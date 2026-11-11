"""Build task06 boss frames from the approved five-pose source sheets."""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "assets" / "raw" / "codex" / "06-bosses" / "poses"
OUT = ROOT / "assets" / "bosses"
MANIFEST = ROOT / "assets" / "manifest.json"
POSES = {"idle": 0, "walk-a": 1, "walk-b": 0, "attack-a": 2, "attack-b": 3, "hit": 4}
BOSSES = {
    "hauptmann": ("hauptmann-poses.png", 315),
    "hexe": ("hexe-poses.png", 315),
    "bassprediger": ("bass-poses.png", 315),
    "flieger": ("flieger-poses.png", 315),
    "brand": ("brand-poses.png", 315),
    "ratten": ("ratten-poses.png", 315),
    "ritter": ("ritter-poses.png", 315),
    "platte": ("platte-poses.png", 360),
    "volk": ("volk-poses.png", 360),
}


def clean_alpha(image: Image.Image) -> Image.Image:
    a = np.asarray(image.convert("RGBA")).copy()
    alpha = a[:, :, 3].astype(np.int32)
    alpha = np.where(alpha < 96, 0, (alpha - 96) * 255 // 159)
    a[:, :, 3] = np.clip(alpha, 0, 255).astype(np.uint8)
    a[a[:, :, 3] == 0, :3] = 0
    return Image.fromarray(a)


def boundaries(image: Image.Image) -> list[int]:
    alpha = np.asarray(image.getchannel("A"))
    projection = (alpha >= 128).sum(axis=0).astype(np.float64)
    projection = np.convolve(projection, np.ones(9), mode="same")
    width = image.width
    cuts = [0]
    for i in range(1, 5):
        expected = round(width * i / 5)
        lo, hi = max(cuts[-1] + 40, expected - 90), min(width - 40, expected + 90)
        cuts.append(lo + int(np.argmin(projection[lo:hi])))
    cuts.append(width)
    return cuts


def remove_foreign_components(cell: Image.Image) -> Image.Image:
    """Drop disconnected fragments cut from a neighbouring pose sheet cell."""
    rgba = np.asarray(cell.convert("RGBA")).copy()
    mask = rgba[:, :, 3] > 0
    parent: list[int] = []
    runs: list[tuple[int, int, int, int]] = []
    previous: list[tuple[int, int, int]] = []

    def find(label: int) -> int:
        while parent[label] != label:
            parent[label] = parent[parent[label]]
            label = parent[label]
        return label

    def union(a: int, b: int) -> int:
        a, b = find(a), find(b)
        if a != b:
            parent[b] = a
        return a

    for y, row in enumerate(mask):
        padded = np.pad(row.astype(np.int8), (1, 1))
        changes = np.diff(padded)
        starts, ends = np.where(changes == 1)[0], np.where(changes == -1)[0] - 1
        current: list[tuple[int, int, int]] = []
        for start, end in zip(starts.tolist(), ends.tolist()):
            touching = [label for pstart, pend, label in previous if pend >= start - 1 and pstart <= end + 1]
            if touching:
                label = find(touching[0])
                for other in touching[1:]:
                    label = union(label, other)
            else:
                label = len(parent)
                parent.append(label)
            current.append((start, end, label))
            runs.append((y, start, end, label))
        previous = current

    if not runs:
        return cell
    stats: dict[int, dict[str, int]] = {}
    for y, start, end, label in runs:
        root = find(label)
        stat = stats.setdefault(root, {"size": 0, "x0": start, "x1": end, "y0": y, "y1": y})
        stat["size"] += end - start + 1
        stat["x0"], stat["x1"] = min(stat["x0"], start), max(stat["x1"], end)
        stat["y0"], stat["y1"] = min(stat["y0"], y), max(stat["y1"], y)
    main = max(stats, key=lambda root: stats[root]["size"])
    keep = {main}
    keep_mask = np.zeros(mask.shape, dtype=bool)
    for y, start, end, label in runs:
        if find(label) in keep:
            keep_mask[y, start : end + 1] = True
    rgba[~keep_mask, 3] = 0
    rgba[~keep_mask, :3] = 0
    return Image.fromarray(rgba)


def source_cells(image: Image.Image) -> list[Image.Image]:
    cuts = boundaries(image)
    cells = []
    for left, right in zip(cuts, cuts[1:]):
        cell = image.crop((left, 0, right, image.height))
        bbox = cell.getchannel("A").getbbox()
        if not bbox:
            raise ValueError(f"empty cell between {left} and {right}")
        cells.append(remove_foreign_components(cell.crop(bbox)))
    if len(cells) != 5:
        raise ValueError(f"expected five cells, got {len(cells)}")
    return cells


def normalize(cell: Image.Image, scale: float) -> tuple[Image.Image, list[float]]:
    size = (max(1, round(cell.width * scale)), max(1, round(cell.height * scale)))
    frame = cell.resize(size, Image.Resampling.LANCZOS)
    frame = clean_alpha(frame)
    bbox = frame.getchannel("A").getbbox()
    if not bbox:
        raise ValueError("frame became empty after normalization")
    frame = frame.crop(bbox)
    pad = 6
    canvas = Image.new("RGBA", (frame.width + pad * 2, frame.height + pad * 2))
    canvas.alpha_composite(frame, (pad, pad))
    alpha = np.asarray(canvas.getchannel("A"))
    ys, xs = np.where(alpha >= 96)
    floor = ys.max()
    support = xs[ys >= floor - 7]
    anchor_x = float(np.median(support)) if support.size else canvas.width / 2
    return canvas, [round(anchor_x, 3), round(float(floor), 3)]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for key in [k for k in manifest if k.startswith("bosses/")]:
        del manifest[key]

    encoded = decoded = 0
    records = {}
    for boss, (source_name, idle_height) in BOSSES.items():
        sheet = clean_alpha(Image.open(RAW / source_name))
        cells = source_cells(sheet)
        scale = idle_height / cells[0].height
        for pose, index in POSES.items():
            frame, anchor = normalize(cells[index], scale)
            path = OUT / f"{boss}-{pose}.webp"
            frame.save(path, "WEBP", quality=88, method=6, exact=True)
            entry = {
                "anchor": anchor,
                "for": f"drawEnemy boss {boss} {pose}",
                "h": frame.height,
                "units": 3,
                "w": frame.width,
            }
            manifest[f"bosses/{boss}-{pose}"] = entry
            records[f"{boss}-{pose}"] = {"source": source_name, "cell": index, **entry}
            encoded += path.stat().st_size
            decoded += frame.width * frame.height * 4

    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (RAW / "picks.json").write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"count": len(records), "encodedBytes": encoded, "decodedBytes": decoded}))


if __name__ == "__main__":
    main()

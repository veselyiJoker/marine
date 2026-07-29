from pathlib import Path
import sys

import pypdfium2 as pdfium
from PIL import Image, ImageDraw


source = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(
    r"C:\Users\PREOATOR\Downloads\Системы Реагирования и мониторинга (1).pdf"
)
out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(
    r"C:\Users\PREOATOR\Desktop\marine\tmp\pdfs\render"
)
out_dir.mkdir(parents=True, exist_ok=True)

pdf = pdfium.PdfDocument(source)
thumbs = []
for index, page in enumerate(pdf):
    image = page.render(scale=1.5).to_pil().convert("RGB")
    page_path = out_dir / f"page-{index + 1:02d}.png"
    image.save(page_path)
    thumb = image.copy()
    thumb.thumbnail((480, 270))
    thumbs.append((index + 1, thumb))

cols = 3
cell_w, cell_h = 500, 310
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "white")
draw = ImageDraw.Draw(sheet)
for position, (number, thumb) in enumerate(thumbs):
    x = (position % cols) * cell_w
    y = (position // cols) * cell_h
    sheet.paste(thumb, (x + 10, y + 25))
    draw.text((x + 10, y + 5), f"Page {number}", fill="black")

sheet.save(out_dir / "contact-sheet.png")
print(f"Rendered {len(thumbs)} pages to {out_dir}")

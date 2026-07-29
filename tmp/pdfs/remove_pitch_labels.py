from pathlib import Path
from io import BytesIO

import numpy as np
from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf._page import PageObject
from pypdf.generic import ContentStream, DecodedStreamObject, NameObject
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


source = Path(r"C:\Users\PREOATOR\Downloads\Системы Реагирования и мониторинга (1).pdf")
output = Path(r"C:\Users\PREOATOR\Desktop\marine\output\pdf\Системы Реагирования и мониторинга_без_Pitch.pdf")
render_dir = Path(r"C:\Users\PREOATOR\Desktop\marine\tmp\pdfs\render")
output.parent.mkdir(parents=True, exist_ok=True)

reader = PdfReader(source)
writer = PdfWriter()
for source_page in reader.pages[:14]:
    writer.add_page(source_page)


pdfmetrics.registerFont(
    TTFont(
        "MontserratBold",
        r"C:\Users\PREOATOR\Desktop\marine\tmp\pdfs\fonts\Montserrat-Bold.ttf",
    )
)


def cover_footer_page(width, height):
    pdf_buffer = BytesIO()
    pdf_canvas = canvas.Canvas(pdf_buffer, pagesize=(width, height))
    pdf_canvas.setFillColorRGB(1, 1, 1)
    pdf_canvas.rect(8, 40 / 3, 590, 134 / 3, stroke=0, fill=1)
    pdf_canvas.setFillColorRGB(0.39, 0.39, 0.39)
    pdf_canvas.setFont("MontserratBold", 9)
    pdf_canvas.drawString(
        15,
        25,
        "CPM • АВТОМАТИЗАЦИЯ ЭКСПЛУАТАЦИИ И УПРАВЛЕНИЯ ФЛОТОМ",
    )
    pdf_canvas.save()
    pdf_buffer.seek(0)
    return PdfReader(pdf_buffer).pages[0]


def fitted_background_patch(page_number):
    image = np.asarray(Image.open(render_dir / f"page-{page_number:02d}.png").convert("RGB"), dtype=np.float64)
    height, width, _ = image.shape
    x0, x1 = 12, 118
    y0, y1 = 1128, 1195

    if page_number not in {5, 7, 8, 11, 14}:
        return Image.new("RGB", (x1 - x0, y1 - y0), "white")
    patch_rgb = image[y0:y1, x1 : x1 + (x1 - x0)].astype(np.uint8)
    return Image.fromarray(patch_rgb, "RGB")


def raster_patch_page(page_number, width, height):
    patch_image = fitted_background_patch(page_number)
    image_buffer = BytesIO()
    patch_image.save(image_buffer, format="PNG")
    image_buffer.seek(0)

    pdf_buffer = BytesIO()
    pdf_canvas = canvas.Canvas(pdf_buffer, pagesize=(width, height))
    pdf_canvas.drawImage(
        ImageReader(image_buffer),
        8,
        40 / 3,
        width=212 / 3,
        height=134 / 3,
        mask="auto",
    )
    pdf_canvas.save()
    pdf_buffer.seek(0)
    return PdfReader(pdf_buffer).pages[0]

removed_labels = 0
for page_number, page in enumerate(writer.pages, start=1):
    content = ContentStream(page["/Contents"].get_object(), writer)
    filtered = []
    for index, (operands, operator) in enumerate(content.operations):
        is_pitch_image = False
        if operator == b"Do" and operands and index >= 2:
            matrix_operands, matrix_operator = content.operations[index - 2]
            if matrix_operator == b"cm" and len(matrix_operands) == 6:
                a, b, c, d, e, f = (float(value) for value in matrix_operands)
                is_pitch_text = str(operands[0]) == "/X9" and (
                    abs(a - 190.625) < 0.01
                    and abs(b) < 0.01
                    and abs(c) < 0.01
                    and abs(d + 71.875) < 0.01
                    and abs(e - 39.525) < 0.01
                    and abs(f - 144.438) < 0.01
                )
                is_pitch_badge = (
                    abs(a - 405) < 0.01
                    and abs(b) < 0.01
                    and abs(c) < 0.01
                    and abs(d + 315) < 0.01
                    and abs(e) < 0.01
                    and abs(f - 315) < 0.01
                )
                is_pitch_image = is_pitch_text or is_pitch_badge
        if is_pitch_image:
            removed_labels += 1
            continue
        filtered.append((operands, operator))

    content.operations = filtered
    page.replace_contents(content)

    # On the three section-cover pages the Pitch badge is baked into a larger
    # image. Its background is plain white, so a precisely matched white patch
    # removes only the badge while preserving the adjacent footer text.
    if page_number in {1, 3, 9}:
        page.merge_page(
            cover_footer_page(float(page.mediabox.width), float(page.mediabox.height))
        )
    else:
        page.merge_page(
            raster_patch_page(
                page_number,
                float(page.mediabox.width),
                float(page.mediabox.height),
            )
        )

writer.add_metadata(reader.metadata or {})
with output.open("wb") as stream:
    writer.write(stream)

print(f"Wrote {len(writer.pages)} pages to {output}")
print(f"Removed {removed_labels} standalone Pitch labels")

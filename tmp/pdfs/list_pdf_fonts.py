from pypdf import PdfReader


reader = PdfReader(r"C:\Users\PREOATOR\Downloads\Системы Реагирования и мониторинга (1).pdf")
seen_objects = set()
seen_fonts = set()


def dereference(value):
    return value.get_object() if hasattr(value, "get_object") else value


def walk_resources(resources):
    resources = dereference(resources)
    if not resources:
        return
    fonts = dereference(resources.get("/Font", {}))
    for name, reference in fonts.items():
        font = dereference(reference)
        descriptor = dereference(font.get("/FontDescriptor")) if font.get("/FontDescriptor") else {}
        embedded = [key for key in ("/FontFile", "/FontFile2", "/FontFile3") if key in descriptor]
        record = (str(name), str(font.get("/BaseFont")), str(font.get("/Subtype")), tuple(embedded))
        if record not in seen_fonts:
            print(record)
            seen_fonts.add(record)
    xobjects = dereference(resources.get("/XObject", {}))
    for reference in xobjects.values():
        obj = dereference(reference)
        marker = getattr(reference, "idnum", id(obj))
        if marker in seen_objects:
            continue
        seen_objects.add(marker)
        if hasattr(obj, "get") and obj.get("/Resources"):
            walk_resources(obj["/Resources"])


for page in reader.pages:
    walk_resources(page["/Resources"])

import re

with open("data/tools.ts", "r") as f:
    content = f.read()

new_tools = """
  {
    "id": "compress-pdf-12kb",
    "name": "Compress PDF to 12KB",
    "slug": "compress-pdf-12kb",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Compress PDF file exactly to 12KB online.",
    "keywords": ["compress pdf to 12kb", "12 kb pdf converter", "compress pdf 12 kb"],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "compress-pdf-12kb",
    "popular": true
  },
  {
    "id": "compress-pdf-140kb",
    "name": "Compress PDF to 140KB",
    "slug": "compress-pdf-140kb",
    "categoryId": "pdf",
    "categoryTitle": "PDF Tools",
    "shortDescription": "Compress PDF file exactly to 140KB online.",
    "keywords": ["compress pdf to 140kb", "140 kb pdf converter", "compress pdf 140 kb"],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "compress-pdf-140kb",
    "popular": true
  },
  {
    "id": "14kb-photo-size",
    "name": "14KB Photo Size Maker",
    "slug": "14kb-photo-size",
    "categoryId": "image",
    "categoryTitle": "Image Tools",
    "shortDescription": "Resize photo or signature to 14KB online.",
    "keywords": ["14kb photo size", "resize image to 14kb", "compress image to 14kb"],
    "aliases": [],
    "searchIntent": "Utility",
    "relatedTools": [],
    "supportedFormats": [],
    "processingType": "client",
    "status": "production",
    "seoPriority": "High",
    "analyticsIdentifier": "14kb-photo-size",
    "popular": true
  },"""

# insert after the array definition starts
content = re.sub(r'export const ALL_TOOLS: Tool\[\] = \[', 'export const ALL_TOOLS: Tool[] = [' + new_tools, content)

with open("data/tools.ts", "w") as f:
    f.write(content)


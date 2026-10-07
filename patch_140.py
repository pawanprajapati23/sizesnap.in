import re
with open("app/tools/compress-pdf-140kb/page.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '140KB is an extremely tiny file size. For vector PDFs (like exported Word documents), text remains sharp. However, if your PDF is a scanned image, compressing it to 140KB will significantly reduce visual quality. We recommend this size strictly for signatures or simple thumb impression PDFs as required by specific portals.',
    '140KB is a very common requirement for uploading marksheets, ID proofs, and certificates on various government recruitment portals (like SSC, UPSC, and State PSCs). Our smart algorithm ensures that your scanned documents remain completely readable while meeting the 140KB threshold.'
)

content = content.replace(
    'Many online portals, specifically for competitive exams and government forms in India, require you to upload a signature or thumb impression in PDF format that is strictly under 15KB or exactly 140KB.',
    'Many online portals, specifically for competitive exams and government forms in India, require you to upload ID proofs or marksheets in PDF format that is strictly under 150KB or exactly 140KB.'
)
with open("app/tools/compress-pdf-140kb/page.tsx", "w") as f:
    f.write(content)

import sys
import subprocess

try:
    import pypdf
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
    import pypdf

reader = pypdf.PdfReader('PHM_Technical_Architecture_Plan.pdf')
text = ""
for page in reader.pages:
    text += page.extract_text() + "\n"

with open('architecture.txt', 'w', encoding='utf-8') as f:
    f.write(text)
print("PDF extracted to architecture.txt")

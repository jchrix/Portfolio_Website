import re
from pathlib import Path

for p in Path(".").rglob("*.html"):
    html = p.read_text(encoding="utf-8", errors="replace")
    hrefs = sorted(set(re.findall(r'href="([^"]+\.html[^"]*)"', html)))
    if hrefs:
        print(f"\n{p}:")
        for h in hrefs:
            print(" ", h[:180])

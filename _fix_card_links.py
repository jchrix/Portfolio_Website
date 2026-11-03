from pathlib import Path

replacements = [
    ("href=\"keepit.html", 'href="/case-studies/keepit/'),
    ("href=\"google-transtale.html", 'href="/case-studies/google-transtale/'),
    ("href=\"rislly.html", 'href="/case-studies/rislly/'),
    ("href=\"opnr.html", 'href="/case-studies/opnr/'),
    ("href=\"girintec.html", 'href="/case-studies/girintec/'),
    ("href=\"what-is-an-experience.html", 'href="/blog/what-is-an-experience/'),
    ('href="index.html#', 'href="/#'),
    ('href="index.html"', 'href="/"'),
]

root = Path(".")
changed_files = []
for path in root.rglob("*.html"):
    original = path.read_text(encoding="utf-8")
    updated = original
    for old, new in replacements:
        updated = updated.replace(old, new)
    if updated != original:
        path.write_text(updated, encoding="utf-8")
        changed_files.append(str(path))

print("updated:")
for name in changed_files:
    print(" ", name)

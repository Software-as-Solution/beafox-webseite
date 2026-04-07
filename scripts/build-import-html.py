#!/usr/bin/env python3
"""Build a self-contained HTML import page for Sanity calculator documents."""

import json
import sys
import os

NDJSON_PATH = os.path.join(os.path.dirname(__file__), "calculator-content.ndjson")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "BeAFox - Webseite", "sanity-import.html")

SANITY_PROJECT = "gnyg0xwn"
SANITY_DATASET = "production"
SANITY_TOKEN = "skIGCdynqiNplY1Ho80o8TbE4QPY85KdpILiDiT5p6Ve3Vz0kw0H3YjMIRuJjJd7a11ND3f0xuf4bvWaiO55heFmHmJMI8TG1yLAKRrCV53AfQQM8p17GM5OrpCCVKhMW1TsFQmVR0Ysi5tt2lD8Qyag7wN5caITrlrewKmR7Y7jVut0C1Qc"

# Read all calculator documents
docs = []
with open(NDJSON_PATH) as f:
    for line in f:
        docs.append(json.loads(line.strip()))

docs_json = json.dumps(docs, ensure_ascii=False)

html = f"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>BeAFox Sanity Import</title>
<style>
body {{ font-family: -apple-system, sans-serif; max-width: 700px; margin: 60px auto; padding: 20px; background: #0f0f0f; color: #e0e0e0; }}
h1 {{ color: #eb8a26; }}
.status {{ padding: 8px 12px; margin: 4px 0; border-radius: 8px; font-size: 14px; }}
.pending {{ background: #1a1a1a; border: 1px solid #333; }}
.success {{ background: #0a2a0a; border: 1px solid #2a5a2a; color: #6fdc6f; }}
.error {{ background: #2a0a0a; border: 1px solid #5a2a2a; color: #dc6f6f; }}
.running {{ background: #2a1a0a; border: 1px solid #5a3a1a; color: #eb8a26; }}
#startBtn {{ background: #eb8a26; color: white; border: none; padding: 14px 32px; font-size: 16px; border-radius: 10px; cursor: pointer; margin: 20px 0; }}
#startBtn:hover {{ background: #d07a1e; }}
#startBtn:disabled {{ background: #555; cursor: not-allowed; }}
#summary {{ margin-top: 20px; padding: 16px; border-radius: 10px; background: #1a1a1a; display: none; }}
</style>
</head>
<body>
<h1>BeAFox Sanity Import</h1>
<p>15 Finanzrechner werden in Sanity importiert (Project: {SANITY_PROJECT}, Dataset: {SANITY_DATASET})</p>
<button id="startBtn" onclick="startImport()">Import starten</button>
<div id="list"></div>
<div id="summary"></div>

<script>
const SANITY_TOKEN = "{SANITY_TOKEN}";
const API_URL = "https://{SANITY_PROJECT}.api.sanity.io/v2024-01-01/data/mutate/{SANITY_DATASET}";

const docs = {docs_json};

function renderList() {{
  const list = document.getElementById("list");
  list.innerHTML = docs.map((doc, i) =>
    '<div class="status pending" id="status-' + i + '">' + doc.slug.current + ' — bereit</div>'
  ).join("");
}}

async function importDoc(doc, index) {{
  const el = document.getElementById("status-" + index);
  el.className = "status running";
  el.textContent = doc.slug.current + " — wird importiert...";

  try {{
    const res = await fetch(API_URL, {{
      method: "POST",
      headers: {{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + SANITY_TOKEN
      }},
      body: JSON.stringify({{
        mutations: [{{ createOrReplace: doc }}]
      }})
    }});

    if (!res.ok) {{
      const err = await res.text();
      throw new Error("HTTP " + res.status + ": " + err);
    }}

    el.className = "status success";
    el.textContent = "\\u2713 " + doc.slug.current + " — erfolgreich importiert";
    return true;
  }} catch (e) {{
    el.className = "status error";
    el.textContent = "\\u2717 " + doc.slug.current + " — Fehler: " + e.message;
    return false;
  }}
}}

async function startImport() {{
  const btn = document.getElementById("startBtn");
  btn.disabled = true;
  btn.textContent = "Import laeuft...";

  let success = 0, failed = 0;
  for (let i = 0; i < docs.length; i++) {{
    const ok = await importDoc(docs[i], i);
    if (ok) success++; else failed++;
  }}

  const summary = document.getElementById("summary");
  summary.style.display = "block";
  summary.innerHTML = "<strong>Fertig!</strong> " + success + " erfolgreich, " + failed + " fehlgeschlagen.";
  btn.textContent = "Import abgeschlossen";
}}

renderList();
</script>
</body>
</html>"""

with open(OUTPUT_PATH, "w") as f:
    f.write(html)

print(f"Created {OUTPUT_PATH}")
print(f"  {len(docs)} calculator documents embedded")
print(f"  File size: {len(html)} bytes")

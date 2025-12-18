const DATASET = "pwc-archive/papers-with-abstracts";
const CONFIG = "default";
const SPLIT = "train";

async function loadRows(offset = 0, length = 20) {
  const url = new URL("https://datasets-server.huggingface.co/rows");
  url.searchParams.set("dataset", DATASET);
  url.searchParams.set("config", CONFIG);
  url.searchParams.set("split", SPLIT);
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("length", String(length));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<{ rows: Array<{ row: any }> }>;
}

function render(rows: Array<{ row: any }>) {
  const list = document.getElementById("list")!;
  list.innerHTML = "";

  for (const r of rows) {
    const x = r.row;

    const item = document.createElement("div");
    item.style.padding = "12px 0";
    item.style.borderBottom = "1px solid #eee";

    const title = document.createElement("div");
    title.style.fontWeight = "600";

    const a = document.createElement("a");
    a.href = x.paper_url || "#";
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = x.title || "(no title)";

    title.appendChild(a);

    const meta = document.createElement("div");
    meta.style.color = "#666";
    meta.style.fontSize = "14px";
    meta.textContent = [x.arxiv_id, x.conference].filter(Boolean).join(" ");

    const abs = document.createElement("div");
    abs.style.marginTop = "8px";
    abs.textContent = x.short_abstract || x.abstract || "";

    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(abs);

    list.appendChild(item);
  }
}

async function main() {
  const status = document.getElementById("status")!;
  status.textContent = "Loading…";

  try {
    const data = await loadRows(0, 20);
    status.textContent = `Showing ${data.rows.length} items`;
    render(data.rows);
  } catch (e: any) {
    status.textContent = `Failed: ${e?.message ?? String(e)}`;
  }
}

main();


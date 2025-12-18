const DATASET = "pwc-archive/papers-with-abstracts";
const CONFIG = "default";
const SPLIT = "train";

async function loadFirst(offset = 0, length = 20) {
  const url = new URL("https://datasets-server.huggingface.co/rows");
  url.searchParams.set("dataset", DATASET);
  url.searchParams.set("config", CONFIG);
  url.searchParams.set("split", SPLIT);
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("length", String(length));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function el(tag, attrs = {}, children = []) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => (k === "text" ? (n.textContent = v) : n.setAttribute(k, v)));
  children.forEach(c => n.appendChild(c));
  return n;
}

(async () => {
  const status = document.getElementById("status");
  const list = document.getElementById("list");

  try {
    const data = await loadFirst(0, 20);
    status.textContent = `Showing ${data.rows.length} items`;

    for (const r of data.rows) {
      const x = r.row; // actual fields

      const titleLink = el("a", { href: x.paper_url || "#", target: "_blank", rel: "noreferrer" });
      titleLink.textContent = x.title || "(no title)";

      list.appendChild(
        el("div", { class: "item" }, [
          el("div", { class: "title" }, [titleLink]),
          el("div", { class: "meta", text: `${x.arxiv_id ?? ""} ${x.conference ?? ""}`.trim() }),
          el("div", { class: "abs", text: x.short_abstract || x.abstract || "" }),
        ])
      );
    }
  } catch (e) {
    status.textContent = `Failed: ${e.message}`;
  }
})();


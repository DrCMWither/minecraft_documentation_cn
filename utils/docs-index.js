const versions = ["1.18.10",
                  "1.21.50.7",
                  "1.21.60.10",
                  "1.21.70.3",
                  "1.21.80.3",
                  "1.21.90.3",
                  "1.21.100.6",
                ];
const cssPath = "styles/styles.css";

async function fetchDocs(version) {
    const res = await fetch(`${version}/`);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const links = [...doc.querySelectorAll("a")]
        .map(a => a.getAttribute("href"))
        .filter(h => h && h.endsWith(".html"))
        .map(h => h.split("/").pop());

    return links.map(h => ({
        name: decodeURIComponent(h.replace(".html", "")),
        path: `${version}/${h}`
    }));
}

async function buildMenu() {
    const menu = document.getElementById("menu");
    let html = "<ul>";
    for (const v of versions) {
        const docs = await fetchDocs(v);
        html += `<li><strong>${v}</strong><ul>`;
        for (const d of docs) {
            html += `<li><a href="${d.path}" target="docFrame" data-path="${d.path}">${d.name}</a></li>`;
        }
        html += "</ul></li>";
    }
    html += "</ul>";
    menu.innerHTML = html;

    menu.addEventListener("click", async (e) => {
        const link = e.target.closest("a[data-path]");
        if (!link) return;
        e.preventDefault();
        const path = link.dataset.path;
        await loadDocIntoIframe(path);
    });
}

async function loadDocIntoIframe(path) {
    const iframe = document.getElementById("docFrame");
    try {
        const res = await fetch(path);
        const html = await res.text();
        iframe.srcdoc = `
        <html>
            <head>
                <link rel="stylesheet" href="${cssPath}">
            </head>
            <body>
                ${html}
            </body>
        </html>
        `;
        iframe.onload = () => {
            const doc = iframe.contentDocument;
            if (!doc) return;
            const links = doc.querySelectorAll("a[href$='.html']");
            links.forEach(a => {
                a.addEventListener("click", (ev) => {
                ev.preventDefault();
                const href = a.getAttribute("href");
                const base = path.substring(0, path.lastIndexOf("/") + 1);
                const nextPath = href.includes("/") ? href : base + href;
                loadDocIntoIframe(nextPath);
                });
            });
        };
    } catch (err) {
        iframe.srcdoc = `<p style="color:red;">加载失败：${path}</p>`;
    }
}

buildMenu();

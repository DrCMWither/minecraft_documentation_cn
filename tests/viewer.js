export const Viewer = {
    async load(iframe, path, cssPath) {
        const res = await fetch(path);
        const html = await res.text();

        const baseHref = new URL(path, window.location.href).href.replace(/[^/]+$/, "");

        iframe.srcdoc = `
            <!doctype html>
            <html>
            <head>
                <meta charset="utf-8">
                <base href="${baseHref}">
                <link rel="stylesheet" href="${cssPath}">
            </head>
            <body>${html}</body>
            </html>
        `;

        iframe.onload = () => this.patchLinks(iframe, baseHref);
    },

    patchLinks(iframe, baseHref) {
        const doc = iframe.contentDocument;
        if (!doc) return;

        doc.querySelectorAll("a[href]").forEach(a => {
            const href = a.getAttribute("href");
            if (!href) return;
            if (href.startsWith("#")) {
                a.addEventListener("click", e => {
                    e.preventDefault();
                    doc.getElementById(href.slice(1))?.scrollIntoView();
                });
                return;
            }
            if (/^javascript:/i.test(href)) return;

            const url = new URL(href, baseHref);
            if (url.origin === location.origin && url.pathname.endsWith(".html")) {
                a.addEventListener("click", e => {
                    e.preventDefault();
                    this.load(iframe, url.pathname + url.search + url.hash);
                });
            }
        });
    }
};

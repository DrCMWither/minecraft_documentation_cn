export const Data = {
    cache: new Map(),

    async fetchDocs(version) {
        if (this.cache.has(version)) return this.cache.get(version);

        const res = await fetch(`${version}/`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const links = [...doc.querySelectorAll("a")]
            .map(a => a.getAttribute("href"))
            .filter(h => h?.endsWith(".html"))
            .map(h => h.split("/").pop());

        const docs = links.map(h => ({
            name: decodeURIComponent(h.replace(".html", "")),
            path: `${version}/${h}`
        }));
        this.cache.set(version, docs);
        return docs;
    }
};

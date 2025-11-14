export const Menu = {
    async render(container, versions, docsProvider, state, onSelectDoc) {
        const expanded = new Set(state.getExpanded());

        const html = await Promise.all(
            versions.map(async v => {
                const docs = await docsProvider(v);
                const items = docs
                    .map(
                        d => `<li><a href="#" data-path="${d.path}">${d.name}</a></li>`
                    )
                    .join("");
                return `
                <li>
                    <div class="version-title ${expanded.has(v) ? "expanded" : ""}" data-v="${v}" tabindex="0">${v}</div>
                    <ul class="version-list ${expanded.has(v) ? "visible" : ""}">
                        ${items}
                    </ul>
                </li>`;
            })
        );

        container.innerHTML = `<ul>${html.join("")}</ul>`;

        container.querySelectorAll(".version-title").forEach(title => {
            title.addEventListener("click", () => this.toggle(title, state));
        });

        container.querySelectorAll("a[data-path]").forEach(link => {
            link.addEventListener("click", evt => {
                evt.preventDefault();
                onSelectDoc(link.dataset.path, link);
            });
        });
    },

    toggle(title, state) {
        const list = title.nextElementSibling;
        title.classList.toggle("expanded");
        list.classList.toggle("visible");

        const allExpanded = [...title.parentNode.parentNode.querySelectorAll(".version-title.expanded")].map(t => t.dataset.v);
        state.setExpanded(allExpanded);
    }
};

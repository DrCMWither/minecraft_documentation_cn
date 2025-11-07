document.querySelectorAll("ul a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const url = link.getAttribute("href");
        fetch(url)
            .then(res => res.text())
            .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const bodyContent = doc.body.innerHTML;

        const iframe = document.querySelector("iframe");
        iframe.srcdoc = `
            <html>
                <head>
                    <link rel="stylesheet" href="styles/styles.css">
                </head>
                <body>
                    ${bodyContent}
                </body>
             </html>
            `;
        });
    });
});

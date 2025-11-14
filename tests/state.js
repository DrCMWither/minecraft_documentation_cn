export const MenuState = {
    key: "document.expanded",
    getExpanded() {
        try {
            return JSON.parse(localStorage.getItem(this.key) || "[]");
        } catch {
            return [];
        }
    },

    setExpanded(list) {
        localStorage.setItem(this.key, JSON.stringify(list));
    }
};
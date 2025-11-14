import { Data } from "./data.js";
import { MenuState } from "./state.js";
import { Menu } from "./menu.js";
import { Viewer } from "./viewer.js";

const versions = ["1.18.10",
    "1.21.50.7",
    "1.21.60.10",
    "1.21.70.3",
    "1.21.80.3",
    "1.21.90.3",
    "1.21.100.6",
  ];
const cssPath = "../styles/styles.css";

const menu = document.getElementById("menu");
const iframe = document.getElementById("docFrame");

Menu.render(
    menu,
    versions,
    (v) => Data.fetchDocs(v),
    MenuState,
    (path, link) => {
        menu.querySelectorAll("a.active").forEach(a => a.classList.remove("active"));
        link.classList.add("active");
        Viewer.load(iframe, path, cssPath);
    }
);

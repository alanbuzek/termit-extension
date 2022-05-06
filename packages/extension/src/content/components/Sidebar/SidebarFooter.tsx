import React from "react";

const SidebarFooter = () => {
  return (
    <footer
      className="footer-row mt-auto"
      style={{ background: "transparent" }}
    >
      {/* <div className="px-sm-3 px-2 col">
        <a
          href="https://kbss.felk.cvut.cz"
          target="_blank"
          rel="noopener noreferrer"
          title="KBSS FEL ČVUT v Praze"
        >
          ©&nbsp;KBSS FEL ČVUT v Praze, 2022
        </a>
      </div> */}
      <div className="news-viewer-toggle px-sm-2 px-sm-3 px-1 text-right">
        <span id="news-toggler">
          <span className="footer-version">Verze&nbsp;</span>0.0.1
        </span>
      </div>
    </footer>
  );
};

export default SidebarFooter;

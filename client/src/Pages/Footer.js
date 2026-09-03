import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="quip-footer">
      <div className="quip-footer__inner">
        <span className="quip-footer__copyright">
          © {new Date().getFullYear()} Quip
        </span>

        <span className="quip-footer__separator">•</span>

        <span className="quip-footer__author">
          Quip Phani
        </span>
      </div>
    </footer>
  );
}


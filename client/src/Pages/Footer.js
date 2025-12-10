import React from "react";
// import logo from "../assets/logo.png"; // update this path if needed
// import config from "../config";       // update this path if needed
import "../styles/footer.css";               // if you have footer styles

export default function Footer() {
  return (
    <footer className="dashboard-footer">
      <nav>
        <ul
          style={{
            display: "flex",
            listStyleType: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <li style={{ marginRight: "20px" }}>
            <a
            //   href={config?.data?.MLR_HOME || "#"}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Quip Author
            </a>
          </li>
        </ul>
      </nav>

      {/* <img src={logo} alt="Company Logo" className="footer-logo" /> */}
    </footer>
  );
}

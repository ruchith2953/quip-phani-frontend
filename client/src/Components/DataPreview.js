import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Header from "../Pages/Header";
import Footer from "../Pages/Footer";
import SideBar from "./SideBar";
import ComponentEditor from "./ComponentEditor";

import "../styles/dataPreview.css";

const getPagePath = (component) => {
  return (
    component?.path ||
    component?.pagePath ||
    component?.pagepath ||
    component?.componentpath ||
    component?.componentPath ||
    "Unknown Path"
  );
};

const DataPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const domainUrl = location?.state?.domainUrl || "";

  const [components, setComponents] = useState([]);
  const [selectedPagePath, setSelectedPagePath] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [status, setStatus] = useState("success");

  useEffect(() => {
    loadComponents();
  }, []);

  async function loadComponents() {
    if (!domainUrl) {
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage("Extracting components...");

      const response = await axios.get(
        "http://localhost:9091/content/exportComponentsToJSON",
        {
          params: {
            domainUrl,
            userName: "ruchithk@nextrow.com",
          },
        }
      );

      console.log(
        "Export Components Response",
        response.data
      );

      const data = response?.data?.components || [];

      setComponents(data);

      if (data.length > 0) {
        const firstPath = getPagePath(data[0]);

        setSelectedPagePath(firstPath || "");
      } else {
        showSnackbar(
          "No components were found for this domain.",
          "error"
        );
      }
    } catch (error) {
      console.error(error);

      showSnackbar(
        "Unable to load components.",
        "error"
      );
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  }

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setStatus(severity);
    setOpen(true);
  };

  const pagePaths = useMemo(() => {
    return [
      ...new Set(
        components.map((item) => getPagePath(item))
      ),
    ];
  }, [components]);

  const filteredComponents = useMemo(() => {
    return components.filter(
      (item) =>
        getPagePath(item) === selectedPagePath
    );
  }, [components, selectedPagePath]);

  const formattedDomain = useMemo(() => {
    if (!domainUrl) {
      return "";
    }

    try {
      return new URL(domainUrl).hostname;
    } catch {
      return domainUrl.replace(/^https?:\/\//, "");
    }
  }, [domainUrl]);

  return (
    <div className="quip-preview-page">

      {/* =====================================================
          APPLICATION HEADER
      ====================================================== */}

      <Header title="Domain Components" />

      {/* =====================================================
          DOMAIN CONTEXT BAR
      ====================================================== */}

      <section className="quip-preview-domain-bar">

        <div className="quip-preview-domain-left">

          <button
            type="button"
            className="quip-preview-back-button"
            onClick={() => navigate("/")}
            aria-label="Back to home"
          >
            <ArrowBackIcon />
          </button>

          <div className="quip-preview-domain-icon">
            <LanguageOutlinedIcon />
          </div>

          <div className="quip-preview-domain-info">

            <span className="quip-preview-domain-label">
              DOMAIN
            </span>

            <span
              className="quip-preview-domain-name"
              title={domainUrl}
            >
              {formattedDomain}
            </span>
          </div>

        </div>

        <div className="quip-preview-domain-meta">

          <div className="quip-preview-status">
            <CheckCircleOutlineIcon />

            <span>Connected</span>
          </div>

          <div className="quip-preview-stat-divider" />

          <div className="quip-preview-stat">
            <LayersOutlinedIcon />

            <strong>
              {components.length}
            </strong>

            <span>components</span>
          </div>

          <div className="quip-preview-stat-divider" />

          <div className="quip-preview-stat">
            <strong>
              {pagePaths.length}
            </strong>

            <span>pages</span>
          </div>

        </div>

      </section>

      {/* =====================================================
          WORKSPACE
      ====================================================== */}

      <main className="quip-preview-workspace">

        {/* PAGE SIDEBAR */}

        <SideBar
          pagePaths={pagePaths}
          selectedPagePath={selectedPagePath}
          onSelectPagePath={(pagePath) => {
            setSelectedPagePath(pagePath);
            setSelectedComponent(null);
          }}
        />

        {/* EDITOR AREA */}

        <section className="quip-preview-editor">

          <div className="quip-preview-editor-header">

            <div className="quip-preview-editor-heading">

              <span className="quip-preview-editor-eyebrow">
                PAGE
              </span>

              <h1
                className="quip-preview-editor-title"
                title={selectedPagePath}
              >
                {selectedPagePath || "No page selected"}
              </h1>

            </div>

            <div className="quip-preview-component-count">
              <span>
                {filteredComponents.length}
              </span>

              {filteredComponents.length === 1
                ? "component"
                : "components"}
            </div>

          </div>

          <div className="quip-preview-editor-divider" />

          <div className="quip-preview-editor-content">

            {selectedPagePath ? (
              <ComponentEditor
                components={filteredComponents}
                selectedComponent={selectedComponent}
                onSelectComponent={setSelectedComponent}
              />
            ) : (
              <div className="quip-preview-no-page">
                <div className="quip-preview-no-page-icon">
                  <LayersOutlinedIcon />
                </div>

                <h2>Select a page</h2>

                <p>
                  Choose a page from the sidebar to
                  inspect its components.
                </p>
              </div>
            )}

          </div>

        </section>

      </main>

      {/* =====================================================
          NOTIFICATION
      ====================================================== */}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={status}
          variant="filled"
          onClose={() => setOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Footer />

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="quip-preview-loading">

          <div className="quip-preview-loading-card">

            <div className="quip-preview-loading-spinner" />

            <div className="quip-preview-loading-title">
              Extracting components
            </div>

            <div className="quip-preview-loading-message">
              {loadingMessage}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DataPreview;
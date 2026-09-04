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
import { isEmptyEntry } from "../Utils/customData";

import "../styles/dataPreview.css";

// Map tabs to their endpoints and loading text (swap URLs as needed)
const TAB_CONFIG = {
  components: {
    endpoint: "http://localhost:9091/content/exportComponentsToJSON",
    loadingText: "Extracting components...",
    errorText: "No components were found for this domain.",
  },
  pages: {
    endpoint: "http://localhost:9091/content/exportPagePropertiesV2", // updated endpoint for pages
    loadingText: "Extracting pages...",
    errorText: "No pages were found for this domain.",
  },
  forms: {
    endpoint: "http://localhost:9091/content/getAemForms", // updated endpoint for forms
    loadingText: "Extracting forms...",
    errorText: "No forms were found for this domain.",
  },
};

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

  // Active Tab State (Default: components)
  const [activeTab, setActiveTab] = useState("components");

  const [components, setComponents] = useState([]);
  const [selectedPagePath, setSelectedPagePath] = useState("");

  const [customDataByRowId, setCustomDataByRowId] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [status, setStatus] = useState("success");

  // Load components initially
  useEffect(() => {
    loadData("components");
  }, []);

  // 3. Dynamic fetcher based on active tab
  async function loadData(tab = activeTab) {
    if (!domainUrl) {
      navigate("/");
      return;
    }

    const config = TAB_CONFIG[tab] || TAB_CONFIG.components;

    try {
      setLoading(true);
      setLoadingMessage(config.loadingText);
      setSelectedPagePath(""); // reset selection on switch

      const response = await axios.get(config.endpoint, {
        params: {
          domainUrl,
          userName: "ruchithk@nextrow.com",
        },
      });

      console.log(`${tab} Response`, response.data);

      const data =
        response?.data?.components ||
        response?.data?.pageData ||
        response?.data?.forms ||
        response?.data ||
        [];

      setComponents(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length > 0) {
        const firstPath = getPagePath(data[0]);
        setSelectedPagePath(firstPath || "");
      } else {
        showSnackbar(config.errorText, "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar(`Unable to load ${tab}.`, "error");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  }

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setActiveTab(newTab);
    loadData(newTab);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setStatus(severity);
    setOpen(true);
  };

  const handleChangeCustomData = (rowId, entry) => {
    setCustomDataByRowId((current) => {
      if (isEmptyEntry(entry)) {
        const { [rowId]: removed, ...remaining } = current;
        return remaining;
      }
      return { ...current, [rowId]: entry };
    });
  };

  const pagePaths = useMemo(() => {
    return [
      ...new Set(components.map((item) => getPagePath(item))),
    ];
  }, [components]);

  const filteredComponents = useMemo(() => {
    return components.filter(
      (item) => getPagePath(item) === selectedPagePath
    );
  }, [components, selectedPagePath]);

  const formattedDomain = useMemo(() => {
    if (!domainUrl) return "";
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
            <span className="quip-preview-domain-label">DOMAIN</span>
            <span className="quip-preview-domain-name" title={domainUrl}>
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
            <strong>{components.length}</strong>
            <span>{activeTab}</span>
          </div>

          <div className="quip-preview-stat-divider" />

          <div className="quip-preview-stat">
            <strong>{pagePaths.length}</strong>
            <span>paths</span>
          </div>
        </div>
      </section>

      <main className="quip-preview-workspace">
        {/* Pass activeTab and onTabChange to SideBar */}
        <SideBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          pagePaths={pagePaths}
          selectedPagePath={selectedPagePath}
          onSelectPagePath={(pagePath) => {
            setSelectedPagePath(pagePath);
          }}
        />

        {/* EDITOR AREA */}

        <section className="quip-preview-editor">
          <div className="quip-preview-editor-header">
            <div className="quip-preview-editor-heading">
              <span className="quip-preview-editor-eyebrow">
                {activeTab.toUpperCase()}
              </span>
              <h1
                className="quip-preview-editor-title"
                title={selectedPagePath}
              >
                {selectedPagePath || "No path selected"}
              </h1>
            </div>

            <div className="quip-preview-component-count">
              <span>{filteredComponents.length}</span>
              {filteredComponents.length === 1 ? "item" : "items"}
            </div>
          </div>

          <div className="quip-preview-editor-divider" />

          <div className="quip-preview-editor-content">
            {selectedPagePath ? (
              <ComponentEditor
                components={filteredComponents}
                pagePath={selectedPagePath}
                customDataByRowId={customDataByRowId}
                onChangeCustomData={handleChangeCustomData}
              />
            ) : (
              <div className="quip-preview-no-page">
                <div className="quip-preview-no-page-icon">
                  <LayersOutlinedIcon />
                </div>
                <h2>Select an item</h2>
                <p>Choose an entry from the sidebar to inspect its data.</p>
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={status} variant="filled" onClose={() => setOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />

      {loading && (
        <div className="quip-preview-loading">
          <div className="quip-preview-loading-card">
            <div className="quip-preview-loading-spinner" />
            <div className="quip-preview-loading-title">Extracting data</div>
            <div className="quip-preview-loading-message">{loadingMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPreview;
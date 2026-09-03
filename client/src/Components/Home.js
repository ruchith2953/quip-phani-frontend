import React, { useState } from "react";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Header from "../Pages/Header";
import Footer from "../Pages/Footer";

import "../styles/Home.css";

export default function HomePage() {
    const navigate = useNavigate();

    const [domainUrl, setDomainUrl] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [status, setStatus] = useState("success");

    const showMessage = (
        message,
        severity = "success"
    ) => {
        setSnackbarMessage(message);
        setStatus(severity);
        setOpen(true);
    };

    async function handleDomainExtraction() {
        const url = domainUrl.trim();

        if (!url) {
            showMessage(
                "Please enter a domain URL.",
                "error"
            );
            return;
        }

        try {
            setLoading(true);
            setLoadingMessage(
                "Starting domain extraction..."
            );

            const response = await axios.get(
                "http://localhost:9091/content/ingestAemData",
                {
                    params: {
                        userEmail: "ruchithk@nextrow.com",
                        domainUrl: url,
                    },
                }
            );

            console.log(
                "Ingestion Response:",
                response.data
            );

            navigate("/home/datapreview", {
                state: {
                    domainUrl: url,
                },
            });
        } catch (error) {
            console.error(
                "Ingestion API Error:",
                error
            );

            navigate("/home/datapreview", {
                state: {
                    domainUrl: url,
                },
            });
        } finally {
            setLoading(false);
            setLoadingMessage("");
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleDomainExtraction();
        }
    };

    return (
        <div className="home-page">
            <Header />

            <main className="home-main">
                <section className="home-hero">

                    <div className="home-hero-badge">
                        <span className="home-hero-badge-dot" />
                        Content Authoring Workspace
                    </div>

                    <h1 className="home-hero-title">
                        Bring your content into
                        <span className="home-hero-title-accent">
                            {" "}one workspace.
                        </span>
                    </h1>

                    <p className="home-hero-description">
                        Connect your domain to discover pages and
                        components, then manage your content structure
                        from a single authoring workspace.
                    </p>

                    <div className="home-domain-card">

                        <div className="home-domain-card-header">
                            <div className="home-domain-card-heading">
                                <span className="home-domain-card-eyebrow">
                                    GET STARTED
                                </span>

                                <h2 className="home-domain-card-title">
                                    Connect a domain
                                </h2>

                                <p className="home-domain-card-description">
                                    Enter the domain you want to inspect
                                    and extract its content structure.
                                </p>
                            </div>

                            <div className="home-domain-card-indicator">
                                <span className="home-domain-card-indicator-dot" />
                                Ready
                            </div>
                        </div>

                        <div className="home-domain-form">

                            <label
                                htmlFor="domain-url"
                                className="home-domain-label"
                            >
                                Domain URL
                            </label>

                            <div className="home-domain-input-row">

                                <div className="home-domain-input-wrapper">
                                    <input
                                        id="domain-url"
                                        type="text"
                                        value={domainUrl}
                                        onChange={(event) =>
                                            setDomainUrl(
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={handleKeyPress}
                                        placeholder="https://your-domain.com"
                                        className="home-domain-input"
                                        disabled={loading}
                                        autoComplete="url"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleDomainExtraction
                                    }
                                    disabled={loading}
                                    className="home-domain-submit"
                                >
                                    <span>
                                        Extract & Continue
                                    </span>

                                    <ArrowRightCircleIcon className="home-domain-submit-icon" />
                                </button>

                            </div>

                            <p className="home-domain-helper">
                                Press Enter to continue
                            </p>

                        </div>
                    </div>

                    <div className="home-workflow">

                        <div className="home-workflow-item">
                            <span className="home-workflow-number">
                                01
                            </span>

                            <div className="home-workflow-copy">
                                <strong>
                                    Connect
                                </strong>

                                <span>
                                    Enter your domain
                                </span>
                            </div>
                        </div>

                        <div className="home-workflow-line" />

                        <div className="home-workflow-item">
                            <span className="home-workflow-number">
                                02
                            </span>

                            <div className="home-workflow-copy">
                                <strong>
                                    Extract
                                </strong>

                                <span>
                                    Discover content
                                </span>
                            </div>
                        </div>

                        <div className="home-workflow-line" />

                        <div className="home-workflow-item">
                            <span className="home-workflow-number">
                                03
                            </span>

                            <div className="home-workflow-copy">
                                <strong>
                                    Author
                                </strong>

                                <span>
                                    Explore components
                                </span>
                            </div>
                        </div>

                    </div>

                </section>
            </main>

            <Snackbar
                open={open}
                autoHideDuration={2500}
                onClose={() => setOpen(false)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                className="home-snackbar"
            >
                <Alert
                    severity={status}
                    variant="filled"
                    onClose={() => setOpen(false)}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Footer />

            {loading && (
                <div className="home-loading-overlay">
                    <div className="home-loading-card">

                        <div className="home-loading-spinner">
                            <span />
                        </div>

                        <div className="home-loading-content">
                            <strong>
                                Preparing workspace
                            </strong>

                            <span>
                                {loadingMessage}
                            </span>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
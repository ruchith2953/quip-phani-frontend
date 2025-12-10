import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Pages/Header";
import Footer from "../Pages/Footer";
import "../styles/updateAem.css";

const UpdateAem = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleBackToHome = () => {
    navigate("/");
  };

  const handlePreviewPage = () => {
    console.log("review page function triggered");
  };

  return (
    <div className="update-aem-wrapper">
      <Header />

      <div className="aem-main-page">
        <h1>AEM Update Successfully Done ✅ </h1>

        <div className="aem-btn-group">
          <button
            className="btn primary-btn"
            onClick={handleBackToHome}
          >
            Back to Home
          </button>

          <button
            className="btn secondary-btn"
            onClick={handlePreviewPage}
          >
            Preview Page
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpdateAem;

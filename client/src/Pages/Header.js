import React from "react";
import { ActionButton, Flex, Provider, defaultTheme } from "@adobe/react-spectrum";
import Home from "@spectrum-icons/workflow/Home";
import { useNavigate } from "react-router-dom";

import "../styles/header.css";

const Header = ({
  title = "Dashboard",
  secondaryTitle,
  showHome = true,
}) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <header className="quip-header">
        <div className="quip-header__inner">

          {/* LEFT — HOME + BRAND */}
          <div className="quip-header__left">

            {showHome && (
              <ActionButton
                onPress={handleHomeClick}
                isQuiet
                aria-label="Home"
                UNSAFE_className="quip-header__home-button"
              >
                <Home size="S" />
              </ActionButton>
            )}

            <div className="quip-header__divider" />

            <div className="quip-header__brand">
              <div className="quip-header__logo">
                Q
              </div>

              <div className="quip-header__brand-text">
                <span className="quip-header__product">
                  Quip
                </span>

                <span className="quip-header__workspace">
                  Phani
                </span>
              </div>
            </div>
          </div>

          {/* CENTER — PAGE TITLE */}
          <div className="quip-header__page">
            <span className="quip-header__page-title">
              {title}
            </span>

            {secondaryTitle && (
              <>
                <span className="quip-header__separator">
                  /
                </span>

                <span className="quip-header__secondary">
                  {secondaryTitle}
                </span>
              </>
            )}
          </div>

          {/* RIGHT — INTENTIONALLY EMPTY */}
          <div className="quip-header__right" />

        </div>
      </header>
    </Provider>
  );
};

export default Header;

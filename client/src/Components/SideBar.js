import React, { useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseIcon from "@mui/icons-material/Close";

import "../styles/sidebar.css";

export default function SideBar({
  pagePaths = [],
  selectedPagePath = "",
  onSelectPagePath,
}) {
  const [searchValue, setSearchValue] = useState("");

  const filteredPagePaths = useMemo(() => {
    const searchText = searchValue.trim().toLowerCase();

    if (!searchText) {
      return pagePaths;
    }

    return pagePaths.filter((pagePath) =>
      pagePath.toLowerCase().includes(searchText)
    );
  }, [pagePaths, searchValue]);

  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <aside className="quip-page-sidebar">
      {/* Header */}
      <div className="quip-page-sidebar__header">
        <div className="quip-page-sidebar__heading">
          <div className="quip-page-sidebar__title-row">
            <h2 className="quip-page-sidebar__title">
              Pages
            </h2>

            <span className="quip-page-sidebar__count">
              {pagePaths.length}
            </span>
          </div>

          <p className="quip-page-sidebar__subtitle">
            Navigate your page paths
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="quip-page-sidebar__search">
        <SearchIcon className="quip-page-sidebar__search-icon" />

        <input
          type="text"
          className="quip-page-sidebar__search-input"
          placeholder="Search pages..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          aria-label="Search page paths"
        />

        {searchValue && (
          <button
            type="button"
            className="quip-page-sidebar__clear"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <CloseIcon />
          </button>
        )}

        {!searchValue && (
          <span className="quip-page-sidebar__search-key">
            /
          </span>
        )}
      </div>

      {/* Result information */}
      {searchValue && (
        <div className="quip-page-sidebar__results">
          <span>
            {filteredPagePaths.length}{" "}
            {filteredPagePaths.length === 1 ? "result" : "results"}
          </span>
        </div>
      )}

      {/* Page navigation */}
      <nav
        className="quip-page-sidebar__navigation"
        aria-label="Page paths"
      >
        {filteredPagePaths.length === 0 ? (
          <div className="quip-page-sidebar__empty">
            <div className="quip-page-sidebar__empty-icon">
              <SearchIcon />
            </div>

            <span className="quip-page-sidebar__empty-title">
              No pages found
            </span>

            <span className="quip-page-sidebar__empty-text">
              Try a different search term.
            </span>
          </div>
        ) : (
          <div className="quip-page-sidebar__list">
            {filteredPagePaths.map((pagePath) => {
              const isSelected = selectedPagePath === pagePath;

              return (
                <button
                  type="button"
                  key={pagePath}
                  className={`quip-page-sidebar__item ${isSelected
                      ? "quip-page-sidebar__item--selected"
                      : ""
                    }`}
                  onClick={() => onSelectPagePath(pagePath)}
                  title={pagePath}
                  aria-current={isSelected ? "page" : undefined}
                >
                  <span className="quip-page-sidebar__item-icon">
                    <DescriptionOutlinedIcon />
                  </span>

                  <span className="quip-page-sidebar__item-content">
                    <span className="quip-page-sidebar__item-path">
                      {pagePath}
                    </span>
                  </span>

                  {isSelected && (
                    <span className="quip-page-sidebar__active-indicator" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom status */}
      <div className="quip-page-sidebar__footer">
        <span className="quip-page-sidebar__footer-dot" />

        <span>
          {pagePaths.length} pages available
        </span>
      </div>
    </aside>
  );
}
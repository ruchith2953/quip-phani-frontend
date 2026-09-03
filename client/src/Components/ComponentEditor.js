import React, { useEffect, useMemo, useState } from "react";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";

import "../styles/componentEditor.css";

const getComponentName = (component = {}) => {
  const name =
    component.componentName ||
    component.componentname ||
    component.name ||
    component.title ||
    "Unnamed component";

  return String(name);
};

const getComponentPath = (component = {}) => {
  return (
    component.componentPath ||
    component.componentpath ||
    component.path ||
    "-"
  );
};

const getComponentType = (component = {}) => {
  return (
    component.componentType ||
    component.componenttype ||
    component.resourceType ||
    component.resourceTypeName ||
    "-"
  );
};

const getComponentIdentifier = (component = {}, index = 0) => {
  return String(
    component.documentId ||
    component.id ||
    component._id ||
    `${getComponentPath(component)}-${getComponentName(component)}-${index}`
  );
};

const createSerializableCopy = (value) => {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    console.error("Unable to serialize component data:", error);
    return value;
  }
};

export default function ComponentEditor({
  components = [],
  pagePath = "",
}) {
  const [selectedComponentIds, setSelectedComponentIds] = useState([]);

  useEffect(() => {
    setSelectedComponentIds([]);
  }, [components, pagePath]);

  const componentsWithIds = useMemo(() => {
    return components.map((component, index) => ({
      component,
      componentId: getComponentIdentifier(component, index),
    }));
  }, [components]);

  const selectedComponents = useMemo(() => {
    const selectedIds = new Set(selectedComponentIds);

    return componentsWithIds
      .filter(({ componentId }) => selectedIds.has(componentId))
      .map(({ component }) => component);
  }, [componentsWithIds, selectedComponentIds]);

  const selectedCount = selectedComponents.length;

  const allComponentsSelected =
    componentsWithIds.length > 0 &&
    selectedComponentIds.length === componentsWithIds.length;

  const someComponentsSelected =
    selectedComponentIds.length > 0 && !allComponentsSelected;

  const selectedComponentNames = useMemo(() => {
    return selectedComponents
      .map((component) => getComponentName(component))
      .join(", ");
  }, [selectedComponents]);

  const handleComponentSelection = (componentId) => {
    setSelectedComponentIds((currentIds) => {
      const isAlreadySelected = currentIds.includes(componentId);

      if (isAlreadySelected) {
        return currentIds.filter(
          (selectedId) => selectedId !== componentId
        );
      }

      return [...currentIds, componentId];
    });
  };

  const handleSelectAll = () => {
    if (allComponentsSelected) {
      setSelectedComponentIds([]);
      return;
    }

    setSelectedComponentIds(
      componentsWithIds.map(({ componentId }) => componentId)
    );
  };

  const handleCheckboxClick = (event, componentId) => {
    event.stopPropagation();
    handleComponentSelection(componentId);
  };

  const pushToAdobeDataLayer = (eventName, dataKey) => {
    if (selectedComponents.length === 0) {
      return;
    }

    window.adobeDataLayer = window.adobeDataLayer || [];

    const selectedRows = createSerializableCopy(selectedComponents);

    const payload = {
      event: eventName,
      pagePath,
      selectionCount: selectedRows.length,
      selectedRows,
    };

    window.adobeDataLayer.push(payload);

    console.log("Adobe Data Layer Payload:", payload);
    console.log(
      "Current Adobe Data Layer:",
      window.adobeDataLayer
    );
  };

  const handleTestClickInteraction = () => {
    pushToAdobeDataLayer(
      "button.click",
      "components"
    );
  };

  const handleTestPageView = () => {
    pushToAdobeDataLayer(
      "Pageview",
      "pages"
    );
  };

  return (
    <section className="component-editor-panel">
      <div className="component-editor-header">
        <div className="component-editor-heading-group">
          <div className="component-editor-heading-icon">
            <LayersOutlinedIcon />
          </div>

          <div className="component-editor-heading-content">
            <div className="component-editor-eyebrow">
              COMPONENT EXPLORER
            </div>

            <h2 className="component-editor-title">
              Components
            </h2>

            <div className="component-editor-path">
              <span className="component-editor-path-label">
                PAGE
              </span>

              <ChevronRightOutlinedIcon />

              <span
                className="component-editor-path-value"
                title={pagePath}
              >
                {pagePath || "Select a page path"}
              </span>
            </div>
          </div>
        </div>

        <div className="component-editor-header-summary">
          {selectedCount > 0 && (
            <div className="component-editor-selected-summary">
              <span className="component-editor-selected-summary-value">
                {selectedCount}
              </span>

              <span className="component-editor-selected-summary-label">
                selected
              </span>
            </div>
          )}

          <div className="component-editor-summary">
            <span className="component-editor-summary-value">
              {components.length}
            </span>

            <span className="component-editor-summary-label">
              {components.length === 1
                ? "component"
                : "components"}
            </span>
          </div>
        </div>
      </div>

      {components.length === 0 ? (
        <div className="component-editor-empty">
          <div className="component-editor-empty-icon">
            <LayersOutlinedIcon />
          </div>

          <h3 className="component-editor-empty-title">
            No components to display
          </h3>

          <p className="component-editor-empty-description">
            Select a page path from the left panel to inspect
            the components available on that page.
          </p>
        </div>
      ) : (
        <div className="component-editor-table-shell">
          <div className="component-editor-table-scroll">
            <table className="component-editor-table">
              <thead>
                <tr>
                  <th className="component-editor-checkbox-column">
                    <input
                      type="checkbox"
                      className="component-editor-checkbox"
                      checked={allComponentsSelected}
                      ref={(checkbox) => {
                        if (checkbox) {
                          checkbox.indeterminate =
                            someComponentsSelected;
                        }
                      }}
                      onChange={handleSelectAll}
                      aria-label="Select all components"
                    />
                  </th>

                  <th className="component-editor-name-column">
                    Component
                  </th>

                  <th className="component-editor-type-column">
                    Type
                  </th>

                  <th className="component-editor-path-column">
                    Component Path
                  </th>

                  <th className="component-editor-status-column">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {componentsWithIds.map(
                  ({ component, componentId }) => {
                    const isSelected =
                      selectedComponentIds.includes(componentId);

                    return (
                      <tr
                        key={componentId}
                        className={`component-editor-row ${isSelected
                            ? "component-editor-row-selected"
                            : ""
                          }`}
                        onClick={() =>
                          handleComponentSelection(componentId)
                        }
                        tabIndex={0}
                        role="checkbox"
                        aria-checked={isSelected}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" ||
                            event.key === " "
                          ) {
                            event.preventDefault();
                            handleComponentSelection(componentId);
                          }
                        }}
                      >
                        <td className="component-editor-checkbox-cell">
                          <input
                            type="checkbox"
                            className="component-editor-checkbox"
                            checked={isSelected}
                            onChange={() => { }}
                            onClick={(event) =>
                              handleCheckboxClick(
                                event,
                                componentId
                              )
                            }
                            aria-label={`Select ${getComponentName(
                              component
                            )}`}
                          />
                        </td>

                        <td>
                          <div className="component-editor-name-cell">
                            <div className="component-editor-component-icon">
                              <LayersOutlinedIcon />
                            </div>

                            <div className="component-editor-name-content">
                              <span
                                className="component-editor-component-name"
                                title={getComponentName(component)}
                              >
                                {getComponentName(component)}
                              </span>

                              {isSelected && (
                                <span className="component-editor-selected-label">
                                  Selected
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="component-editor-type-badge">
                            {getComponentType(component)}
                          </span>
                        </td>

                        <td>
                          <span
                            className="component-editor-component-path"
                            title={getComponentPath(component)}
                          >
                            {getComponentPath(component)}
                          </span>
                        </td>

                        <td>
                          <div className="component-editor-row-status">
                            <span
                              className={`component-editor-status-dot ${isSelected
                                  ? "component-editor-status-dot-active"
                                  : ""
                                }`}
                            />

                            <span>
                              {isSelected ? "Selected" : "Ready"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="component-editor-testing-panel">
          <div className="component-editor-testing-info">
            <div className="component-editor-testing-icon">
              <TouchAppOutlinedIcon />
            </div>

            <div className="component-editor-testing-copy">
              <span className="component-editor-testing-label">
                INTERACTION TESTING
              </span>

              <strong
                className="component-editor-testing-component"
                title={selectedComponentNames}
              >
                {selectedCount === 1
                  ? getComponentName(selectedComponents[0])
                  : `${selectedCount} components selected`}
              </strong>

              <span className="component-editor-testing-description">
                Push selected component data to Adobe Data Layer.
              </span>
            </div>
          </div>

          <div className="component-editor-testing-actions">
            <button
              type="button"
              className="component-editor-clear-button"
              onClick={() => setSelectedComponentIds([])}
            >
              Clear selection
            </button>

            <button
              type="button"
              className="component-editor-test-button component-editor-test-button-primary"
              onClick={handleTestClickInteraction}
            >
              <TouchAppOutlinedIcon />

              <span>Test Click</span>
            </button>

            <button
              type="button"
              className="component-editor-test-button component-editor-test-button-secondary"
              onClick={handleTestPageView}
            >
              <VisibilityOutlinedIcon />

              <span>Test Page View</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
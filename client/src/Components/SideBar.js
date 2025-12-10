
import React, { useEffect, useMemo, useState } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "../styles/sidebar.css";
import { formatComponentName } from "../Utils/utlity";

const groupByRootName = (components) => {
  return components.reduce((acc, component) => {
    const rootName = component.componentName.split("|")[0];
    if (!acc[rootName]) acc[rootName] = [];
    acc[rootName].push(component);
    return acc;
  }, {});
};

export default function SideBar({
  components = [],
  selectedComponent,
  onSelectComponent
}) {
  const groupedComponents = useMemo(
    () => groupByRootName(components),
    [components]
  );
  
  const [openGroup, setOpenGroup] = useState(null);

//   const formatComponentName = (name = "") => {
//   const firstPart = name.split("|")[0]; 
//   return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
// };

  useEffect(() => {
    if (components.length && !selectedComponent) {
      onSelectComponent(components[0]);
    }
  }, [components, selectedComponent, onSelectComponent]);

  useEffect(() => {
    if (!selectedComponent) return;
    const root = selectedComponent.componentName.split("|")[0];
    setOpenGroup(root);
  }, [selectedComponent]);

  const toggleGroup = (rootName) => {
    setOpenGroup((prev) =>
      prev === rootName ? null : rootName
    );
  };

  return (
    <div className="component-list">
      {Object.entries(groupedComponents).map(
        ([rootName, group]) => {
          const isOpen = openGroup === rootName;

          return (
            <div key={rootName} className="component-group">
              {/* ROOT HEADER */}
              <div
                className="component-group-title"
                onClick={() => toggleGroup(rootName)}
              >
                <span>{rootName}</span>
                <span className="arrow">
                  {isOpen ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
                </span>
              </div>

              {/* CHILD ITEMS */}
              {isOpen &&
                group.map((component) => (
                  <div
                    key={component.documentId}
                    className={`component-item ${
                      selectedComponent?.documentId === component.documentId
                        ? "active"
                        : ""
                    }`}
                    onClick={() => onSelectComponent(component)}
                  >
                    <div className="component-title">
                      {formatComponentName(component.componentName)}
                    </div>
                    <div className="component-path">
                      {component.componentpath}
                    </div>
                  </div>
                ))}
            </div>
          );
        }
      )}
    </div>
  );
}

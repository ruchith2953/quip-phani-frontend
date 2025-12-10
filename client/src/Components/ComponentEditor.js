import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import { Snackbar, Alert } from "@mui/material";
import "../styles/componentEditor.css";
import { formatComponentName } from "../Utils/utlity";
import axios from "axios";

const uneditableFields = [
  "documentId",
  "path",
  "componentpath",
  "inventoryurl",
  "lastmodifiedon",
  "lastmodifiedby",
  "ats-lastmodifiedon",
  "ats-lastmodifiedby",
  "changed"
];
const hideFields=[
  "documentId",
  "topicContent"
];

export default function ComponentEditor({ component,currentDomainCardData,onExtract,setLoading,setLoadingMessage}) {
  const navigate = useNavigate();
  
  const [editedComponent, setEditedComponent] = useState({});
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackBarMessage] = useState("");
  const [status, setStatus] = useState("success");
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [originalComponent, setOriginalComponent] = useState({});
  const [enableAem,setEnableAem]=useState(true);


  useEffect(() => {
    if (component) {
        const deepCopy = JSON.parse(JSON.stringify(component));
        setEditedComponent(deepCopy);
        setOriginalComponent(deepCopy);
    }
  }, [component]);

  if (!component) {
    return (
      <div className="editor-container empty-state">
        <h2>No Data Avaialbale ...</h2>
      </div>
    );
  }

  const isDisabled = (key) =>
    uneditableFields.some((field) =>
      key.toLowerCase().includes(field.toLowerCase())
    );

    const isHidden = (key) =>
  hideFields.some((field) =>
    key.toLowerCase().includes(field.toLowerCase())
  );

  const autoResize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const updateField = (key, value) => {
    setEditedComponent((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const getUpdatedFieldsPayload = () => {
  const payload = {
    id: originalComponent.documentId
  };

  Object.keys(editedComponent).forEach((key) => {
    if (isDisabled(key)) return;
    const originalValue = originalComponent[key] ?? "";
    const updatedValue = editedComponent[key] ?? "";

    if (originalValue !== updatedValue) {
      payload[key] = updatedValue;
    }
  });

  return payload;
};


  const renderField = (key, value) => {
     if (isHidden(key)) return null; 
    const disabled = isDisabled(key);
    if (typeof value === "object" && value !== null) {
      return (
        <div
          key={key}
          className={`field-group ${disabled ? "system-field" : ""}`}
        >
          <h4 className="object-title">{key}</h4>
          <div className="object-block">
            {Object.entries(value).map(([k, v]) => renderField(k, v))}
          </div>
        </div>
      );
    }

    return (
      <div
        key={key}
        className={`field-group ${disabled ? "system-field" : ""}`}
      >
        <label className="field-label">{key}</label>
        <textarea
          className="field-textarea"
          disabled={disabled}
          value={value ?? ""}
          ref={autoResize}
          onChange={(e) => {
            autoResize(e.target);
            updateField(key, e.target.value);
          }}
        />
      </div>
    );
  };



  const handleSave = async () => {
  try {
    setLoading(true);
    setLoadingMessage("Saving changes...");
    const userEmail="sravan@nextrow.com";
    const userName="sravan";
    const payload={
      "domainUrl":currentDomainCardData.domainUrl,
      "userName":userName,
      "updateDocument":getUpdatedFieldsPayload()
    };
    console.log("Saved Component:", payload);
      const updatedResponse=await axios.put(`/proxy/content/updateComponent`,payload,{headers: {"Content-Type": "application/json"}});
      if(updatedResponse.data.status==="success"){
        setSnackBarMessage(updatedResponse.data.message);
        setStatus("success");
        setOpen(true);
        setEnableAem(false);
      }else{
        setSnackBarMessage(updatedResponse.data.message);
        setStatus("error");
        setOpen(true);
      }
   
  } catch (err) {
    setSnackBarMessage("Save failed");
    setStatus("error");
    setOpen(true);
  } finally {
    setLoading(false);
    setLoadingMessage("");
  }
};

   function updateAemNavigation(){
        setSelectedDomain(currentDomainCardData);
        setConfirmOpen(true);
    }

  async function updateAEMapi(updatedDomain) {
      try {
        setLoading(true);
        setLoadingMessage("Updating AEM...");
        console.log("updateAEM api function triggered", updatedDomain);
        // await api call make it here..
        navigate("/home/datapreview/update-aem", {
          state: { test: "data" }
        });
      } catch (error) {
        console.error("Update AEM failed", error);
      } finally {
        setLoading(false);
        setLoadingMessage("");
      }
  }

  return (
    <>
      <div className="editor-container">
        <div className="editor-header">
          <h2 className="editor-title">
            Editing: <span>{formatComponentName(component.componentName)}</span>
          </h2>

          <div className="btn-group">
            <button className="btn btn-back" onClick={() => navigate("/")}>
              Back
            </button>
            <button className={`btn btn-aem ${enableAem ? "btn-disabled" : ""}`}onClick={()=>updateAemNavigation()} disabled={enableAem} >
              Update AEM
            </button>
          </div>
        </div>

        <div className="editor-body">
          <div className="editor-inner">
            {Object.entries(editedComponent).map(([key, value]) =>
              renderField(key, value)
            )}

            <div className="save-section">
              <button className="btn btn-save" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
            open={confirmOpen}
            mode="info"
            domainData={currentDomainCardData}  
            onCancel={() => {
                setConfirmOpen(false);
                setSelectedDomain(null);
                    }}
            action={"updateAem"}
            onHandleUpdateAem={updateAEMapi}
                />

      <Snackbar
              open={open}
              autoHideDuration={2000}
              sx={{zIndex: 99999}}
              onClose={() => setOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
            <Alert severity={status} onClose={() => setOpen(false)} variant="filled">
                      {snackbarMessage}
            </Alert>
            </Snackbar>
    </>
  );
}

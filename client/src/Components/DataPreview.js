import React, { useEffect, useState } from "react";
import Header from "../Pages/Header";
import Footer from "../Pages/Footer";
import "../styles/dataPreview.css";
import ComponentEditor from "./ComponentEditor";
import { useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";

const DataPreview = () => {

  const [selectedComponent, setSelectedComponent] = useState(null);
  const [componentData,setComponentData]=useState([]);
  const location=useLocation();
  const selectedCardFromRoute = location?.state?.selectedDomain || null;
  const { selectedDomain, path } = location.state || {};
  const [selectedCard,setSelectedCard]=useState(selectedCardFromRoute);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackBarMessage] = useState("");
  const [status, setStatus] = useState("success");


  useEffect(()=>{
      exportComponents()
  },[])

 async function exportComponents(){
    try {
      setLoading(true)
      setLoadingMessage("Extracting Components Data...");
      const response=await axios.get(`/proxy/content/exportComponentsToJSON?domainUrl=${selectedCard.domainUrl}&domainPath=${path}`);
      if(response.data.components.length>0){
        setComponentData(response.data.components);
      }else{
        setComponentData([])
      setSnackBarMessage("No Component Data Avaliable for the Domain.")
      setOpen(true);
      setStatus("error");
      }
    } catch (error) {
      setSnackBarMessage("Api unable to Fetch the Data Try Again.")
      setOpen(true);
      setStatus("error");
      console.log("error exportComponents ",error);
    }finally{
    setLoading(false);
    setLoadingMessage("");
    }
  }

  return (
    <div className="editing-main-page">
      <Header />

      <div className="editor-main">
        {/* side bar code  */}
        <SideBar
          components={componentData.components}
          // components={componentData}
          selectedComponent={selectedComponent}
          onSelectComponent={(component) =>
            setSelectedComponent(component)
          }
        />
        {/* Editor Page Code */}
        <div className="editor-console">
          <ComponentEditor
            component={selectedComponent}
            currentDomainCardData={selectedCard}
            onExtract={exportComponents}
            setLoading={setLoading}
            setLoadingMessage={setLoadingMessage}
          />
        </div>
      </div>
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

      <Footer />
        {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p style={{ color: "white", marginTop: "12px" }}>
            {loadingMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default DataPreview;

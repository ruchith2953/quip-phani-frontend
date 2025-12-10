import { DataGrid } from "@mui/x-data-grid";
import { Alert, Snackbar } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Footer from "../Pages/Footer";
import Header from "../Pages/Header";
import "../styles/Setting.css";
import ConfirmDialog from "./ConfirmDialog";

export default function SettingsPage() {
    const navigate = useNavigate();
    const [domainUrl, setDomainUrl] = useState("");
     const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackBarMessage] = useState("");
    const [status, setStatus] = useState("success");
    const [columns, setColumns] = useState([]);
    const [rowData,setRowData]=useState();
    const [mapperFile, setMapperFile] = useState(null);
    const [selectedDomainToDelete, setSelectedDomainToDelete] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        fetchDomains();
    }, []);

   const fetchDomains = async() => {
        try {
            const domainResponse= await axios.get("/proxy/content/getAllDomains");
            if(domainResponse?.data?.domains?.length>0){
                setColumns(extractColumns(domainResponse?.data || {}));
                setRowData(domainResponse?.data?.domains || []);
            }else{
                setColumns([]);
                setRowData([]);
            }
        } catch (error) {
            console.log("fetch Domains",error);
            
        }
    };
    const handleCreateDomain = async () => {
        if (!domainUrl && !mapperFile) {
            setSnackBarMessage("Domain URL and mapper file are required.");
            setStatus("error");
            setOpen(true);
            return;
        }
        if (!domainUrl) {
            setSnackBarMessage("Domain URL is missing.");
            setStatus("error");
            setOpen(true);
            return;
        }
        if (!mapperFile) {
            setSnackBarMessage("Mapper file (.xlsx) is missing.");
            setStatus("error");
            setOpen(true);
            return;
        }
        const formData = new FormData();
        formData.append("domainUrl", domainUrl);
        formData.append("mapperFile", mapperFile);

        try {
            const response = await axios.post("/proxy/content/createDomain",formData,{ headers: {"Content-Type": "multipart/form-data"} });
            if (response.data?.status === "success") {
                setSnackBarMessage(response.data.response || "Domain created successfully");
                setStatus("success");
                setOpen(true)
                setDomainUrl("");
                fetchDomains();
            } else {
                setSnackBarMessage(response.data?.errorMessage || "Error creating domain");
                setStatus("error");
                setOpen(true);
            }
        } catch (error) {
            console.error("Create domain error:", error);
            setSnackBarMessage("Server error while creating domain.");
            setStatus("error")
            setOpen(true)
            setDomainUrl("")
        } finally {
            setMapperFile(null);
            setDomainUrl("")
        }
    };

    const handleDeleteDomain = (data) => {
        setSelectedDomainToDelete(data);
        setConfirmOpen(true);
    };

    const handleDeleteDomainApi=(data)=>{
        console.log("handle delete domain function",data)
    }

    function extractColumns(data) {
        const result = Object.keys(data?.domains[0]).map(key => {
            let header = key.toUpperCase();

            if (key === "domainName") header = "Domain Name";
            if (key === "domainUrl") header = "Domain URL";

            return {
                field: key,
                headerName: header,
                flex: 1,
                renderCell: (params) => {
                    if (key === "domainUrl") {
                        return (
                            <a
                                href="#"
                                style={{ color: "#007bff" }}
                                onClick={e => e.stopPropagation()}
                            >
                                {params.value}
                            </a>
                        );
                    }
                    return params.value;
                }
            };
        });
        result.push({
            field: "delete",
            headerName: "Delete",
            flex: 0.3,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    color="error"
                    onClick={() => handleDeleteDomain(params.row)}
                >
                    <DeleteIcon />
                </IconButton>
            )
        });

        return result.filter(item => item.field !== "id");
    }

    return (
        <div className="Dashboard-setting">
            <Header/>
        <div className="settings-container">
            <div>
            <div className="top-wrapper">
                <div className="left-group">
                    <input
                        type="text"
                        placeholder="Enter domain URL"
                        value={domainUrl}
                        onChange={e => setDomainUrl(e.target.value)}
                        className="domain-input"
                    />
                     <label className="upload-btn">
                          <CloudUploadIcon />
                        <input
                            type="file"
                            accept=".xlsx"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setMapperFile(file || null);
                            }}
                        />
                    </label>
                    
                    <button className="create-btn" onClick={handleCreateDomain}>
                        Create Domain
                    </button>
                </div>

                <div className="right-group">
                    <button className="back-btn" onClick={() => navigate("/")}>
                         Back to Home
                    </button>
                </div>
                
            </div>
            {mapperFile && (
                <span className="file-name">
                    {mapperFile.name}
                </span>
            )}
       </div>
            <Paper sx={{ height: 400, width: "100%" ,marginTop:"35px"}}>
                <DataGrid
                    rows={rowData}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection={false} 
                    disableRowSelectionOnClick
                    sx={{ border: 0 }}
                    isCellEditable={() => false}
                />
            </Paper>
        </div>
        <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={() => setOpen(false)}
              sx={{zIndex : 9999}}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
            <Alert severity={status} onClose={() => setOpen(false)} variant="filled">
                      {snackbarMessage}
            </Alert>
            </Snackbar>
                         
        <ConfirmDialog
            open={confirmOpen}
            // title="Delete Domain"
            mode="error"
            domainData={selectedDomainToDelete}  
            onCancel={() => {
                setConfirmOpen(false);
                setSelectedDomainToDelete(null);
            }}
            action={"Delete"}
            onHandleDelete={handleDeleteDomainApi}
        />
        <Footer/>
        </div>
    );
}

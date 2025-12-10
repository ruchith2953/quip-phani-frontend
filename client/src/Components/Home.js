import {Cog6ToothIcon,ArrowRightCircleIcon} from "@heroicons/react/24/outline";
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Home.css";
import "../styles/Setting.css";
import Footer from "../Pages/Footer";
import Header from "../Pages/Header";


export default function HomePage() {
    const navigate = useNavigate();
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessage,setLoadingMessage]=useState("loading");
    const [showModal, setShowModal] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState();
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackBarMessage] = useState("");
    const [status, setStatus] = useState("success");


    let getAllDomains = {
    "domains": [
        {
            "domainName": "nrbank",
            "domainUrl": "https://nrbank.p.cwcm-admp.com",
            "updatedAt": "2025-12-01T11:23:38.857507400Z",
            "id": "6926cf690d84d3342bc96a2b"
        },
        {
            "domainName": "qulipta",
            "domainUrl": "https://qulipta.p.cwcm-admp.com",
            "id": "692974b01dce44de94391b29"
        },
        {
            "domainName": "psoriasis",
            "domainUrl": "https://psoriasis.p.cwcm-admp.com",
            "id": "692d682ec8c30fc9703826f1"
        }
    ]
};


    useEffect(() => {
        fetchDomains();
    }, []);

   async function fetchDomains() {
    setLoadingMessage("Loading Domains please wait ...");
    try {
        setLoading(true)
        const response = await axios.get('/proxy/content/getAllDomains'); 
        
        if(response?.data?.domains?.length > 0){
        setDomains(response?.data?.domains || []);
        setLoading(false)
        setSnackBarMessage(`Domains fetched successfully.`);
        setStatus("success");
        setOpen(true);
        return response?.data || [];  
        }else{
        setDomains([])
        setLoading(false)
        setSnackBarMessage(response?.data?.errorMessage);
        setStatus("error");
        setOpen(true);
        }
        setLoadingMessage("");
    } catch (error) {
        setLoading(false)
        setSnackBarMessage(`Error: ${error.message}`);
        setStatus("error");
        setOpen(true);
        console.error('Error fetching domains:', error);
        setLoadingMessage("");
    }
    }

    const openModal = (domain) => {
        setSelectedDomain(domain);
        setInputValue("");
        setSnackBarMessage("")
        setShowModal(true);
        
    };
    const closeModal = () => {
        setShowModal(false);
        setSelectedDomain(null);
    };

    async function handleDomainIngestion() {
        setLoadingMessage("Ingestion in progress please await...")
        const path = inputValue;
        try {
            if (!inputValue.trim()) {
            closeModal();
            setSnackBarMessage("Content path cannot be empty.");
            setStatus("error");
            setOpen(true);
            return;
        }
        setLoading(true);
            const path = inputValue;
            const selectedUrl = selectedDomain.domainUrl;
            const userEmail="sravan@nextrow.com";
            const response= await axios.get(`/proxy/content/ingestAemData?userEmail=${userEmail}&domainUrl=${selectedUrl}`);
            if(response.data.status==="success"){
                setLoading(false)
                navigate("/home/datapreview", {
                    state: { selectedDomain, path }
                });
            }else{
                setLoading(false);
                setSnackBarMessage(response?.data?.errorMessage);
                setOpen(true);
                navigate("/home/datapreview",{state:{selectedDomain,path}});
                setStatus("error");
            }
            setLoadingMessage("");
        } catch (error) {
            closeModal();
            setLoading(false);
            setLoadingMessage("");
            navigate("/home/datapreview",{state:{selectedDomain,path}});
            console.log("ingestion error",error); 
        } 
    }

    return (
        <div className="Dashboard-setting">
           
         <Header/>   
        <div className="page-container">
            <div>
                <div className="header-section">
                    Content Authoring Workspace
                </div>

                 {/* <button onClick={()=>{
                handleUpdateAem()
            }}>updateAEM</button> */}

                <button className="settings-btn" onClick={() => navigate('/settings')}>
                    <Cog6ToothIcon className="settings-icon" />
                </button>
            </div>
            
            {loading ? (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p style={{color:"white"}}>{loadingMessage}</p>
                </div>
            ) : domains.length === 0 ? (
                <p className="empty-text">No domains registered.</p>
            ) : (
                <div className="domain-grid">
                    {domains.map((domain) => (
                        <div key={domain.id} onClick={() => openModal(domain)} className="domain-card">
                            <div className="domain-card-header">
                                <h2 className="domain-name">{domain.domainName}</h2>
                                <ArrowRightCircleIcon className="domain-arrow" />
                            </div>
                            <p className="domain-url">
                                    {domain.domainUrl}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <button className="modal-close-btn" onClick={closeModal}>
                            <CloseIcon className="modal-close-icon" />
                        </button>
                        <div className="modal-header">
                            <h2 className="modal-title">{selectedDomain.domainName}</h2>
                        </div>
                        <label className="modal-label">Content Path / Page Path</label>
                        <div className="modal-input-wrapper">
                            <input type="text" placeholder="e.g. /content/site/en/page" className="modal-input" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                        </div>

                        <button onClick={handleDomainIngestion} className="modal-submit-btn">
                            <ArrowRightCircleIcon className="modal-submit-icon" />
                            <span>Extract & Continue</span>
                        </button>
                    </div>
                </div>
            )}
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
        <Footer/>
        
        </div>
    );
}

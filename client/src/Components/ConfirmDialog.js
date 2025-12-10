import { ExclamationTriangleIcon,CheckCircleIcon,InformationCircleIcon,XCircleIcon,} from "@heroicons/react/24/solid";
import "../styles/confirmDialog.css" 

const iconMap = {
    info: InformationCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    success: CheckCircleIcon,
};

export default function ConfirmDialog({
    open,
    mode = "info",
    onCancel,
    action,
    onHandleDelete,
    onHandleUpdateAem,
    domainData
}) {

    if (!open) return null;
    const IconComponent = iconMap[mode] || InformationCircleIcon;
      
   const handleConfromation=  (data,Action) => {
    if(Action==="Delete"){
        onHandleDelete(data);  
    }else{
        onHandleUpdateAem(data);
        }
    if (onCancel) {
        onCancel();  
    }
};
    return (
        <div className="confirm-dialog-overlay">
            <div className={`confirm-dialog-box confirm-mode-${mode}`}>
                <div className="confirm-dialog-header">
                    <div className="confirm-dialog-icon">
                        <IconComponent style={{ width: "28px", height: "28px" }} />
                    </div>
                    <h2 className="confirm-dialog-title">{action==="Delete"?`Deleting Domain ${domainData?.domainName}`:` Conform Aem ${domainData?.domainName} Update`}</h2>
                </div>
                <div className="confirm-dialog-buttons">
                    <button className="confirm-btn confirm-btn-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button style={{border:"2px solid yellow"}} className="confirm-btn confirm-btn-confirm" onClick={()=>handleConfromation(domainData,action)}>
                        {action==="Delete"?"Delete":"Update Aem"}
                    </button>
                </div>
            </div>
        </div>
    );
}
import React, {useState} from "react";
import Dialog from '@mui/material/Dialog';


const DialogContext = React.createContext();

export const useDialog = () => React.useContext(DialogContext);

export default function DialogProvider({ children }) {
    const [dialogs, setDialogs] = useState([]);

    const createDialog = (option) => {
      const dialog = { ...option, open: true };
      setDialogs((dialogs) => [...dialogs, dialog]);
    };
    
    const closeDialog = () => {
      setDialogs((dialogs) => {
        const latestDialog = dialogs.pop();
        if (!latestDialog) return dialogs;
        if (latestDialog.onClose) latestDialog.onClose();
        return [...dialogs].concat({ ...latestDialog, open: false });
      });
    };

    const contextValue = React.useRef([createDialog, closeDialog]);


  return (
    <DialogContext.Provider value={contextValue.current}>
      {children}
      {dialogs.map((dialog, i) => {
        return <DialogContainer key={i} {...dialog} />;
      })}
    </DialogContext.Provider>
  );
}

function DialogContainer(props) {
    const { children, open, onClose } = props;
  
    return (
        <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {children}
      </Dialog>
    </div>
    );
  }
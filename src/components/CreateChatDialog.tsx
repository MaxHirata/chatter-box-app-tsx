import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    TextField 
} from "@mui/material";
import { useContext, useState } from "react";
import { ChatContext, ChatContextType } from "../context/ChatContext";

const CreateChatDialog = ({open, onClose} : {open: boolean, onClose: () => void}) => {

    const { 
        currentUser,
        handleCreateChat 
    } = useContext<ChatContextType>(ChatContext);

    const [chatTitle, setChatTitle] = useState<string>('');

    const handleCreate = () => {
        if(currentUser) {
            handleCreateChat([currentUser], chatTitle);
        }
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Chat</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter a title for the New Chat
                </DialogContentText>
                <TextField
                    onChange={ e => setChatTitle(e.target.value) }
                />
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button onClick={() => handleCreate()}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateChatDialog;
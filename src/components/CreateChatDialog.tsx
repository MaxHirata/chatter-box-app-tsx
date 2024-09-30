import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    TextField 
} from "@mui/material";
import React, { useContext, useState } from "react";
import { ChatContext, ChatContextType } from "../context/ChatContext";

const CreateChatDialog = ({open, onClose} : {open: boolean, onClose: () => void}) => {

    const { 
        currentUser,
        handleCreateChat 
    } = useContext<ChatContextType>(ChatContext);

    const [chatTitle, setChatTitle] = useState<string>('');

    const handleCreateNewChat = () => {
        if(currentUser) {
            handleCreateChat([currentUser], chatTitle);
        } else {
            // Throw some kind of error
            console.error("Error: A User must be set to create a new chat");
        }
        setChatTitle('');
        onClose();
    }

    const handleOnChangeChatTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChatTitle(e.target.value)
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Chat</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter a title for the New Chat
                </DialogContentText>
                <TextField onChange={ handleOnChangeChatTitle }/>
            </DialogContent>
            <DialogActions>
                <Button sx={{ color: '#4287f5' }} onClick={onClose}>
                    Cancel
                </Button>
                <Button sx={{ color: '#4287f5' }} onClick={() => handleCreateNewChat()} disabled={!chatTitle}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateChatDialog;
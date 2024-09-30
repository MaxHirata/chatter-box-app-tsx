import React, { useContext, useState } from "react"
import { ChatContext, ChatContextType } from "../context/ChatContext";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

const CreateUserDialog = ({ open, onClose } : {open: boolean, onClose: () => void}) => {
    const { handleCreateUser } = useContext<ChatContextType>(ChatContext);
    
    const [userName, setUserName] = useState<string>('');

    const handleOnChangeUserName = (e : React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value)
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create a New User</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the name of the new user:
                </DialogContentText>
                <TextField onChange={ handleOnChangeUserName }/>
            </DialogContent>
            <DialogActions>
                <Button sx={{ color: '#4287f5' }} onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button sx={{ color: '#4287f5' }} onClick={() => { handleCreateUser(userName) }} disabled={!userName}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
 }

export default CreateUserDialog
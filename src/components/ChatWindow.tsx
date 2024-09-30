import { Box, Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Chat, ChatContext } from "../context/ChatContext";

const ChatWindow = () => {

    const {
        currentUser,
        currentChat,
        chatHash,
        handleSendMessage
    } = useContext(ChatContext);

    const defaultChat: Chat = {
        id: '',
        name: '',
        participantIds: [],
        chatLogs: []
    }

    const [currentChatLogs, setCurrentChatLogs] = useState<Chat>(currentChat ? chatHash[currentChat] : defaultChat);
    const [messageText, setMessageText] = useState('');

    useEffect(() => {
        if (currentChat) {
            setCurrentChatLogs(chatHash[currentChat])
        }
    }, [currentChat, chatHash])

    const sendMessage = () => {
        if(currentUser && currentChat && messageText) {
            handleSendMessage(currentUser, currentChat, messageText);
            setMessageText('');
        } else {
            // Throw some kind of error
            console.error("Error: A User and a selected Chat must be set in order to send a message to chat");
        }
    }

    const handleOnChangeMessage = (e : React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value)
    }

    return (
        <Box 
            sx={{ 
                width: '80%', 
                height: 'inherit',
                marginLeft: '8px',
            }}
        > 
            <Box 
                id="chat-view"
                sx={{
                    padding: 2,
                    height: '85%',
                    border: '3px solid #4287f5',
                    borderRadius: '16px'
                }}
            >
                <Box 
                    sx={{ 
                        fontSize: 18, 
                        fontWeight: 600, 
                        textDecoration: 'underline',
                        marginBottom: '8px',
                    }} 
                >
                    {currentChatLogs.name}
                </Box>
                <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
                    {currentChatLogs.chatLogs?.map( (chatLog, index) => {
                        const sender = chatLog.senderName;
                        const message = chatLog.message;
                        const timeStamp = chatLog.timeStamp;
                        return (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '2px 4px'
                                }}
                            >
                                <Box>{sender}:</Box>
                                <Box sx={{ textAlign: 'start' }}>"{message}"</Box>
                                <Box>{timeStamp}</Box>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '16px'
                }}
            >
                <Box
                    sx={{
                        fontSize: 20,
                        fontWeight: 600,
                        marginRight: '8px'
                    }}
                >Message: </Box>
                <TextField
                    sx={{
                        width: '70%',
                        background: 'white',
                        borderRadius: '8px',
                    }}
                    size="small"
                    value={messageText}
                    onChange={ handleOnChangeMessage }
                />
                <Button
                    sx={{
                        marginLeft: '8px',
                        '&.Mui-disabled' : {
                            opacity: 0.5,
                            color: 'white',
                            backgroundColor: '#4287f5'
                        }
                    }}
                    disabled={!messageText}
                    variant="contained"
                    onClick={() => sendMessage()}
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
}

export default ChatWindow;
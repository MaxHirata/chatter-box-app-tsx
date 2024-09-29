import React from 'react';
import { createContext, useState } from "react"
import { v4 as uuid } from "uuid";

interface User {
    id: string,
    name: string,
    involvedChats: string[],
    deleted: boolean 
}

interface UserHash {
    [key: string]: User
}

interface ChatLog {
    senderName: string,
    message: string,
    timeStamp: string
}

interface Chat {
    id: string,
    name: string,
    participantIds: string[],
    chatLogs: ChatLog[]
}

interface ChatHash {
    [key: string] : Chat
}

export interface ChatContextType {
    currentUser: string | null;
    currentChat: string | null,
    userHash: UserHash,
    chatHash: ChatHash,
    handleSwitchUser: any,
    handleSelectCurrentUser: (userId: string) => void,
    handleSelectCurrentChat: (chatId: string) => void,
    handleCreateUser: (name: string) => void,
    handleDeleteUser: (userId: string) => void,
    handleCreateChat: (userIds: string[], chatName: string) => void,
    handleDeleteChat: (chatId: string) => void,
    handleSendMessage: (userId: string, chatId: string, message: string) => void
}

const defaultChatContextValues = {
    currentUser: null,
    currentChat: null,
    userHash: {},
    chatHash: {},
    handleSwitchUser: () => null,
    handleSelectCurrentUser: () => null,
    handleSelectCurrentChat: () => null,
    handleCreateUser: () => null,
    handleDeleteUser: () => null,
    handleCreateChat: () => null,
    handleDeleteChat: () => null,
    handleSendMessage: () => null
}

export const ChatContext = createContext<ChatContextType>(defaultChatContextValues);

const ChatContextProvider = ({ children } : { children: React.ReactNode }) => {

    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [currentChat, setCurrentChat] = useState<string | null>(null);
    const [userHash, setUserHash] = useState<UserHash>({});
    const [chatHash, setChatHash] = useState<ChatHash>({});

    const handleSelectCurrentUser = (userId: string) => { setCurrentUser(userId) }

    const handleSelectCurrentChat = (chatId: string) => { setCurrentChat(chatId) }

    const handleCreateUser = (name: string) => {
        const chatId = uuid();
        const userId = uuid();

        // Create a self private chat so the new user can chat to them selves
        const selfChat = {
            id: chatId,
            name: 'self private chat',
            participantIds: [userId],
            chatLogs: []
        }

        // Create New User
        const newUser = {
            id: userId,
            name: name,
            involvedChats: [chatId],
            deleted: false // Going to mimic a soft delete approach when deleting users
        }

        let updatedChatHash: ChatHash = {...chatHash};
        updatedChatHash[chatId] = selfChat;
        setChatHash(updatedChatHash);

        let updatedUserHash = {...userHash};
        updatedUserHash[userId] = newUser;
        setUserHash(updatedUserHash);

        // After create set the new user as current and new chat as current
        setCurrentUser(userId);
        setCurrentChat(chatId);
    }

    const handleSwitchUser = (userId: string) => {
        if(userId) {
            const user: User = userHash[userId];
            setCurrentUser(user.id);

            // then set the first chat as the default selected
            if(user.involvedChats?.length) {
                const firstUserChatId = user.involvedChats[0];
                setCurrentChat(firstUserChatId);
            } else {
                setCurrentChat(null);
            }

        } else {
            setCurrentUser(null);
            setCurrentChat(null);
        }
    }

    const handleDeleteUser = (userId: string) => {
        let updatedUserHash: UserHash = {...userHash};
        updatedUserHash[userId].deleted = true;
        setUserHash(updatedUserHash);
    }

    const handleCreateChat = (userIds: string[], chatName: string) => {
        const chatId = uuid();
        const newChat: Chat = {
            id: chatId,
            name: chatName,
            participantIds: [...userIds],
            chatLogs: []
        }
        let updatedChatHash = {...chatHash};
        updatedChatHash[chatId] = newChat;

        let updatedUserHash = {...userHash};
        userIds.forEach(userId => {
            updatedUserHash[userId].involvedChats.push(chatId);
        })

        setUserHash(updatedUserHash);
        setChatHash(updatedChatHash);
        setCurrentChat(chatId); // After chat is create it becomes the new current chat
    }

    const handleDeleteChat = (chatId: string) => {
        let updatedChatHash: ChatHash = {...chatHash};
        let updatedUserHash: UserHash = {...userHash};

        // Remove the chatId in each of the chat's participant's users' involvedChat list
        updatedChatHash[chatId].participantIds.forEach(participantId => {
            let userInvolvedChatList = updatedUserHash[participantId].involvedChats;
            const deletedChatIdIndex = userInvolvedChatList.indexOf(chatId);
            userInvolvedChatList.splice(deletedChatIdIndex, 1);
        })

        if(chatId === currentChat) {
            // in case the current selected chat is being delete
            if(currentUser && updatedUserHash[currentUser].involvedChats.length) {
                setCurrentChat(updatedUserHash[currentUser].involvedChats[0]);
            } else {
                setCurrentChat(null);
            }
        }

        // delete the chat object 
        delete updatedChatHash[chatId];

        setUserHash(updatedUserHash);
        setChatHash(updatedChatHash);
    }

    const handleSendMessage = (userId: string, chatId: string, message: string) => {
        const newMessage = {
            senderName: userHash[userId].name,
            message: message,
            timeStamp: new Date(Date.now()).toLocaleString()
        }

        let updatedChatHash = {...chatHash};
        updatedChatHash[chatId].chatLogs.push(newMessage);
        setChatHash(updatedChatHash);
    }


    return (
        <ChatContext.Provider value={{
            currentUser,
            currentChat,
            userHash,
            chatHash,
            handleSwitchUser,
            handleSelectCurrentUser,
            handleSelectCurrentChat,
            handleCreateUser,
            handleDeleteUser,
            handleCreateChat,
            handleDeleteChat,   
            handleSendMessage
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatContextProvider;
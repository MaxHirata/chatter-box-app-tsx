import React from 'react';
import { createContext, useState } from "react"
import { v4 as uuid } from "uuid";

export interface User {
    id: string,
    name: string,
    involvedChats: string[],
    deleted: boolean 
}

export interface UserHash {
    [key: string]: User
}

export interface ChatLog {
    senderName: string,
    message: string,
    timeStamp: string
}

export interface Chat {
    id: string,
    name: string,
    participantIds: string[],
    chatLogs: ChatLog[]
}

export interface ChatHash {
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

    /**
     * Sets a selected user as the current user
     * @param userId 
     */
    const handleSelectCurrentUser = (userId: string) => { setCurrentUser(userId) }

    /**
     * Sets a selected chat as the current chat
     * @param chatId
     */
    const handleSelectCurrentChat = (chatId: string) => { setCurrentChat(chatId) }

    /**
     * Creates a new user and creates a private chat for that user
     * and sets the new user and thier private chat as the current \
     * selected user and current selected chat
     * @param name 
     */
    const handleCreateUser = (name: string) => {
        const chatId = uuid();
        const userId = uuid();

        // Create a self private chat so the new user can chat to them selves
        const selfChat: Chat = {
            id: chatId,
            name: 'Self Private Chat',
            participantIds: [userId],
            chatLogs: []
        }

        // Create New User
        const newUser: User = {
            id: userId,
            name: name,
            involvedChats: [chatId],
            deleted: false // Going to mimic a soft delete approach when deleting users
        }

        let updatedChatHash: ChatHash = {...chatHash};
        updatedChatHash[chatId] = selfChat;
        setChatHash(updatedChatHash);

        let updatedUserHash: UserHash = {...userHash};
        updatedUserHash[userId] = newUser;
        setUserHash(updatedUserHash);

        // After create set the new user as current and new chat as current
        setCurrentUser(userId);
        setCurrentChat(chatId);
    }

    /**
     * This is method sets an existing user as current user and sets the current 
     *      chat to that new selected user's first available chat if it exists.
     * NOTE: This method is not currently used. This is for future support for having 
     *       multiple users and creating private chats between multiple users
     * @param userId 
     */
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

    /**
     *  This method soft deletes a user. This is to help not display that deleted user 
     *      on the user list but will still preserve records of chat logs that deleted 
     *      person was a part of.
     *  NOTE: This method is not currently used. This is for future support for having 
     *       multiple users and creating private chats between multiple users
     * @param userId 
     */
    const handleDeleteUser = (userId: string) => {
        let updatedUserHash: UserHash = {...userHash};
        updatedUserHash[userId].deleted = true;
        setUserHash(updatedUserHash);
    }

    /**
     * Creates a new chat.
     * Note: The reason why this method takes an array of userIds 
     *       is to support multiple users being involved in the chat.
     *       Currently this app only supports a single user but in the
     *       future when multple user support is available, this 
     *       method should multi user chats
     * @param userIds
     * @param chatName 
     */
    const handleCreateChat = (userIds: string[], chatName: string) => {
        const chatId = uuid();
        const newChat: Chat = {
            id: chatId,
            name: chatName,
            participantIds: [...userIds],
            chatLogs: []
        }
        let updatedChatHash: ChatHash = {...chatHash};
        updatedChatHash[chatId] = newChat;

        let updatedUserHash: UserHash = {...userHash};
        userIds.forEach(userId => {
            updatedUserHash[userId].involvedChats.push(chatId);
        })

        setUserHash(updatedUserHash);
        setChatHash(updatedChatHash);
        setCurrentChat(chatId); // After chat is create it becomes the new current chat
    }

    /**
     * Deletes a user's chat, deletes all records of the chat in the chatHash 
     * and removes that chat from current user's involvedChat list
     * @param chatId 
     */
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

    /**
     * Creats a chatLog message to be sent to the chat
     * @param userId 
     * @param chatId 
     * @param message 
     */
    const handleSendMessage = (userId: string, chatId: string, message: string) => {
        const newMessage: ChatLog = {
            senderName: userHash[userId].name,
            message: message,
            timeStamp: new Date(Date.now()).toLocaleString()
        }

        let updatedChatHash: ChatHash = {...chatHash};
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
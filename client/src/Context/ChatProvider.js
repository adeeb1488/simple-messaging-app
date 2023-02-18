import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

// chat provider method and their initial states

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const history = useHistory();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const[notification, setNotification] = useState([])

    // getting user details

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem('userDetails'));
       setUser(userInfo)

       if(!userInfo){
              history.push('/')
       }

    },[history])
    
    return (
        <ChatContext.Provider value={{user,setUser,selectedChat, setSelectedChat, chats, setChats,notification, setNotification}}>
        {children}
        </ChatContext.Provider>
    );
    }

    //updating the chat state

    export const ChatState = () => {
        return useContext(ChatContext);
    }

export default ChatProvider;
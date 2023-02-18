import React from 'react'
import { Box } from '@chakra-ui/layout';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { ChatState } from "../Context/ChatProvider"
import { useEffect } from "react"
//import './chats.css'
import { useState } from 'react';
const Chats = () => {

  const { user } = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false)
  
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
      className = 'myChatsandchatBoxbox'
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain = {setFetchAgain}/>}
      </Box>
    </div>
  )
}


export default Chats;
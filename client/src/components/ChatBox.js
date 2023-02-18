import React from 'react'
import {ChatState} from '../Context/ChatProvider.js'
import {Box} from '@chakra-ui/layout'
import SingleChat from './SingleChat.js'
const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const { selectedChat } = ChatState()


  // my conversations background

  return (
  <Box display={{base:selectedChat?"flex":"none",md:"flex"}}
  alignItems="center"
  flexDir="column"
  p={3}

  background="#00000"
  w={{base:"100%" ,md:"70%"}}
  borderRadius="10px"
  borderWidth="1px"
  bordercolor = "#7b889a"

  
  >
<SingleChat fetchAgain={fetchAgain} setFetchAgain = {setFetchAgain}/>
  </Box>
  )
}

export default ChatBox

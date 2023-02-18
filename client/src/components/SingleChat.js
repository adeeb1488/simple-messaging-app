import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { FormControl, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { senderDetails, senderName } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChats from './ScrollableChats'
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:8080"
var socket, selectedChatCompare;



const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([])
    const [loading,setLoading] = useState(false)
    const[newMessage, setNewMessage] = useState("")
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false)

const toastLoading = useToast()
 
 const{user,selectedChat,setSelectedChat, notification, setNotification} = ChatState()
  
 useEffect(()=>{
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on('connected successfully', ()=>{
        setSocketConnected(true)

    })
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))
},[])
const fetchAllMessages =async()=>{
    if(!selectedChat)return;

    try{
        const config = {
            headers: {
             
            Authorization: `Bearer ${user.token}`,
            },
          }; 
          setLoading(true)
          console.log("CHAT ID: ", selectedChat._id)
          const { data } = await axios.get(`/api/message/${selectedChat._id}`,config)
          console.log(messages)
          setMessages(data)
          console.log(messages)
          setLoading(false)
          socket.emit('join chat', selectedChat._id)
    }catch(err){
        toastLoading({
            title: "Error Occured!",
            description: "Failed to Load Messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
    }
}

useEffect(()=>{
    fetchAllMessages()
    selectedChatCompare = selectedChat;
},[selectedChat])


useEffect(()=>{
    socket.on('message received', (newMessageReceived) =>{
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id)
        {
                if(!notification.includes(newMessageReceived))
                {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)

                }
                console.log("NOTIFICATIONNN!!!-----------------",notification)
        }
        else{
            setMessages([...messages,newMessageReceived])
        }
    } )
})
const sendMessage = async(ev) =>{
if(ev.key==="Enter" && newMessage)
{
    socket.emit('stop typing', selectedChat._id)
    try{
        const config = {
            headers: {
            "Content-Type" : "application/json", 
            Authorization: `Bearer ${user.token}`,
            },
          };
   
    const { data } = await axios.post('/api/message',{
        content:newMessage,
        chatId:selectedChat._id,

    }, config)
    console.log(data)
    setNewMessage("")
       socket.emit('new message', data)
        setMessages([...messages,data])
        // console.log(data)

    } catch(err){
        toastLoading({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
    }
}
}


const typingHandler = (e) =>{
    setNewMessage(e.target.value)
    if(!socketConnected) return;
    if(!typing){
        setTyping(true)
        socket.emit('typing', selectedChat._id)
    }

    let lastTypingTime = new Date().getTime()
    var timerDuration = 3000;
    setTimeout(()=>{
        var timeNow = new Date().getTime()
        var timeDiff = timeNow - lastTypingTime
        
        if(timeDiff >= timerDuration && typing)
        {
            socket.emit('stop typing', selectedChat._id)
            setTyping(false)
        }
    }, timerDuration)
    // Typing Indicator
}


 return (
    <>{selectedChat ? (<>
    <Text
    fontSize={{base:"28px",md:"35px"}}
    pb={3}
    px={2}
    w="100%"
    fontFamily="Montserrat"
    display="flex"
    justifyContent={{base:"space-between"}}
    alignItems="center"
    >
        
        <IconButton
        display={{base:"flex", md:"none"}}
        icon={<ArrowBackIcon/>}
        onClick={() => setSelectedChat("")}
        />
     {!selectedChat.isGroupChat ? (
     
     <>
     {senderName(user,selectedChat.user)}
     <ProfileModal
     user={senderDetails(user,selectedChat.user)}
     />
     </>)
     :
     (
        <>
        {
            selectedChat.name.toUpperCase()
        }
    {
        <UpdateGroupChatModal
        fetchAgain={fetchAgain}
        setFetchAgain = {setFetchAgain}
        fetchAllMessages={fetchAllMessages}
        />
    }
        
        </>
     )
     }

    </Text>
    <Box
    display="flex"
    flexDir="column"
    justifyContent="flex-end"
    p={3}
    bg="#E8E8E8"
    w="100%"
    h="100%"
    borderRadius="10px"
    overflowY="hidden"
    >
        {/* Messages here */}
    {loading?(<Spinner
    size="xl"
    w={20}
    h={20}
    alignSelf="center"
    margin="auto"
    />)
:(
    <div className='messages'>
        {/* Messages */}
        <ScrollableChats messages = {messages} />

        </div>)}
    <FormControl
    onKeyDown={sendMessage}
    isRequired
    mt={3}

    >
{isTyping?<div>Typing...</div>:<></>}
<Input 
variant="filled"
bg="white"
placeholder='Enter message here'
value={newMessage}
onChange={typingHandler}

/>
    </FormControl>
   
  

    </Box>
    </>):(
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Montserrat">

<b>Welcome to DevLovePers! Select a user to start chatting...</b>

        </Text>
        </Box>
        )}</>
  )
}

export default SingleChat
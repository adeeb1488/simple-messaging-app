import React from 'react'
import { useState } from 'react'

import { Box, Tooltip, Input, InputGroup, InputLeftElement, Spinner, Avatar, Text, Flex, Button, useToast, Menu, MenuButton, MenuList,MenuDivider, MenuItem, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody} from '@chakra-ui/react'
//import "./SideDrawer.css"

import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal'
import Signout from './ProfileModal'
import {useHistory} from 'react-router-dom'
import { useDisclosure } from '@chakra-ui/react';
import axios from 'axios'
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserListItem';
import { senderName } from '../../config/ChatLogics';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge"; 
const SideDrawer = () => {
    const {user, setSelectedChat,setChats,chats, notification, setNotification} = ChatState()
    const history = useHistory()
const toastLoading = useToast()
    const [search, setSearch] = useState("")
    // const [loadingChat, setLoadingChat] = useState()
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
const searchUser = async() =>{
    if(!search){
        toastLoading({
            title: "Please enter username or email",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          return;
    }
    try {
        setLoading(true);
  
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const { data } = await axios.get(`/api/user?search=${search}`, config);
  
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toastLoading({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
}
const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat/accesschat`, { user_id:userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        console.log(setChats([data, ...chats]))
        setChats([data, ...chats]);}
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
      toastLoading({
        title: "Chat created... start messaging!",
        
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      toastLoading({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
    const SignOut = () =>{
        localStorage.removeItem("userDetails")
        history.push('/')
    }


    return (
        <>
            <Box
            display={"flex"}
            justifyContent="space-between"
            alignItems="center"
            bg="#00000"
            w="100%"
            p="5px 10px 5px 10px"
            borderWidth="5px"
            borderColor = "#7b889a"
            >
                <Tooltip label="Search Users to Chat With" hasArrow placement='bottom-end' >
                    <Button  className = "searchButton" variant='ghost' onClick={onOpen} >
                        {/* <i class="fa-duotone fa-magnifying-glass" ></i> */}
                        <i className="fas fa-search"></i>
                        <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
                        {/* <i class="fa-duotone fa-magnifying-glass"></i> */}
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" >
                DevLovePers
        </Text>
        <div>
            <Menu>
                <MenuButton p = {1}>
                    <BellIcon fontSize="2xl" m={1}/>
                    <NotificationBadge
                    count={notification.length}
                    effect={Effect.SCALE}
                    
                    />
                </MenuButton>
                <MenuList pl={2}>
                  {!notification.length && "No new messages"}
                  {notification.map((n)=>(
                    <MenuItem key={n._id} onClick={()=>{
                      setSelectedChat(n.chat);
                      setNotification(notification.filter((u)=> u!== n))
                    }}>
                      {n.chat.isGroupChat?`New message in ${n.chat.name}`:`New message from ${senderName(user,n.chat.user)}`}
                    </MenuItem>
                  ))}
                  
                </MenuList>
            </Menu>
            <Menu>
            <MenuButton as={Button}
            rightIcon={<ChevronDownIcon />}
            >
                
                <Avatar size="sm" cursor="pointer" name={user.user_name} src={user.profile_pic}/>
                    
                </MenuButton>

                <MenuList>
                    <ProfileModal user = {user}>
                    <MenuItem>My Profile</MenuItem>{" "}
                    </ProfileModal>
                    <MenuDivider/>
                    <MenuItem onClick={SignOut}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
            </Box>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerHeader>Search Users</DrawerHeader>
<DrawerBody>
    <Box display="flex" pb={2}>
    <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
    <Button 
    onClick={searchUser}
    >Search</Button>
    </Box>

    {loading?(<ChatLoading />):(

        searchResult?.map(user =>(
            <UserListItem
            key = {user._id}
            user = {user}
            handleFunction={() =>accessChat(user._id)}
            />
        ))
    )}
    {loadingChat && <Spinner ml="auto" display="flex"/>}
</DrawerBody>
        </DrawerContent>
    </Drawer>


        </>
    )
}

export default SideDrawer

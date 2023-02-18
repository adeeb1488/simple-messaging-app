import React, { useState } from 'react'
import { Box, IconButton, useDisclosure, useStatStyles, useToast, Input, Spinner } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import UserTag from '../UserTag'
import { FormControl } from '@chakra-ui/react'
import axios from 'axios'
import UserListItem from '../UserListItem'
const UpdateGroupChatModal = ({fetchAgain, setFetchAgain,fetchAllMessages}) => {
    
    const[groupName,setGroupName] = useState()
    const[selectedUsers,setSelectedUsers] = useState([])
    const[searchQuery,setSearchQuery] = useState("")
    const[searchResults,setSearchResults] = useState([])
    const[loading,setLoading] = useState(false)
    const{user, selectedChat,setSelectedChat} = ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const[renameLoading, setRenameLoading] = useState(false)
    
    const toastLoading = useToast()
    const RemoveUser = async(user1) =>{
        if(selectedChat.admin._id!==user._id && user1._id!==user._id)
        {
            toastLoading({
                title: "Only admins can remove a user from group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
              return;
        }
        try{
            setLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.put('/api/chat/removeuser', {
                    chat_id:selectedChat._id,
                    user_id:user1._id
            },config)

           user1._id === user._id? setSelectedChat():setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchAllMessages()
            setLoading(false)


        }catch(err){
            toastLoading({
                title: "Error occured",
                description: err.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
        }
    
    }
    const addUser = async(user1) =>{
        if(selectedChat.user.find((u)=>u._id === user1._id))
        {
            toastLoading({
                title: "User already exists in the group...",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
            return;
        }
        if(selectedChat.admin._id !== user._id)
        {
            toastLoading({
                title: "Only admins can add users to the group...",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
              return;
        }
        try{
            setLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.put('/api/chat/adduser', {
                    chat_id:selectedChat._id,
                    user_id:user1._id
            },config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)


        }catch(err){
            toastLoading({
                title: "Error occured",
                description: err.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
        }
    }
    const handleRename = async() =>{
        if(!groupName)
        {
            return;
        }
        try{
            setRenameLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };
            const { data } = await axios.put('/api/chat/editgroupname',{
                chat_id:selectedChat._id,
                chat_name:groupName
            },config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        }catch(err){
            toastLoading({
                title: "Error Occured!",
                description: err.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
              setRenameLoading(false)
              setGroupName("")

        }
    }
    const handleSearch = async(query) =>{
        setSearchQuery(query);
        if (!query) {
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(`/api/user?search=${searchQuery}`, config);
          console.log(data);
          setLoading(false);
          setSearchResults(data);
        } catch (error) {
          toastLoading({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setLoading(false);
        }

    }
    return (
        <>
          <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen} />
    
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
              fontSize="25px"
              fontFamily="Montserrat"
              display="flex"
              justifyContent="center"
              >{selectedChat.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
               <Box
               w="100%"
               display="flex"
               flexWrap="wrap"
               pb={3}
               >
                {selectedChat.user.map(u=>(
                      <UserTag
                      key={user._id}
                      user={u}
                      handleFunction={()=>RemoveUser(u)}
                      />
                ))}
               </Box>
               <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading?(
                <Spinner size="1g"/>
            ):
            (
                searchResults?.map((user) =>(
                    <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction={() => addUser(user)}
                    
                    />
                ))

            )
        
        
        }
              </ModalBody>
    
              <ModalFooter>
              <Button onClick={() => RemoveUser(user)} colorScheme="red">
              Leave Group
            </Button>
                
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default UpdateGroupChatModal
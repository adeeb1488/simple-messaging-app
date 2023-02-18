import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    FormControl,
  } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
  import { useDisclosure } from '@chakra-ui/react'
  import { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Input } from '@chakra-ui/react'
import axios from 'axios'
import UserListItem from '../UserListItem'
import UserTag from '../UserTag'
import { Box } from '@chakra-ui/react'
const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const[groupName,setGroupName] = useState()
    const[selectedUsers,setSelectedUsers] = useState([])
    const[searchQuery,setSearchQuery] = useState("")
    const[searchResults,setSearchResults] = useState([])
    const[loading,setLoading] = useState(false)
    
    const toastLoading = useToast()
    
    const{user,chats,setChats} = ChatState();

    const handleSearch = async(query) =>{
        setSearchQuery(query)
        if(!query)
        {
            return;
        }
        try{
            setLoading(true)
            const config = {
                headers: {
                 
                  Authorization: `Bearer ${user.token}`,
                },
              };
            const { data } = await axios.get(`/api/user?search=${searchQuery}`, config)
            console.log(data)
            setLoading(false)
            setSearchResults(data)
        }catch(err){
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
    const submitForm = async() =>{
        if(!groupName || !selectedUsers)
        {
            toastLoading({
                title: "Please fill all fields",
                
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
              return
        }

        try{
            
            const config = {
                headers: {
                 
                  Authorization: `Bearer ${user.token}`,
                },
              };
            const { data } = await axios.post(`/api/chat/group`,{name: groupName, user:JSON.stringify(selectedUsers.map((u) => u._id))}, config)
            console.log(data)
       
       onClose()
       setChats([data, ...chats])
       toastLoading({
        title: "Group Chat created!",
        
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
        }catch(err){
            toastLoading({
                title: "Error Occured!",
                description: err.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
        }
    }
    const deleteUser = (userToRemove) =>{
setSelectedUsers(selectedUsers.filter((s)=>s._id!==userToRemove._id))
    }
    const searchedUsers = (addedUser) =>{
        if(selectedUsers.includes(addedUser))
        {
            toastLoading({
                title: "This user is already selected.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
              return
        }
        setSelectedUsers([...selectedUsers,addedUser])
    }
    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
              fontSize="40px"
              fontFamily="Montserrat"
              display="flex"
              justifyContent="center"
              >New Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody
              display="flex"
              flexDir="column"
              alignItems="center"
              >
               <FormControl>
                <Input
                placeholder='Enter Group Name'
                onChange={(e) => setGroupName(e.target.value)}
                />
               </FormControl>
               <FormControl>
                <Input
                placeholder='Add users'
                onChange={(e) => handleSearch(e.target.value)}
                />
               </FormControl>
           
           <Box
           w="100%"
           display="flex"
           flexWrap="true"
           >
            {selectedUsers.map((u)=>(
                <UserTag
                key={user._id}
                user={u}
                handleFunction={()=>deleteUser(u)}
                />
            ))}
            </Box>
            {loading?<div>searching...</div>:(
                searchResults?.slice(0,5).map((user)=>(
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction ={() => searchedUsers(user)}
                    />
                ))
            )}

              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={submitForm}>
                  Create Chat
                </Button>
                
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default GroupChatModal
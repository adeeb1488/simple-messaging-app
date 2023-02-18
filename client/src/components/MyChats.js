import React, { useEffect } from 'react'
import { AddIcon } from "@chakra-ui/icons";
import { ChatState } from '../Context/ChatProvider'
import { useState } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Button } from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
import { Stack } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { senderName } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModel';



const MyChats = ({ fetchAgain }) => {
  const [currentUser, setCurrentUser] = useState()
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toastLoading = useToast()
  const displayChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toastLoading({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("userDetails")))
    displayChats()

  }, [fetchAgain])
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}

      bg="#7b889a"

      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "23px", md: "23px" }}
        fontFamily="Montserrat"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >

        <b>My Conversations</b>

        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "15px", md: "10px", lg: "15px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}

        bg="#000000cc"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"

                bg={selectedChat === chat ? "#7b889a" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? (
                    senderName(currentUser, chat.user)

                  ) : chat.name}
                </Text>
              </Box>
            ))}
          </Stack>

        ) : (<ChatLoading />)}

      </Box>
    </Box>
  )
}

export default MyChats
import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin,isSameUser} from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
const ScrollableChats = ({messages}) => {
  const{user} = ChatState()
  
    return (
    <ScrollableFeed>
{messages && messages.map((m,i)=>(
<div style={{display:"flex"}} key={m._id}>
{   
    // console.log("M IDDDD : ",m._id, "USER ID: ", user._id)
    // console.log(user._id)
    (isSameSender(messages,m,i,user._id)
    || isLastMessage(messages,i,user._id)
    ) &&(<Tooltip
    label = {m.sentBy.user_name}
    placement = "bottom-start"
    hasArrow
    >
        <Avatar
        mt="7px"
        mr={1}
        size="sm"
        cursor="pointer"
        name={m.sentBy.user_name}
        src={m.sentBy.profile_pic}

        />
    </Tooltip>)
    
}

<span class = "scrolableChats"style={
{
    backgroundColor:`${m.sentBy._id === user._id? "#3ffcd0" : "#3f9efc"}`,

    borderRadius:"20px",
    padding:"5px 15px",
    maxWidth:"75%",
    marginLeft:isSameSenderMargin(messages,m,i,user._id),
    marginTop:isSameUser(messages,m,i,user._id)? 3:10
}}

>
{m.messageContent}
</span>
</div>
))}
    </ScrollableFeed>
  )
}

export default ScrollableChats
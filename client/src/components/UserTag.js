import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserTag = ({user, handleFunction}) => {
  return (
    <Box
    px={2}
    py={1}
    borderRadius="5px"
    m={1}
    mb={2}
    fontSize={15}
    backgroundColor="green"
    color="white"
    cursor="pointer"
    onClick={handleFunction}
    >
{user.user_name}
<CloseIcon pl={1}/>
    </Box>
  )
}

export default UserTag
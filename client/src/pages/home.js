import React, {useEffect} from 'react'
import { Container, Box, Text, Tabs, TabList, TabPanels, TabPanel, Tab } from '@chakra-ui/react';
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'
import { useHistory } from "react-router-dom";


const HomePage = () => {
    const history = useHistory()

    useEffect(()=>{

        const userInfo = JSON.parse(localStorage.getItem('userDetails'));
        if(userInfo){
            history.push('/chats')
        }
    },[history])




  return (
    <Container maxW="xl" centerContent>
      <Box className='SignUpBox'
        d="flex"
        justifyContent="center"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px">
        <Text className='heading' fontSize={'35px'}>
          DevLovePers Connect Here
        </Text>
      </Box>
      <Box className='SignUpBox' width='100%' p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded" >
          <TabList mb="1em" >
            <Tab className='Login-Tab' >Login</Tab>
            <Tab className='SignUp-Tab'>Register</Tab>

          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
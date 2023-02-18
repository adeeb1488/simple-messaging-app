import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import { React, useState } from 'react'
import axios from 'axios';
import { useHistory } from "react-router";
//import './Login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'



const Login = () => {
  const toastLoading = useToast()
  const history = useHistory()
  const [show, setShow] = useState(false);
  const [emailID, saveEmailId] = useState()
  const [pass, savePass] = useState()
  const [loading, setLoading] = useState(false);
  const clickHandle = () => setShow(!show)


  const submitForm = async () => {
    setLoading(true);
    if (!emailID || !pass) {
      toastLoading({
        title: "All fields are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // console.log(email, password);
    try {
      const requestHeaders = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        {
          email: emailID,
          pass: pass
        },
        requestHeaders
      );

      // console.log(JSON.stringify(data));
      toastLoading({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userDetails", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toastLoading({
        title: "Error!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }
  return (
    <VStack spacing='10px'>
      <FormControl className='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input className='email-input'
          style={{
            borderTopStyle: 'hidden',
            borderLeftStyle: 'hidden',
            borderRightStyle: 'hidden',
            borderBottomStyle: 'solid',
          }}
          placeholder='Enter email'
          onChange={(e) => saveEmailId(e.target.value)}
        />
      </FormControl>

      <FormControl className='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            style={{
              borderTopStyle: 'hidden',
              borderLeftStyle: 'hidden',
              borderRightStyle: 'hidden',
              borderBottomStyle: 'solid',
            }}
            type={show ? 'text' : 'password'}
            className='pass-input'
            placeholder='Enter Password'
            onChange={(e) => savePass(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size={"sm"} onClick={clickHandle}
              style={{ backgroundColor: 'transparent', border: 'none' }}>
              {show ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
            </Button>

          </InputRightElement>
        </InputGroup>


      </FormControl>
      <Button className='login-button'
        colorScheme="blue"
        onClick={submitForm}
        isLoading={loading}
        loadingText="Logging in"
        width={'9vw'}
      >
        Login
      </Button>
      <Button className='guest-user-buton'
        colorScheme="blue"
        onClick={() => {
          saveEmailId("default@tesing.com")
          savePass("abc123");
        }}
      >
        Login as Guest
      </Button>

    </VStack>
  )
}

export default Login
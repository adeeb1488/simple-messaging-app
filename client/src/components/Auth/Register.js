import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import {React, useState} from 'react'
import axios from 'axios';
import {useHistory} from "react-router";
import { IconButton } from '@chakra-ui/react'

//import './Register.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useRef } from 'react';
import {  AttachmentIcon } from '@chakra-ui/icons'




const Register = () => {
    const toastLoading = useToast()
    const[show, setShow] = useState(false);
    const[username, saveUsername] = useState()
    const[emailID, saveEmailId] = useState()
    const[pass, savePass] = useState()
    const[confirmPass, saveConfirmPass] = useState()
    const [picture, setPicture] = useState()
    const [loading,setLoading] = useState(false);
    const clickHandle = () => setShow(!show)
    const history = useHistory()
    const fileRef = useRef()

    const submitForm = async () => {
        setLoading(true);
        if (!username || !emailID || !pass || !confirmPass) {
          toastLoading({
            title: "Error. Please check if you entered all fields.",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
        }
        if (pass !== confirmPass) {
          toastLoading({
            title: "Passwords are not the same.",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
        console.log(username, emailID, pass, picture);
        try {
          const requestHeaders = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const {data}  = await axios.post(
            "/api/user/registration",
            {
                user_name:username,
                pass:pass,
                email:emailID,
                profile_pic:picture

            },
            requestHeaders
          ).catch(err => console.log(err));
          console.log(data);
          toastLoading({
            title: "Registration Successful",
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
          console.log(error.message)
          setLoading(false);
        }
      };

      function selectFile (){
    console.log("SELECTED")
    fileRef.current.click();
}

    const uploadImage = (picture) =>{
        setLoading(true);
        if(picture === undefined)
        {
            toastLoading({
                title:"Select an image",
                status:"warning",
                duration:3000,
                isClosable: true,
                position:"bottom"
            })
            return;
        }

    if(picture.type === "image/jpeg" || picture.type === "image/png"  )
    {
        const data = new FormData();
        data.append("file", picture);
        data.append("upload_preset", "DevLovePers");
        data.append("cloud_name", "dtkecctul")
        fetch("https://api.cloudinary.com/v1_1/dtkecctul/image/upload", {
            method: 'post',
            body:data
        }).then((res) =>res.json()).then((data) =>{
            setPicture(data.url.toString())
            console.log(data.url.toString())
        
           
            setLoading(false)
        }).catch((err) =>{
            console.log(err);
            setLoading(false);
        })

    }
    else{
        toastLoading({
            title:"Select an image with the correct format.",
            status:"warning",
            duration:3000,
            isClosable: true,
            position:"bottom"
        })
        setLoading(false)
        return;
    }
    }


  return (
    <VStack spacing= '10px'>
        <FormControl className='username' isRequired>
            <FormLabel>Username</FormLabel>
            <Input className='username-input'
            placeholder='Enter username'
            onChange={(e) =>saveUsername(e.target.value)}
            style = {{
                borderTopStyle:'hidden',
                borderLeftStyle:'hidden',
                borderRightStyle:'hidden',
                borderBottomStyle:'solid',
            }}
             />
        </FormControl>
        <FormControl className='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input className='email-input'
            style = {{
              borderTopStyle:'hidden',
              borderLeftStyle:'hidden',
              borderRightStyle:'hidden',
              borderBottomStyle:'solid',
          }}
            placeholder='Enter email'
            onChange={(e) =>saveEmailId(e.target.value)}
             />
        </FormControl>
        <FormControl className='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input 
            style = {{
              borderTopStyle:'hidden',
              borderLeftStyle:'hidden',
              borderRightStyle:'hidden',
              borderBottomStyle:'solid',
          }}
            type={show?'text':'password'}
            className='pass-input'
            placeholder='Enter Password'
            onChange={(e) =>savePass(e.target.value)}
             />
             <InputRightElement width={"4.5rem"}>
                <Button h="1.75rem" size={"sm"} onClick={clickHandle}
                 style={{ backgroundColor: 'transparent', border: 'none' }}>

                {show ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                </Button>

             </InputRightElement>
            </InputGroup>
            
          
        </FormControl>
        <FormControl className='password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
            <Input 
            style = {{
              borderTopStyle:'hidden',
              borderLeftStyle:'hidden',
              borderRightStyle:'hidden',
              borderBottomStyle:'solid',
          }}
            type={show?'text':'password'}
            className='confirmpass-input'
            placeholder='Confirm Password'
            onChange={(e) =>saveConfirmPass(e.target.value)}
             />
             <InputRightElement width={"4.5rem"}>
                <Button h="1.75rem" size={"sm"} onClick={clickHandle}
                 style={{ backgroundColor: 'transparent', border: 'none' }}>

                {show ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                </Button>

             </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl className='profile-pic'>
            <FormLabel>Upload Profile Picture</FormLabel>


            <input onChange={(e) => uploadImage(e.target.files[0])} ref = {fileRef} type="file" style = {{display : 'none'}} />
<IconButton type = 'button'onClick={selectFile}>
    <AttachmentIcon / >
</IconButton>
            
            <Button className='register-button'
            colorScheme= "blue"
            onClick={submitForm}
            isLoading={loading}
            >
                    Register
            </Button>
        </FormControl>
    </VStack>
  )
}

export default Register
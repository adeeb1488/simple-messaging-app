import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import chats from "./data/data.js";
import cors from 'cors';
import user_routes from './routes/user.js'
import chat_routes from './routes/chats.js'
import message_routes from './routes/message.js'
import { doesNotExist, errorHandler } from "./errorHandling.js";
import { Server } from "socket.io";
import path from "path";
// import { Socket } from "socket.io";
const app = express();
dotenv.config();
console.log(process.env.DB_CONNECTION)
const database_URL = process.env.DB_CONNECTION;

app.use(express.json())
// const portNum = 8080;
app.use(cors());



app.use('/api/user', user_routes)
app.use('/api/chat', chat_routes)
app.use('/api/message', message_routes)

//-----------------------DEPLOYMENT-------------------------------

const __dirname1 = path.resolve()
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === "production"){
app.use(express.static(path.join(__dirname1,'../client/build')))
app.get('*',(req,res) =>{
    res.sendFile(path.resolve(__dirname1,"client","build","index.html"))
} )
}else{
    app.get('/',(req,res) =>{
        res.send("API is running");
    })
}

//----------------------DEPLOYMENT-----------------------------------------


app.use(errorHandler);
app.use(doesNotExist);




// app.use('/api/chat', chatsRoute)

const portNum = 8080;
const serverStart = app.listen(portNum, console.log(`The server is running on ${portNum}`));
mongoose.connect(database_URL)
.then(() => console.log("Connected to Database!!"))
.catch(err => console.log(err))

const io = new Server(serverStart,{
    pingTimeout:60000,
    cors:{
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) =>{
    console.log("Connected to socket.io !!!!")
    socket.on('setup',(userData) =>{
        socket.join(userData._id);
        console.log(userData._id)
        socket.emit('connected successfully')
    })

    socket.on('join chat', (room)=>{
        socket.join(room)
        console.log("User has joined room" + room)
    })

    socket.on('typing', (room) => socket.in(room).emit("typing"))
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"))

    socket.on("new message",(newMesssageReceived)=>{
        var chat = newMesssageReceived.chat;
        if(!chat.user)
        {
            return console.log("users not defined")
        }
        chat.user.forEach(user =>{
            if(user._id == newMesssageReceived.sentBy._id)
            {
                return;
            }
            socket.in(user._id).emit("message received", newMesssageReceived)

        })
    })

    // socket.off("setup",(userData) =>{
    //     console.log("USER CONNECTION DISCONNECTED!!")
    //     socket.leave(userData._id)
    // })
})



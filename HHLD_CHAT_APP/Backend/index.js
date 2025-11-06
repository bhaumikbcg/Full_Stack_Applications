import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import msgsRouter from './routes/msgs.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';
import { addMsgToConversation } from './controllers/msgs.controller.js';
import { subscribe, publish } from "./redis/msgsPubSub.js";


dotenv.config(); //dotenv loads environment variables from .env file into process.env
const port = process.env.PORT || 5000; // use the port specified in the environment variable PORT, or default to port 5000

const app = express();

// app.use(cors());
app.use(cors({
  credentials: true,
  origin: [`${process.env.BE_HOST}:3000`, `${process.env.BE_HOST}:3001`, `${process.env.BE_HOST}:3002`]
  
}));
app.use('/msgs', msgsRouter);


const server = http.createServer(app);//create an HTTP server and pass express app to it
const io = new Server(server, {
   cors: {
       allowedHeaders: ["*"],
       origin: "*",
       methods: ["GET", "POST"]
     }
});
// io is an instance of the Socket.IO server class that is associated with and attached to the HTTP server. This is not a new server. The only new server is the HTTP server.

const userSocketMap = {};//to store the mapping of user and socket



//user - socket
//one to one message - sender, receiver
//map - sender - socket?
//receiver - socket?
io.on('connection', (socket) => {//this is a callback function
    console.log('A user connected');
    const username = socket.handshake.query.username;

    userSocketMap[username] = socket;
    // The callback function is executed whenever a message is received on
    // the specified Redis channel. When a message is received,
    // it's passed to this callback function as the msg parameter.


    const channelName = `chat_${username}`
    subscribe(channelName, (msg) => { socket.emit("chat msg", JSON.parse(msg));});



   console.log('Username:', username);
    socket.on('chat msg', (msg) => {
       console.log(msg.sender);
       console.log(msg.receiver);
       console.log(msg.text);
       //socket.broadcast.emit('chat msg', msg);//broadcast to all other clients except the sender
       const receiverSocket = userSocketMap[msg.receiver];
        if (receiverSocket) receiverSocket.emit('chat msg', msg);//both sender and receiver are connected to the same backend
      //  io.emit('chat msg', msg);
         else {
          //sender and receiver are connected to different backend instances, hence we need to use pubsub and hence we are publishing to Redis
          const channelName = `chat_${msg.receiver}`
          publish(channelName, JSON.stringify(msg));
        }

        addMsgToConversation([msg.sender, msg.receiver], {text: msg.text, sender: msg.sender, receiver: msg.receiver});
   });

})

// Define a route
app.get('/', (req, res) => {
  res.send('Congratulations HHLD Folks!');
});

// Start the server
server.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is listening at ${process.env.BE_HOST}:${port}`);
});
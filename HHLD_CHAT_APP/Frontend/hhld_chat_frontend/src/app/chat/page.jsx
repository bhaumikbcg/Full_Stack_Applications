"use client"
import React, {useState, useEffect} from 'react'
import io from "socket.io-client";
import { useAuthStore } from '../zustand/useAuthStore.js';
import { useUsersStore } from '../zustand/useUsersStore.js';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore.js';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore.js';
import axios from "axios";
import ChatUsers from '../_components/ChatUsers.jsx';


const Chat = () => {

    const {authName} = useAuthStore();//to get the logged in user's name from the zustand store
    const {updateUsers} = useUsersStore();//to get the users list and the function to update it
    const {chatReceiver} = useChatReceiverStore();
    const { chatMsgs, updateChatMsgs} = useChatMsgsStore();


    const sendMessage = (e) => {
       e.preventDefault();
       const msgToBeSent = {text: msg, sender: authName, receiver: chatReceiver};
       if(socket) {
           socket.emit('chat msg', msgToBeSent);//'chat msg' should match with backend event name line 25
           //setMsgs(prevMsgs => [...prevMsgs, {text: msg, sentByCurrUser: true}]); gone from day 8
           //whatever messages you have, append the new msg to it
        //    updateChatMsgs([...chatMsgs, msgToBeSent]);
        updateChatMsgs((prevMsgs) => [...prevMsgs, msgToBeSent]);
           setMsg('');
       }
   }
   
   //we added the below line because in the input field, we are using msg and setMsg
   const [msg, setMsg] = useState('');//the string is the initial value of msg

   //socket is the variable and setSocket is the function to update that variable
   const [socket, setSocket] = useState(null);

   //const[msgs, setMsgs] = useState([]);//to store all messages and show them in the chat window.

   const getUserData = async () => {
           const res = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}:8081/users`,{withCredentials: true});
           updateUsers(res.data);//update the users list in the zustand store
           console.log(res.data);
       }


   //useEffect is called when page is rendered for the first time
   useEffect(() => {
        // Establish WebSocket connection, build a new websocket connection to the server
        //the url is the backend server url
       const newSocket = io(`${process.env.NEXT_PUBLIC_BE_HOST}:8080`, {query: {username: authName}});//authName is the logged in user's name from the zustand store
       // eslint-disable-next-line react-hooks/set-state-in-effect
       setSocket(newSocket);

       newSocket.on('chat msg', msg => {
           //setMsgs((prevMsgs) => [...prevMsgs, {text: msg, sentByCurrUser: false}]);//append the new msg to the previous msgs
        //    updateChatMsgs([...chatMsgs, msg]);
        updateChatMsgs((prevMsgs) => [...prevMsgs, msg]);
       });

       getUserData();

       // Clean up function
       return () => newSocket.close();
},[]);//we are saying this has no dependecies and hence call this only once


  return (
    <div className='h-screen flex divide-x-4'>
        <div className='w-1/5'>
            <ChatUsers/>
        </div>
        <div className='w-4/5 flex flex-col'>
            <div className='1/5'>
                <h1>{authName} is chatting with {chatReceiver}</h1>
            </div>
            <div className='msgs-container h-4/5 overflow-scroll'>
            {chatMsgs?.map((msg, index) => (
                <div key={index} className={`m-3 p-1 ${msg.sender === authName ? 'text-right' : 'text-left'}`}>
                    <span className={`p-2 ${msg.sender === authName ? 'bg-blue-200' : 'bg-yellow-200'} rounded-lg`}>{msg.text}</span>
                </div>
            ))}
            </div>
            <div className='h-1/5 flex items-center justify-center'>
            <form onSubmit={sendMessage} className="w-full max-w-lg mx-auto my-10">
                <div className="relative">
                <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type your text here" required className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
                </div>
            </form>
            </div>
        </div>
    </div>
  )
}

export default Chat
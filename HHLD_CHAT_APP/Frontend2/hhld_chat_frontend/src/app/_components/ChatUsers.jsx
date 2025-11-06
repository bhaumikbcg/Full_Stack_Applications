//when the name of the folder starts with an underscore, it means this folder contains components that are shared across multiple pages. In the route you can directly import these components without specifying the full path. you dont have to name the folder.

import React, { useEffect } from 'react'
import { useUsersStore } from '../zustand/useUsersStore.js';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore.js';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore.js';
import { useAuthStore } from '../zustand/useAuthStore.js';
import axios from 'axios';

const ChatUsers = () => {
    const {users} = useUsersStore();//to get the users list from the zustand store
    const {chatReceiver, updateChatReceiver} = useChatReceiverStore();
    const { updateChatMsgs} = useChatMsgsStore();
    const {authName} = useAuthStore();
    const setChatReceiver = (user) => {updateChatReceiver(user.username);}

    useEffect(() => {//useEffect is called initially when the page is loaded
       const getMsgs = async () => {
           const res = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}:8080/msgs`,
               {params: {'sender': authName, 'receiver': chatReceiver}},
               {withCredentials: true}
            );
           if (res.data.length !== 0) updateChatMsgs(res.data); 
           else updateChatMsgs([]);
       }
       if(chatReceiver) getMsgs();
    }, [chatReceiver])


  return (
    <div>
        {users.map((user, index) => (
            <div key={index} onClick={() => setChatReceiver(user)} className='bg-blue-300 rounded-xl m-3 p-5'>
                {user.username}
            </div>
        ))}
    </div>
  );
};

export default ChatUsers
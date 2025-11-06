"use client"
import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {useAuthStore} from './zustand/useAuthStore.js';

const Auth = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');//variable and the function to update that variable
    const [password, setPassword] = useState('');
    const {authName, updateAuthname} = useAuthStore();//this is a custom hook like useState
    //whenever we want to update we will call updateAuthname function and whenever we want to read the value we will use authName

const signUpFunc = async (event) => {
    event.preventDefault();
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:8081/auth/signup`, {username, password},
        {withCredentials: true});
        if(res.data.message === "Username already exists") alert('Usermname already exists');
        else {
            updateAuthname(username);//update the zustand store with the logged in user's name
            router.replace('/chat');
        }
    } catch (error) {
        console.log("Error in signup function : ", error.message);
    }
}

const loginFunc = async (event) => {
    event.preventDefault();
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:8081/auth/login`, {username, password}, {withCredentials: true});
        updateAuthname(username);//update the zustand store with the logged in user's name
        router.replace('/chat');
    } catch (error) {
        console.log("Error in login function : ", error.message);
    }
}

  return (
    <div>
      
<div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 className="mt-10 text-center text-2xl leading-9 font-bold tracking-tight text-white">Sign in to your account</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form action="#" method="POST" className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-white">Username</label>
        <div className="mt-2">
          <input id="username" type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" className="block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"/>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
        </div>
        <div className="mt-2">
          <input id="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="block w-full rounded-md bg-gray-700 px-3 py-1.5 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>

      <div className='flex'>
        <button onClick={signUpFunc} type="submit" className="m-3 flex w-1/2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">Sign up</button>
        <button onClick={loginFunc} type="submit" className="m-3 flex w-1/2 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">Log in</button>
      </div>
    </form>
  </div>
</div>

    </div>
  )
}

export default Auth
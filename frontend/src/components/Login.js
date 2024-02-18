import React, { useRef, useState } from 'react'
import { checkValidData } from '../Utils/validate.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios'
import Cookies from 'js-cookie'
//import { addUser } from '../Utils/userSlice';


const Login = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [isSignInForm,setIsSignInForm]=useState(true)
  const [errorMessage,setErrorMessage]=useState(null)
  const username=useRef(null);
  const email=useRef(null);
  const password=useRef(null);
  const toggleSignInForm=()=>{
    setIsSignInForm(!isSignInForm);

  };
  const handleButtonClick=async()=>{
    const message= checkValidData(email.current.value,password.current.value);
    console.log(message)
    if(message)
    return;
    
    if(!isSignInForm)
    {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/register', {
             "username":`${username.current.value}`,
             "email":`${email.current.value}`,
             "password":`${password.current.value}`
             });
             const { accessToken, refreshToken } = response.data;

      // Set the tokens as cookies
      Cookies.set('accessToken', accessToken); // Expires in 1 day
      Cookies.set('refreshToken', refreshToken); // Expires in 7 days

            console.log(response.data);
            navigate("/browse") // Handle successful login
          } catch (error) {
            console.error(error); // Handle login error
          }

    }
    else{
        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/login', { 
             "email":`${email.current.value}`,
             "password":`${password.current.value}`
             });
             console.log(response.data.data);
             const { accessToken, refreshToken } = response.data.data;
             console.log(accessToken);
             console.log(refreshToken);
             
             axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
       
      
             navigate("/browse")
         // Handle successful login
          } catch (error) {
            console.error(error); // Handle login error
          }
        
    }
      
        
          
        
  }
  return (
    <div>
      <form onSubmit={(e)=>e.preventDefault()} className="w-1/2 md:w-3/12 bg-black p-12 absolute my-36 mx-auto left-0 right-0 text-white rounded-lg opacity-80">
        <h1 className=' p-2 font-bold text-xl'>{isSignInForm?'Sign In':'Sign Up'}</h1>
        {!isSignInForm && <input 
        ref={username}
        type="text" placeholder='FullName' 
        className='my-4 p-4 w-full bg-gray-700'
        />}
        <input
         ref={email}
         type="text" placeholder='Email' 
         className='my-4 p-4 w-full bg-gray-700'
         />
        <input 
         ref={password}
         type="Password" placeholder='Password' 
         className='my-4 p-4 w-full bg-gray-700'
        />
        <p className="text-red-500 font-bold text-lg ">{errorMessage}</p>
        <button onClick={handleButtonClick} className=" my-6 p-4 bg-red-700 w-full rounded-lg cursor-pointer">
          {isSignInForm?"Sign In":"Sign Up"}
        </button>
        <p className=' py-4 cursor-pointer ' onClick={toggleSignInForm}>
          {isSignInForm?"New to app? SignUp now":"Already Registered? SignIn now"}
          
        </p>

      </form>
    </div>
  )
}

export default Login
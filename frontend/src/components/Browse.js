import React from 'react'
import axios from 'axios'
//import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
import BookSearch from './BookSearch';

const Browse = () => {
    const navigate = useNavigate();
    
    const handleLogout=async()=>{
        try {
            // Make a request to the backend logout endpoint
            await axios.post('http://localhost:8000/api/v1/users/logout',{}); // Assuming '/logout' is the logout endpoint provided by the backend
      
            // Clear any session/authentication tokens stored in cookies
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');

            // Redirect the user to the login page or another appropriate location
            navigate('/'); // Redirect to the login page
          } catch (error) {
            // Handle any errors that occur during logout
            console.error('Logout failed:', error);
          }
        
    };
  
        
        
        
  return (
    <div>
        <button className=' bg-purple-600 text-black rounded-lg px-4 py-2 m-2' onClick={handleLogout}>Logout</button>
        <BookSearch/>

    </div>
  )
}

export default Browse
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults,setFilteredResults]=useState([]);
   useEffect(()=>{
       fetchBooks()
   },[])
   
   const filterbooks=()=>{
    const results = searchResults.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(results);
    setSearchTerm('');
    }
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/books/all`);
      setSearchResults(response.data.data);
      setFilteredResults(response.data.data);
      console.log(searchResults);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };
  const showallbooks=()=>{
     setFilteredResults(searchResults);
  }

  const handleSearchChange = (event) => {
    
    
    setSearchTerm(event.target.value);
  };

  return (
    <>
    <div className=" max-w-md mx-auto mt-8 p-4 border border-gray-200 rounded-md shadow-md">
      <h1 className='text-lg font-bold mb-4'>Book Search</h1>
      <input className="flex-grow rounded-l-md border border-gray-300 focus:outline-none focus:border-blue-500 px-4 py-2" type="text" placeholder="Search by title, author, or genre" value={searchTerm} onChange={handleSearchChange} />
      <button className=' bg-purple-600 text-black rounded-lg px-4 py-2 m-2' onClick={filterbooks}>Search</button>
      <button className=' bg-purple-600 text-black rounded-lg px-4 py-2 m-2' onClick={showallbooks}>Showall</button>
      
    </div>
    <div className=' mt-3'>
      <ul className='flex flex-wrap'>
        {filteredResults.map(book => (
          <li key={book.id} className="border-b border-gray-400 py-2 px-2 m-2 mx-8 w-1/4 shadow-lg">
            <div>
              <img src={book.bookcover} alt="bookcoverimage"/>
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-600">Author: {book.author}</p>
              <p className="text-sm text-gray-600">Genre: {book.genre}</p>
              <p className="text-sm text-gray-600">Description: {book.description}</p>
              <p className="text-sm text-gray-600">Published At: {book.createdAt}</p>
              {/*<button onClick={() => viewBookDetails(book.id)}>View Details</button>*/}
            </div>
          </li>
        ))}
        </ul>
    </div>
    </>
  );
};

export default BookSearch
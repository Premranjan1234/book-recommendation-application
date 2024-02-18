const BookDetails = ({ bookId }) => {
    const [book, setBook] = useState(null);
  
    useEffect(() => {
      const fetchBookDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/books/${bookId}`);
          setBook(response.data);
        } catch (error) {
          console.error('Error fetching book details:', error);
        }
      };
  
      fetchBookDetails();
    }, [bookId]);
  
    if (!book) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h1>{book.title}</h1>
        <img src={book.coverUrl} alt="Book Cover" />
        <p>Author: {book.author}</p>
        <p>Genre: {book.genre}</p>
        <p>Publication Date: {book.publicationDate}</p>
        <p>Description: {book.description}</p>
        {/* Add rating and review components here */}
      </div>
    );
  };
  
  export default BookDetails
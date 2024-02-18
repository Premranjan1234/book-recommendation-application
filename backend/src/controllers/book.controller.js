import { Book } from "../modals/book.modal.js";
import { User } from "../modals/user.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";





const createBook = asyncHandler(async (req, res) => {
    
    const {title,genre,description}=req.body;
    const userId=req.user?._id;
    const loggedInUser=await User.findById(userId);
    if(!title){
        throw new ApiError(400,"title is required")
    }
    if(!genre){
        throw new ApiError(400,"genre is required")
    }
    if(!description){
        throw new ApiError(400,"description is required")
    }
    
    
    console.log(req.files);
    const bookcoverLocalPath=req.files?.bookcover[0]?.path;
    if(!bookcoverLocalPath)
    {
        throw new ApiError(402,"bookcover file is required")
    }
    const bookcover=await uploadOnCloudinary(bookcoverLocalPath);
    
    //console.log(avatar);
    if(!bookcover)
    {
        throw new ApiError(403,"bookcover file is required")
    }
    const book=await Book.create({
        title,
        bookcover:bookcover.url,
        author:loggedInUser?.username,
        genre,
        description
        
    })
    const createdBook=await Book.findById(book._id).select();
    if(!createdBook){
        throw new ApiError(500,"Something went wrong while creating book")
    }
    return res.status(201).json(
        new ApiResponse(200,createdBook,"Book created  successfully")
    )



})

const getBooksByTitle = asyncHandler(async (req, res) => {
    const bookTitle = req.params.title;
    
    const books  = await Book.find({title:bookTitle});
    console.log(books);    
    return res.status(201).json(
        new ApiResponse(200,books,"Tweet fetched successfully")
    )
    // TODO: get user tweets
})
const getBooksByGenre = asyncHandler(async (req, res) => {
    const bookGenre = req.params.genre;
    const books  = await Book.find({ genre: bookGenre });
    console.log(books);    
    return res.status(201).json(
        new ApiResponse(200,books,"Tweet fetched successfully")
    )
    // TODO: get user tweets
})
const getBooksByAuthor = asyncHandler(async (req, res) => {
    const bookAuthor = req.params.author;
    const books  = await Book.find({author:bookAuthor});
    console.log(books);    
    return res.status(201).json(
        new ApiResponse(200,books,"Tweet fetched successfully")
    )
    // TODO: get user tweets
})

const getAllBooks = asyncHandler(async (req, res) => {
    const getbooks=await Book.find({});
    if(!getbooks){
        throw new ApiError(400,"Error occured while fetching books")
    }
  return res.status(201).json(
      new ApiResponse(200,getbooks,"Books fetched  successfully")
  )


  //TODO: update tweet
})




export {createBook,getBooksByAuthor,getBooksByTitle,getBooksByGenre,getAllBooks}
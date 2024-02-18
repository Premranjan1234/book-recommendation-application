import { User } from "../modals/user.modal.js"
import { ApiError } from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};

    }
    catch(error){
        throw new ApiError(500,"something went wrong while generating access token");
    }
}

const registerUser= asyncHandler(async(req,res)=>{
    const {email,username,password}=req.body
     
    
     if(email===''){
        throw new ApiError(400,"email is reqiured")
    }
    if(username===''){
        throw new ApiError(400,"username is reqiured")
    }
    if(password===''){
        throw new ApiError(400,"password is reqiured")
    }
    const existedUser= await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(401,"User with username or email already exist")
    }
    
    
    
    const user=await User.create({
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})
const loginUser=asyncHandler(async(req,res)=>{
    //req data
    //username or email
    //check user
    //check password
    //access token and refresh token

    const {username,email,password}=req.body;
    console.log(email);
    if(!username && !email)
    {
        throw new ApiError(400, "username or email is required");
    }
    const userData= await User.findOne({
        $or:[{email},{username}]
    })
     console.log(userData)
    if(!userData){
        throw new ApiError(404,"user doesnot exist");
    }
    const isPasswordValid=await userData.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401," password is not valid");
    }
    const {refreshToken,accessToken}=await generateAccessAndRefreshToken(userData._id);
    const loggedInUser=await User.findById(userData._id);
     const options={
        httpOnly:true,
        secure:true
     }
    return res.
    status(200).
    cookie("accessToken",accessToken,options).
    cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                user:loggedInUser,refreshToken,accessToken,

            },
            "User logged in successfully"
        )
    )
})
const logoutUser=asyncHandler(async(req,res)=>{
   const logoutUser= await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
     }
     console.log(logoutUser);
     return res.status(200).
     clearCookie("accessToken",options).
     clearCookie("refreshToken",options).
     json(new ApiResponse(200,{},"user logged out"))
})



export {registerUser,
    loginUser,
    logoutUser}
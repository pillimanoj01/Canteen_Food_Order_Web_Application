import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'


const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//login user

const loginUser = async(req,res)=>{
    const {email,password}=req.body
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User doesnt exist"})
        }
        const isMatch= await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.json({success:false,message:"Enter a valid password"})
        }

        const token=createToken(user._id)
        res.json({sucess:true,token})
        
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:"Error"})
    }
    
}

//register user

const registerUser = async(req,res)=>{
    const {name,password,email}=req.body;
    try {
        const exist=await userModel.findOne({email}) 
        //checking the user already exist
        if (exist) {
            return res.json({sucess:false,message:"user already exist"})
        }
        //checking email format
        if (!validator.isEmail(email)) {
            return res.json({sucess:false,message:"please enter valid email"})
        }
        //check password
        if (password.length<8) {
            return res.json({sucess:false,message:"please enter a strong password"}) 
        }
        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt);

        const newUser = new userModel({name:name,email:email,password:hashedPassword})
        const user=await newUser.save()
        const token=createToken(user._id)
        return res.json({sucess:true,token})
    } catch (error) { 
        console.log(error)
        res.json({sucess:false,message:"Error"})
    }

}

export {loginUser,registerUser}
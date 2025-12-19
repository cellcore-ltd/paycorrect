import { findAllUsers, findUserByUid, editUserByUid, editPasswordByMail } from "../models/admin_models.js";
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res, next) =>{
    try{
        //Getting all the users from the database
        const users = await findAllUsers();

        //removing the password 
        users.forEach(u => {
            delete u.password;
        });

        res.json(users);
    } catch (err) {
        next(err);
    };
};

//Getting a specific user based on id
export const getUser = async (req, res, next) => {
    try{
        const id = parseInt(req.params.id);

        const user = await findUserByUid(id);
        if(!user) return res.status(404).json({ message :"User not found"});

        res.json(user);
    } catch(err){
        next(err);
    }
};

//Updating the users information
export const updateUser = async (req, res, next) => {
    try{
        const id = parseInt(req.params.id);

        const {name, email, phone, userType} = req.body;

        const user = await editUserByUid(id, name, email, phone, userType);

        delete user.password;

        res.json(user);
    } catch (err){
        next(err);
    }
};

//getting a looged in users information from the token
export const getProfile = (req, res, next) => {
    try{
        res.json({
            user: req.user
        });
    }catch(err){
        next(err);
    };
}

export const resetPassword = async (req, res, next) =>{
    try{
        const { email,password } = req.password;

        const user = await editPasswordByMail(email);
        if(!user) return res.status(404).json({ message : "An error occured"});

        return res.status(200).json({ message : "Password successfully reset" })
    } catch (err){
        next(err)
    }
}
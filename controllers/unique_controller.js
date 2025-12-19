import md5 from "md5";
import jwt from "jsonwebtoken";
import { creatNewInstitution } from "../models/institution_models.js";
import { creatNewUser, findUserByMail } from "../models/admin_models.js";
import { findAllUsers } from "../models/admin_models.js";
import generateId from "../config/unique.id.js";
import { transpoter } from "../config/mailer.js";

//Controller to register a new admin user
export const register = async (req, res, next) => {
    //a for loop that runs just incase the unique_id is repeated so as to regenerate a diffrent one
    for (let attempt=1; attempt <= 5; attempt++){
        try{
            //Hasing password with MD5
            const password = md5(req.body.password);
            
            //A dictionary to hold all institution related values
            const newInstitution ={ 
                name : req.body.institution_name,
                email : req.body.institution_email,
                type : req.body.institution_type,
                sub: req.body.institution_sub,
                regNumber : req.body.reg_number,
                services : req.body.services,
                address : req.body.address,
                numberOfMembers: {
                    size : req.body.size,
                    number : req.body.num_members
                },
                bankInfo : {
                    bankName : req.body.bank_name,
                    accountName : req.body.account_name,
                    accountNumber : req.body.account_number
                },
                date : new Date(),
            };

            //A dictionary to hold all user related values
            const newUser = {
                name : req.body.user_name,
                email : req.body.user_email,
                pNumber : req.body.phone,
                userType : req.body.user_type,
                date : new Date()
            };

            //Generating a unique id for the institution
            const institutionUniqueId = generateId();
                
            //Sending the collected information of the institution to the database
            const institution = await creatNewInstitution(institutionUniqueId, newInstitution.name, newInstitution.email, newInstitution.type, newInstitution.sub, newInstitution.services,  newInstitution.address, newInstitution.regNumber, newInstitution.numberOfMembers, newInstitution.bankInfo, newInstitution.date);

            try{
                //Generating a unique id for the admin
                const adminUniqueId = generateId();

                //Sending the collected information of the admin to the database
                const user = await creatNewUser(newUser.name, newUser.email,  newUser.pNumber, password, newUser.userType, institution.unique_id, newUser.date,adminUniqueId);
                
                //Creating the access and refresh tokens
                const accessToken = jwt.sign({id : user.id, user : user.name, email : user.email}, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn : "40m"
                });
                const refreshToken = jwt.sign({id : user.id, user : user.name, email : user.email}, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn : "1hr"
                });
                
                //Saving the refreshtoken in cookies as a httponly
                res.cookie('refreshToken', refreshToken, {
                    httpOnly : true,
                    secure : false,
                    // sameSite : 'strict',
                    maxAge : 60 * 60  * 1000
                });

                //returning the response
                return res.status(201).json({institution, user, accessToken});
            } catch (err) {
                //if response is duplicate value for the id
                if(err.code === '23505'){
                    console.warn(`Duplicate ID ${uniqueId}, retying.....`);
                } else{
                    next(err);
                }
            };
            
        } catch (err){
            //if response is duplicate value for the id
            if(err.code === '23505'){
                console.warn(`Duplicate ID ${uniqueId}, retying.....`);
            } else{
                next(err);
            }
        };
}};



export const login = async (req, res, next) => {
    try{
        //Gets all the users from the database
        const users = await findAllUsers();

        const {email, uid, password} = req.body;
        //Finding user using email
        var user = users.find(u => u.email_address === email);

        //Finding user  using unique id if email is not found
        if(!user) {
            user= users.find(u => u.unique_id === uid);
            if(!user) return res.status(400).json({message : "User not found"});
        };



        //checks the password of the user
        if(user.password !== md5(password)) return res.status(401).json({ message : "Password incorrect"});

        const accessToken = jwt.sign({id : user.id, user : user.name, email : user.email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn : "2m"});
        const refreshToken = jwt.sign({id : user.id, user : user.name, email : user.email}, process.env.REFRESH_TOKEN_SECRET, { expiresIn : "5m" });

        res.cookie('refreshToken', refreshToken, {
            httpOnly : true,
            secure : false,
            // sameSite : 'strict',
            maxAge : 5 * 60  * 1000
        });

        //sending confirmation login email to the admin
        transpoter.sendMail({
            from : "joba@gmail.com",
            to: "jayjayddeveloper@gmail.com",
            subject: "Login Successful",
            html: `
            <div>
                <div>
                    <img src="../../logo.png" alt="paycollect logo" style="display: block; margin: auto;">
                </div>
                <h1 style="text-align: center; margin: 100px 0;">Logged in Succesfully</h1>
            </div>`
        })

        res.status(200).json({message : "Login sucessful", accessToken});
    } catch (err){
        next(err)
    }
}

export const logout = async (req, res, next) => {
    try{
        const refreshToken = req.cookies.refreshToken;

        //Clear refresh token from the cookies
        res.clearCookie('refreshToken', {httpOnly : true, sameSite : 'strict', secure : true});
        res.json({message: "Logged out sucessfully"});
    } catch (err){
        next(err)
    }
}

export const refresh = async (req, res, next) => {
    try{
        //obatainig the refresh token
        const refreshToken = req.cookies.refreshToken;
        
        if(!refreshToken) return res.status(403).json({ message : "No refresh token"});

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(403).json({ message : "Invalid refresh Token"});
            
            const accessToken = jwt.sign({id : user.id, user : user.name, email : user.email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn : "40m" });
            res.json({ message : "Token refreshed", accessToken});
        });
    } catch (err){
        next(err);
    }
}

export const forgotPassword = async (req, res, next) =>{
    try{
        const { email } = req.body;

        const user = await findUserByMail(email);
        if(!user) return res.status(404).json({ message : "User with this Email was not Found."});

        const token = jwt.sign({id : user.id, user : user.name, email : user.email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn : "1hr" });

        transpoter.sendMail({
            from:"PAYCOLLECT",
            to: `jayjayddeveloper@gmail.com`,
            subject: "Reset-Password",
            html:`
            <div style="width: 70%; display: block; margin: auto;">
                <div style="background: rgb(123, 209, 243);">
                    <img src="https://res.cloudinary.com/dam72m9yq/image/upload/v1763467566/logo_ms1qxp.png" alt="paycollect logo" style="display: block; margin: auto;">
                </div>
                <div  style="background: rgba(114, 215, 233, 0.37); padding: 5px 10px;">
                    <h5 style="text-align: center; margin: 50px 0;">Password Reset: Click On the Button</h5>

                    <button style="display: block; margin: auto; border: none; border-radius: 5px; padding: 15px; background: rgb(123, 209, 243); box-shadow: black 2px 2px 10px ;"><a href="localhost:5173/users/reset-password/${token}" style="text-decoration:  none; color: black;">Reset-Password</a></button>

                    <hr style="margin-top:30px; border:0; border-top:1px solid #3333333f;">

                    <p style="margin: 0; color: #333; font-size: 14px;">&copy; 2025 Paycollect. All rights reserved.</p>
                </div>
            </div>
            `,
        })
        return res.status(200).json({ message : "Reset Link has been sent to your email sucessfully" })
    } catch (err){
        next(err)
    }
}
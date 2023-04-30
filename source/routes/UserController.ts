import { NextFunction, Router, Response } from "express";
import { User } from "../models";

import {v4 as uuidv4} from 'uuid';
import { Op } from "sequelize";

export let router = Router();


interface UserSignupForm{
    username:string;
    email:string;
    password:string;
};
function isUserSignupForm(obj:any): obj is UserSignupForm{
    let valid=
        ("username" in  obj) && 
        typeof obj.username ==="string" &&
        /[\w\d_]{4,}/.test(obj.username) &&
        ("email" in obj) &&
        typeof obj.username ==="string" &&
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(obj.email) &&
        ("password" in  obj) && 
        typeof obj.password ==="string" &&
        /[\w\d_!@#$%^&*]{6,}/.test(obj.password);
    
    return valid;
};
/**
 * Sign up route aka User.create
 * TODO: make passwords not be saved in plaintext
 */
router.post('/signup', async (req, res)=>{
    console.log(req.body);
    if(isUserSignupForm(req.body)){
        try{
            await User.create({
                id:uuidv4(),
                access:"Client",
                email:req.body.email,
                username:req.body.username,
                password: req.body.password
            })
            res.redirect('../');
        }catch(error){
            res.send(error);
        }
    }else{
        res.sendStatus(400);
    }
});

router.get('/signup', (req, res)=>{
    res.render('pages/user/signup');
});




interface UserSigninForm{
    user:string;
    password:string;
};
function isUserSigninForm(obj:any): obj is UserSigninForm{
    let valid=
        ("user" in  obj) && 
        typeof obj.user ==="string" &&
        (
            /[\w\d_]{4,}/.test(obj.user) || 
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(obj.user)
        ) &&
        ("password" in  obj) && 
        typeof obj.password ==="string" &&
        /[\w\d_!@#$%^&*]{6,}/.test(obj.password);
    
    return valid;
};
/**
 * Log in route
 */
router.get('/login', (req, res)=>{
    res.render('pages/user/login');
});

router.post('/login', async(req, res)=>{
    if(isUserSigninForm(req.body)){
        try{
            let user: User = await User.findOne({
                where:{
                    [Op.or]:[
                        {username:req.body.user},
                        {email:req.body.user}
                    ],
                    password:req.body.password
                }
            });
            if(user!=null){
                // TODO: send auth token
                res.send("Logged in successfuly");
            }else{
                res.send("User not found");
            }
        }catch(error){
            res.send(error);
        }
    }else{
        res.sendStatus(400);
    }
});

/**
 * Middleware for verifying the auth token
 */
export function authenticator(req:Request, res:Response, next:NextFunction){
    if(0/* Has token */){
        next();
    }else{
        res.sendStatus(401);
    }
};
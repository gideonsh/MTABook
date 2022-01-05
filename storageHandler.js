
import * as db from './DB.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    console.log(token);
    if (token == null) return res.sendStatus(401); 
    console.log("in auth");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); 
        req.id = user.id;
        next();
    })
}

export function userIsApproved(req,res,next){
    if(users.some(user => user.id === req.id && user.userStatus === ACTIVE)){
        next();
    } else {
        res.status(401).send("User is not active");
    }
}

export async function initAdmin() {
    {
        if (db.users.some(user => user.id === 0)) {
            //throw new Error("Admin already exists")
        }
        else {
            const creationDate = Date.now().stringify;
            const hash = await bcrypt.hash("123456", 10);
            db.users.push({ id: 0, name: "gideon",email:"gideon@gmail.com", password:hash, creation:creationDate, status:"active" });
            await db.saveData();
        }
    }
}

export function getDateAndTime() {
    let date = new Date();
    let dateAndTime = "Last Sync: " + date.getDate() + "/"
        + (date.getMonth() + 1) + "/"
        + date.getFullYear() + " @ "
        + date.getHours() + ":"
        + date.getMinutes() + ":"
        + date.getSeconds();
    return dateAndTime;
}


export default class DataHandler {

    async getUser(email){
        if(db.users.some(user => user.email === email)) {
            return db.users.filter(user => user.email === email)[0];
        } else {
            console.log("there is no matching user");
        }
    }

    async userExist(email, password) {
        if(db.users.some(user => user.email === email)) {
            return true;
        } else {
            return false;
        }
    }

    async addUser(name,email,password){
        const id = db.usersID++; 
        if(db.users.some(user => user.email === email)){
            throw new Error("email already exist");
        }
        
        const date = Date.now(); 
        const status = "created";
        db.users.push({id,name,email,password,date,status});
        await db.saveData();
    }

    async changeUser(name,email,password, status){
        if(db.users.some(user => user.email === email)){
            db.users = db.users.map(user => {
                if(user.email === email) {
                    return {id:user.id, name:name, email:email, password:password, date:user.date, status:status};
                } else {
                    return user;
                }
                
            });
            await db.saveData();
        }
    }

    async deleteUser(email){
        db.users = db.users.filter(user => user.email !== email);
        await db.saveData();
    }

    async getMessage(id){
        if(db.messages.some(msg => msg.id === id)) {
            return db.messages.filter(msg => msg.id === id)[0];
        } else {
            console.log("there is no matching message");
        }
    }

    async addMessage(msgText){
        const id = db.messagesID++;
        const date = 2; 
        const time = 2; 
        
        db.messages.push({id,msgText,date,time});
        await db.saveData();
    }

    async changeMessage(id,msgText){
        if(db.messages.some(msg => msg.id === id)){
            db.messages = db.messages.map(msg => {
                if(msg.id === id) {
                    return {id:id,text:msgText,date:msg.date,time:msg.time};
                } else {
                    return msg;
                }
            });
            await db.saveData();
        }
    }

    async deleteMessage(id){
        db.messages = db.messages.filter(msg => msg.id !== id);
        await db.saveData();
    }

    async getPost(id){
        if(db.posts.some(post => post.id === id)) {
            return db.posts.filter(post => post.id === id)[0];
        } else {
            console.log("there is no matching post");
        }
    }

    async addPost(postText){
        const id = db.postsID++; 
        const date = 2; 
        const time = 2; 
        
        db.posts.push({id,postText,date,time});
        await db.saveData();
    }

    async changePost(id,postText){
        if(db.posts.some(post => post.id === id)){
            db.posts = db.posts.map(post => {
                if(post.id === id) {
                    return {id:id,text:postText,date:post.date,time:post.time};
                } else {
                    return post;
                }
            });
            await db.saveData();
        }
    }

    async deletePost(id){
        db.posts = db.posts.filter(post => post.id !== id);
    }

   
}




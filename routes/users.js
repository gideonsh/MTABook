import express from 'express';
import DataHandler, { authenticateToken, userIsApproved, getDateAndTime } from '../storageHandler.js';
import * as db from "../DB.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
let dataStorage = new DataHandler();

// fetch('http://something',{method:"POST", body:"",headers:{"Content-Type":"application/json"}})
const set_content_type = function (req, res, next) 
{
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	next()
}

router.use( set_content_type );
router.use(express.json());  // to support JSON-encoded bodies
router.use(express.urlencoded( // to support URL-encoded bodies
    {  
      extended: true
    }));


router.post("/login", async (req,res)=>{

    try {
        if(dataStorage.userExist(req.body.email, req.body.password)) {
            const { email, password } = req.body;
            const user = db.users.find(user => user.email === email);
            const validPass = await bcrypt.compare(password, user.password);
            if (!validPass) {
                console.log("not valid");
                res.status(401).send("invalid password");
                
            }
            const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
            res.json({ accessToken: accessToken })
        } else {
            res.status(400).send("user doesn't exist");
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
})

router.post("/signup", async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const id = db.usersID.value++;
        const now = new Date();
        const date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
        const password = await bcrypt.hash(req.body.password, 10);
        const newUser = { id:id, name:name, email:email, password:password, creation:date, status: "created" }
        
        db.users.push(newUser);
        await db.saveData();
        console.log("saving");
        res.send(newUser);
    } catch (e) {
        res.status(400).send(e.message);
    }
})


// Admin section - START
router.get("/all",(req,res)=>{
    res.send(JSON.stringify(db.users))
})

router.post("/:id/approve/:userid", authenticateToken, async (req,res)=>{
    if(req.params.id === "0") {
        db.users.forEach(user => {
            if(user.id === Number(req.params.userid)) {
                if(user.status === "created") {
                    user.status = "active";
                } else {
                    console.log("user is not in status created");
                }
            }
        })
        try {
            await db.saveData();
            res.status(200).send(db.users);
        } catch(err) {
            console.log(err.message);
            res.status(400).send("failed to approve a user");
        }
    } else {
        res.status(400).send("Only admin can approved users");
    }
}) 

router.post("/:id/suspend/:userid", authenticateToken, async (req,res)=>{
    if(req.params.id === "0") {
        db.users.forEach(user => {
            if(user.id === Number(req.params.userid)) {
                if(user.status !== "suspended") {
                    user.status = "suspended";
                } 
            }
        })
        try {
            await db.saveData();
            res.status(200).send(db.users);
        } catch(err) {
            console.log(err.message);
            res.status(400).send("failed to suspend a user");
        }
    } else {
        res.status(400).send("Only admin can suspend users");
    }
}) 


router.post("/:id/restore/:userid", authenticateToken, async (req,res)=>{
    if(req.params.id === "0") {
        db.users.forEach(user => {
            if(user.id === Number(req.params.userid)) {
                if(user.status !== "suspended") {
                    user.status = "active";
                } else {
                    console.log("user is not in status suspended");
                }
            }
        })
        try {
            await db.saveData();
            res.status(200).send(db.users);
        } catch(err) {
            console.log(err.message);
            res.status(400).send("failed to restore a user");
        }
    } else {
        res.status(400).send("Only admin can restore users");
    }
}) 

router.post("/:id/sendmessage/:userid", authenticateToken, async (req,res)=>{
    if(req.params.id === "0") {
        if(req.params.userid === "all") {
            db.users.forEach(user => {
                db.messages.push({id: db.messagesID.value++, date: getDateAndTime(), from: Number(req.params.id), to: user.id, text: req.body.text});
            });
        } else {
            const newMessage = {
                id: db.messagesID.value++,
                date: getDateAndTime(),
                from: req.params.id,
                to: req.params.userid,
                text: req.body.text
            }
            db.messages.push(newMessage);
        }
        try {
            await db.saveData();
            res.status(200).send(db.messages);
        } catch(err) {
            console.log(err.message);
            res.status(400).send("failed to send a message as admin");
        }
    } else {
        res.status(400).send("Only admin can send message to all users at once");
    }
    
}) 

router.delete("/:id/delete/:userid", authenticateToken, async (req,res)=>{
    if(req.params.id === "0") {
        const index = db.users.findIndex(user => user.id === Number(req.params.userid));
        if (index > -1) {
            db.users.splice(index, 1);
            await db.saveData();
            res.status(200).send(db.users);
        } else {
            res.status(400).send("no found");
        }
    } else {
        res.status(400).send("Only admin can delete users");
    }
}) 

router.delete("/:id/deletepost/:postid", authenticateToken, async (req,res)=>{
    if(req.params.id === "0") {
        const index = db.posts.findIndex(post => post.id === Number(req.params.postid));
        if (index > -1) {
            db.posts.splice(index, 1);
            await db.saveData();
            res.status(200).send(db.posts);
        } else {
            res.status(400).send("no found");
        }
    } else {
        res.status(400).send("Only admin can delete posts");
    }
    
}) 
// Admin section - END




export default router;

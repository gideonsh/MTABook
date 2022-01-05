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


// Posts
// • Can be published by any active user /
// • Can be seen by all users /
// • Cannot be edited /
// • Can be deleted by the creator /
// • Post Properties:
// • Text (no html)
// • Id (numeric, unique)
// • Date & Time


router.get("/all",(req,res)=>{
    res.status(200).send(JSON.stringify(db.posts))
})


router.post("/:id", authenticateToken, async (req,res)=>{
    const newPost = {
        id: db.postsID.value++,
        date: getDateAndTime(),
        publisherId: Number(req.params.id),
        text: req.body.text
    }
    db.posts.push(newPost);
    try {
        await db.saveData();
        res.status(200).send(db.posts);
    } catch(err) {
        res.status(400).send("failed to create a post");
    }
})


router.delete("/:id/:postid", authenticateToken, async (req,res)=>{
    const index = db.posts.findIndex(post => post.publisherId === Number(req.params.id));
    if (index > -1) {
        db.posts.splice(index, 1);
        await db.saveData();
        res.status(200).send(db.posts);
    } else {
        throw new Error("Post not found")
    }
})

export default router;

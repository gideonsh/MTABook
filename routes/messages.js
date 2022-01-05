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

// •Messages
// • Can be sent from one user to another /
// • The admin can send messages to all users /
// • Cannot be edited /
// • Cannot be deleted /
// • Message Properties:
// • Text (no html)
// • Id (numeric, unique)
// • Date & Time

router.get("/all", authenticateToken,(req,res)=>{
    res.status(200).send(db.messages);
})


router.post("/:id/", authenticateToken, async (req,res)=>{
    const newMessage = {
        id: db.messagesID.value++,
        date: getDateAndTime(),
        from: Number(req.params.id),
        to: Number(req.body.to),
        text: req.body.text
    }
    db.messages.push(newMessage);
    try {
        await db.saveData();
        res.status(200).send(db.messages);
    } catch(err) {
        res.status(400).send("failed to create a message");
    }
})


export default router;

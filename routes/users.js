import express from 'express';
import DataHandler from '../storageHandler.js';
import * as db from "../DB.js";

const router = express.Router();
let dataStorage = new DataHandler();


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

router.get("/all",(req,res)=>{

})


router.get("/",(req,res)=>{
    res.send(JSON.stringify(db.users))
})


router.post("/",async (req,res)=>{
    console.log(req)
    await dataStorage.addUser(req.body.name,req.body.email,"1234")
    res.send("added")
})


router.put("/",(req,res)=>{
    
})


router.delete("/",(req,res)=>{
    
})

export default router;

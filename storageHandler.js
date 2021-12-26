
import * as db from './DB.js'

export default class DataHandler {
    getUser(){

    }

    async addUser(name,email,password){
        const id = 2 //generateId();
        if(db.users.some(user => user.email === email)){
            throw new Error("email already exist");
        }
        //password = hashPaswword(password);
        const date = 2//getDate();
        db.users.push({name,email,password,id,date})
        await db.saveData();
    }

    changeUser(){
        
    }

    deleteUser(){
        
    }

    getMessage(){

    }

    addMessage(){
        
    }

    changeMessage(){
        
    }

    deleteMessage(){
        
    }

    getPost(){

    }

    addPost(){
        
    }

    changePost(){
        
    }

    deletePost(){
        
    }

   
}




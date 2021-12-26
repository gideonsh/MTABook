
import * as db from './DB.js'

export default class DataHandler {
    getUser(){

    }

    async addUser(name,email,password){
        const id = generateId();
        if(db.users.some(user => user.email === email)){
            throw new Error("email already exist");
        }
        password = hashPaswword(password);
        const date = getDate();
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




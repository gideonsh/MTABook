
import * as db from './DB.js'

export default class DataHandler {

    async getUser(email){
        if(db.users.some(user => user.email === email)) {
            return db.users.filter(user => user.email === email)[0];
        } else {
            // there is no user like this
        }
    }

    async addUser(name,email,password){
        const id = 2 //generateId();
        if(db.users.some(user => user.email === email)){
            throw new Error("email already exist");
        }
        //password = hashPaswword(password);
        const date = 2; //getDate();
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
            // there is no message like this
        }
    }

    async addMessage(msgText){
        const id = 2; //generateId();
        const date = 2; //getDate();
        const time = 2; //getTime();
        
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
            // there is no post like this
        }
    }

    async addPost(postText){
        const id = 2; //generateId();
        const date = 2; //getDate();
        const time = 2; //getTime();
        
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




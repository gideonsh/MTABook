import fsp from 'fs/promises';
import fs from 'fs';

export let messages = [];
export let users = [];
export let posts = [];

 export async function readData() {
    if (fs.existsSync('./messages.json')) {
        const data = await fsp.readFile('./messages.json', "utf8");
        messages = JSON.parse(data)
    }

    if (fs.existsSync('./users.json')) {
        const data = await fsp.readFile('./users.json', "utf8");
        users = JSON.parse(data)
        } 

    if (fs.existsSync('./posts.json')) {
        const data = await fsp.readFile('./posts.json', "utf8");
        posts = JSON.parse(data)
    } 
    
        saveData();
    
}

export async function saveData() {
    await fsp.writeFile('./messages.json', JSON.stringify(messages));
    await fsp.writeFile('./users.json', JSON.stringify(users));
    await fsp.writeFile('./posts.json', JSON.stringify(posts));
}
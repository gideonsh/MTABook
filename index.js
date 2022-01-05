// External modules
import express from 'express';
import {StatusCodes} from 'http-status-codes';
import usersRouter from './routes/users.js';
import messagesRouter from './routes/messages.js';
import postRouter from './routes/posts.js';
import * as db from './DB.js';
import DataHandler, { initAdmin } from './storageHandler.js';
import dnv from "dotenv";


dnv.config();

const app = express()
//let  port = 5001;
//const { PORT, HOST } = process.env;
const PORT=2718;
const HOST="localhost";

const set_content_type = function (req, res, next) 
{
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	next()
}
app.use( set_content_type );
app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded( // to support URL-encoded bodies
{  
  extended: true
}));
app.use("/user",usersRouter);
app.use("/message",messagesRouter);
app.use("/post",postRouter);


// General app settings


await db.readData();
initAdmin();
let dataStorage = new DataHandler();
// User's tablec
//db.users.push({id:db.usersID++, name: 'admin', email: "admin@gmail.com", password: 1234, creation: Date.now(), status: "active"});

// API functions

// Version 
// function get_version( req, res) 
// {
// 	const version_obj = { version: package.version, description: package.description };
// 	res.send(  JSON.stringify( version_obj) );   
// }

function list_users( req, res) 
{
	res.json( db.users );   
}

function get_user( req, res )
{
	const id =  parseInt( req.params.id );

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	const user =  db.users.find( user =>  user.id == id )
	if ( !user)
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

	res.send(  JSON.stringify( user) );   
}

function delete_user( req, res )
{
	const id =  parseInt( req.params.id );

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	if ( id == 1)
	{
		res.status( StatusCodes.FORBIDDEN ); // Forbidden
		res.send( "Can't delete root user")
		return;		
	}

	const idx =  db.users.findIndex( user =>  user.id == id )
	if ( idx < 0 )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

	db.users.splice( idx, 1 )
	res.send(  JSON.stringify( {}) );   
}

function create_user( req, res )
{
	const name = req.body.name;

	if ( !name)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing name in request")
		return;
	}


	// Find max id 
	let max_id = 0;
	db.users.forEach(
		item => { max_id = Math.max( max_id, item.id) }
	)

	const new_id = max_id + 1;
	const new_user = { id: new_id , name: name};
	db.users.push( new_user  );
	
	res.send(  JSON.stringify( new_user) );   
}

function update_user( req, res )
{
	const id =  parseInt( req.params.id );

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	const idx =  db.users.findIndex( user =>  user.id == id )
	if ( idx < 0 )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

	const name = req.body.name;

	if ( !name)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing name in request")
		return;
	}

	const user = db.users[idx];
	user.name = name;

	res.send(  JSON.stringify( {user}) );   
}

// Routing
// const router = express.Router();

// router.get('/version', (req, res) => { get_version(req, res )  } )
// router.get('/users', (req, res) => { list_users(req, res )  } )
// router.post('/users', (req, res) => { create_user(req, res )  } )
// router.put('/user/(:id)', (req, res) => { update_user(req, res )  } )
// router.get('/user/(:id)', (req, res) => { get_user(req, res )  })
// router.delete('/user/(:id)', (req, res) => { delete_user(req, res )  })

// app.use('/api',router)


// Init 

let msg = `server is listening at port ${PORT}`
app.listen(PORT, () => { console.log( msg ) ; })



// List all users /
// Approve a request to join network
// Suspend or delete a user /
// Restore a suspended user
// Send a message to all users or to a single one
// Delete a post of a user 


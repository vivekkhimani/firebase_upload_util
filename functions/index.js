const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const serviceAccount = require('./firebase_secret.json');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const Multer = require('multer');

const app = express();

//multer temp storage
const multer = Multer({
  storage: Multer.memoryStorage(),

    limits: {
    fileSize: 100 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

let global_email = null;
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: "gs://ash-initiative.appspot.com"
});



app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());


//allow cross domain communication

var allowCrossDomain = function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers','Content-Type');

	next();
};
app.use(allowCrossDomain);

//main form endpint
app.use('/',express.static('public'));

/*
//invalid
app.get("/invalid",(request,response)=>{
	response.end()
	//response.end();
})
*/
/*
app.get("/",(request,response)=>{
	response.sendFile("404.html");

})
*/


//a request received for the email verification link
app.get('/welcome',(request,response) => {
	const recieved_email = request.query.email;
	global_email = recieved_email;
	console.log("global email reference updated.");
	console.log(global_email);

	if (global_email != null){
		response.redirect("/");
	}
	else{
		response.writeHead(404);
		response.end("not avail");
	}
})


//a request received from the native public page for adding to the firebase db
app.get('/update_db',(request,response) => {
	//date val

    if (global_email != null){
		var today = new Date();
		var date_val = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		var time_val = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();

		console.log(request.query);
		const first_name = request.query.first_name;
		const last_name = request.query.last_name;
		const gDriveLink1 = request.query.GDrive1;
		const description1 = request.query.description1;
		const gDriveLink2 = request.query.GDrive2;
		const description2 = request.query.description2;

		let bucket = admin.storage().bucket();
		let db = admin.firestore();
		let collection_name = date_val;

		//check if the record for user with same email exists
		//let collection_ref = db.collection(collection_name);
		//let query_ref = collection_ref.where('email','==',global_email);
		//console.log(query_ref);

		console.log(gDriveLink1)

		console.log(global_email);
		let docref = db.collection(collection_name).doc(global_email);
		let setRecord = docref.set({
			first: first_name,
			last: last_name,
			email: global_email,
			date_val: date_val,
			time_val: time_val,
			GDrive1: gDriveLink1,
			description1: description1,
			GDrive2: gDriveLink2,
			description2: description2
		}).then(()=>{
			console.log("SUCCESS");
		});
		global_email = null;
		response.send("Received.");
}
	else{
		response.send("Get Out");
	}
});


exports.app = functions.https.onRequest(app);

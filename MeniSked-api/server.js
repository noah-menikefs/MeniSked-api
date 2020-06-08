const express = require('express');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const cors = require('cors');
const nodemailer = require("nodemailer");
var generatePassword = require("password-generator");
// const pdf = require('html-pdf');
// const pdfTemplate = require('./documents');
const knex = require('knex');

const db = knex({
	client: 'pg',
  	connection: {
    	host : '127.0.0.1',
    	user : 'noah.menikefs',
    	password : '',
    	database : 'meniSked'
    }
});


db.select('*').from('users').then(data => {
	console.log(data);
});

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cors())


const database = {
	users: [
		{
			id: 1,
			firstname: 'John',
			lastname: 'Smith',
			password: 'cookies',
			email: 'john@gmail.com',
			colour: '#FFD678',
			department: 'ST-JOES-A',
			isadmin: false,
			isactive: true,
			worksked: [
				{
					id: 0,
					date: "05/29/2020"
				},
				{
					id: 8,
					date: "08/7/2020"
				}
			]
		},
		{
			id: 2,
			firstname: 'Sally',
			lastname: 'Jenkins',
			password: 'bananas',
			email: 'sally@gmail.com',
			colour: '#F49F93',
			department: 'ST-JOES-A',
			isadmin: false,
			isactive: true,
			worksked: [
				{
					id: 2,
					date: "06/9/2020"
				},
				{
					id: 4,
					date: "06/21/2020"
				}
			]
		},
		{
			id: 0,
			firstname: 'Peter',
			lastname: 'Menikefs',
			password: '123',
			email: 'pnm@gmail.com',
			colour: '#FFEE96',
			department: 'ST-JOES-A Admin',
			isadmin: true,
			isactive: true,
			worksked: [
				{
					id: 2,
					date: "07/19/2020"
				},
				{
					id: 3,
					date: "06/29/2020"
				}
			]
		}
	],
	login: [
		{
			id: '100',
			hash: '',
			email: 'john@gmail.com'
		}
	],
	holidays: [
		[
			{
				name: "New Year's Day",
				isactive: true,
				month: "January",
				day: 1
			},
			{
				name: "Christmas Day",
				isactive: true,
				month: "December",
				day: 25
			}
		],
		[
			{
				name: "Party",
				eventsked: ["12/21/2020","01/12/2021"]
			},
			{
				name: "Easter",
				eventsked: ["04/12/2020","04/04/2021"]
			}

		]
	],
	entries: [
		{
			id: 0,
			name: "Request No Call",
			isactive: true
		},
		{
			id: 1,
			name: "No Assignment",
			isactive: true
		},
		{
			id: 2,
			name: "Not Available",
			isactive: true
		},
		{
			id: 3,
			name: "Vacation",
			isactive: true
		},
		{
			id: 4,
			name: "Staycation",
			isactive: true
		},
		{
			id: 5,
			name: "Not Available Night",
			isactive: true
		},
		{
			id: 6,
			name: "Assign Specific Call",
			isactive: true
		}



	],
	callTypes: [
		{
			id: 7,
			name: "1st Call Day",
			priority: 1,
			active: true
		},
		{
			id: 8,
			name: "1st Call Night",
			priority: 2,
			active: true
		},
		{
			id: 9,
			name: "2nd Call Day",
			priority: 3,
			active: true
		}
	],
	messages: [
		{
			userId: 1,
			status: "pending",
			dateSent: "07/10/2020",
			requestDates: [
				"07/17/2020"
			],
			typeID: 0,
			response: ""
		},
		{	userId: 3,
			status: "denied",
			dateSent: "07/02/2020",
			requestDates: [
				"07/19/2020", "07/20/2020", "07/21/2020"
			],
			typeID: 2,
			response: "Sorry, I can't let you work that day"
		}
	],
	notes: [
		{
			id: 1,
			type: 1,
			date: "05/2/2020",
			msg: "0  2  +1"
		},
		{
			id: 2,
			type: 2,
			date: "05/21/2020",
			msg: "Armogan + 1"
		},
		{
			id: 3,
			type: 3,
			date: "05/25/2020",
			msg: "busy day"
		}
	],
	colours: ['#FFEE9680','#F49F9380','#FFD67880','#EB040080','#FFE70080','#FF56C580','#FFAC3E80','#EC019180','#F8831C80','#D980FF80','#B60EFF80','#83E5C780','#7101A980','#57BB7E80','#0091FF80','#19735B80','#88E4FF80','#C7EF6580','#41A3CC80','#85C63580'],
	published: 0 //Months after June 2020
}

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'menisked@gmail.com',
    pass: 'PDM"jxRv4C*aAmAB'
  }
});

//Checks if a user's login info is correct
app.post('/login', (req, res) => {
	const {email, password} = req.body;
	let found = false;

	database.users.forEach((user) => {
		//COMPARE HASH HERE
		if (email === user.email && password === user.password){
			found = true;
			return res.json(user);

		}
	})
	if (!found){
		res.status(400).json('error logging in');
	}
})

//Adds a new user to the "database"
app.post('/register', (req, res) => {
	const {email, firstname, lastname, password, department, isadmin} = req.body;
	db('users')
		.returning('*')
		.insert({
			email: email,
			firstname: firstname,
			lastname: lastname,
			colour: '#FFD678',
			department: department,
			isadmin: isadmin,
			isactive: true,
			worksked: []
		})
		.then(user => {
			res.json(user[0]);
		})
		.catch(err => res.status(400).json(err));

	// let flag = false;

	// for (let i = 0; i < database.users.length; i++){
	// 	if (database.users[i].email === email){
	// 		flag = true;
	// 	}
	// }

	// if (flag){
	// 	return res.status(400).json('user with this email already exists.');
	// }

	// //HASH PASSWORD HERE
	// database.users.push({
	// 	id: database.users.length+20,
	// 	firstname: firstname,
	// 	lastname: lastname,
	// 	email: email,
	// 	colour: database.colours[database.users.length%20],
	// 	password: password,
	// 	department: department,
	// 	isadmin: isadmin,
	// 	isactive: true,
	// 	worksked: []
	// })

	//return res.json(database.users[database.users.length -1]);
})

//Adding a recurring holiday
app.post('/holiday/r', (req,res) => {
	const {name, month, day, isactive} = req.body;
	database.holidays[0].push({
		name: name,
		isactive: isactive,
		month: month,
		day: day
	})
	res.json(database.holidays[0][database.holidays[0].length -1]);
})

//Editing a recurring holiday
app.put('/holiday/r', (req,res) => {
	const {isactive, name, month, day} = req.body;
	let index = -1;
	for (let i = 0; i < database.holidays[0].length; i++){
		if (database.holidays[0][i].name === name){
			index = i;
			break;
		}
	}
	if (index !== -1){
		database.holidays[0][index].month = month;
		database.holidays[0][index].day = day;
		database.holidays[0][index].isactive = isactive;
		res.json(database.holidays[0][index]);
	}
	else{
		res.status(404).json('no such holiday');
	}
})

//Getting holidays
app.get('/holiday/:type', (req,res) => {
	const {type} = req.params;
	let j = 1;
	if (type === 'r'){
		j = 0;
	}
	res.json(database.holidays[j]);
})


//Deleting a holiday
app.delete('/holiday/:type', (req,res) => {
	const {type} = req.params;
	const {name} = req.body;
	let j = 1;
	if (type === 'r'){
		j = 0;
	}
	let index = -1;
	for (let i = 0; i < database.holidays[j].length; i++){
		if (database.holidays[j][i].name === name){
			index = i;
			break;
		}
	}
	if (index !== -1){
		database.holidays[j].splice(index,1);
		res.json(database.holidays[j]);
	}
	else{
		res.status(404).json('no such holiday');
	}
})

//Adding a non-recurring holiday
app.post('/holiday/nr', (req,res) => {
	const {name} = req.body;
	database.holidays[1].push({
		name: name,
		eventsked: []
	})
	res.json(database.holidays[1][database.holidays[1].length - 1]);
})

//Scheduling a non-recurring holiday
app.post('/holiday/snr', (req,res) => {
	const {name, year, month, day} = req.body;
	let index = -1;
	for (let i = 0; i < database.holidays[1].length; i++){
		if (database.holidays[1][i].name === name){
			index = i;
			break;
		}
	}
	if (index !== -1){
		database.holidays[1][index].eventsked.push(month+'/'+day+'/'+year);
		res.json(database.holidays[1][index].eventsked[database.holidays[1][index].eventsked.length - 1]);
	}
	else{
		res.status(404).json('no such holiday');
	}
})

//Adding a call type
app.post('/callTypes', (req,res) => {
	const {name, priority, active} = req.body;
	if (priority !== (database.callTypes.length + 1)){
		database.callTypes.forEach((call,n) => {
			if (priority <= database.callTypes[n].priority){
				return database.callTypes[n].priority = database.callTypes[n].priority + 1;
			}
		})
	}
	database.callTypes.push({
		id: (database.callTypes.length+20),
		name: name,
		priority: priority,
		active: active
	})
	res.json(database.callTypes[database.callTypes.length - 1]);
})

//Editing a call type
app.put('/callTypes', (req, res) => {
	const {id, name, priority, active} = req.body;
	let index = -1;
	for (let i = 0; i < database.callTypes.length; i++){
		if (database.callTypes[i].id === id){
			index = i;
		}
	}
	if (index !== -1){
		const p = database.callTypes[index].priority
		if (p !== priority){
			if (p > priority){
				database.callTypes.forEach((call,n) => {
					if (priority <= database.callTypes[n].priority && database.callTypes[n].priority < p){
						return database.callTypes[n].priority = database.callTypes[n].priority + 1;
					}
				})
			}
			else{
				database.callTypes.forEach((call,n) => {
					if (priority >= database.callTypes[n].priority && database.callTypes[n].priority > p){
						return database.callTypes[n].priority = database.callTypes[n].priority - 1;
					}
				})
			}
		}
		database.callTypes[index].name = name;
		database.callTypes[index].priority = priority;
		database.callTypes[index].active = active;
		res.json(database.callTypes[index]);
	}
	else{
		res.status(404).json('no such holiday');
	}
})

//Deleting a call type
app.delete('/callTypes', (req,res) => {
	const {id} = req.body;
	let index = -1;
	let priority = -1;
	for (let i = 0; i < database.callTypes.length; i++){
		if (database.callTypes[i].id === id){
			index = i;
			priority = database.callTypes[i].priority;
			break;
		}
	}
	if (index !== -1){
		database.callTypes.splice(index,1);
		for (let n = 0; n < database.callTypes.length; n++){
			if (database.callTypes[n].priority > priority){
				database.callTypes[n].priority = database.callTypes[n].priority - 1;
			}
		}
		res.json(database.callTypes);
	}
	else{
		res.status(404).json('no such holiday');
	}
})

//Getting call types
app.get('/callTypes', (req,res) => {
	res.json(database.callTypes);
})

//Adding a user
app.post('/people', (req, res) => {
	const {email, firstname, lastname, department} = req.body;
	let flag = false;

	for (let i = 0; i < database.users.length; i++){
		if (database.users[i].email === email){
			flag = true;
		}
	}
	if (flag){
		return res.status(400).json('a user with this email already exists.');
	}

	const password = generatePassword(16, false);
	//HASH PASSWORD HERE
	database.users.push({
		id: database.users.length+20,
		firstname: firstname,
		lastname: lastname,
		email: email,
		colour: database.colours[database.users.length%20],
		password: password,
		department: department,
		isadmin: false,
		isactive: true,
		worksked: []
	})

	var mailOptions = {
	  	from: 'menisked@gmail.com',
	  	to: email,
	  	subject: 'Welcome to MeniSked!',
	 	text: 'Hey '+firstname+',\n\nYour administrator has set up your MeniSked account and you have been given a temporary password: '+password+'. Please login using this password and immediately navigate to the account page. Here you will be able to change it to something easier to remember.\n\nThank you,\nThe MeniSked Team.'
	};

	transporter.sendMail(mailOptions, function(error, info){
  		if (error) {
    		return res.json(error);
  		} 
  		return res.json(info.response);
	});
	return res.json(database.users[database.users.length -1]);
})

//Editing a user
app.put('/people', (req, res) => {
	const {id, isactive} = req.body;
	let found = false;
	database.users.forEach((user, i) => {
		if (user.id === id){
			found = true;
			database.users[i].isactive = isactive;
			return res.json(database.users[i]);
		}
	})
	if (!found){
		res.status(404).json('no such user');
	}
})

//Deleting a user
app.delete('/people', (req,res) => {
	const {id} = req.body;
	let found = false;
	database.users.forEach((user, i) => {
		if (user.id === id){
			found = true;
			database.users.splice(i, 1);
			return res.json(database.users);
		}
	})
	if (!found){
		res.status(404).json('no such user');
	}
})

//Getting all users
app.get('/people', (req, res) => {
	res.json(database.users);
})

//Editing account information
app.put('/account/:id', (req,res) => {
	const {id} = req.params;
	const {firstname, lastname, email} = req.body;
	let found = false;
	database.users.forEach((user, i) => {
		if (user.id === id){
			found = true;
			database.users[i].firstname = firstname;
			database.users[i].lastname = lastname;
			database.users[i].email = email;
			return res.json(database.users[i]);
		}
	})
	if (!found){
		res.status(404).json('no such user');
	}
})

//Editing account's password
app.post('/account/:id', (req,res) => {
	const {id} = req.params;
	const {password} = req.body;
	let found = false;
	//HASH PASSWORD HERE
	database.users.forEach((user, i) => {
		if (user.id === id){
			found = true;
			database.users[i].password = password;
			return res.json(database.users[i]);
		}
	})
	if (!found){
		res.status(404).json('no such user');
	}
})

//Getting user's account information
app.get('/account/:id', (req,res) => {
	const {id} = req.params;
	let found = false;
	db.select('*').from('users').where({
		id: id
	})
	.then(user => {
		console.log(user[0]);
	})
	database.users.forEach((user) => {
		if (user.id === id){
			found = true;
			return res.json(user);
		}
	})
	if (!found){
		res.status(404).json('no such user');
	}
})

//Add note
app.post('/sked/notes', (req, res) => {
	const {date, msg, type} = req.body;
	database.notes.push({
		id: (database.notes.length + 20),
		type: type,
		date: date,
		msg: msg
	})
	res.json(database.notes[database.notes.length -1]);
})

//Getting all notes 
app.get('/sked/allNotes', (req, res) => {
	res.json(database.notes);
})


//Get active doctors
app.get('/sked/docs', (req, res) => {
	const arr = database.users.filter((user => {
		return user.isactive === true;
	}))
	res.json(arr);
})

//Get entry types
app.get('/sked/entries', (req,res) => {
	res.json(database.entries);
})

//Add entry type
app.post('/entries', (req,res) => {
	const {name, active} = req.body;
	database.entries.push({
		id: database.entries.length + 20,
		name: name,
		isactive: active
	})
	res.json(database.entries[database.entries.length-1]);
})

//Delete entry type
app.delete('/entries', (req, res) => {
	const {id} = req.body;
	let index = -1;
	for (let i = 0; i < database.entries.length; i++){
		if (database.entries[i].id === id){
			index = i;
		}
	}
	if (index !== -1){
		database.entries.splice(index,1);
		return res.json(database.entries);
	}
	res.json('entry not found');
})

//Edit entry type
app.put('/entries', (req,res) => {
	const {id, name, active} = req.body;
	for (let i = 0; i < database.entries.length; i++){
		if (database.entries[i].id === id){
			database.entries[i].name = name;
			database.entries[i].isactive = active;
			return res.json(database.entries[i]);
		}
	}
	res.json('entry not found');
})

//Admin assign call
app.post('/sked/assign', (req,res) => {
	const {docId, typeId, date} = req.body;
	let index = -1;
	for (let i = 0; i < database.users.length; i++){
		if (database.users[i].id === docId){
			for (let j = 0; j < database.users[i].worksked.length; j++){
				if (database.users[i].worksked[j].date === date){
					index = j;
					break;

				}
			}
			if (index !== -1){
				database.users[i].worksked.splice(index, 1);
			}

			database.users[i].worksked.push({
				id: typeId,
				date: date
			})
			return res.json(database.users[i]);
		}
	}
	res.json('user not found');
})

//Admin delete call
app.delete('/sked/assign', (req,res) => {
	const {docId, date, typeId} = req.body;
	let index = -1;
	for (let i = 0; i < database.users.length; i++){
		if (database.users[i].id === docId){
			for (let j = 0; j < database.users[i].worksked.length; j++){
				if (database.users[i].worksked[j].date === date){
					index = j;
					break;

				}
			}
			if (index !== -1){
				database.users[i].worksked.splice(index, 1);
			}
			return res.json(database.users[i]);
		}
	}
	res.json('user not found');

})


//User forgot password
app.post('/forgot', (req, res) => {
	const {email} = req.body;
	const password = generatePassword(16, false);
	//HASH PASSWORD
	let name = '';
	let flag = false;
	for (let i = 0; i < database.users.length; i++){
		if (database.users[i].email === email){
			name = database.users[i].firstname;
			flag = true;
			database.users[i].password = password;
		}
	}

	if (flag){
		var mailOptions = {
	  		from: 'menisked@gmail.com',
	  		to: email,
	  		subject: 'Recover your MeniSked Password.',
	 	 	text: 'Hey '+name+',\n\nLooks like you forgot your password. Please login to your account using the temporary password: '+password+'. Once signed in, navigate to the account page and change your password to something easier to remember.\n\nThank you,\nThe MeniSked Team.'
		};

		transporter.sendMail(mailOptions, function(error, info){
  			if (error) {
    			return res.json(error);
  			} 
  			return res.json(info.response);
		});
	}
	else{
		return res.status(400).json('user not found');
	}	
})

//Get published months
app.get('/published', (req,res) => {
	res.json(database.published);
})

//Update published months
app.put('/published', (req,res) => {
	const {newNum} = req.body;
	database.published = newNum;
	res.json(database.published);
})

//Generate PDF
// app.post('/create-pdf', (req,res) => {
// 	pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf',(err) => {
// 		if (err){
// 			res.send(Promise.reject());
// 		}

// 		res.send(Promise.resolve());
// 	});
// });

// //GET - Send PDF to client
// app.get('/fetch-pdf', (req,res) => {
// 	res.sendFile(`${__dirname}/result.pdf`)
// })

app.listen(3000, () => {
	console.log('app is running on port 3000');
})


// //Hashing
// 	var bcrypt = require('bcryptjs');
// 	bcrypt.genSalt(10, function(err, salt) {
//    		bcrypt.hash(password, salt, function(err, hash) {
//         	console.log(hash);
//     	});
// 	});

// //Checking
	// // Load hash from your password DB.
	// bcrypt.compare("apples", "$2a$10$enNbkbWo29q4xjl8tylxtum/8p31ZbUODeQ.ENORdhz8TWkKtawia", function(err, res) {
 //    	console.log('first guess', res);
	// });
	// bcrypt.compare("not_bacon", "$2a$10$enNbkbWo29q4xjl8tylxtum/8p31ZbUODeQ.ENORdhz8TWkKtawia", function(err, res) {
 //    	console.log('second guess', res);
	// });




/*
/ --> res = this is working
/login --> POST = success/fail (always want to send passwords as POST)
/register --> POST = user 
/sked --> PUT/POST/GET/DELETE --> skedEvents 
/holiday --> GET/POST/PUT/DELETE --> holidays
/callTypes --> GET/POST/PUT/DELETE --> calls
/people --> GET/POST/PUT/DELETE --> user
/messages --> POST/GET --> messages 
/account --> GET/POST/PUT --> user
*/
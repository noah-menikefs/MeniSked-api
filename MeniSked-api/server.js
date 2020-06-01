const express = require('express');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cors())


const database = {
	users: [
		{
			id: 1,
			firstName: 'John',
			lastName: 'Smith',
			password: 'cookies',
			email: 'john@gmail.com',
			colour: '#ADD8E6',
			department: 'ST-JOES-A',
			isAdmin: false,
			isActive: true,
			workSked: [
				{
					id: 0,
					date: "05/29/2020"
				},
				{
					id: 8,
					date: "08/07/2020"
				}
			]
		},
		{
			id: 2,
			firstName: 'Sally',
			lastName: 'Jenkins',
			password: 'bananas',
			email: 'sally@gmail.com',
			colour: '#FFCCCB',
			department: 'ST-JOES-A',
			isAdmin: false,
			isActive: true,
			workSked: [
				{
					id: 2,
					date: "06/09/2020"
				},
				{
					id: 4,
					date: "06/21/2020"
				}
			]
		},
		{
			id: 0,
			firstName: 'Peter',
			lastName: 'Menikefs',
			password: '123',
			email: 'pnm@gmail.com',
			colour: '#FFC0CB',
			department: 'ST-JOES-A Admin',
			isAdmin: true,
			isActive: true,
			workSked: [
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
				isActive: true,
				month: "January",
				day: 1
			},
			{
				name: "Christmas Day",
				isActive: true,
				month: "December",
				day: 25
			}
		],
		[
			{
				name: "Party",
				eventSked: ["12/21/2020","01/12/2021"]
			},
			{
				name: "Easter",
				eventSked: ["04/12/2020","04/04/2021"]
			}

		]
	],
	entries: [
		{
			id: 0,
			name: "Request No Call"
		},
		{
			id: 1,
			name: "No Assignment"
		},
		{
			id: 2,
			name: "Not Available"
		},
		{
			id: 3,
			name: "Vacation"
		},
		{
			id: 4,
			name: "Staycation"
		},
		{
			id: 5,
			name: "Not Available Night"
		},
		{
			id: 6,
			name: "Assign Specific Call"
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
			date: "05/02/2020",
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
	]

}

//Checks if a user's login info is correct
app.post('/login', (req, res) => {
	const {email, password} = req.body;
	let found = false;
	database.users.forEach((user) => {
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
	const {email, firstName, lastName, password, department, isAdmin} = req.body;
	database.users.push({
		id: '3',
		firstName: firstName,
		lastName: lastName,
		email: email,
		colour: '#FFFF99',
		department: department,
		isAdmin: isAdmin,
		isActive: true,
		workSked: []
	})
	res.json(database.users[database.users.length -1]);
})

//Adding a recurring holiday
app.post('/holiday/r', (req,res) => {
	const {name, month, day, isActive} = req.body;
	database.holidays[0].push({
		name: name,
		isActive: isActive,
		month: month,
		day: day
	})
	res.json(database.holidays[0][database.holidays[0].length -1]);
})

//Editing a recurring holiday
app.put('/holiday/r', (req,res) => {
	const {isActive, name, month, day} = req.body;
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
		database.holidays[0][index].isActive = isActive;
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
		eventSked: []
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
		database.holidays[1][index].eventSked.push(month+'/'+day+'/'+year);
		res.json(database.holidays[1][index].eventSked[database.holidays[1][index].eventSked.length - 1]);
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
	const {email, firstName, lastName, password, department, msg} = req.body;
	database.users.push({
		id: database.users.length,
		firstName: firstName,
		lastName: lastName,
		email: email,
		colour: '#FFFF99',
		department: department,
		isAdmin: false,
		isActive: true,
		workSked: []
	})

	//USE NODEMAILER HERE
	res.json(database.users[database.users.length -1]);
})

//Editing a user
app.put('/people', (req, res) => {
	const {id, isActive} = req.body;
	let found = false;
	database.users.forEach((user, i) => {
		if (user.id === id){
			found = true;
			database.users[i].isActive = isActive;
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
	const {firstName, lastName, email} = req.body;
	let found = false;
	database.users.forEach((user, i) => {
		if (user.id === id){
			found = true;
			database.users[i].firstName = firstName;
			database.users[i].lastName = lastName;
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
		return user.isActive === true;
	}))
	res.json(arr);
})

//Get entry types
app.get('/sked/entries', (req,res) => {
	res.json(database.entries);
})

//Admin assign call
app.post('/sked/assign', (req,res) => {
	const {docId, typeId, date} = req.body;
	for (let i = 0; i < database.users.length; i++){
		if (database.users[i].id === docId){
			database.users[i].workSked.push({
				id: typeId,
				date: date
			})
			return res.json(database.users[i]);
		}
	}
	res.json('user not found');
})

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
/profile/:userId --> GET = user
/sked --> PUT/POST/GET/DELETE --> skedEvents 
/holiday --> GET/POST/PUT/DELETE --> holidays
/callTypes --> GET/POST/PUT/DELETE --> calls
/people --> GET/POST/PUT/DELETE --> user
/messages --> POST/GET --> messages 
/account --> GET/POST/PUT --> user
*/
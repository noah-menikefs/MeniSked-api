const express = require('express');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const cors = require('cors');
const nodemailer = require("nodemailer");
var genPass = require("password-generator");
const knex = require('knex');

const register = require('./controllers/register');
const login = require('./controllers/login');
const holiday = require('./controllers/holiday');
const calltype = require('./controllers/calltype');
const people = require('./controllers/people');
const account = require('./controllers/account');
const sked = require('./controllers/sked');
const entries = require('./controllers/entries');
const messages = require('./controllers/messages');
const request = require('./controllers/request');
const published = require('./controllers/published');
const departments = require('./controllers/departments');

const db = knex({
	client: 'pg',
  	connection: {
    	host : '127.0.0.1',
    	user : 'noah.menikefs',
    	password : '',
    	database : 'meniSked'
    }
});

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cors())

// const database = {
// 	users: [
// 		{
// 			id: 1,
// 			firstname: 'John',
// 			lastname: 'Smith',
// 			password: 'cookies',
// 			email: 'john@gmail.com',
// 			colour: '#FFD678',
// 			department: 'ST-JOES-A',
// 			isadmin: false,
// 			isactive: true,
// 			worksked: [
// 				{
// 					id: 0,
// 					date: "05/29/2020"
// 				},
// 				{
// 					id: 8,
// 					date: "08/7/2020"
// 				}
// 			]
// 		},
// 		{
// 			id: 2,
// 			firstname: 'Sally',
// 			lastname: 'Jenkins',
// 			password: 'bananas',
// 			email: 'sally@gmail.com',
// 			colour: '#F49F93',
// 			department: 'ST-JOES-A',
// 			isadmin: false,
// 			isactive: true,
// 			worksked: [
// 				{
// 					id: 2,
// 					date: "06/9/2020"
// 				},
// 				{
// 					id: 4,
// 					date: "06/21/2020"
// 				}
// 			]
// 		},
// 		{
// 			id: 0,
// 			firstname: 'Peter',
// 			lastname: 'Menikefs',
// 			password: '123',
// 			email: 'pnm@gmail.com',
// 			colour: '#FFEE96',
// 			department: 'ST-JOES-A Admin',
// 			isadmin: true,
// 			isactive: true,
// 			worksked: [
// 				{
// 					id: 2,
// 					date: "07/19/2020"
// 				},
// 				{
// 					id: 3,
// 					date: "06/29/2020"
// 				}
// 			]
// 		}
// 	],
// 	login: [
// 		{
// 			id: '100',
// 			hash: '',
// 			email: 'john@gmail.com'
// 		}
// 	],
// 	holidays: [
// 		[
// 			{
// 				name: "New Year's Day",
// 				isactive: true,
// 				month: "January",
// 				day: 1
// 			},
// 			{
// 				name: "Christmas Day",
// 				isactive: true,
// 				month: "December",
// 				day: 25
// 			}
// 		],
// 		[
// 			{
// 				name: "Party",
// 				eventsked: ["12/21/2020","01/12/2021"]
// 			},
// 			{
// 				name: "Easter",
// 				eventsked: ["04/12/2020","04/04/2021"]
// 			}

// 		]
// 	],
// 	entries: [
// 		{
// 			id: 0,
// 			name: "Request No Call",
// 			isactive: true
// 		},
// 		{
// 			id: 1,
// 			name: "No Assignment",
// 			isactive: true
// 		},
// 		{
// 			id: 2,
// 			name: "Not Available",
// 			isactive: true
// 		},
// 		{
// 			id: 3,
// 			name: "Vacation",
// 			isactive: true
// 		},
// 		{
// 			id: 4,
// 			name: "Staycation",
// 			isactive: true
// 		},
// 		{
// 			id: 5,
// 			name: "Not Available Night",
// 			isactive: true
// 		},
// 		{
// 			id: 6,
// 			name: "Assign Specific Call",
// 			isactive: true
// 		}
// 	],
// 	callTypes: [
// 		{
// 			id: 7,
// 			name: "1st Call Day",
// 			priority: 1,
// 			active: true
// 		},
// 		{
// 			id: 8,
// 			name: "1st Call Night",
// 			priority: 2,
// 			active: true
// 		},
// 		{
// 			id: 9,
// 			name: "2nd Call Day",
// 			priority: 3,
// 			active: true
// 		}
// 	],
// 	messages: [
// 		{
// 			userId: 1,
// 			status: "pending",
// 			dateSent: "07/10/2020",
// 			requestDates: [
// 				"07/17/2020"
// 			],
// 			typeID: 0,
// 			response: ""
// 		},
// 		{	userId: 3,
// 			status: "denied",
// 			dateSent: "07/02/2020",
// 			requestDates: [
// 				"07/19/2020", "07/20/2020", "07/21/2020"
// 			],
// 			typeID: 2,
// 			response: "Sorry, I can't let you work that day"
// 		}
// 	],
// 	notes: [
// 		{
// 			id: 1,
// 			type: 1,
// 			date: "05/2/2020",
// 			msg: "0  2  +1"
// 		},
// 		{
// 			id: 2,
// 			type: 2,
// 			date: "05/21/2020",
// 			msg: "Armogan + 1"
// 		},
// 		{
// 			id: 3,
// 			type: 3,
// 			date: "05/25/2020",
// 			msg: "busy day"
// 		}
// 	],
// 	colours: ['#FFEE9680','#F49F9380','#FFD67880','#EB040080','#FFE70080','#FF56C580','#FFAC3E80','#EC019180','#F8831C80','#D980FF80','#B60EFF80','#83E5C780','#7101A980','#57BB7E80','#0091FF80','#19735B80','#88E4FF80','#C7EF6580','#41A3CC80','#85C63580'],
// 	published: 0 //Months after June 2020
// }

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'menisked@gmail.com',
    pass: 'PDM"jxRv4C*aAmAB'
  }
});

//Checks if a user's login info is correct
app.post('/login', (req, res) => {login.handleLogin(req,res,db,bcrypt)})

//User forgot password
app.post('/forgot', (req, res) => {login.forgotPassword(req,res,db,bcrypt,genPass)})

//Adds a new user to the "database"
app.post('/register', (req,res) => {register.handleRegister(req, res, db, bcrypt) })

//Adding a recurring holiday
app.post('/holiday/r', (req,res) => {holiday.addRecurring(req,res,db)})

//Editing a recurring holiday
app.put('/holiday/r', (req,res) => {holiday.editRecurring(req,res,db)})

//Getting holidays
app.get('/holiday/:type', (req,res) => {holiday.getHoliday(req,res,db)})

//Deleting a holiday
app.delete('/holiday/:type', (req,res) => {holiday.deleteHoliday(req,res,db)})

//Adding a non-recurring holiday
app.post('/holiday/nr', (req,res) => {holiday.addNonRecurring(req,res,db)})

//Scheduling a non-recurring holiday
app.put('/holiday/snr', (req,res) => {holiday.skedHoliday(req,res,db)})

//Adding a call type
app.post('/callTypes', (req,res) => {calltype.addCall(req,res,db)})

//Editing a call type
app.put('/callTypes', (req,res) => {calltype.editCall(req,res,db)})

//Deleting a call type
app.delete('/callTypes', (req,res) => {calltype.deleteCall(req,res,db)})

//Getting call types
app.get('/callTypes', (req,res) => {calltype.getCall(req,res,db)})

//Adding a user
app.post('/people', (req,res) => {people.addUser(req,res,db,genPass)})

//Editing a user
app.put('/people', (req,res) => {people.editUser(req,res,db)})

//Deleting a user
app.delete('/people', (req,res) => {people.deleteUser(req,res,db)})

//Getting all users
app.get('/people', (req,res) => {people.getUser(req,res,db)})

//Editing account information
app.put('/account/:id', (req,res) => {account.editAccountInfo(req,res,db)})

//Editing account's password
app.post('/account/:id', (req,res) => {account.editAccountPass(req,res,db,bcrypt)})

//Getting user's account information
app.get('/account/:id', (req,res) => {account.getAccount(req,res,db)})

//Add note
app.post('/sked/notes', (req,res) => {sked.addNote(req,res,db)})

//Getting all notes 
app.get('/sked/allNotes', (req,res) => {sked.getNotes(req,res,db)})

//Get active doctors
app.get('/sked/docs', (req,res) => {sked.getDocs(req,res,db)})

//Get entry types
app.get('/sked/entries', (req,res) => {sked.getEntries(req,res,db)})

//Admin assign entry
app.post('/sked/assign', (req,res) => {sked.assignEntry(req,res,db)})

//Admin delete call
app.delete('/sked/assign', (req,res) => {sked.deleteSkedCall(req,res,db)})

//Add entry type
app.post('/entries', (req,res) => {entries.addEntry(req,res,db)})

//Delete entry type
app.delete('/entries', (req,res) => {entries.deleteEntry(req,res,db)})

//Edit entry type
app.put('/entries', (req,res) => {entries.editEntry(req,res,db)})

//Get published months
app.get('/published', (req,res) => {published.getMonths(req,res,db)})

//Update published months
app.put('/published', (req,res) => {published.updateMonths(req,res,db)})

//Get all messages 
app.get('/amessages', (req,res) => {messages.getAllMessages(req,res,db)})

//Get employee's messages
app.get('/emessages/:id', (req,res) => {messages.getEmployeeMessages(req,res,db)})

//Admin responding to a pending request
app.put('/amessages', (req,res) => {messages.messageResponse(req,res,db)})

//Employee making a request
app.post('/request', (req,res) => {request.addRequest(req,res,db)})

//Employee editing a request's dates
app.put('/request', (req,res) => {request.editRequest(req,res,db)})

//Employee cancelling a request

//Admin accepting a request (updates the employee's workSked)

//Get all the departments with MeniSked
app.get('/departments', (req,res) => {departments.getDepts(req,res,db)})


app.listen(3000, () => {
	console.log('app is running on port 3000');
})
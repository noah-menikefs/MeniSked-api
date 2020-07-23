const getAllMessages = (req,res,db) => {
	db.select('*')
		.from('messages')
		.then(messages => {
			res.json(messages);
		})
		.catch(err => res.status(400).json('unable to get messages'))
}

const getEmployeeMessages = (req,res,db) => {
	const {id} = req.params;
	db.select('*')
		.from('messages')
		.where('docid', '=', id)
		.then(messages => {
			res.json(messages);
		})
		.catch(err => res.status(400).json('unable to get messages'))
}

const messageResponse = (req,res,db) => {
	const {id, status, msg, stamp} = req.body;
	db('messages')
		.where('id','=', id)
		.update({
			status: status,
			msg: msg,
			stamp: stamp
		})
		.returning('*')
		.then(message => {
			res.json(message[0]);
		})
		.catch(err => res.status(400).json('unable to respond'))
}


module.exports = {
	getAllMessages: getAllMessages,
	getEmployeeMessages: getEmployeeMessages,
	messageResponse: messageResponse
}
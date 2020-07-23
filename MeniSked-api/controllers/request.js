const addRequest = (req,res,db) => {
	const {docid, entryid, date, stamp} = req.body;

	db('messages')
		.returning('*')
		.insert({
			docid: docid,
			entryid: entryid,
			dates: [date],
			stamp: stamp,
			status: 'pending',
			msg: ''
		})
		.then(message => {
			res.json(message[0]);
		})
		.catch(err => res.status(404).json('could not add message'))
}

const editRequest = (req,res,db) => {
	const {docid, entryid, date} = req.body;
	db('messages')
		.where('docid', '=', docid)
		.andWhere('entryid', '=', entryid)
		.update({
			dates: db.raw('array_append(dates, ?)', [date]),
		})
		.returning('*')
		.then(message => {
			res.json(message[0]);
		})
		.catch(err => res.status(404).json('unable to edit'))
}

module.exports = {
	addRequest: addRequest,
	editRequest: editRequest
}
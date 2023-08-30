const getAllMessages = (req,res,db) => {
	db.select('*')
		.from('messages')
		.then(messages => {
			res.json(messages);
		})
		.catch(err => res.status(400).json('unable to get messages'))
}

const deleteMessage = (req, res, db) => {
	const {id, deleted, user} = req.body;
	
	db('messages')
		.returning('*')
		.where('id', '=', id)
		.del()
		.then(message => {
			res.json(message[0]);
		})
		.catch(err => res.status(400).json('unable to delete'))
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

const messageResponse = (req, res, db, transporter) => {
    const { id, status, msg, stamp } = req.body;

    db('messages')
        .where('id', '=', id)
        .update({
            status: status,
            msg: msg,
            stamp: stamp
        })
        .returning('*')
        .then(message => {
            // Respond immediately with the message update
            res.json(message[0]);

            const docid = message[0].docid;
            return db.select('*').from('users').where('id', '=', docid)
                .then(user => {
                    if (user.length > 0) {
                        var mailOptions = {
                            from: 'menisked@gmail.com',
                            to: user[0].email,
                            subject: 'Your Administrator Has Responded to Your Request',
                            text: 'Hey ' + user[0].firstname + ',\n\nYour administrator has responded to one of your work requests. To view their response, please navigate to the messages section of MeniSked. The request will appear at the top of your list.\n\nThank you,\nThe MeniSked Team.'
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                // Log the error to the console or elsewhere
                                console.error("Failed to send email:", error);
                            }
                        });
                    }
                })
        })
        .catch(err => {
            res.status(400).json(err.message || 'Unexpected error occurred');
        });
}


module.exports = {
	getAllMessages,
	deleteMessage,
	getEmployeeMessages,
	messageResponse
}
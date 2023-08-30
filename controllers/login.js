const handleLogin = (req, res, db, bcrypt) => {
	const {email, password} = req.body;
	db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash); // true
			
			if (isValid){
				return db.select('*').from('users')
					.where('email','=',email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('unable to get user'))
			}
			else{
				res.status(400).json('wrong credentials')
			}
		})
	.catch(err => res.status(400).json('wrong credentials'))
}

const forgotPassword = (req, res, db, bcrypt, genPass, transporter) => {
    const { email } = req.body;
    const password = genPass(16, false);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    let name = '';

    db.select('*')
        .from('users')
        .where('email', email)
        .then(user => {
            if (user.length === 0) {
                throw new Error('User not found');
            }
            name = user[0].firstname;
            return db('login')
                .where('email', email)
                .update('hash', hash)
                .returning('id', 'email');
        })
        .then(user => {
            // Respond immediately with the updated user details
            res.json(user[0]);

            // Construct the email and send
            var mailOptions = {
                from: process.env.NODEMAILER_USER,
                to: email,
                subject: 'Recover your MeniSked Password.',
                text: 'Hey ' + name + ',\n\nLooks like you forgot your password. Please login to your account using the temporary password: ' + password + '. Once signed in, navigate to the account page and change your password to something easier to remember.\n\nThank you,\nThe MeniSked Team.'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    // Log the error or handle it in a way that it doesn't affect the main response
                    console.error("Failed to send email:", error);
                }
            });
        })
        .catch(err => {
            res.status(400).json(err.message || 'Unexpected error occurred');
        });
}

module.exports = {
	handleLogin,
	forgotPassword
}
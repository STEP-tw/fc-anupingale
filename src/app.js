const { readFile } = require("fs");

const send = function(res, statusCode, content) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const app = (req, res) => {
	let statusCode = 404;
	let message = "PAGE NOT FOUND";
	readFile("./public" + req.url, (err, content) => {
		if (!err) {
			statusCode = 200;
			message = content;
		}
		send(res, statusCode, message);
	});
};

// Export a function that can act as a handler

module.exports = app;

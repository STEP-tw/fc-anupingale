const { readFile } = require("fs");

const send = function(res, statusCode, content) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const app = (req, res) => {
	readFile("./public" + req.url, (err, content) => {
		if (err) {
			send(res, 404, "page not found");
			return;
		}
		send(res, 200, content);
	});
};

// Export a function that can act as a handler

module.exports = app;

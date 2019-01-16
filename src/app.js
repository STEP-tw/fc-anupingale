const { readFile } = require("fs");

const app = (req, res) => {
	if (req.url) {
		readFile("." + req.url, (err, content) => {
			res.statusCode = 200;
			res.write(content);
			res.end();
		});
	} else {
		res.statusCode = 404;
		res.end();
	}
};

// Export a function that can act as a handler

module.exports = app;

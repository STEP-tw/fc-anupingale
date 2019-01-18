const parser = require("./parser.js");
const { Handler } = require("./framework.js");
const app = new Handler();
const { readFile, appendFile } = require("fs");

const createKeyValuePair = function(data) {
	let name = data[0][1];
	let comment = data[1][1];
	return { name: name, comment: comment, time: new Date().toLocaleString() };
};

const parseDetails = function(details) {
	let userData = details.split("&").map(x => x.split("="));
	return createKeyValuePair(userData);
};

const send = function(res, statusCode, content) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const readContent = function(req, res, next) {
	readFile("./public" + req.url, (err, content) => {
		send(res, 200, content);
	});
};

const appendContent = function(req, res, next) {
	readFile("./public" + req.url, (err, content) => {
		readFile("./src/user_comments.json", (err, data) => {
			let comments = parser(JSON.parse("[" + data + "]"));
			send(res, 200, content + comments);
		});
	});
};

const writeComment = function(req, res, next) {
	let content = "";
	req.on("data", chunk => {
		content += chunk;
	});
	req.on("end", () => {
		let details = "\n," + JSON.stringify(parseDetails(content));
		appendFile("./src/user_comments.json", details, "utf8", err => {
			if (err) console.log(err);
			appendContent(req, res);
		});
	});
};

const logError = function(req, res, next) {
	send(res, 404, "File Not Found");
};

const readHomeContent = function(req, res, next) {
	readFile("./public/index.html", (err, content) => {
		send(res, 200, content);
	});
};

app.get("/", readHomeContent);
app.get("/index.html", readContent);
app.post("/guest_book.html", writeComment);
app.get("/homepage.css", readContent);
app.get("/homepage.js", readContent);
app.get("/pages.css", readContent);
app.get("/images/freshorigins.jpg", readContent);
app.get("/images/animated-flower-image-0021.gif", readContent);
app.get("/guest_book.html", appendContent);
app.get("/abeliophyllum.html", readContent);
app.get("/images/pbase-Abeliophyllum.jpg", readContent);
app.get("/flowers.css", readContent);
app.get("/flower_pdf/Abeliophyllum.pdf", readContent);
app.use(logError);
// Export a function that can act as a handler

module.exports = app.handler.bind(app);

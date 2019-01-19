const { parser, parseDetails } = require("./parser.js");
const { Handler } = require("./framework.js");
const commentDetails = require("../src/user_comments.json");
const app = new Handler();
const { readFile, writeFile } = require("fs");

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
		let comments = parser(JSON.parse(JSON.stringify(commentDetails)));
		send(res, 200, content + comments);
	});
};

const writeComment = function(req, res, next) {
	let content = "";
	req.on("data", chunk => {
		content += chunk;
	});
	req.on("end", () => {
		let details = JSON.parse(JSON.stringify(commentDetails));
		details.push(parseDetails(content));

		writeFile(
			"./src/user_comments.json",
			JSON.stringify(details),
			"utf8",
			(err, data) => {
				if (err) console.log(err);
				appendContent(req, res);
			}
		);
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
app.get("/agerantum.html", readContent);
app.get("/images/pbase-agerantum.jpg", readContent);
app.get("/flower_pdf/Ageratum.pdf", readContent);
app.get("/flower_pdf/Abeliophyllum.pdf", readContent);
app.use(logError);
// Export a function that can act as a handler

module.exports = app.handler.bind(app);

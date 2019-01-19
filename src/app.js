const { parser, parseDetails } = require("./parser.js");
const { Handler } = require("./framework.js");
const commentDetails = require("../src/user_comments.json");
const app = new Handler();
const { readFile, writeFile } = require("fs");

const publicPrefix = req => "./public" + req.url;

const send = function(res, statusCode, content) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const readContent = function(req, res, next) {
	readFile(publicPrefix(req), (err, content) => {
		send(res, 200, content);
	});
};

const appendContent = function(req, res, next) {
	readFile(publicPrefix(req), (err, content) => {
		let comments = parser(commentDetails);
		send(res, 200, content + comments);
	});
};

const writeComment = function(req, res, next) {
	let content = "";
	req.on("data", chunk => (content += chunk));
	req.on("end", () => {
		commentDetails.push(parseDetails(content));
		let newComments = JSON.stringify(commentDetails);
		writeFile("./src/user_comments.json", newComments, "utf8", (err, data) => {
			if (err) console.log(err);
			appendContent(req, res);
		});
	});
};

const readHomeContent = function(req, res, next) {
	readFile("./public/index.html", (err, content) => {
		send(res, 200, content);
	});
};

app.get("/", readHomeContent);
app.post("/guest_book.html", writeComment);
app.get("/guest_book.html", appendContent);
app.use(readContent);

module.exports = app.handler.bind(app);

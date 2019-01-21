const { parser, parseDetails } = require("./parser.js");
const { Handler } = require("./framework.js");
const jsonPath = () => "./src/user_comments.json";
const fileNotFound = () => "File not found";
const encoding = () => "utf8";
const homePage = () => "./public/index.html";

const app = new Handler();
const {
	readFile,
	writeFile,
	existsSync,
	writeFileSync,
	readFileSync
} = require("fs");

const publicPrefix = req => "./public" + req.url;
let commentDetails;

const read = function(req, res, next) {
	if (!existsSync(jsonPath())) {
		writeFileSync(jsonPath(), "[]", encoding());
	}
	const content = readFileSync(jsonPath(), encoding());
	commentDetails = JSON.parse(content);
	next();
};

const send = function(res, statusCode, content) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const readContent = function(req, res) {
	readFile(publicPrefix(req), (err, content) => {
		if (err) return send(res, 404, fileNotFound());
		send(res, 200, content);
	});
};

const appendContent = function(req, res) {
	readFile(publicPrefix(req), (err, content) => {
		let comments = parser(commentDetails);
		send(res, 200, content + comments);
	});
};

const writeComment = function(req, res) {
	let content = "";
	req.on("data", chunk => (content += chunk));
	req.on("end", () => {
		commentDetails.unshift(parseDetails(content));
		let newComments = JSON.stringify(commentDetails);
		writeFile(jsonPath(), newComments, encoding(), (err, data) => {
			if (err) console.log(err);
			appendContent(req, res);
		});
	});
};

const readHomeContent = function(req, res) {
	readFile(homePage(), (err, content) => {
		send(res, 200, content);
	});
};

const getComments = (req, res) => {
	send(res, 200, parser(commentDetails));
};

app.use(read);
app.get("/", readHomeContent);
app.post("/guest_book.html", writeComment);
app.get("/guest_book.html", appendContent);
app.get("/comments", getComments);
app.use(readContent);

module.exports = app.handler.bind(app);

const { parser, parseDetails } = require("./parser.js");
const { Handler } = require("./framework.js");
const app = new Handler();
const {
	JSONPATH,
	fileNotFound,
	ENCODING,
	HOMEPAGE,
	DEFAULTCOMMENT
} = require("./constants.js");
const {
	readFile,
	writeFile,
	existsSync,
	writeFileSync,
	readFileSync
} = require("fs");

const publicPrefix = req => "./public" + req.url;
let user_comments;

const read = function(req, res, next) {
	if (!existsSync(JSONPATH)) {
		writeFileSync(JSONPATH, DEFAULTCOMMENT, ENCODING);
	}
	const content = readFileSync(JSONPATH, ENCODING);
	user_comments = JSON.parse(content);
	next();
};

const send = function(res, content, statusCode = 200) {
	res.statusCode = statusCode;
	res.write(content);
	res.end();
};

const readContent = function(req, res) {
	readFile(publicPrefix(req), (err, content) => {
		if (err) return send(res, fileNotFound, 404);
		send(res, content);
	});
};

const showComments = function(req, res) {
	readFile(publicPrefix(req), (err, content) => {
		let comments = parser(user_comments);
		send(res, content + comments);
	});
};

const getComments = function(req, res) {
	let content = "";
	req.on("data", chunk => (content += chunk));
	req.on("end", () => {
		user_comments.unshift(parseDetails(content));
		let newComments = JSON.stringify(user_comments);
		writeFile(JSONPATH, newComments, ENCODING, (err, data) => {
			if (err) console.log(err);
			showComments(req, res);
		});
	});
};

const readHomeContent = function(req, res) {
	readFile(HOMEPAGE, (err, content) => {
		send(res, content);
	});
};

const updateComments = (req, res) => {
	send(res, parser(user_comments));
};

app.use(read);
app.get("/", readHomeContent);
app.post("/html/guest_book.html", getComments);
app.get("/html/guest_book.html", showComments);
app.get("/comments", updateComments);
app.use(readContent);

module.exports = app.handler.bind(app);

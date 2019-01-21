const { parser, parseDetails } = require("./parser.js");
const { Handler } = require("./framework.js");
const jsonPath = () => "./src/user_comments.json";
const fileNotFound = () => "File not found";
const encoding = () => "utf8";
const homePage = () => "./public/index.html";
const defaultComment = () => "[]";
const app = new Handler();
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
	if (!existsSync(jsonPath())) {
		writeFileSync(jsonPath(), defaultComment(), encoding());
	}
	const content = readFileSync(jsonPath(), encoding());
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
		if (err) return send(res, fileNotFound(), 404);
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
		writeFile(jsonPath(), newComments, encoding(), (err, data) => {
			if (err) console.log(err);
			showComments(req, res);
		});
	});
};

const readHomeContent = function(req, res) {
	readFile(homePage(), (err, content) => {
		send(res, content);
	});
};

const updateComments = (req, res) => {
	send(res, parser(user_comments));
};

app.use(read);
app.get("/", readHomeContent);
app.post("/guest_book.html", getComments);
app.get("/guest_book.html", showComments);
app.get("/comments", updateComments);
app.use(readContent);

module.exports = app.handler.bind(app);

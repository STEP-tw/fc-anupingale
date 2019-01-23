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
const login = readFileSync("./public/html/login.html", ENCODING);
const logout = readFileSync("./public/html/logout.html", ENCODING);

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
	readFile("./public/html/guest_book.html", ENCODING, (err, content) => {
		let comments = parser(user_comments);
		let data = content.replace("##COMMENTS##", comments);
		if (req.cookies.username) {
			let details = data.replace("##LOGINFO##", logout);
			send(res, details.replace("##USERNAME##", req.cookies.username));
			return;
		}
		send(res, data.replace("##LOGINFO##", login));
		return;
	});
};

const getComments = function(req, res) {
	let content = "";
	req.on("data", chunk => (content += chunk));
	req.on("end", () => {
		let d = parseDetails(content);
		d["name"] = req.headers.cookie.split("=")[1];
		user_comments.unshift(d);
		let newComments = JSON.stringify(user_comments);
		showComments(req, res);
		res.writeHead(302, {
			Location: "/html/guest_book.html"
		});
		writeFile(JSONPATH, newComments, ENCODING, (err, data) => {
			if (err) console.log(err);
			res.end();
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

const loadCookies = function(req, res, next) {
	let cookie = req.headers["cookie"];
	let cookies = {};
	if (cookie) {
		cookie.split(";").forEach(element => {
			let [name, value] = element.split("=");
			cookies[name] = value;
		});
	}
	req.cookies = cookies;
	next();
};

const renderLogin = function(req, res, next) {
	let content = "";
	req.on("data", chunk => (content += chunk));
	req.on("end", () => {
		let username = content.split("=")[1];
		res.setHeader("Set-Cookie", "username=" + username);
		res.writeHead(302, {
			Location: "/html/guest_book.html"
		});
		res.end();
	});
};

const renderLogout = function(req, res, next) {
	res.setHeader(
		"Set-Cookie",
		"username=;expires=Thu, 01 Jan 1970 00:00:00 UTC"
	);
	res.writeHead(302, {
		Location: "/html/guest_book.html"
	});
	res.end();
};

app.use(read);
app.use(loadCookies);
app.get("/", readHomeContent);
app.post("/submitComments", getComments);
app.get("/html/guest_book.html", showComments);
app.post("/html/guest_book.html", getComments);
app.post("/login", renderLogin);
app.post("/logout", renderLogout);
app.get("/comments", updateComments);
app.use(readContent);

module.exports = app.handler.bind(app);

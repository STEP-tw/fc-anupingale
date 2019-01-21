const createKeyValuePair = function(data) {
	let name = decodeURIComponent(data[0][1]).replace(/[+]/g, " ");
	let comment = decodeURIComponent(data[1][1]).replace(/[+]/g, " ");
	return { name: name, comment: comment, time: new Date().toLocaleString() };
};

const parseDetails = function(details) {
	let userData = details.split("&").map(x => x.split("="));
	return createKeyValuePair(userData);
};

const createData = function(content) {
	return "<td>" + content + "</td>";
};

const createRow = function(name, comment, time) {
	let data = [name, comment, time];
	return "<tr>" + data.map(createData).join("") + "</tr>";
};

const createTable = function(content) {
	return createRow(content.time, content.name, content.comment);
};

const parser = function(content) {
	headers = "<th>Date</th><th>Name</th><th>Comment</th>";
	return (
		"<table class='comments' id='user_comments' cellspacing='20px'>" +
		headers +
		content.map(createTable).join("") +
		"</table>"
	);
};

module.exports = { parser, parseDetails };

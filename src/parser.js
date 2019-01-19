const createKeyValuePair = function(data) {
	let name = data[0][1];
	let comment = data[1][1];
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
	headers = "<tr><th>Date</th><th>Name</th><th>Comment</th>";
	return (
		"<table cellspacing='20px'>" +
		headers +
		content.map(createTable).join("") +
		"</table>"
	);
};

module.exports = { parser, parseDetails };

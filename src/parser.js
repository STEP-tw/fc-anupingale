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
	headers = "<tr><th>date</th><th>name</th><th>comment</th>";
	return (
		"<table border='solid 1px black'>" +
		headers +
		content.map(createTable).join("") +
		"</table>"
	);
};

module.exports = parser;

const updateComments = function() {
	fetch("/guest_book.html")
		.then(res => {
			return res.text();
		})
		.then(doc => {
			let id = document.getElementById("user_comments");
			let newDoc = document.createElement("html");
			newDoc.innerHTML = doc;
			id.innerHTML = newDoc.getElementsByClassName("comments")[0].innerHTML;
		});
};

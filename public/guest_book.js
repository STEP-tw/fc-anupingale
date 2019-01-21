const updateComments = function() {
	fetch("/comments")
		.then(res => res.text())
		.then(refreshedComments => {
			document.getElementById('user_comments').innerHTML = refreshedComments;
		});
};

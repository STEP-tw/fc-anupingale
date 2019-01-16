const displayImage = function() {
	const jar = document.getElementById("jar");
	jar.style.visibility = "visible";
};

const hideImage = function() {
	const jar = document.getElementById("jar");
	jar.style.visibility = "hidden";
	setTimeout(displayImage, 1000);
};

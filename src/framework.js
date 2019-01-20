const validateRoutes = function(req, route) {
	if (route.method && req.method != route.method) return false;
	if (route.url && req.url != route.url) return false;
	return true;
};

class Handler {
	constructor() {
		this.routes = [];
	}

	handler(req, res) {
		let validRoutes = this.routes.filter(x => validateRoutes(req, x));
		const next = function() {
			let current = validRoutes.shift();
			if (!current) return;
			current.handler(req, res, next);
		};
		next();
	}

	get(url, handler) {
		this.routes.push({ url, method: "GET", handler });
	}

	post(url, handler) {
		this.routes.push({ url, method: "POST", handler });
	}

	use(handler) {
		this.routes.push({ handler });
	}
}

module.exports = { Handler };

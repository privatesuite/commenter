const url = require("url");
const contenu = require("contenu");
const comments = require("../comments");

const Router = contenu.Router;

const router = new Router();

// Cooldown in seconds
const cooldown = contenu.utils.conf().comments && contenu.utils.conf().comments.cooldown ? contenu.utils.conf().comments.cooldown : 10;
const cooldownMap = new Map();

router.get("/", (req, res) => {

	res.end("Commenter is working!");

});

router.post("/add", async (req, res) => {

	const to = url.parse(req.url, true).query.to;

	const address = req.connection.remoteAddress + "";

	if (cooldownMap.has(req.connection.remoteAddress)) {

		if (to) {

			res.writeHead(302, {
		
				"Location": decodeURIComponent(to)
		
			});

			res.end();

			return;

		}

		res.writeHead(429, {

			"Content-Type": "application/json"
	
		});
	
		res.end(`{"status": "tooFast"}`);

		return;

	}

	var data = (await contenu.utils.body(req)) || {};

	if (!((await contenu.database.elements()).find(_ => _.id === data.element))) {

		if (to) {

			res.writeHead(302, {
		
				"Location": to
		
			});

			res.end();

			return;

		}

		res.writeHead(400, {

			"Content-Type": "application/json"
	
		});
	
		res.end(`{"status": "invalidElement"}`);

		return;

	}

	cooldownMap.set(req.connection.remoteAddress, {

		cooldown: true

	});

	setTimeout(() => {

		cooldownMap.delete(address);

	}, cooldown * 1000);

	var result = await comments.addComment({
		
		...data,
		date: Date.now()
		
	});

	if (!result) {

		if (to) {

			res.writeHead(302, {
		
				"Location": to
		
			});

			res.end();

			return;

		}

		res.writeHead(206, {

			"Content-Type": "application/json"
	
		});
	
		res.end(`{"status": "missingFields"}`);

		return;

	}

	if (to) {

		res.writeHead(302, {
	
			"Location": to
	
		});

		res.end();

		return;

	}

	res.writeHead(201, {

		"Content-Type": "application/json"

	});

	res.end(`{"status": "success"}`);

});

module.exports = router;

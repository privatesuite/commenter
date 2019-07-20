const contenu = require("contenu");
const comments = require("../comments");

const Router = contenu.Router;

const router = new Router();

router.get("/", (req, res) => {

	res.end("Commenter is working!");

});

router.post("/add", async (req, res) => {

	var data = await contenu.utils.body(req);

	var result = await comments.addComment(data);

	if (!result) {

		res.writeHead(206, {

			"Content-Type": "application/json"
	
		});
	
		res.end(`{"status": "missingFields"}`);

		return;

	}

	res.writeHead(201, {

		"Content-Type": "application/json"

	});

	res.end(`{"status": "success"}`);

});

module.exports = router;

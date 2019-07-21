const fs = require("fs");
const path = require("path");
const contenu = require("contenu");
const comments = require("../comments");

const Router = contenu.Router;
const view = contenu.utils.view;

const router = new Router();

router.get("/", async (req, res) => {

	res.writeHead(200, {

		"Content-Type": "text/html"

	});

	res.end(await view(req, "comments", {

		comments: await comments.getComments()

	}, path.join(__dirname, "..", "..", "views")));

});

router.post("/delete_comment", async (req, res) => {

	const data = (await contenu.utils.body(req)) || {};

	const element = (await contenu.database.elements()).find(_ => _.id === data.id);

	if (element) {

		element.delete();

	}

	res.writeHead(302, {
		
		"Location": "/admin/comments"

	});
	
});

router.get("/static/*", async (req, res) => {

	var file = path.join(__dirname, "../..", req.url);

	if (!fs.existsSync(file)) {

		res.writeHead(404);
		
		res.end("404: Not Found");

		return;

	}

	var stat = fs.statSync(file);

	res.writeHead(200, {

		"Content-Type": "application/octet-stream",
		"Content-Length": stat.size

	});

	fs.createReadStream(file).pipe(res);

});

module.exports = router;

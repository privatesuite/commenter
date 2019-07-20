const path = require("path");
const contenu = require("contenu");
const comments = require("./comments");

const view = contenu.utils.view;

async function main () {

	await comments.initiate();

	contenu.routes.api.use("/comments", require("./routes/api"));

	// Admin Panel

	contenu.routes.admin.get("/comments", async (req, res) => {

		res.writeHead(200, {

			"Content-Type": "text/html"

		});

		res.end(await view(req, "comments", {}, path.join(__dirname, "..", "views")));

	});

}

main();

const contenu = require("contenu");
const comments = require("./comments");

async function main () {

	await comments.initiate();

	contenu.routes.api.use("/comments", require("./routes/api"));
	contenu.routes.admin.use("/comments", require("./routes/admin"));

}

main();

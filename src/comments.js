const contenu = require("contenu");

let template;

module.exports = {

	async initiate () {

		template = (await contenu.database.templates()).find(_ => _.name.toLowerCase() === "comment");

		if (!template) {

			await contenu.database.addTemplate(new contenu.Template(contenu.database, "commenter_template", "Comment", {

				title: "string", // The comment's title
				element: "element_identifier", // The element it's bound to

				author: "string", // The comment's author
				content: "string", // The comment's content

				api_access: true

			}));

		}

	},

	async addComment (fields) {

		if (!fields.title || !fields.element || !fields.author || !fields.content) return false;

		return await contenu.database.addElement(new contenu.Element(contenu.database, null, "commenter_template", {

			title: fields.title + "",
			element: fields.element + "",

			author: fields.author + "",
			content: fields.content + "",

			api_access: true

		}));

	}

}

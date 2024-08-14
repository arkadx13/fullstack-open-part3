const express = require("express");
const app = express();
const PORT = 3001;

let phonebook = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/api/persons", (request, response) => {
	response.json(phonebook);
});

app.get("/info", (request, response) => {
	const info = `<p>Phonebook has info for ${
		phonebook.length
	} people</p><p>${new Date()}</p>`;

	response.send(info);
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	const person = phonebook.find((person) => person.id === id);
	console.log(person);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.listen(PORT);
console.log(`Server is running on port ${PORT}`);

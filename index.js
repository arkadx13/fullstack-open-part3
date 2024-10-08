const express = require("express");
const morgan = require("morgan");
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

// Middlewares
morgan.token("type", (req, res) => {
	return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(express.json());
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :type"
	)
);

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

function generateId() {
	const idArr = phonebook.map((person) => Number(person.id));
	let newId;

	while (true) {
		newId = Math.ceil(Math.random() * 1000);
		if (!idArr.includes(newId)) {
			break;
		}
	}

	return String(newId);
}

app.post("/api/persons", (request, response) => {
	const body = request.body;
	const isExisting = Boolean(
		phonebook.find((person) => person.name === body.name)
	);

	// The name or number is missing
	if (!body.name || !body.number) {
		return response
			.status(400)
			.json({ error: "name and number fields must be filled" });
	}

	// The name already exists in the phonebook
	if (isExisting) {
		return response.status(400).json({ error: "name must be unique" });
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	};

	phonebook = phonebook.concat(person);
	response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	phonebook = phonebook.filter((person) => person.id !== id);

	response.status(204).end();
});

app.listen(PORT);
console.log(`Server is running on port ${PORT}`);

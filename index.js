const http = require('http')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());

// GET all persons
app.route('/api/persons').get((req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.json(persons)
})
  .post((req, res) => {
    console.log(req.body);
    let newId;
    do {
      newId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER)
    } while (persons.find(person => person.id === newId));

    // ERROR HANDLING
    const { name, number } = req.body;
    if (!name) return res.status(400).json({ error: "name required" })
    if (!number) return res.status(400).json({ error: "number required" })
    if (persons.find(person => person.name === name)) return res.status(400).json({ error: `${name} already exists in phonebook` })

    //ADD NEW PERSON
    const newPerson = {
      id: newId,
      name,
      number
    }
    persons.push(newPerson);
    res.status(200);
    res.json(newPerson)
  });

// GET phonebook metadata
app.route('/info').get((req, res) => {
  const msg = `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date().toString()}</p>`
  res.send(msg)
});

// GET or DELETE single person
app.route('/api/persons/:id').all((req, res) => {
  const id = Number(req.params.id);
  const method = req.method;
  console.log({ id, method })
  person = persons.find(person => person.id === id);
  if (!person) return res.send(`no person found with ID = ${id}`);

  if (method === 'GET') return res.json(person);
  if (method === 'DELETE') {
    persons.splice(persons.indexOf(person), 1);
    return res.send(`deleted record: ${person.name}, ${person.number}`)
  }
  return res.status(405).send(`invalid request type: ${method} `);
});

// 404 default
app.use((req, res, next) => {
  res.status = 404
  res.send('page not found');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
});
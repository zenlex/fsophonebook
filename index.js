const http = require('http')
const express = require('express');

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
// GET all persons
app.route('/api/persons').get((req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.json(persons)
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
  console.log({id, method})
  person = persons.find(person => person.id === id);
  if(!person) return res.send(`no person found with ID = ${id}`);
  
  if(method === 'GET') return res.json(person);
  if(method === 'DELETE'){
    persons.splice(persons.indexOf(person), 1);
    return res.send(`deleted record: ${person.name}, ${person.number}`)
  } 
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
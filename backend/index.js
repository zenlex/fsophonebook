require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());

morgan.token('postdata', (req, res) => {
  return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'));

// SERVE STATIC FRONTEND
app.use(express.static('build'));

// GET ALL PERSONS / POST NEW PERSON
app.route('/api/persons').get((req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})
  .post((req, res) => {

    // ERROR HANDLING
    const { name, number } = req.body;
    if (!name) return res.status(400).json({ error: "name required" })
    if (!number) return res.status(400).json({ error: "number required" })
    // if (persons.find(person => person.name === name)) return res.status(400).json({ error: `${name} already exists in phonebook` })

    //ADD NEW PERSON
    const newPerson = {
      name,
      number
    }
    Person.create(newPerson).then(result => {
      res.status(200);
      res.json(result)
    })
  });
// GET phonebook metadata
app.route('/info').get((req, res) => {
  Person.find({}).then(result => {
    const msg = `<p>Phonebook has info for ${result.length} people</p>
        <p>${new Date().toString()}</p>`
    res.send(msg)
  })
});

// GET or DELETE single person
app.route('/api/persons/:id').all((req, res) => {
  console.log('single person request made', req.method, req.params.id, )
  const method = req.method;

  if (method === 'GET') {
    Person.findById(req.params.id).then(result => {
      if (!result) {
        return res.json({ error: `no person entries found with id: ${req.params.id}` })
      }
      res.json(result);
    })
  } else if (method === 'DELETE') {
    Person.findByIdAndDelete(req.params.id).then(result => {
      if (!result) {
        return res.json({ error: `no person entries found with id: ${req.params.id}` })
      }
      res.send(`deleted record: ${result.name}, ${result.number}`)
    })
  } else return res.status(405).send(`invalid request type: ${method} `);
});

// 404 default
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
});
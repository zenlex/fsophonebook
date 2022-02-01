require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const { response } = require('express');

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
app.route('/api/persons')
  .get((req, res, next) => {
    Person.find({}).then(persons => {
      res.json(persons
        .map(person => {
          return {
            name: person.name,
            number: person.number,
            id: person._id
          }
        })
      )
    })
      .catch(err => next(err))
  })
  .post((req, res, next) => {
    const { name, number } = req.body;
    //ADD NEW PERSON
    const newPerson = new Person({
      name,
      number
    })
    newPerson.save()
      .then(result => {
        res.status(200);
        res.json(result)
      })
      .catch(err => next(err))
    });

// GET phonebook metadata
app.route('/info').get((req, res, next) => {
  Person.find({})
    .then(result => {
      const msg = `<p>Phonebook has info for ${result.length} people</p>
        <p>${new Date().toString()}</p>`
      res.send(msg)
    })
    .catch(err => next(err))
});

// GET or DELETE single person
app.route('/api/persons/:id').all((req, res, next) => {
  const method = req.method;

  if (method === 'GET') {
    Person.findById(req.params.id)
      .then(result => {
        if (result) {
          const response = {
            name: result.name,
            number: result.number,
            id: result._id
          }
          res.json(response);
        } else {
          return res.json({ error: `no person entries found with id: ${req.params.id}` })
        }
      })
      .catch(err => next(err))

  } else if (method === 'DELETE') {
    Person.findByIdAndDelete(req.params.id)
      .then(result => {
        if (!result) {
          return res.json({ error: `no person entries found with id: ${req.params.id}` })
        }
        res.send(`deleted record: ${result.name}, ${result.number}`)
      })
      .catch(err => next(err))
  } else if (method === 'PUT') {
    Person.findByIdAndUpdate(req.params.id, { new: true })
      .then(result => {
        if (!result) {
          return res.json({ error: `no person entries found with id ${req.params.id}` })
        }
        res.send(`updated record: ${result.name}, ${result.number}`)
      })
      .catch(err => next(err))
  }
  else return res.status(405).send(`invalid request type: ${method} `);

});

// 404 default
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// ERROR HANDLING
const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  }
  else res.status(400).send({ error: err.message })
  next(err)
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
});
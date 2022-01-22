const http = require('http')

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

const app = http.createServer((req, res) => {
    switch(req.url) {
      case '/api/persons':
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(persons))
        break;
      case '/info':
        const msg = `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date().toString()}</p>`
        res.end(msg)
    }
})


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
});
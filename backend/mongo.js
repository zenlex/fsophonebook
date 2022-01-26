const mongoose = require('mongoose')
const { Schema } = mongoose;

// console.log(process.argv);

if (process.argv.length < 3) {
  console.log('not enough arguments: node mongo.js <dbpassword> [entry to add]');
  process.exit(1);
}

const password = process.argv[2];

const dbURL = `mongodb+srv://zenlex:${password}@cluster0.oofub.mongodb.net/fsophonebook?retryWrites=true&w=majority`;

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

mongoose.connect(dbURL);

const personSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  }
})

const Person = mongoose.model('Person', personSchema);

mongoose.connect(dbURL)

if (process.argv.length === 3) {
    Person.find({}, (err, persons) => {
        if (err) console.log(err);
        for (const person of persons){
          console.log(`${person.name} ${person.number}`);
        }
        mongoose.connection.close();
        process.exit(1);
    })
  }
    
    
    // // POPULATE DB WITH INIT DATA
    // const addPerson = (name, number) => {
    //   const newPerson = new Person({ name, number })
    //     console.log(newPerson);
    //     newPerson.save().then(result => {
    //       console.log(`added ${result.name}`)
    //     });
    // }  
    
    // for(const person of persons){
    //   addPerson(person.name, person.number);
    // };
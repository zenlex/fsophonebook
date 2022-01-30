
const mongoose = require('mongoose')
const { Schema } = mongoose;

const dbURL = process.env.MONGO_URL

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

console.log('connecting to MongoDB')
mongoose.connect(dbURL).then(result => {
  console.log('connected to MongoDB');
})
  .catch(error => {
    console.log('error connectiong to MongoDB: ', error.message)
  })

module.exports = Person;
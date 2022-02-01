
const mongoose = require('mongoose')
const { Schema } = mongoose;

const dbURL = process.env.MONGO_URL

const personSchema = new Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'Name Required'],
    unique: true
  },
  number: {
    type: String,
    required: [true, 'Number Required'],
    minlength: 10,
    validate:{
      validator: function(v) {
        return /\(?\d{3}\)?-\d{3}-\d{4}\s*$/.test(v)
      },
      message: props=> `${props.value} is not a valid US phone number e.g.333-555-9999`
    }
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
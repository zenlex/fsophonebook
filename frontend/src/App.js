import React, { useEffect, useState } from 'react';
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import People from './components/People'
import ps from './services/persons';

const Notification = ({ message }) => {
  if (!message) return null;
  const error = message instanceof Error ? true : false;
  const successStyle = {
    width: '100%',
    padding: '10px 25px',
    margin: '0 auto 20px auto',
    backgroundColor: 'lightgrey',
    border: '2px solid green',
    borderRadius: 10
  }
  const errorStyle = {
    width: '100%',
    padding: '10px 25px',
    margin: '0 auto 20px auto',
    backgroundColor: 'lightgrey',
    color:'red',
    border: '2px solid red',
    borderRadius: 10
  }

  return (
    <div style={error ? errorStyle : successStyle}>
      {message.message || message}
    </div>
  )
}

const App = () => {
  // STATE ------------------------->
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNum, setNewNum] = useState('');
  const [filter, setFilter] = useState('');
  const [alertmsg, setAlertMsg] = useState(null);
  useEffect(() => {
    ps.getAll()
      .then(data => setPersons(data))
  }, [])

  // HANDLERS ----------------------->
  const handleNameChange = (event) => {
    setNewName(event.target.value)
    event.target.value = newName
  }
  const handleNumChange = (event) => {
    setNewNum(event.target.value)
    event.target.value = newNum
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    event.target.value = filter
  }

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} already exists in phonebook - replace old number with  new one?`)) {
        let personObj = { ...existingPerson, number: newNum };
        ps.update(personObj)
          .then(updated => setPersons(
            persons.map(person => 
              person.name === personObj.name 
              ? personObj 
              : person)))
          .catch(error => {
            setAlertMsg(error);
            setTimeout(() => setAlertMsg(null), 3000);
          })

      }
    } else {
      let personObj = { name: newName, number: newNum }
      ps.create(personObj)
        .then(newPerson => {
          setPersons(persons.concat(newPerson));
          setAlertMsg(`${newPerson.name} successfully added`);
          setTimeout(() => setAlertMsg(null), 3000);
        })
        .catch(error => {
          setAlertMsg(error);
          setTimeout(() => setAlertMsg(null), 3000);
        });
    }
    setNewName('');
    setNewNum('')
  }

  const deletePerson = (id) => {
    if (window.confirm(`delete ${persons.find(person => person.id === id).name}?`)) {
      ps.deleteRow(id)
        .then(() => setPersons(persons.filter(
          person => person.id !== id)))
        .catch(error => {
          setAlertMsg(error)
          setTimeout(() => setAlertMsg(null), 3000);
        })
    }
  }

  // FILTER LOGIC --------------------->
  const regex = filter ? new RegExp(filter, 'i') : /./i
  const personsToShow = persons
    .filter(person =>
      regex.test(person.name)
      || regex.test(person.number))

  // RETURN -------------------------->
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={alertmsg} />
      <Filter filter={filter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        num={newNum}
        onNameChange={handleNameChange}
        onNumChange={handleNumChange}
      />
      <h2>Numbers</h2>
      <People persons={personsToShow} deletePerson={deletePerson} />


      <div>debug: {newName}</div>
    </div>
  )

};

export default App;



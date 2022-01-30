import React from "react"

const PersonRow = ({ person, deletePerson }) => {
  console.log(person);
  return (<li key={person.name}>
    {person.name} - {person.number}
    <button onClick={() => deletePerson(person._id)}>delete</button>
  </li>)
}

const People = ({ persons, deletePerson }) => (
  <ul>
    {persons.map(person => <PersonRow key={person.name} person={person} deletePerson={deletePerson}/>)}
  </ul>
)

export default People;
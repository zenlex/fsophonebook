import axios from 'axios';

const dbURL = 'http://localhost:3001/api/persons';

const getAll = () => {
  const response = axios.get(dbURL);
  return response.then(response => response.data)
}

const create = newPerson => {
  const response = axios.post(dbURL, newPerson);
  return response.then(response => response.data);
}

const update = person => {
  const response = axios.put(`${dbURL}/${person.id}`, person);
  return response.then(response => response.data);
}

const deleteRow = id => {
  return axios.delete(`${dbURL}/${id}`)
}

const exports = {getAll, create, update, deleteRow};

export default exports;


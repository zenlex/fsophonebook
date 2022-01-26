import axios from 'axios';

const baseURL = '/api/notes';

const getAll = () => {
  const response = axios.get(baseURL);
  return response.then(response => response.data)
}

const create = newPerson => {
  const response = axios.post(baseURL, newPerson);
  return response.then(response => response.data);
}

const update = person => {
  const response = axios.put(`${baseURL}/${person.id}`, person);
  return response.then(response => response.data);
}

const deleteRow = id => {
  return axios.delete(`${baseURL}/${id}`)
}

const exports = {getAll, create, update, deleteRow};

export default exports;


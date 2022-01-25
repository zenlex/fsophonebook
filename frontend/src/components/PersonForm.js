import React from "react"

const PersonForm = ({ onSubmit, name, num, onNameChange, onNumChange }) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={name} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={num} onChange={onNumChange} />
    </div>
    <div>
      <button type="submit" >add</button>
    </div>
  </form>
)

export default PersonForm;
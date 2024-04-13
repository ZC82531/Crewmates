import './App.css';
import { createClient } from '@supabase/supabase-js';
import React, { useState, useEffect } from 'react'; // Import useState and useEffect

const supabaseUrl = 'https://klyscrccqlqhnjplutfy.supabase.co';
const supabaseKey = process.env.API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  const [crewmates, setCrewmates] = useState([]); // Declare crewmates state variable
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [iq, setIQ] = useState('');
  const [selectedCrewmate, setSelectedCrewmate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("Crewmates").select("*");
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setCrewmates(data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []); // Empty dependency array to fetch data only once on component mount

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'name') {
      setName(value);
    } else if (id === 'age') {
      setAge(value);
    } else if (id === 'iq') {
      setIQ(value);
    }
  };

  const handleEdit = (crewmate) => {
    setSelectedCrewmate(crewmate);
    setName(crewmate.name);
    setAge(crewmate.age);
    setIQ(crewmate.iq);
  };

  async function insertData() {
    try {
      if (selectedCrewmate) {
        const { data, error } = await supabase.from("Crewmates").update({ name, age, iq }).eq('id', selectedCrewmate.id);
        if (error) {
          console.error('Error updating data:', error);
        } else {
          console.log('Data successfully updated:', data);
        }
      } else {
        const { data, error } = await supabase.from("Crewmates").insert([{ name, age, iq }]);
        if (error) {
          console.error('Error inserting data:', error);
        } else {
          console.log('Data successfully inserted:', data);
        }
      }
      // Fetch the updated data
      const { data: newData, error: fetchError } = await supabase.from("Crewmates").select("*");
      if (fetchError) {
        console.error('Error fetching data:', fetchError);
      } else {
        // Update the state with the new data
        setCrewmates(newData);
        // Clear input fields and reset selected crewmate after successful insertion or update
        setName('');
        setAge('');
        setIQ('');
        setSelectedCrewmate(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("Crewmates").delete().eq('id', id);
      if (error) {
        console.error('Error deleting data:', error);
      } else {
        console.log('Data successfully deleted');
        // Trigger re-fetching data after deletion
        const { data: newData, error: fetchError } = await supabase.from("Crewmates").select("*");
        if (fetchError) {
          console.error('Error fetching data:', fetchError);
        } else {
          setCrewmates(newData);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {/* Input fields and submit button */}
      <div className="form-container">
        <label>
          Name:
          <input type="text" id="name" value={name} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Age:
          <input type="text" id="age" value={age} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          IQ:
          <input type="text" id="iq" value={iq} onChange={handleInputChange} />
        </label>
        <br />
        <button onClick={insertData}>
          {selectedCrewmate ? 'Update' : 'Submit'}
        </button>
      </div>

      {/* Render the crewmates data */}
      <div className="container">
        {crewmates.map((crewmate, index) => (
          <div key={index} className="box">
            <p className="data">Name: {crewmate.name}</p>
            <p className="data">Age: {crewmate.age}</p>
            <p className="data">IQ: {crewmate.iq}</p>
            {/* Edit button */}
            <button className="edit-button" onClick={() => handleEdit(crewmate)}>Edit</button>
            {/* Delete button */}
            <button className="delete-button" onClick={() => handleDelete(crewmate.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

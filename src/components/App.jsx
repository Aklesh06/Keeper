import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);

  const fetchNote = async () => {
    try{
      const response = await axios.get('http://localhost:5000/notes');
      console.log(response.data);
      setNotes(response.data)
    }
    catch(error){
      console.error('Error fetching data:',error);
    }
  }
  
  fetchNote()

  function addNote() {
    fetchNote();
  }

  const removeNote = async (id) => {
    try{
      const response = await axios.delete(`http://localhost:5000/notes/${id}`);
      fetchNote();
    }
    catch(error){
      console.error('Error deleteing data:',error);
    }
  }

  function deleteNote(id) {
    removeNote(id)
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem) => {
        return (
          <Note
            key={noteItem._id}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;

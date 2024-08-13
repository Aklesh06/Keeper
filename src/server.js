import mongoose,{ Schema } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import env from "dotenv";

env.config();
const app = express();
const port = process.env.port || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.databseLink).then(() => {
    console.log("Connected to Keeper in mongodb")
}).catch((err) => {
    console.log("Connection Error",err);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const noteSchema = new mongoose.Schema({
    title:String,
    content:String,
},{collection:'Note',
   versionKey: false 
});

const Note = mongoose.model("Note",noteSchema);

app.get('/notes', async (req,res) => {
    try{
        const noteArr = await Note.find();
        res.json(noteArr);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
})

app.post('/notes',async ( req, res) => {
    const { title , content } = req.body;
    const newNote = new Note({
        title,
        content
    });
    try{
        const saveNote = await newNote.save();
        res.status(201).json(saveNote);
    }
    catch(error){ 
        res.status(500).json({message: error.message});
    }
});

app.delete('/notes/:id',async (req,res) => {
    const { id } = req.params;
    try{
        const deleteNote = await Note.findByIdAndDelete(id);
        if(!deleteNote){
            return res.status(404),json({message:"Note not found"});
        }

        res.json({message:"Note found successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
})

app.listen(port , () => {
    console.log(`Server running on port ${port}`);
})
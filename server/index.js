import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import todomodel from './Models/Todo.js'
import dotenv from 'dotenv'
dotenv.config()


const app = express()
app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL||"http://localhost:5173", // Allow frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Add all required methods
    credentials: true // Allow cookies if needed
}));


app.get('/get', (req, res) => {
    todomodel.find()
    .then(result => {
        console.log(result);  // Log to check data
        result.forEach(task => {
            if (task.task.length > 30) {
                task.task = task.task.substring(0, 30) + '...';
            }
        });
        res.json(result);
    })
    .catch(err => res.json(err));
});



app.put('/update/:id', (req, res) => {  // Make sure ':id' is in the route path
    const { id } = req.params;  // Get the id from the URL
    const { task, done } = req.body;  // Get task and done from request body

    // Find the todo by id and update its task and done status
    todomodel.findByIdAndUpdate(id, { task, done }, { new: true })  // { new: true } ensures it returns the updated document
        .then(result => res.json(result))  // Send the updated task as a response
        .catch(err => res.status(400).json({ error: err.message }));  // Handle error
});


app.delete('/delete/:id', (req, res) => {  // Corrected route path
    const { id } = req.params;
    todomodel.findByIdAndDelete({ _id: id })
        .then(result => res.json(result))
        .catch(err => res.json(err))
});


app.post('/add',(req,res)=>{
    const task=req.body.task;
    todomodel.create({
        task:task
    }).then((result)=>{
        res.json(result)
    }).catch((err)=>{
        res.json(err)
    })
})



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));
})




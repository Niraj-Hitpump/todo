import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

const Create = ({ setTodos, todos }) => {
    const [task, setTask] = useState("");
    const [loading, setLoading] = useState(false);

    // Function to handle adding a task
    const handleAdd = () => {
        if (!task.trim()) {
            toast.error("Task cannot be empty");
            return;
        }

        // Truncate task if longer than 30 characters
        const truncatedTask = task.length > 30 ? task.substring(0, 30) + '...' : task;

        setLoading(true);

        axios
            .post("http://localhost:4000/add", { task: truncatedTask })
            .then((res) => {
                setTodos([...todos, { _id: res.data._id, task: truncatedTask, done: false }]);
                setTask(""); // Clear input after adding
                toast.success("Todo added successfully");
            })
            .catch((err) => {
                toast.error("Error adding todo:", err);
            })
            .finally(() => setLoading(false));
    };

    // Function to handle deleting a task
    const handleDelete = (id) => {
        setLoading(true);  // Start loading during the delete operation
        axios
            .delete(`http://localhost:4000/delete/${id}`)
            .then((res) => {
                if (res.status === 200) {
                    setTodos((prevTodos) =>
                        prevTodos.filter((todo) => todo._id !== id)
                    );
                    toast.success("Todo deleted successfully");
                } else {
                    toast.error("Failed to delete todo: Unexpected response", res);
                }
            })
            .catch((err) => {
                toast.error("Error deleting todo:", err);
                toast.error("Failed to delete todo. Please try again.");
            })
            .finally(() => setLoading(false));  // Stop loading after operation
    };

    // Function to handle updating a task
 const handleUpdate = (id) => {
    if (!task.trim()) {
        toast.error("Task cannot be empty");
        return;
    }

    setLoading(true);
    axios
        .put(`http://localhost:4000/update/${id}`, { task, done: false })
        .then((res) => {
            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo._id === id ? { ...todo, task: res.data.task, done: res.data.done } : todo
                )
            );
            toast.success("Todo updated successfully");
            setTask("");  // Clear input field after successful update
        })
        .catch((err) => {
            // Handle error more specifically if needed
            console.error("Error updating todo:", err);
            toast.error("Failed to update todo. Please try again.");
        })
        .finally(() => {
            setLoading(false);  // Ensure loading is stopped
        });
};

    return (
        <div>
            <input
                type="text"
                className="create_input"
                placeholder="Add a task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                disabled={loading}  // Disable input while loading
            />
            <button 
                type="button" 
                className="create_button" 
                onClick={handleAdd} 
                disabled={loading} // Disable button during loading
            >
                {loading ? "Adding..." : "Add"}
            </button>
        </div>
    );
};

export default Create;

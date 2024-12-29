import  { useEffect, useState } from "react";
import Create from "./Create";
import axios from "axios";
import {
    BsCircleFill,
    BsFillCheckCircleFill,
    BsFillTrashFill,
} from "react-icons/bs";

const Home = () => {
    const [todos, setTodos] = useState([]);

    // Fetch todos on component mount
    useEffect(() => {
        axios
            .get("https://todobackend-tan.vercel.app//get") // Corrected base URL
            .then((res) => {
                setTodos(res.data);
            })
            .catch((err) => {
                console.error("Error fetching todos:", err);
            });
    }, []);

    // Toggle the `done` status of a todo
    const handleEdit = (id) => {
        axios
            .put(`https://todobackend-tan.vercel.app//update/${id}`) // Pass `id` in URL
            .then((res) => {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo._id === id ? { ...todo, done: !todo.done } : todo
                    )
                );
            })
            .catch((err) => {
                console.error("Error updating todo:", err);
            });
    };

    // Delete a todo
    const handleDelete = (id) => {
        axios
            .delete(`https://todobackend-tan.vercel.app/delete/${id}`) // Corrected route
            .then((res) => {
                setTodos((prevTodos) =>
                    prevTodos.filter((todo) => todo._id !== id)
                );
            })
            .catch((err) => {
                console.error("Error deleting todo:", err);
            });
    };

    return (
        <div className="home">
            <h2>ToDo List</h2>
            <Create setTodos={setTodos} todos={todos} />
            {todos.length === 0 ? (
                <div>
                    <h2>No Records</h2>
                </div>
            ) : (
                todos.map((todo, index) => (
                    <div key={index} className="task">
                        <div
                            className="checkbox"
                            onClick={() => handleEdit(todo._id)}
                        >
                            {todo.done ? (
                                <BsFillCheckCircleFill className="icon" />
                            ) : (
                                <BsCircleFill className="icon" />
                            )}
                            <p className={todo.done ? "line-through" : ""}>
                                {todo.task}
                            </p>
                        </div>
                        <div>
                            <span>
                                <BsFillTrashFill
                                    className="icon"
                                    onClick={() => handleDelete(todo._id)}
                                />
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Home;

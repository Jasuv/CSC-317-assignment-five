const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample data
let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
  { id: 2, task: "Build a REST API", completed: false }
];

/*
Question 1: Add a "Priority" Field to the To-Do API
example usage:
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"task": "Complete Express assignment", "priority": "high"}'
*/
app.post('/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: false,
    priority: req.body.priority || "medium"
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

/* OLD GET endpoint, please look at Q3
// GET /todos - Retrieve all to-do items
app.get('/todos', (req, res) => {
  res.json(todos);
});
*/

/* 
Question 3: Retrieve all to-do items or filter by completed status.
after completing this part, you need to comment out the GET end point 
already implemented here to test this new GET endpoint!
example usage:
curl http://localhost:3000/todos?completed=true
curl http://localhost:3000/todos?completed=false
*/
app.get('/todos', (req, res) => {
  const completed = req.query.completed;
  if (completed !== undefined) {
    return res.json(todos.filter(todo => todo.completed === (completed === "true")));
  }
  res.json(todos);
});

/* OLD POST endpoint, please look at Q1
// POST /todos - Add a new to-do item
app.post('/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});
*/

// PUT /todos/:id - Update an existing to-do item
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).send("To-Do item not found");
  }
  todo.task = req.body.task || todo.task;
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
  res.json(todo);
});

/*
Question 2: Implement a "Complete All" Endpoint
example usage: 
curl -X PUT http://localhost:3000/todos/complete-all
*/
app.put('/todos/complete-all', (req, res) => {
  todos.forEach(item=> {item.completed = true})
  if (!todos) {
    return res.status(404).send("To-Do item not found");
  }
  res.json(todos);
});

// DELETE /todos/:id - Delete a to-do item
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).send("To-Do item not found");
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

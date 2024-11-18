const express = require('express');
const sqlite3 = require('sqlite3')
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Open SQLite db
const db = new sqlite3.Database('./todos.db');

// POST /todos - Add a new to-do
app.post('/todos', (req, res) => {
  const id = this.lastID + 1;
  const task = req.body.task;
  const priority = req.body.priority || 'medium';
  const completed = 'false';
  db.run(
    'INSERT INTO todos (id, task, completed, priority) VALUES (?, ?, ?, ?)', 
    [id, task, completed, priority],
    function() {
      res.status(201).json({ id, task, completed, priority });
    }
  );
});

// GET /todos - Get all to-dos
app.get('/todos', (req, res) => {
  const completed = req.query.completed;
  let sql = 'SELECT * FROM todos';
  if (completed !== undefined) {
    console.log("AAAAAAAAAAAA");
    sql += ` WHERE completed = '${completed}'`;
  }
  db.all(sql, [], (err, rows) => {
    res.json(rows);
  });
});

// PUT /todos/:id - Update a to-do by ID
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const task = req.body.task;
  const completed = req.body.completed ? 'true' : 'false';
  const priority = req.body.priority;
  db.run(
    'UPDATE todos SET task = ?, completed = ?, priority = ? WHERE id = ?',
    [task, completed, priority, id],
    function() {
      res.status(201).json({ id, task, completed, priority });
    }
  );
});

// DELETE /todos/:id - Delete a to-do by ID
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM todos WHERE id = ?', id, function() {
    res.status(204).send();
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
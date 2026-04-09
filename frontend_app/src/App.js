import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState('');
  const [cls, setCls] = useState('');
  const [task, setTask] = useState('');
  const [studentId, setStudentId] = useState('');
  const [editId, setEditId] = useState(null); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');// ✅ Added

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Login
  const login = async () => {
  try {
    const res = await axios.post('http://localhost:5000/login', {
      email,
      password
    });

    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  } catch (err) {
    alert('Invalid credentials');
  }
};

  // Students
  const loadStudents = async () => {
    const res = await axios.get('http://localhost:5000/students', headers);
    setStudents(res.data);
  };

  const addStudent = async () => {
    await axios.post(
      'http://localhost:5000/students',
      { name, class: cls },
      headers
    );
    setName('');
    setCls('');
    loadStudents();
  };

  const deleteStudent = async (id) => {
    await axios.delete(`http://localhost:5000/students/${id}`, headers);
    loadStudents();
  };

  const updateStudent = async (id) => {
    await axios.put(
      `http://localhost:5000/students/${id}`,
      { name, class: cls },
      headers
    );
    setEditId(null);
    setName('');
    setCls('');
    loadStudents();
  };

  // Tasks
  const loadTasks = async () => {
    const res = await axios.get('http://localhost:5000/tasks', headers);
    setTasks(res.data);
  };

  const addTask = async () => {
    await axios.post(
      'http://localhost:5000/tasks',
      { title: task, studentId },
      headers
    );
    setTask('');
    setStudentId('');
    loadTasks();
  };

  const toggleTask = async (t) => {
    await axios.put(
      `http://localhost:5000/tasks/${t._id}`,
      { completed: !t.completed },
      headers
    );
    loadTasks();
  };

  // If not logged in
  if (!token) {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', margin: '10px auto', padding: '8px' }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', margin: '10px auto', padding: '8px' }}
      />

      <button onClick={login} style={{ padding: '8px 20px' }}>
        Login
      </button>
    </div>
  );
}

  return (
    <div style={{ padding: '20px' }}>

      {/* Logout */}
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.reload();
      }}>
        Logout
      </button>

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>

        {/* Students */}
        <div>
          <h2>Students</h2>
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Class" value={cls} onChange={e => setCls(e.target.value)} />
          <button onClick={addStudent}>Add</button>
          <button onClick={loadStudents}>Load</button>

          {students.map(s => (
            <div key={s._id} style={{ marginBottom: '10px' }}>
              
              {editId === s._id ? (
                <>
                  <input value={name} onChange={e => setName(e.target.value)} />
                  <input value={cls} onChange={e => setCls(e.target.value)} />
                  <button onClick={() => updateStudent(s._id)}>Save</button>
                </>
              ) : (
                <>
                  {s.name} ({s.class})
                  <button onClick={() => {
                    setEditId(s._id);
                    setName(s.name);
                    setCls(s.class);
                  }}>
                    Edit
                  </button>
                </>
              )}

              <button onClick={() => deleteStudent(s._id)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Tasks */}
        <div>
          <h2>Tasks</h2>
          <input placeholder="Task" value={task} onChange={e => setTask(e.target.value)} />
          <input placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
          <button onClick={addTask}>Assign</button>
          <button onClick={loadTasks}>Load</button>

          {tasks.map(t => (
            <div key={t._id} style={{ marginBottom: '10px' }}>
              {t.title} - {t.completed ? 'Done' : 'Pending'}
              <button onClick={() => toggleTask(t)}>
                {t.completed ? 'Mark Pending' : 'Mark Done'}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations';
import * as mutations from './graphql/mutations';
import { listTodos } from './graphql/queries';
import * as queries from './graphql/queries';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

let updating = false;

const initialState = { name: '', description: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
	if(updating === true){
		updating = false;
		switchBack();
	}  
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }
  
  async function deleteATodo(idNum) {  
    try {
		const todoDetails = {
			id: idNum,
		};
	  const deletedTodo = await API.graphql({ query: mutations.deleteTodo, variables: {input: todoDetails}});
	  fetchTodos();
    } catch (err) {
      console.log('error deleting todo:', err)
    }
  }
  
  
    const switchBack = function(){
	document.getElementById("main-btn").innerHTML = "Create A Todo";
	document.getElementById("instruct").innerHTML = "";
	fetchTodos();
  }
  
  
  
  const updateATodo = function (theId, newName, newDescription) {
	updating = true;
	document.getElementById("main-btn").innerHTML = "UPDATE";
	document.getElementById("instruct").innerHTML = "Here's what you're updating in the boxes below <br />Name : "+newName+"<br /> Description : "+newDescription;
	deleteATodo(theId);
	fetchTodos();
  }
  
  
  
  
  function testme(){
	  console.log("testme");
  }
  testme()

  return (
    <div style={styles.container}>
      <h2>Create Things</h2>
	  <h3 id="instruct">~</h3>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <Button onClick={addTodo}>Create Something</Button>
      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
			<p style={styles.todoDescription}>{todo.id}</p>
			<Button id={todo.id} onClick={() => updateATodo(todo.id, todo.name, todo.description)}>Update Me</Button>
			<Button id={todo.id} onClick={() => deleteATodo(todo.id)}>Delete Me</Button>
          </div>
        ))
      }
    </div>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default App
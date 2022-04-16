/* src/App.js */
import React, { useEffect, useState } from 'react'
import ResultPage from './ResultPage.js';
import {root, container, goToCMS, goToResult}  from './index.js';
import { createRoot } from 'react-dom/client';
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
	//console.log({ ...formState});
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
	  fetchTodos();
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
  
  const goResult = function(){
	  goToResult();
  }
  
  
  function testme(){
	  console.log("testme");
  }
  testme()
 
	function createMarkup(desc) {
		if(!desc){return}
		//console.log(desc);
		return {__html: desc.replace(/(?:\r\n|\r|\n)/g, '<br>').substring(0, 100)+"..."}
	}
	
	function formatDate(updatedAt){
		var date = new Date(updatedAt);
		return(((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + ' : ' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + ' : ' + date.getFullYear());
	}

  return (
  <>
	<div id="nav" className="container-fluid">
		<h2>Container Management</h2>
		<p>Create, Edit an or Delete your Titles and Content Below</p>
		<p>Click the Preview Button to View Your Changes on the Live Site</p>
		<Button id="preView" onClick={goResult}>PREVIEW</Button>
	</div>
    <div style={styles.container}>
      <h2 id="create-h2">Create Things</h2>
	  <h3 id="instruct">~</h3>
	<p id="input-cont">  
      <textarea
		cols="20"
        onChange={event => setInput('name', event.target.value)}
		id="textAreaExample1"
		className="form-control"
        value={formState.name}
        placeholder="Title"
      />
      <textarea
		cols="50"
        onChange={event => setInput('description', event.target.value)}
        className="form-control"
        value={formState.description}
        placeholder="Content"
      />
      <Button id="main-btn" className="btn btn-success" onClick={addTodo}>Create Something</Button>
	 </p> 
      <Container>
			  <Row xs={1} md={4} className="g-4">
			  {
				todos.map((todo, index) => (
				  <Col key={todo.name ? todo.name : index}>
					<Card className="crudBox">
						<img className="card-img-top" src="./default.jpg" alt="Card image" />
						<Card.Body>
							<Card.Title>{todo.name}</Card.Title>
							<Card.Text className="small-date">{formatDate(todo.updatedAt)}</Card.Text>
							<div dangerouslySetInnerHTML={createMarkup(todo.description)} />
							<Card.Text className="hide">{todo.id}</Card.Text>
							
							<Button id={todo.id} onClick={() => deleteATodo(todo.id)}>Delete Me</Button>
							<Button id={todo.id} onClick={() => updateATodo(todo.id, todo.name, todo.description)}>Update Me</Button>
						</Card.Body>
					</Card>
				</Col>
				))
			  }
			  </Row>
			</Container>
    </div>< />
  )
}

const styles = {
  //container: { width: "1500px", margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'left', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18, marginLeft: 5, marginRight: 5 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 10 },
  Button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 30px' }
}

export default App
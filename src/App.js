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
		console.log("useEffect runs");
		try {
			const todoData = await API.graphql(graphqlOperation(listTodos))
			const todos = todoData.data.listTodos.items
			setTodos(todos)
		} catch (err) { console.log('error fetching todos') }
	}

	async function addTodo() {
		formState.name = document.getElementById("title-content").value
		formState.description = document.getElementById("main-content").value
		try {
			if (!formState.name || !formState.description) return
				const todo = { ...formState }
				setTodos([...todos, todo])
				setFormState(initialState)
				await API.graphql(graphqlOperation(createTodo, {input: todo}))
				fetchTodos();
				document.getElementById("title-content").value = "";
				document.getElementById("main-content").value = "";
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

	let currId;
	const setUpUpdate = function(theID, theName, theDesc){
		document.getElementById("title-content").value = theName;
		document.getElementById("main-content").value = theDesc;
		currId = theID;
		document.getElementById("main-btn").style.display = 'none';
		document.getElementById("update-btn").style.display = 'inline-block';
	}
	
	async function updateATodo () {
		try {
			const updateTodoDetails = {
				id: currId,
				name: document.getElementById("title-content").value,
				description: document.getElementById("main-content").value
			};
			const updatedTodo = await API.graphql({ query: mutations.updateTodo, variables: {input: updateTodoDetails}});
			document.getElementById("title-content").value = "";
			document.getElementById("main-content").value = "";
			document.getElementById("main-btn").style.display = 'inline-block';
			document.getElementById("update-btn").style.display = 'none';
			fetchTodos();
		} catch (err) {
			console.log("error updating todo")
		}
	}
  
	const goResult = function(){
		goToResult();
	}
  
  
	function testme(){
		console.log("testme");
	}
	testme();
 
	function createMarkup(desc) {
		if(!desc){return}
		return {__html: desc.replace(/(?:\r\n|\r|\n)/g, '<br>').substring(0, 100)+"..."}
	}
	
	function formatDate(updatedAt){
		var date = new Date(updatedAt);
		return(((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + ' : ' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + ' : ' + date.getFullYear());
	}
	
	function getSelectedBold(){
		let text = document.getElementById("main-content").value; 
		document.getElementById("main-content").value = text.replace(window.getSelection().toString(),"<b>"+window.getSelection().toString()+"</b>");
	}
	function getSelectedItalic(){
		let text = document.getElementById("main-content").value; 
		document.getElementById("main-content").value = text.replace(window.getSelection().toString(),"<i>"+window.getSelection().toString()+"</i>");
	}
	function getSelectedLink(){
		let text = document.getElementById("main-content").value; 
		document.getElementById("main-content").value = text.replace(window.getSelection().toString(),"<a href='REPLACE THIS TEXT WITH YOUR LINK' target='blank'>"+window.getSelection().toString()+"</a> ~");
	}
	
	
	return (
		<>
			<div id="nav" className="container-fluid">
			<h2>Container Management</h2>
			<p>Create, Update and or Delete your Titles and Content Below</p>
			<p>Click the Preview Button to View Your Changes on the Live Site</p>
			<Button id="preView" onClick={goResult}>PREVIEW</Button>
			</div>
			
			<div>
			<h2 id="create-h2">Create an Article</h2>
			<div id="input-cont">  
				<textarea
					cols="20"
					id="title-content"
					className="form-control"
					placeholder="Title"
				/>
				<textarea
					cols="50"
					id="main-content"
					className="form-control"
					placeholder="Content"
				/>
			</div> 

			<button id="main-btn" type="button" className="btn btn-success" onClick={addTodo}>Create Article</button>
			<Button id="update-btn" type="button" onClick={updateATodo}>Update Article</Button>
			<div className="btn-group">
				<button type="button" className="btn btn-primary" onClick={getSelectedBold}>B</button>
				<button type="button" className="btn btn-primary" onClick={getSelectedItalic}>I</button>
				<button type="button" className="btn btn-primary" onClick={getSelectedLink}>Link</button>
			</div>

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
									<Button id={todo.id} onClick={() => setUpUpdate(todo.id, todo.name, todo.description)}>Update Me</Button>
								</Card.Body>
							</Card>
						</Col>
					)
					)
					}
				</Row>
			</Container>
			</div>
		< />
	)
}

export default App
import React, { useEffect, useState } from 'react'
import {root, container, goToCMS, goToResult}  from './index.js';
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




const ResultPage = () => {
	
	const [todos, setTodos] = useState([])
	
	useEffect(() => {
		fetchTodos()
	}, [])	

	async function fetchTodos() {
		try {
			const todoData = await API.graphql(graphqlOperation(listTodos))
			const todos = todoData.data.listTodos.items
			setTodos(todos)
		} catch (err) { console.log('error fetching todos') }
	}
	
	function testRenders(){
	  console.log("testRenders");
  }
  testRenders()

	return (
	<>
		<div id="nav" className="container-fluid">
			<h2>Container Results Page</h2>
			<p>This is How Your Card Page Will Look</p>
			<p>Click the Back to Container Management Button to Return to Your Container Management Page</p>
			<Button id="preView" onClick={goToCMS}>Back to Container Management</Button>
		</div>
		<h2 id="create-h2">Cards You Have Created</h2>
		<div>
			<Container>
					<Row xs={1} md={4} className="g-4">
						{
							todos.map((todo, index) => (
								<Col key={todo.name ? todo.name : index}>
									<Card className="crudBox">
										<img className="card-img-top" src="./default.jpg" alt="Card image" />
										<Card.Body>
											<Card.Title>{todo.name}</Card.Title>
											<Card.Text>{todo.description}</Card.Text>
											<Card.Text><Button>Read More</Button></Card.Text>
											<Card.Text className="hide">{todo.id}</Card.Text>
										</Card.Body>
									</Card>
								</Col>
							))
						}
					</Row>
			</Container>
		</div>
	< />
	)
}
export default ResultPage
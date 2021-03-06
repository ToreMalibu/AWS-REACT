import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import './index.css';
import ResultPage from './ResultPage.js';
import GoToArticle from './GoArticle.js';
import App from './App';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Amplify from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);


export const container = document.getElementById('root');
export const root = createRoot(container);

export const goToCMS = function(){
	root.render(<App />);
}
goToCMS();

export const goToResult = function(){
	root.render(<ResultPage />);
}



export const buildPage = function(t, d, c){
	function createMarkup(desc) {
		if(!desc){return}
		return {__html: desc.replace(/(?:\r\n|\r|\n)/g, '<br>')}
	}
	const Fraf = function(){
		  return(
			<>
				<div id="nav" className="container-fluid">
					<h2>Container Management Page Built! &#10004;</h2>
					<p>This would be replaced by a navigation area.</p>
					<p>Click the Back to Container Management Button to Return to Your Container Management Page</p>
					<Button id="preView" onClick={goToCMS}>Back to Container Management</Button>
					<Button id="CMS" onClick={goToResult}>Back to the Preview Page</Button>
				</div>
				<h2 id="create-h2">Below is the Page You Have Created</h2>
				<div id="page" className="container">
					<h1 id="title">{t}</h1>
					<h5 id="theDate">{d}</h5>
					<div id="content" dangerouslySetInnerHTML={createMarkup(c)} />
				</div>
			</>
		  );
	}
	root.render(<Fraf />);
}
/*
<p dangerouslySetInnerHTML={createMarkup(c)} />
<div dangerouslySetInnerHTML={createMarkup(todo.description)} />

function createMarkup(desc) {
		if(!desc){return}
		//console.log(desc);
		return {__html: desc.replace(/(?:\r\n|\r|\n)/g, '<br>').substring(0, 100)+"..."}
	}



*/

/*
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App tab="home" />
}
root.render(<AppWithCallbackAfterRender />);
*/


//export const goArticle = function(t, d, c ){
	//root.render(<GoToArticle />);
//}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ResultPage from './ResultPage.js';
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
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

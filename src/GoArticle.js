import React, { useEffect, useState } from 'react'
import {root, container}  from './index.js';

const GoToArticle = () => {
	//alert(t);
	//alert(d);
	//alert(c);
	
	
	
	const showArticle = () => {
		return(
		<>
			<div id="title">t</div>
			<div id="theDate">d</div>
			<div id="content">c</div>
		</>
		)
	}
	root.render(<showArticle />);
}

export default GoToArticle
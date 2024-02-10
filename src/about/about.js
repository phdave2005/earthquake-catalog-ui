import React, { Component } from 'react'
import './about.css'
import '../App.css'
import dvp from './dvp_photo.jpg'
import TEXT_MAP from './translation-map.js'

class About extends Component {
  	constructor() {
		super();
		const languageUsed = window?.localStorage?.getItem("language-used") || 'en';
		const textUsed = TEXT_MAP[languageUsed];
		this.state = {
			text: {
				heading: textUsed.heading,
				content: textUsed.content
			}
		}
	}

  	render() {
		return ( 
			<main id="about">
				<section className="main-wrapper">
					<h1>{this.state.text.heading}</h1>
					<div>
						<img src={dvp} alt="DVP" />
						<p dangerouslySetInnerHTML={{__html: '&emsp;' + this.state.text.content}}></p>
					</div>
				</section>
			</main>
		);
  	}
}

export default About;

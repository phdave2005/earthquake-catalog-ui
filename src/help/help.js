import React, { Component } from 'react'
import './help.css'
import '../App.css'
import TEXT_MAP from './translation-map.js'

class Help extends Component {
      constructor() {
        super();
        const languageUsed = window?.localStorage?.getItem("language-used") || 'en';
        const textUsed = TEXT_MAP[languageUsed];
        this.state = {
            text: {
                heading: textUsed.heading,
                subheading: textUsed.subheading,
                content: textUsed.content
            }
        }
    }

      render() {
        return (
            <main id="help">
                <section className="main-wrapper">
                    <h2>{this.state.text.heading}</h2>
                    <h3 dangerouslySetInnerHTML={{__html: '&emsp;' + this.state.text.subheading}}></h3>
                    <ul>
                    {
                        this.state.text.content.map(content => {
                            return (
                                <li key={'c' + content.id} dangerouslySetInnerHTML={{__html: content.text}}></li>
                            );
                        })
                    }
                    </ul>
                </section>
            </main>
        );
      }
}

export default Help;

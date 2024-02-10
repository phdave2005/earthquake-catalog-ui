import React, { Component } from 'react'
import './user-settings.css'
import '../App.css';
import LANGUAGE_INFO from './translation-map.js'
import LabelElement from '../elements/label/label-element.js'

class Settings extends Component {
    constructor() {
        super();
        this.languageUsed = 'en';
        this.state = {
            hasStorage: false,
            storageEvent: {
                text: '',
                cl: 'DN'
            },
            text: {
                title: '',
                label: {
                    language: '',
                    download: ''
                },
                button: ''
            },
            view: {
                storage: {
                    cl: 'DN',
                    text: ''
                },
                nostorage: {
                    cl: 'DN',
                    text: ''
                }
            }
        }
    }

    componentDidMount() {
        if (this.detectLocalStorage()) {
            this.languageUsed = window.localStorage.getItem("language-used") || 'en';
            this.setSettingsState();
            document.getElementById("language-used").value = this.languageUsed;
            document.getElementById("download").checked = window.localStorage?.getItem("download") === '1';
        }
    }

    setSettingsState() {
        const textUsed = LANGUAGE_INFO.TEXT_MAP[this.languageUsed];
        this.setState({
            hasStorage: true,
            text: {
                label: {
                    language: textUsed.label.language,
                    download: textUsed.label.download
                },
                button: textUsed.button
            },
            view: {
                storage: {
                    cl: '',
                    text: textUsed.heading
                },
                nostorage: {
                    cl: 'DN',
                    text: textUsed.noStorage
                }
            }
        });
    }

      detectLocalStorage() {
        if ('hasStorageAccess' in document) {
            return true;
        } else {
            return this.detectLocalStorageLegacy();
        }
    }

    detectLocalStorageLegacy = () => {
        try {
            var value = '1',
                testkey = 'aaa',
                storage = window.localStorage;
            storage.setItem(testkey, value);
            storage.removeItem(testkey);
            return true;
        } catch (e) {
            return false;
        }
    }

    updateLocalStorage = () => {
        const set = document.getElementsByClassName("field");
        const storage = window.localStorage;
        const storageJSONInitial = JSON.stringify(storage);
        let i, val, storageJSONFinal,
            textUsed = LANGUAGE_INFO.TEXT_MAP[this.languageUsed]
        for(i in set) {
            if (set[i]?.nodeName) {
                val = set[i].value;
                if (set[i].type === 'checkbox') {
                    val = set[i].checked ? 1 : 0;
                }
                storage.setItem(set[i].id, val);
                if (set[i].id === 'language-used') {
                    this.languageUsed = set[i].value;
                    this.setSettingsState();
                    let elem = document.getElementById("about");
                    if (!!elem) {
                        elem.innerHTML = LANGUAGE_INFO.TEXT_MAP[this.languageUsed].about.dvp;
                    }
                    elem = document.getElementById("about-earthquake");
                    if (!!elem) {
                        elem.innerHTML = LANGUAGE_INFO.TEXT_MAP[this.languageUsed].about.cod;
                    }
                }
            }
        }
        storageJSONFinal = JSON.stringify(localStorage);
        textUsed = LANGUAGE_INFO.TEXT_MAP[this.languageUsed];
        this.setState({
            storageEvent: (storageJSONInitial !== storageJSONFinal) ? {
                text: textUsed.storageEvent.success,
                cl: ' success'
            } : {
                text: textUsed.storageEvent.fail,
                cl: ' fail'
            }
        });
        setTimeout(() => {
            this.setState({
                storageEvent: (storageJSONInitial !== storageJSONFinal) ? {
                    text: '',
                    cl: ' DN'
                } : {
                    text: '',
                    cl: ' DN'
                }
            });
        }, 5000);
    }

    languageOptions() {
        let options = [],
            i = 0,
            selectedLanguage = window?.localStorage?.getItem("language-used") || 'en',
            src = LANGUAGE_INFO.LANGUAGES[selectedLanguage],
            len = src.length;
        for(; i < len; i++) {
            options.push(<option key={'l' + i} value={src[i].value}>{src[i].label}</option>);
        }
        return options;
    }

    render() {
        return ( 
            <main id="settings">
                <section className="main-wrapper">
                    <p className={"dialog " + this.state.storageEvent.cl} data-identifier="info">{this.state.storageEvent.text}</p>
                    <div className={this.state.view.storage.cl}>
                        <h1 dangerouslySetInnerHTML={{__html: this.state.view.storage.text}}></h1>
                        <div className="flex-field-half-wrapper MT32">
                            <div className="flex-field half">
                                <select id="language-used" className="field">
                                    {this.languageOptions()}
                                </select>
                                <LabelElement labelFor={'language-used'} text={this.state.text.label.language} />
                            </div>
                            <div className="flex-field half">
                                <input id="download" className="field" type="checkbox" />
                                <LabelElement labelFor={'download'} text={this.state.text.label.download} tooltip={false} />
                            </div>
                        </div>
                        <button type="button" className="primary" onClick={this.updateLocalStorage}>{this.state.text.button}</button>
                    </div>
                    <div className={this.state.view.nostorage.cl}>
                        <h1 dangerouslySetInnerHTML={{__html: this.state.view.nostorage.text}}></h1>
                    </div>
                </section>
            </main>
        );
    }
}

export default Settings;

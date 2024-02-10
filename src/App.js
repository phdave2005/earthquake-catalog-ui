import React, { useState } from 'react'
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons'
import Home from './home/home.js'
import Help from './help/help.js'
import About from './about/about.js'
import HelpIcon from './elements/help-icon/help-icon.js'
import Settings from './settings/user-settings.js'
import SettingsToggle from './elements/settings/settings-toggle.js'

const App = () => {
    const textMap = {
        en: {
            about: 'About DVP',
            aboutEarthquake: 'About Earthquake Catalog'
        },
        es: {
            about: 'Acerca de DVP',
            aboutEarthquake: 'Acerca del catálogo de terremotos'
        },
        fr: {
            about: 'À propos DVP',
            aboutEarthquake: 'À propos du catalogue des tremblements de terre'
        },
        it: {
            about: 'Di DVP',
            aboutEarthquake: 'Informazioni sul catalogo dei terremoti'
        }
    };
    const language =  window?.localStorage?.getItem("language-used") || 'en';
    const [state, setState] = useState({
        about: textMap[language].about,
        aboutEarthquake: textMap[language].aboutEarthquake
    });
    return (
        <BrowserRouter>
            <div className="App">
                <header className="flex-align-top">
                    <div className="ML4">
                        <h1 className="M0 P0">
                            <span>Quake Catalog UI</span>
                        </h1>
                    </div>
                    <div className="action-container MR4">
                        <HelpIcon />
                        <SettingsToggle />
                    </div>
                </header>
                <Routes>
                    <Route path="/earthquake-catalog-ui" element={<Home />} />
                    <Route path="/earthquake-catalog-ui/help" element={<Help />} />
                    <Route path="/earthquake-catalog-ui/settings" element={<Settings />} />
                    <Route path="/earthquake-catalog-ui/about" element={<About />} />
                </Routes>
                <footer className="flex-align-center">
                    <span className="ML4">
                        <a href="https://twitter.com/phdave2005?ref_src=twsrc%5Etfw" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faXTwitter} /></a>
                    </span>
                    <span>&copy;{new Date().getFullYear()} <a href="https://phdave.com" target="_blank" rel="noreferrer">PhDave LLC</a></span>
                    <span>
                        <a id="about-earthquake" href="https://www.usgs.gov/programs/earthquake-hazards" target="_blank" rel="noreferrer">{state.aboutEarthquake}</a>
                    </span>
                    <span className="MR4">
                        <Link id="about" to="/earthquake-catalog-ui/about">{state.about}</Link>
                    </span>
                </footer>
            </div>
        </BrowserRouter>
    );
};

export default App;

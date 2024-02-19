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
        ar: {
            about: 'عن الدكتور بارتيكا',
            aboutEarthquake: 'حول برنامج مخاطر الزلازل'
        },
        de: {
            about: 'Über Dr. Partyka',
            aboutEarthquake: 'Über das Erdbebengefahrenprogramm'
        },
        en: {
            about: 'About Dr. Partyka',
            aboutEarthquake: 'About Earthquake Catalog'
        },
        es: {
            about: 'Acerca del Dr. Partyka',
            aboutEarthquake: 'Acerca del programa de riesgos sísmicos'
        },
        fr: {
            about: 'À propos du Dr Partyka',
            aboutEarthquake: 'À propos du programme sur les risques sismiques'
        },
        hi: {
            about: 'डॉ. पार्टीका के बारे में',
            aboutEarthquake: 'भूकंप खतरा कार्यक्रम के बारे में'
        },
        it: {
            about: 'A proposito del dottor Partyka',
            aboutEarthquake: 'Informazioni sul programma sui rischi legati ai terremoti'
        },
        ja: {
            about: 'パーティカ博士について',
            aboutEarthquake: '地震防災プログラムについて'
        },
        ko: {
            about: '닥터파티카 소개',
            aboutEarthquake: '지진 위험 프로그램 정보'
        },
        ru: {
            about: 'О докторе Партике',
            aboutEarthquake: 'О программе по предотвращению землетрясений'
        },
        zh: {
            about: '關於帕蒂卡博士',
            aboutEarthquake: '關於地震災害計劃'
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

import React, { Component } from 'react'
import { Tooltip } from 'react-tooltip'
import CanvasJS from '@canvasjs/charts';
import axios from 'axios'
import { faArrowsRotate, faGlobe, faFilter, faMagnifyingGlass, faChevronLeft, faChevronRight, faFastBackward, faFastForward, faCircle, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './home.css'
import MainForm from '../forms/main/main-form.js'
import FiltersForm from '../forms/filters/filters-form.js'
import EVENT_TYPES from '../constants/event-types.js'
import processing from './processing.svg'
import TRANSLATION_MAPS from './translation-map.js'

class Home extends Component {
    constructor(props) {
        super(props);
        this.apiPath = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
        this.corsDomain = 'https://corsproxy.io';
        this.language = window?.localStorage?.getItem("language-used") || 'en';
        this.textUsed = TRANSLATION_MAPS.TEXT[this.language];
        this.eventTypes = this.mapEventTypes();
        this.apiData = [];
        this.state = {
            apiDataLength: 0,
            chartControls: {
                cl: 'DN'
            },
            chartIndex: 0,
            forms: {
                cl: '',
                active: 'main',
                sections: {
                    main: {
                        show: true,
                        heading: this.textUsed.heading.main
                    },
                    filters: {
                        show: false,
                        heading: this.textUsed.heading.filters
                    }
                },
                validation: {
                    error: {
                        cl: 'DN invalid',
                        text: ''
                    },
                    processing: {
                        cl: 'DN',
                        text: null
                    }
                }
            },
            info: {
                cl: 'DN'
            },
            quakes: {
                cl: 'DN'
            }
        };
    }

    search = () => {
        if (!this.isProcessing() && !this.invalidateFormActiveSection()) {
            document.getElementById("parameters-form").getElementsByTagName("BUTTON")[0].click();
        }
    }

    isProcessing = () => {
        const el = document.getElementById("processing-container");
        return !!el && !el.classList.contains("DN");
    }

    mapEventTypes() {
        const rawEventTypes = EVENT_TYPES[this.language];
        const eventTypes = {};
        const generateMap = (map, et) => {
            map[et.value.replace(/-/g, " ")] = et.label;
            return map;
        };
        return rawEventTypes.reduce(generateMap, eventTypes);
    }

    processFormSubmission = (e) => {
        e.preventDefault();
        const elements = e.target.querySelectorAll("[data-search-category]");
        let i,
            val,
            ID,
            type,
            category,
            filterData,
            searchData = {
                payload: {},
                filters: {}
            };
        for(i in elements) {
            if (i.match(/^\d+$/) && !!elements[i] && elements[i].nodeName && !!elements[i]?.getAttribute("data-search-category")) {
                val = elements[i]?.value.trim();
                if (val) {
                    if (!!elements[i]?.type) {
                        ID = elements[i].id;
                        category = elements[i].getAttribute("data-search-category");
                        filterData = elements[i].getAttribute("data-filter") || null;
                        type = elements[i].type;
                        if (val) {
                            if (elements[i].type === 'checkbox') {
                                if (elements[i].checked) {
                                    val = 1;
                                } else {
                                    continue;
                                }
                            }
                            searchData[category][ID] = {
                                filter: filterData,
                                nodeName: elements[i].nodeName,
                                type: type,
                                value: val
                            };
                        }
                    }
                }
            }
        }
        if (Object.keys(searchData.payload).length) {
            this.setState(state => (state.forms.validation = {
                error: {
                    cl: 'DN invalid',
                    text: ''
                },
                processing: {
                    cl: '',
                    text: null
                }
            }, state));
            this.fetchData(searchData);
        } else{
            this.setState(state => (state.forms.validation = {
                error: {
                    cl: 'invalid',
                    text: this.textUsed.validation.error.oneParameter
                },
                processing: {
                    cl: 'DN',
                    text: null
                }
            }, state));
        }
    }

    constructQueryString(data) {
        let i, field, value, parameter, queryStringArray = [];
        for(i in data) {
            if (!!data[i]?.value) {
                value = data[i].value;
                field = document.getElementById(i);
                if (!!field && !!value) {
                    parameter = i + '=' + data[i].value;
                    queryStringArray.push(parameter);
                }
            }
        }
        return queryStringArray.join('&');
    }

    isLocalhost() {
        return document.URL.indexOf("localhost") !== -1;
    }

    resultGo = (e) => {
        if (!e.target.classList.contains("disabled")) {
            const lastIndex = this.state.apiDataLength - 1;
            let stateObj = {};
            switch(e.currentTarget.dataset.goType) {
                case 'first':
                    if (this.state.chartIndex > 0) {
                        stateObj = {
                            chartIndex: 0,
                            chartControls: {
                                cl: ''
                            }
                        };
                    }
                break;
                case 'last':
                    if (this.state.chartIndex < lastIndex) {
                        stateObj = {
                            chartIndex: lastIndex,
                            chartControls: {
                                cl: ''
                            }
                        };
                    }
                break;
                case 'previous':
                    if (this.state.chartIndex > 0) {
                        stateObj = {
                            chartIndex: this.state.chartIndex - 1,
                            chartControls: {
                                cl: ''
                            }
                        };
                    }
                break;
                default://next
                    if (this.state.chartIndex < lastIndex) {
                        stateObj = {
                            chartIndex: this.state.chartIndex + 1,
                            chartControls: {
                                cl: ''
                            }
                        };
                    }
            }
            if (Object.keys(stateObj).length) {
                this.setState(stateObj);
                setTimeout(() => {
                    const indexedData = this.apiData[this.state.chartIndex];
                    this.renderInfo(indexedData);
                    this.renderChart(indexedData);
                }, 250);
            }
        }
    }

    getQueryLimit() {
        const maximumSearchResults = Number(document.getElementById("max-search-results").value);
        return (!isNaN(maximumSearchResults) && maximumSearchResults.toString().match(/^\d+$/) && (maximumSearchResults > 0)) ? maximumSearchResults : 20000;
    }

    fetchData(searchData) {
        const payload = searchData.payload;
        const filters = searchData.filters;
        if (!window.navigator.onLine && this.isLocalhost()) {
            import(`../constants/mock-response.js`)
            .then((response) => {
                const mockResponseData = response.MOCK_RESPONSE.features;
                this.processResponse(mockResponseData, filters);
            });
        } else {
            const results = this.apiPath + '?format=geojson&' + this.constructQueryString(payload) + '&limit=' + this.getQueryLimit();
            axios.get(this.corsDomain + '/?' + encodeURIComponent(results))
            .then((response) => {
                if (response?.data?.features?.length) {
                    this.processResponse(response.data.features, filters);
                } else {
                    this.setState(state => (state.forms.validation = {
                        error: {
                            cl: 'invalid',
                            text: this.textUsed.validation.error.noData
                        },
                        processing: {
                            cl: 'DN',
                            text: null
                        }
                    }, state));
                }
            })
            .catch((error) => {
                this.setState(state => (state.forms.validation = {
                    error: {
                        cl: 'invalid',
                        text: this.textUsed.validation.error.api
                    },
                    processing: {
                        cl: 'DN',
                        text: null
                    }
                }, state));
            });
        }
    }

    processResponse(data, filters) {
        let i, j, filteredData = [], allPass,
            filterMap = {
                tsunami: (d, v) => {
                    return d.properties.tsunami === 1;
                },
                magtype: (d, v) => {
                    return d.properties.magType.toLowerCase() === v;
                }
            };
        for(i in data) {
            allPass = true;
            for(j in filters) {
                if (!filterMap[filters[j].filter](data[i], filters[j].value)) {
                    allPass = false;
                    break;
                }
            }
            if (allPass) {
                filteredData.push(data[i]);
            }
        }
        if (filteredData.length) {
            this.setState({
                quakes: {
                    cl: 'MT64'
                }
            });
            if (window.localStorage?.getItem("download") === '1') {
                this.downloadData(filteredData);
            } else {
                this.renderWithTimeout(filteredData);
            }
        } else {
            this.setState(state => (state.forms.validation = {
                error: {
                    cl: 'invalid',
                    text: this.textUsed.validation.error.noData
                },
                processing: {
                    cl: 'DN',
                    text: null
                }
            }, state));
        }
    }

    downloadData(data) {
        const date = new Date();
        const str = JSON.stringify(data, undefined, 2);
        const blob = new Blob([str], {
            type: "application/json"
        });
        const downloadLink = document.getElementById("download");
        downloadLink.setAttribute("href", URL.createObjectURL(blob));
        downloadLink.setAttribute("download", "data_" + date.toISOString().split("T")[0] + "-" + date.getTime() + ".json");
        downloadLink.click();
        this.renderWithTimeout(data);
    }

    renderWithTimeout(data) {
        setTimeout(() => {
            this.setState(state => (state.forms.validation = {
                error: {
                    cl: 'valid',
                    text: this.textUsed.validation.success.downloaded
                },
                processing: {
                    cl: 'DN',
                    text: null
                }
            }, state));
            this.renderResults(data);
            setTimeout(() => {
                this.completeProcessing();
            }, 6000);
        }, 250);
    }

    completeProcessing() {
        this.setState(state => (state.forms.validation = {
            error: {
                cl: 'DN',
                text: ''
            },
            processing: {
                cl: 'DN',
                text: null
            }
        }, state));
    }

    renderResults(data) {
        this.apiData = data;
        this.setState({
            apiDataLength: data.length,
            chartIndex: 0,
            chartControls: {
                cl: ''
            },
            info: {
                cl: ''
            },
            quakes: {
                cl: 'MT16'
            }
        });
        const indexedData = this.apiData[this.state.chartIndex];
        this.renderInfo(indexedData);
        this.renderChart(indexedData);
    }

    renderInfo(data) {
        const properties = data.properties,
            alertColor = properties.alert || 'gray';
        let dateString = new Date(properties.time).toString(), modifiedDatestring;
        dateString = dateString.slice(0, dateString.lastIndexOf("(")).trim();
        modifiedDatestring = dateString.slice(dateString.indexOf(" ")).trim();
        document.getElementById("result-title").innerHTML = properties.title;
        document.getElementById("result-title-link").href = properties.url + "/executive";
        document.getElementById("result-alert-status").style.color = alertColor;
        document.getElementById("result-date").innerHTML = modifiedDatestring;
        document.getElementById("result-event-type").innerHTML = this.eventTypes[data.properties.type];
    }

    renderChart(data) {
        const chart = new CanvasJS.Chart("chart-container", {
            title:{
                text: this.textUsed.chart.title
            },
            axisY: {
                minimum: 0
            },
            data: [{
                type: "column",
                dataPoints: [
                    { label: this.textUsed.chart.xLabels[0], y: data.properties.mag },
                    { label: this.textUsed.chart.xLabels[1], y: data.properties.mmi },
                    { label: this.textUsed.chart.xLabels[2], y: data.properties.cdi }
                ]
            }]
        });
        chart.render();
    }

    invalidateFormActiveSection = () => {
        const validate = (f) => {
            const errorLabels = [];
            if (!!f?.value) {
                const validations = f.getAttribute("data-validations");
                let invalid, num;
                validations.split(",").forEach((validation) => {
                    switch(validation) {
                        case 'anyNumber':
                            num = Number(f.value);
                            invalid = isNaN(num);
                        break;
                        case 'nonnegativeInteger':
                            num = Number(f.value);
                            invalid = isNaN(num) || (num < 0) || !f.value.match(/^\d+$/);
                        break;
                        case 'nonnegativeNumber':
                            num = Number(f.value);
                            invalid = isNaN(num) || (num < 0);
                        break;
                        case 'dateCannotExceedToday':
                            invalid = new Date(f.value) > new Date();
                        break;
                        case 'minDateCannotExceedMaxDate':
                            const correspondingMaximumDateId = 'max' + f.id.replace(/^min/i, '');
                            const maxDateField = document.getElementById(correspondingMaximumDateId);
                            invalid = !!maxDateField && maxDateField.value.trim() && (new Date(maxDateField.value) < new Date(f.value));
                        break;
                        case 'minCannotExceedMax':
                            const correspondingMaximumId = f.id.replace(/min/i, 'max');
                            const maxField = document.getElementById(correspondingMaximumId);
                            invalid = !!maxField && maxField.value.trim() && (Number(maxField.value) < Number(f.value));
                        break;
                        case 'minimumValue':
                            num = Number(f.value);
                            invalid = num < Number(f.getAttribute("data-minimum-value"));
                        break;
                        case 'maximumValue':
                            num = Number(f.value);
                            invalid = num > Number(f.getAttribute("data-maximum-value"));
                        break;
                        default: // 'positiveNumber':
                            num = Number(f.value);
                            invalid = isNaN(num) || (num <= 0);
                        break;
                    }
                    if (invalid) {
                        errorLabels.push(this.textUsed.validation.labels[validation]);
                    }
                });
            }
            return errorLabels;
        };

        let field,
            errorLabels,
            i,
            id,
            validationSection,
            hasError = false;
        const activeSection = document.getElementById("parameters-form").getElementsByClassName("active");
        if (activeSection?.length === 1) {
            validationSection = activeSection[0].querySelectorAll("[data-validations]");
            for(i in validationSection) {
                id = validationSection[i].id;
                field = document.getElementById(validationSection[i].id);
                if (!!field) {
                    errorLabels = validate(field);
                    if (errorLabels?.length) {
                        hasError = true;
                        this.markInvalidField({
                            elem: document.getElementById(id),
                            errorLabel: errorLabels[0]
                        });
                    } else {
                        this.clearInvalidField({
                            elem: document.getElementById(id),
                            errorLabel: ''
                        });
                    }
                }
            }
        }
        if (hasError) {
            document.querySelectorAll(".flex-field.invalid")[0].parentElement.parentElement.scrollIntoView();
        } else {
            document.getElementById("main-grid-view").scrollTop = 0;
        }
        return hasError;
    }

    markInvalidField(data) {
        let field = data.elem,
            target,
            label;
        if (!!field) {
            target = field;
            while(!target.classList.contains("flex-field")) {
                target = field.parentElement;
            }
            target.classList.add("invalid");
            label = target.getElementsByTagName("LABEL");
            if (!!label) {
                label[0].getElementsByClassName("default-label")[0].classList.add("DN");
                label[0].getElementsByClassName("error-label")[0].classList.remove("DN");
                label[0].getElementsByClassName("error-label-text")[0].innerHTML = data.errorLabel;
            }
        }
    }

    clearInvalidField(data) {
        let field = data.elem,
            target,
            label;
        if (!!field) {
            target = field;
            while(!target.classList.contains("flex-field")) {
                target = field.parentElement;
            }
            target.classList.remove("invalid");
            label = target.getElementsByTagName("LABEL");
            if (!!label) {
                label[0].getElementsByClassName("default-label")[0].classList.remove("DN");
                label[0].getElementsByClassName("error-label")[0].classList.add("DN");
                label[0].getElementsByClassName("error-label-text")[0].innerHTML = data.errorLabel || '';
            }
        }
    }

    render() {
        const processMenuClick = (e) => {
            if (!this.isProcessing() && !this.invalidateFormActiveSection()) {
                e.preventDefault();
                let newFormState = this.state.forms.sections,
                    i;
                for(i in newFormState) {
                    newFormState[i].show = false;
                }
                newFormState[e.currentTarget.dataset.identifier].show = true;
                this.setState({
                    forms: {
                        active: e.currentTarget.dataset.identifier,
                        validation: {
                            error: {
                                cl: 'DN invalid',
                                text: ''
                            },
                            processing: {
                                cl: 'DN',
                                text: null
                            }
                        },
                        sections: newFormState
                    }
                });
            }
        };
        const resetForm = () => {
            if (!this.isProcessing()) {
                const form = document.getElementById("parameters-form");
                const activeSection = form.getElementsByClassName("active");
                if (activeSection?.length === 1) {
                    const fields = activeSection[0].getElementsByClassName("flex-field");
                    let i;
                    for(i in fields) {
                        if (fields[i]?.nodeName) {
                            fields[i].classList.remove("invalid");
                            fields[i].getElementsByClassName("default-label")[0].classList.remove("DN");
                            fields[i].getElementsByClassName("error-label")[0].classList.add("DN");
                            fields[i].getElementsByClassName("error-label-text")[0].innerHTML = '';
                        }
                    }
                }
                form.reset();
                this.setState({
                    chartControls: {
                        cl: 'DN'
                    },
                    info: {
                        cl: 'DN'
                    },
                    quakes: {
                        cl: 'DN'
                    }
                });
            }
        }
        const buttonParameters = [
            { id: 0, text: this.textUsed.menu.button.main, icon: faGlobe, class: 'form', identifier: 'main', fn: processMenuClick },
            { id: 1, text: this.textUsed.menu.button.filters, icon: faFilter, class: 'form', identifier: 'filters', fn: processMenuClick },
            { id: 2, text: this.textUsed.menu.button.reset, icon: faArrowsRotate, class: 'MT40 warning', identifier: 'reset', fn: resetForm },
            { id: 3, text: this.textUsed.menu.button.search, icon: faMagnifyingGlass, class: 'MT40 primary', identifier: 'search', fn: this.search }
        ];
        return (
            <main>
                <div id="main-grid">
                    <div id="main-grid-menu">
                        <h3 className="TAC">{this.textUsed.menu.heading}</h3>
                        <ul>
                        {
                            buttonParameters.map(parameter => {
                                return (
                                    <li key={'navbutton' + parameter.id}>
                                        <button type="button" className={parameter.class} data-identifier={parameter.identifier} data-testid={parameter.identifier + '-button'} onClick={parameter.fn}>
                                            <FontAwesomeIcon icon={parameter.icon} />
                                            <span>{parameter.text}</span>
                                        </button>
                                    </li>
                                );
                            })
                        }
                        </ul>
                    </div>
                    <div id="main-grid-view">
                        <p className={"dialog " + this.state.forms.validation.error.cl} data-identifier="info">{this.state.forms.validation.error.text}</p>
                        <div className={this.state.chartControls.cl + ' flexrow-even FS24 MB-8'}>
                            <span>
                                <FontAwesomeIcon icon={faFastBackward} onClick={this.resultGo} data-tooltip-id={'fast-backward'} data-tooltip-content={this.textUsed.chart.controls.fastBackward} data-go-type="first" />
                            </span>
                            <span>
                                <FontAwesomeIcon className="MR4" icon={faChevronLeft} onClick={this.resultGo} data-tooltip-id={'chevron-left'} data-tooltip-content={this.textUsed.chart.controls.chevronLeft} data-go-type="previous" />
                                <FontAwesomeIcon className="ML4" icon={faChevronRight} onClick={this.resultGo} data-tooltip-id={'chevron-right'} data-tooltip-content={this.textUsed.chart.controls.chevronRight} data-go-type="next" />
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faFastForward} onClick={this.resultGo} data-tooltip-id={'fast-forward'} data-tooltip-content={this.textUsed.chart.controls.fastForward}data-go-type="last" />
                            </span>
                            <Tooltip id={'chevron-left'} />
                            <Tooltip id={'chevron-right'} />
                            <Tooltip id={'fast-backward'} />
                            <Tooltip id={'fast-forward'} />
                        </div>
                        <div id="results-container" className={this.state.quakes.cl}>
                            <div id="info-container" className={this.state.info.cl}>
                                <h2><FontAwesomeIcon id="result-alert-status" icon={faCircle}  data-tooltip-id={'alert-status-circle'} data-tooltip-content={this.textUsed.chart.alert}/> <a id="result-title-link" href="" target="_blank"><span id="result-title"></span> <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a></h2>
                                <Tooltip id={'alert-status-circle'} />
                                <ul>
                                    <li><b>{this.textUsed.results.date}:</b> <span id="result-date"></span></li>
                                    <li><b>{this.textUsed.results.eventType}:</b> <span id="result-event-type"></span></li>
                                    <li><b>{this.textUsed.results.record.title}:</b> <span>{this.state.chartIndex + 1}</span> <span>{this.textUsed.results.record.of}</span> <span>{this.state.apiDataLength}</span>
                                    </li>
                                </ul>
                            </div>
                            <div id="chart-container"></div>
                        </div>
                        <div id="processing-container" className={this.state.forms.validation.processing.cl}>
                            <div>
                                <img className="scale-2" src={processing} alt="processing" data-testid="processing" />
                            </div>
                            <p>{this.textUsed.processing.text}</p>
                        </div>
                        <form id="parameters-form" className={this.state.quakes.cl.match(/DN/i) ? '' : 'DN'} data-testid="form" onSubmit={this.processFormSubmission}>
                            <h2 className="form-heading">{this.state.forms.sections[this.state.forms.active].heading}</h2>
                            <MainForm class={this.state.forms.sections.main.show ? 'active' : 'DN'} language={this.language} />
                            <FiltersForm class={this.state.forms.sections.filters.show ? 'active' : 'DN'} language={this.language} />
                            <button type="submit" className="DN"></button>
                        </form>
                        <a href="/" id="download" className="DN">-</a>
                    </div>
                </div>
            </main>
        );
    }
}

export default Home;

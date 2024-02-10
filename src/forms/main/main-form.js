import React, { useState } from 'react'
import './main-form.css'
import '../form.css'
import ALERT_LEVELS from '../../constants/alert-levels.js'
import EVENT_TYPES from '../../constants/event-types.js'
import SORT_ORDER from '../../constants/sort-order.js'
import REVIEW_STATUSES from '../../constants/review-statuses.js'
import LabelElement from '../../elements/label/label-element.js'
import TEXT_MAP from './translation-map.js'

function handleNumberChange(e) {
    if ((e.target.type === 'number') && !e.target.value) {
        e.preventDefault();
        e.target.value = '';
    }
}

function createOptions(src, prepend) {
    const len = src.length;
    let options = [],
        i = 0;
    for(; i < len; i++) {
        options.push(<option key={prepend + i} value={src[i].value}>{src[i].label}</option>);
	}
	return options;
}

function MainForm(props) {
	const [ locationState, setLocationState ] = useState({
		rectangularDisplayClass: '',
		radialDisplayClass: 'DN'
	});
	const clearLocationFields = (evt) => {
		let target = evt.target,
			nodename = '',
			set,
			i;
		while(nodename !== 'FIELDSET') {
			target = target.parentElement;
			nodename = target.nodeName;
		}
		set = target.getElementsByClassName("field");
		for(i in set) {
			if (!!set[i]?.nodeName) {
				set[i].value = null;
			}
		}
	};
    const textUsed = TEXT_MAP[props.language];
    return (
        <section id="main-section" className={props.class} data-testid="main">
			<fieldset>
				<legend>{textUsed.legend.intensity}</legend>
				<div className="flex-field-half-wrapper MT32">
					<div className="flex-field half">
						<input id="minmagnitude" className="field" type="number" data-validations="positiveNumber,maximumValue,minCannotExceedMax" data-maximum-value="10" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'minmagnitude'} text={textUsed.labels.minMagnitude} tooltip={false} />
					</div>
					<div className="flex-field half">
						<input id="maxmagnitude" className="field" type="number" data-validations="positiveNumber,maximumValue" data-maximum-value="10" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'maxmagnitude'} text={textUsed.labels.maxMagnitude} tooltip={false} />
					</div>
				</div>
				<div className="flex-field-half-wrapper MT32">
					<div className="flex-field half">
						<input id="minmmi" className="field" type="number" data-validations="positiveNumber,maximumValue,minCannotExceedMax" data-maximum-value="12" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'minmmi'} text={textUsed.labels.minMmi} tooltip={false} />
					</div>
					<div className="flex-field half">
						<input id="maxmmi" className="field" type="number" data-validations="positiveNumber,maximumValue" data-maximum-value="12" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'maxmmi'} text={textUsed.labels.maxMmi} tooltip={false} />
					</div>
				</div>
				<div className="flex-field-half-wrapper MT32">
					<div className="flex-field half">
						<input id="mincdi" className="field" type="number" data-validations="positiveNumber,maximumValue,minCannotExceedMax" data-maximum-value="12" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'mincdi'} text={textUsed.labels.minCdi} tooltip={false} />
					</div>
					<div className="flex-field half">
						<input id="maxcdi" className="field" type="number" data-validations="positiveNumber,maximumValue" data-maximum-value="12" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'maxcdi'} text={textUsed.labels.maxCdi} tooltip={false} />
					</div>
				</div>
			</fieldset>
			<fieldset className="MT32">
				<legend>{textUsed.legend.location}</legend>
				<div className="flex-field">
					<div className="flex-field-horizontal MT8">
						<input id="rectangular" type="radio" name="location" defaultChecked onChange={
							(e) => {
								clearLocationFields(e);
								setLocationState({
									rectangularDisplayClass: !!e.target.checked ? '' : 'DN',
									radialDisplayClass: !!e.target.checked ? 'DN' : ''
								})
							}
						} />
						<LabelElement labelFor={'rectangular'} text={textUsed.labels.rectangularLocation} tooltip={false} />
					</div>
					<div className="flex-field-horizontal MT8">
						<input id="radial" type="radio" name="location" onChange={
							(e) => {
								clearLocationFields(e);
								setLocationState({
									rectangularDisplayClass: !!e.target.checked ? 'DN' : '',
									radialDisplayClass: !!e.target.checked ? '' : 'DN'
								})
							}
						} />
						<LabelElement labelFor={'radial'} text={textUsed.labels.radialLocation} tooltip={false} />
					</div>
				</div>
				<section className={locationState.rectangularDisplayClass}>
					<div className="flex-field-half-wrapper MT32">
						<div className="flex-field half">
							<input id="minlatitude" className="field" type="number" data-validations="anyNumber,maximumValue,minimumValue,minCannotExceedMax" data-minimum-value="-90" data-maximum-value="90" data-search-category="payload" onKeyUp={handleNumberChange} />
							<LabelElement labelFor={'minlatitude'} text={textUsed.labels.minLatitude + ' (&deg;)'} tooltip={false} />
						</div>
						<div className="flex-field half">
							<input id="maxlatitude" className="field" type="number" data-validations="anyNumber,maximumValue,minimumValue" data-minimum-value="-90" data-maximum-value="90" data-search-category="payload" onKeyUp={handleNumberChange} />
							<LabelElement labelFor={'maxlatitude'} text={textUsed.labels.maxLatitude + ' (&deg;)'} tooltip={false} />
						</div>
					</div>
					<div className="flex-field-half-wrapper MT32">
						<div className="flex-field half">
							<input id="minlongitude" className="field" type="number" data-validations="anyNumber,maximumValue,minimumValue,minCannotExceedMax" data-minimum-value="-360" data-maximum-value="360" data-search-category="payload" onKeyUp={handleNumberChange} />
							<LabelElement labelFor={'minlongitude'} text={textUsed.labels.minLongitude + ' (&deg;)'} tooltip={false} />
						</div>
						<div className="flex-field half">
							<input id="maxlongitude" className="field" type="number" data-validations="anyNumber,maximumValue,minimumValue" data-minimum-value="-360" data-maximum-value="360" data-search-category="payload" onKeyUp={handleNumberChange} />
							<LabelElement labelFor={'maxlongitude'} text={textUsed.labels.maxLongitude + ' (&deg;)'} tooltip={false} />
						</div>
					</div>
				</section>
				<section className={locationState.radialDisplayClass}>
					<div className="flex-field-half-wrapper MT32">
						<div className="flex-field half">
							<input id="latitude" className="field" type="number" data-validations="anyNumber,maximumValue,minimumValue" data-minimum-value="-90" data-maximum-value="90" data-search-category="payload" onKeyUp={handleNumberChange} />
							<LabelElement labelFor={'latitude'} text={textUsed.labels.latitude + ' (&deg;)'} tooltip={false} />
						</div>
						<div className="flex-field half">
							<input id="longitude" className="field" type="number" data-validations="anyNumber,maximumValue,minimumValue" data-minimum-value="-180" data-maximum-value="180" data-search-category="payload" onKeyUp={handleNumberChange} />
							<LabelElement labelFor={'longitude'} text={textUsed.labels.longitude + ' (&deg;)'} tooltip={false} />
						</div>
					</div>
					<div className="flex-field-half-wrapper MT32">
						<div className="flex-field half">
							<input id="maxradius" className="field" type="number" data-validations="nonnegativeNumber,maximumValue,minCannotExceedMax" data-maximum-value="180" data-search-category="payload" onKeyUp={handleNumberChange} />
							<LabelElement labelFor={'minradius'} text={textUsed.labels.maxRadius + ' (&deg;)'} tooltip={false} />
						</div>
						<div className="flex-field half">
							<input id="maxradiuskm" className="field" type="number" data-validations="nonnegativeNumber,maximumValue" data-maximum-value="20001.6" data-search-category="payload" onKeyUp={handleNumberChange} />
							<LabelElement labelFor={'maxradiuskm'} text={textUsed.labels.maxRadiusKm} tooltip={false} />
						</div>
					</div>
				</section>
			</fieldset>
			<fieldset className="MT32">
				<legend>{textUsed.legend.depth}</legend>
				<div className="flex-field-half-wrapper MT32">
					<div className="flex-field half">
						<input id="mindepth" className="field" type="number" data-validations="anyNumber,minCannotExceedMax" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'mindepth'} text={textUsed.labels.minDepth} tooltip={false} />
					</div>
					<div className="flex-field half">
						<input id="maxdepth" className="field" type="number" data-validations="anyNumber" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'maxdepth'} text={textUsed.labels.maxDepth} tooltip={false} />
					</div>
				</div>
			</fieldset>
			<fieldset className="MT32">
				<legend>{textUsed.legend.dateRange}</legend>
				<div className="flex-field-half-wrapper MT32">
					<div className="flex-field half">
						<input id="endtime" className="field" type="date" data-validations="dateCannotExceedToday,minDateCannotExceedMaxDate" data-search-category="payload" />
						<LabelElement labelFor={'endtime'} text={textUsed.labels.minDate} tooltip={false} />
					</div>
					<div className="flex-field half">
						<input id="starttime" className="field" type="date" data-validations="dateCannotExceedToday" data-search-category="payload" />
						<LabelElement labelFor={'starttime'} text={textUsed.labels.maxDate} tooltip={false} />
					</div>
				</div>
			</fieldset>
			<fieldset className="MT32">
				<legend>{textUsed.legend.gap} (&deg;)</legend>
				<div className="flex-field-half-wrapper MT32">
					<div className="flex-field half">
						<input id="mingap" className="field" type="number" data-validations="nonnegativeNumber,maximumValue,minCannotExceedMax" data-maximum-value="360" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'mingap'} text={textUsed.labels.minGap} tooltip={false} />
					</div>
					<div className="flex-field half">
						<input id="maxgap" className="field" type="number" data-validations="nonnegativeNumber,maximumValue" data-maximum-value="360" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'maxGap'} text={textUsed.labels.maxGap} tooltip={false} />
					</div>
				</div>
			</fieldset>
			<fieldset className="MT32">
				<legend>{textUsed.legend.significance}</legend>
				<div className="flex-field-half-wrapper MT32">
					<div className="flex-field half">
						<input id="minsig" className="field" type="number" data-validations="positiveNumber,minCannotExceedMax" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'minsig'} text={textUsed.labels.minSignificance} tooltip={false} />
					</div>
					<div className="flex-field half">
						<input id="maxsig" className="field" type="number" data-validations="positiveNumber" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'maxsig'} text={textUsed.labels.maxSignificance} tooltip={false} />
					</div>
				</div>
			</fieldset>
			<fieldset className="MT32">
				<legend>{textUsed.legend.felt}</legend>
				<div className="flex-field-half-wrapper MT32">
					<div className="flex-field half">
						<input id="minfelt" className="field" type="number" min="0" step="1" data-validations="nonnegativeInteger,minCannotExceedMax" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'minfelt'} text={textUsed.labels.minFelt} tooltip={false} />
					</div>
					<div className="flex-field half">
						<input id="maxfelt" className="field" type="number" min="0" step="1" data-validations="nonnegativeInteger" data-search-category="payload" onKeyUp={handleNumberChange} />
						<LabelElement labelFor={'maxfelt'} text={textUsed.labels.maxFelt} tooltip={false} />
					</div>
				</div>
			</fieldset>
			<fieldset className="MT32">
				<legend>{textUsed.legend.metadata}</legend>
				<div className="flex-field-half-wrapper MT32">
					<div className="flex-field half">
						<select id="alertlevel" className="field" data-search-category="payload">
							<option value="">{textUsed.selectDefault}</option>
								{createOptions(ALERT_LEVELS[props.language], 'at')}
						</select>
						<LabelElement labelFor={'alertlevel'} text={textUsed.labels.alertLevel} tooltip={false} />
					</div>
					<div className="flex-field half">
						<select id="eventtype" className="field" data-search-category="payload">
							<option value="">{textUsed.selectDefault}</option>
								{createOptions(EVENT_TYPES[props.language], 'et')}
						</select>
						<LabelElement labelFor={'eventtype'} text={textUsed.labels.eventType} tooltip={false} />
					</div>
				</div>
				<div className="flex-field-half-wrapper MT32">
					<div className="flex-field half">
						<select id="reviewstatus" className="field" data-search-category="payload">
							<option value="">{textUsed.selectDefault}</option>
								{createOptions(REVIEW_STATUSES[props.language], 'rs')}
						</select>
						<LabelElement labelFor={'reviewstatus'} text={textUsed.labels.reviewStatus} tooltip={false} />
					</div>
					<div className="flex-field half">
						<select id="orderby" className="field" data-search-category="payload">
							<option value="">{textUsed.selectDefault}</option>
								{createOptions(SORT_ORDER[props.language], 'ob')}
						</select>
						<LabelElement labelFor={'orderby'} text={textUsed.labels.orderBy} tooltip={false} />
					</div>
				</div>
			</fieldset>
        </section>
    );
}

export default MainForm;

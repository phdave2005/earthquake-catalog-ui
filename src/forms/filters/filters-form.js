import './filters-form.css'
import '../form.css'
import MAGNITUDE_TYPES from '../../constants/magnitude-types.js'
import LabelElement from '../../elements/label/label-element.js'
import TEXT_MAP from './translation-map.js'

function handleNumberChange(evt) {
    if (!evt.target.value) {
        evt.preventDefault();
        evt.target.value = '';
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

function FiltersForm(props) {
    const textUsed = TEXT_MAP[props.language];
    return (
        <section id="filters-section" className={props.class} data-testid="filters">
            <div className="flex-field-half-wrapper MT32">
                <div className="flex-field half">
                    <input id="max-search-results" placeholder={textUsed.fields.maxSearchResults.placeholder} className="field" type="number" data-validations="positiveInteger" data-search-category="filters" onKeyUp={handleNumberChange} />
                    <LabelElement labelFor={'max-search-results'} text={textUsed.fields.maxSearchResults.label} tooltip={false} />
                </div>
                <div className="flex-field half">
                    <select id="magtype" className="field" data-search-category="filters" data-filter="magtype">
                        <option value="">{textUsed.selectDefault}</option>
                            {createOptions(MAGNITUDE_TYPES[props.language], 'mt')}
                    </select>
                    <LabelElement labelFor={'magtype'} text={textUsed.fields.magType.label} tooltip={false} />
                </div>
            </div>
            <div className="flex-field-half-wrapper MT32">
                <div className="flex-field half">
                    <input id="had-tsunami" className="field" type="checkbox" data-search-category="filters" data-filter="tsunami" />
                    <LabelElement labelFor={'had-tsunami'} text={textUsed.fields.hadTsunami.label} tooltip={false} />
                </div>
            </div>
        </section>
    );
}

export default FiltersForm;

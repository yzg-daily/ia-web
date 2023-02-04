import EntryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import datePickerFactory from './DatePickerFactory';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

function ensureNotNull(prop) {
    if (!prop) {
        throw new Error(prop + ' must be set.');
    }

    return prop;
}
/**
 * sets the default parameters which are needed to create an entry
 *
 * @param options
 * @returns {{id: *, description: (*|string), get: (*|Function), set: (*|Function),
 *            validate: (*|Function), html: string}}
 */
const setDefaultParameters = function(options) {
    // default method to fetch the current value of the input field
    const defaultGet = function(element) {
        const bo = getBusinessObject(element),
            res = {},
            prop = ensureNotNull(options.modelProperty);
        res[prop] = bo.get(prop);

        return res;
    };

    // default method to set a new value to the input field
    const defaultSet = function(element, values) {
        const res = {},
            prop = ensureNotNull(options.modelProperty);
        if (values[prop] !== '') {
            res[prop] = values[prop];
        } else {
            res[prop] = undefined;
        }

        return cmdHelper.updateProperties(element, res);
    };

    // default validation method
    const defaultValidate = function() {
        return {};
    };

    return {
        id: options.id,
        description: options.description || '',
        get: options.get || defaultGet,
        set: options.set || defaultSet,
        validate: options.validate || defaultValidate,
        html: '',
    };
};

const EntryFactoryExtend = EntryFactory;
EntryFactoryExtend.datePicker = function(translate, options) {
    return datePickerFactory(translate, options, setDefaultParameters(options));
};

module.exports = EntryFactoryExtend;

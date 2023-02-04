import entryFieldDescription from 'bpmn-js-properties-panel/lib/factory/EntryFieldDescription';
import { escapeHTML } from 'bpmn-js-properties-panel/lib/Utils';
import { domify, query as domQuery } from 'min-dom';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import React from 'react';
import { DatePicker } from 'antd';

const reactEscapeHTML = reactNode => reactNode;

function DatePickerFactory(translate, options, defaultParameters) {
    const resource = defaultParameters,
        label = options.label || resource.id,
        canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
        canBeHidden = !!options.hidden && typeof options.hidden === 'function',
        description = options.description;

    // resource.html = domify(
    //     '<label for="custom-' +
    //         escapeHTML(resource.id) +
    //         '"' +
    //         (canBeDisabled ? 'data-disable="isDisabled"' : null) +
    //         (canBeHidden ? 'data-show="isShown"' : '') +
    //         ' >' +
    //         escapeHTML(label) +
    //         '</label>' +
    //         '<div class="bpp-field-wrapper"' +
    //         (canBeDisabled ? 'data-disable="isDisabled"' : null) +
    //         (canBeHidden ? 'data-show="isShown"' : '') +
    //         '>' +
    //         (<DatePicker disabled={options.disabled} />) +
    //         '</div>'
    // );
    resource.html = domify(
        '<label for="custom-' +
            escapeHTML(resource.id) +
            '"' +
            (canBeDisabled ? 'data-disable="isDisabled"' : null) +
            (canBeHidden ? 'data-show="isShown"' : '') +
            ' >' +
            escapeHTML(label) +
            '</label>' +
            '<div class="bpp-field-wrapper"' +
            (canBeDisabled ? 'data-disable="isDisabled"' : null) +
            (canBeHidden ? 'data-show="isShown"' : '') +
            '>' +
            ReactDOM.hydrate(<DatePicker disabled={options.disabled} />) +
            '</div>'
    );

    if (description) {
        resource.html.appendChild(entryFieldDescription(translate, description, { show: canBeHidden && 'isHidden' }));
    }

    if (canBeDisabled) {
        resource.isDisabled = function() {
            return options.disabled.apply(resource, arguments);
        };
    }

    if (canBeHidden) {
        resource.isHidden = function() {
            return !options.hidden.apply(resource, arguments);
        };
    }

    resource.cssClasses = ['bpp-textfield'];

    return resource;
}

export default DatePickerFactory;

import {MDCTextField} from '@material/textfield';

import {appendParameterFieldsFromArgs, getArgsObjectsByArgs} from './utils';

const getTextAreaEl = ({id, value, label, rows = 8}) => {
    const field = document.createElement('div');
    field.className = 'mdc-layout-grid__cell--span-12';
    field.insertAdjacentHTML('afterbegin', `
        <div class="mdc-text-field mdc-text-field--fullwidth mdc-text-field--textarea">
            <textarea  id="${id}" class="mdc-text-field__input" rows="${rows}">${value}</textarea>
            <div class="mdc-notched-outline">
                <div class="mdc-notched-outline__leading"></div>
                <div class="mdc-notched-outline__notch">
                    <label for="textarea" class="mdc-floating-label">${label}</label>
                </div>
                <div class="mdc-notched-outline__trailing"></div>
            </div>
        </div>
    `);
    return field;
};

export const initExpressionFields = ({expression, argsRaw, methodName, beanName, dialogEl, updateArgMDCs}) => {
    // initialize current expression panel
    argsRaw = argsRaw[1].split(')');
    argsRaw = argsRaw[0].split(',').map(arg => arg.trim());
    const args = getArgsObjectsByArgs({beanName, methodName, argsRaw});

    const currentExpressionPanelEl = dialogEl.querySelector('#current-expression-panel');

    let expressionEl = getTextAreaEl({id: 'activiti-expression', value: expression, label: 'Expression'});
    let textFieldExpressionMDC = new MDCTextField(expressionEl);
    textFieldExpressionMDC.value = expression;
    currentExpressionPanelEl.appendChild(expressionEl);

    const {argMDCs} = appendParameterFieldsFromArgs({
        args, 
        currentExpressionPanelEl, 
        methodName, 
        beanName, 
        textFieldExpressionMDC
    });
    updateArgMDCs(argMDCs);

    return {
        currentExpressionPanelEl,
        textFieldExpressionMDC
    };
};
export default initExpressionFields;

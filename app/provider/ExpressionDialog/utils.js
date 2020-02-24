import {MDCTextField} from '@material/textfield';
import {MDCTextFieldHelperText} from '@material/textfield/helper-text';
import beansConfig from '../../../resources/common-tasks-meta-model';

export const getNewExpression = ({beanName, methodName, argMDCs}) => {
    return `\$\{${beanName}.${methodName}(${argMDCs.map(c => c.value).join(',')})\}`;
};

const getHelperTextEl = ({description, id}) => {
    const el = document.createElement('div');
    el.className = 'mdc-text-field-helper-line';
    el.insertAdjacentHTML('afterbegin', `
        <div class="mdc-text-field-helper-text" id="${id}" aria-hidden="true">${description}</div>
    `);
    return el;
};

const getSuffixEl = ({value}) => {
    const el = document.createElement('i');
    el.className = 'material-icons mdc-text-field__icon mdc-text-field__icon--trailing';
    el.role = 'button';
    el.tabindex = '0';
    el.innerHTML = 'event';

    return el;
};

const getTextFieldEl = ({id, value, label, suffix, isRequired}) => {
    const field = document.createElement('div');
    field.className = 'mdc-layout-grid__cell--span-12 method-arg';
    field.insertAdjacentHTML('afterbegin', `
        <label class="mdc-text-field mdc-text-field--with-trailing-icon" style="width: 100%">
            <div class="mdc-text-field__ripple"></div>
            <input class="mdc-text-field__input" type="text" aria-labelledby="${id}" value="${value}" aria-describedby="${id}-helper">
            <span class="mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button">${suffix}</span>
            <span class="mdc-floating-label mdc-floating-label--float-above ${isRequired ? 'required' : ''}" id="${id}">
                ${label}
            </span>
            <div class="mdc-line-ripple"></div>
        </label>
    `);
    return field;
};

// @todo helper text mdc
export const appendParameterFieldsFromArgs = ({args = [], beanName, methodName, currentExpressionPanelEl, textFieldExpressionMDC}) => {
    let argEl, helperTextEl, helperTextMDC, argMDC;
    const argMDCs = [];

    const presentArgFields = currentExpressionPanelEl.querySelectorAll('.method-arg');
    if(presentArgFields){
        for(let i = 0; i < presentArgFields.length; i++){
            presentArgFields[i].remove();
        }
    }
    for (let i = 0; i < args.length; i++){
        argEl = getTextFieldEl({id: `arg-${i}`, value: args[i].defaultValue, label: args[i].displayName, suffix: args[i].dataType, isRequired: args[i].required});
        helperTextEl = getHelperTextEl({description: args[i].description, id: `arg-${i}-helper`});
        argEl.appendChild(helperTextEl);
        argMDC = new MDCTextField(argEl);
        helperTextMDC = new MDCTextFieldHelperText(helperTextEl);

        argMDC.value = args[i].defaultValue;
        argMDCs.push(argMDC);
        argMDC.listen('keyup', () => {
            textFieldExpressionMDC.value = getNewExpression({beanName, methodName, argMDCs});
        })
        currentExpressionPanelEl.appendChild(argEl);
    }
    return {argMDCs};
};

export const getArgsObjectsByArgs = ({beanName, methodName, argsRaw}) => {

    const argsObjects = [];
    const bean = beansConfig.beans.filter(b => b.name === beanName)[0];
    const methodObject = bean.methods.filter(m => m.name === methodName)[0];
    for (let i = 0; i < argsRaw.length; i++) {
        let argObject = methodObject.params[i];
        if(argObject) {
            argsObjects.push(Object.assign(argObject, {defaultValue: argsRaw[i]}));
        } else {
            argsObjects.push({
                defaultValue: argsRaw[i],
                displayName: argsRaw[i],
                dataType: argsRaw[i],
                required: true,
                exampleValue: argsRaw[i],
                description: argsRaw[i]
            });
        }
    }
    return argsObjects;
};
import {MDCList, MDCListAdapter, MDCListFoundation} from '@material/list';
import beansConfig from '../../../resources/common-tasks-meta-model';
import {appendParameterFieldsFromArgs, getNewExpression} from './utils';

const getExpresseinonsListEl = () => {
    const el = document.createElement('ul');
    el.className = 'mdc-list mdc-list--two-line';
    return el;
};
const getAvailableExpressionEl = ({beanName, methodName, description, tabindex = null, args = []}) => {
    const liEl = document.createElement('li');
    liEl.className = 'mdc-list-item';
    if(tabindex !== null) liEl.tabindex = tabindex;
    liEl.dataset.beanName = beanName;
    liEl.dataset.methodName = methodName;
    liEl.insertAdjacentHTML('afterbegin', `
        <span class="mdc-list-item__text">
            <span class="mdc-list-item__primary-text">${beanName}.${methodName}(${args.map(arg => arg.defaultValue).join(',')})</span>
            <span class="mdc-list-item__secondary-text">${description}</span>
        </span>
    `);
    return liEl;
};

export const initAvailableExpressionsPanel = ({
    currentExpressionPanelEl, 
    textFieldExpressionMDC, 
    dialogEl, 
    currentBeanName,
    updateArgMDCs, 
    updateMethodName,
    updateBeanName
}) => {
    // initialize available expressions panel
    const availableExpressionsPanelEl = dialogEl.querySelector('#available-expressions-panel');
    const listEl = getExpresseinonsListEl();
    
    const beanConfig = beansConfig.beans.filter(b => b.name === currentBeanName)[0];
    const listItemEls = [];
    let beanName = beanConfig.name;
    beanConfig.methods.forEach((method, j) => {
        let listItemEl = getAvailableExpressionEl({
            beanName, 
            methodName: method.name, 
            args: method.params, 
            description: method.description,
            tabindex: j === 0 ? j : null
        });
        listItemEls.push(listItemEl);
        listEl.appendChild(listItemEl);
    });
    
    const listMDC = new MDCList(listEl);
    listMDC.listen('MDCList:action', ({detail: {index}}) => {
        let {beanName, methodName} = listItemEls[index].dataset;
        if(beanConfig && beanConfig.hasOwnProperty('methods')) {
            let {argMDCs} = appendParameterFieldsFromArgs({
                args: (beanConfig.methods.filter(m => m.name === methodName)[0] || {}).params,
                currentExpressionPanelEl, 
                methodName, 
                textFieldExpressionMDC,
                beanName
            });
            textFieldExpressionMDC.value = getNewExpression({argMDCs, methodName, beanName});
            updateArgMDCs(argMDCs);
            updateMethodName(methodName);
            updateBeanName(beanName);
        }
    });
    availableExpressionsPanelEl.appendChild(listEl);

    return {
        availableExpressionsPanelEl
    };
};
export default initAvailableExpressionsPanel;

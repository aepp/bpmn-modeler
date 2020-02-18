import {MDCDialog} from '@material/dialog';
import {getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
import {initExpressionFields} from './ExpressionFields';
import {initAvailableExpressionsPanel} from './AvailablaExpressionsPanel';
import {getNewExpression} from './utils';
import {bpmnModeler} from '../../index';

export const ExpressionDialog = element => {
    const bo = getBusinessObject(element);
    const {expression} = bo;
    let argsRaw = expression.split('(');
    let beanAndmethod = argsRaw[0].split('${')[1];
    let methodName = beanAndmethod.split('.')[1];
    let beanName =  beanAndmethod.split('.')[0];
    let argMDCs = [];

    const updateMethodName = m => methodName = m; 
    const updateBeanName = b => beanName = b; 
    const updateArgMDCs = a => argMDCs = a; 

    const dialogEl = document.querySelector('.mdc-dialog');

    const {currentExpressionPanelEl, textFieldExpressionMDC} = initExpressionFields({expression, argsRaw, methodName, beanName, dialogEl, updateArgMDCs});
    const {availableExpressionsPanelEl} = initAvailableExpressionsPanel({
        currentExpressionPanelEl, 
        textFieldExpressionMDC, 
        dialogEl, 
        updateArgMDCs, 
        updateMethodName,
        updateBeanName
    });

    const dialog = new MDCDialog(dialogEl);
    dialog.open();

    dialog.listen('MDCDialog:closing', event => {
        const {action} = event.detail;
        if(action === 'save'){
            bpmnModeler.get('modeling').updateProperties(element, {'activiti:expression': getNewExpression({argMDCs, methodName, beanName})});
        }
        currentExpressionPanelEl.innerHTML = '';
        availableExpressionsPanelEl.innerHTML = '';
    });
};
export default ExpressionDialog;


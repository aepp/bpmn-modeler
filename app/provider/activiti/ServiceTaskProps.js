import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import {is, getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';

import ExpressionDialog from '../ExpressionDialog';

export default function(group, element) {

  // Only return an entry, if the currently selected
  // element is a ServiceTask.
  
  if (is(element, 'bpmn:ServiceTask') || is(element, 'bpmn:ReceiveTask')) {
    const businessObject = getBusinessObject(element);
    if(businessObject.expression){
      group.entries.push(entryFactory.textField({
        id : 'expression',
        description : 'The activiti:expression prop',
        label : 'Expression',
        modelProperty : 'expression',
        buttonLabel: '...',
        buttonAction: {
          name: 'openRegisterFileTaskDialog',
          method: () => ExpressionDialog(element)
        }
      }));
    }
    
    group.entries.push(entryFactory.textField({
      id : 'async',
      description : 'The activiti:async prop',
      label : 'Async?',
      modelProperty : 'async'
    }));

    group.entries.push(entryFactory.textField({
      id : 'resultVariableName',
      description : 'The activiti:resultVariableName prop',
      label : 'Result variable name',
      modelProperty : 'resultVariableName'
    }));
  }
}
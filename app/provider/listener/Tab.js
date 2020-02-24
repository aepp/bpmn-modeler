import {is} from 'bpmn-js/lib/util/ModelUtil';

import listenerProps from './parts/ListenerProps';
import listenerDetails from './parts/ListenerDetailProps';
import listenerFields from './parts/ListenerFieldInjectionProps';

var getListenerLabel = function(param, translate) {

  if (is(param, 'activiti:executionListener')) {
    return translate('Execution Listener');
  }

  return '';
};

// Create the custom activiti tab
function createListenerTabGroups(element, bpmnFactory, translate) {
  
    // Create a group called "Activiti".
    let listenerGroup = {
      id: 'listener',
      label: 'Listener props',
      entries: []
    };
  
    // Add the listener props to the listener group.
    let options = listenerProps(listenerGroup, element, bpmnFactory, translate);
  
    let listenerDetailsGroup = {
      id: 'listener-details',
      entries: [],
      enabled: function(element, node) {
        return options.getSelectedListener(element, node);
      },
      label: function(element, node) {
        var param = options.getSelectedListener(element, node);
        return getListenerLabel(param, translate);
      }
    };
  
    listenerDetails(listenerDetailsGroup, element, bpmnFactory, options, translate);

    let listenerFieldsGroup = {
      id: 'listener-fields',
      label: translate('Field Injection'),
      entries: [],
      enabled: function(element, node) {
        return options.getSelectedListener(element, node);
      }
    };
  
    listenerFields(listenerFieldsGroup, element, bpmnFactory, options, translate);
  
    return [
      listenerGroup,
      listenerDetailsGroup,
      listenerFieldsGroup
    ];
  }

// The "Listener" tab
export default (element, bpmnFactory, translate) => ({
    id: 'listener',
    label: 'Listener',
    groups: createListenerTabGroups(element, bpmnFactory, translate)
});
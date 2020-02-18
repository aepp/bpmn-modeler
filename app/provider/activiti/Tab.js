import serviceTaskProps from './ServiceTaskProps';

// Create the custom activiti tab
function createActivitiTabGroups(element) {
  
    // Create a group called "Activiti".
    var activitiGroup = {
      id: 'activiti',
      label: 'Activiti props',
      entries: []
    };
  
    // Add the expression props to the activiti group.
    serviceTaskProps(activitiGroup, element);
  
    return [
      activitiGroup
    ];
  }

// The "Activiti" tab
export default element => ({
    id: 'activiti',
    label: 'Activiti',
    groups: createActivitiTabGroups(element)
});
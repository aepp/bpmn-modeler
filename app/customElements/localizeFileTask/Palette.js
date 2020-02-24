import beansConfig from '../../../resources/common-tasks-meta-model';

const SERVICE_TASK_BEAN_NAME = 'asyncFileTransfer';
const RECEIVE_TASK_BEAN_NAME = 'asyncFileTransfer';
const serviceTaskBeanConfig = beansConfig.beans.filter(b => b.name === SERVICE_TASK_BEAN_NAME)[0];
const receiveTaskBeanConfig = beansConfig.beans.filter(b => b.name === RECEIVE_TASK_BEAN_NAME)[0];

export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate, modeling, elementRegistry) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
    this.modeling = modeling;
    this.elementRegistry = elementRegistry;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate,
      modeling,
      elementRegistry
    } = this;

    function createTask({serviceTaskProps, receiveTaskProps}) {
      return function(event) {
        const extensionElementsConfig = receiveTaskProps.extensionElements;
        const extensionElementsBusinessObjects = [];
        const serviceTaskType = 'bpmn:ServiceTask';
        const receiveTaskType = 'bpmn:ReceiveTask';

        for(let i = 0; i < extensionElementsConfig.length; i++) {
          let extensionElementConfig = extensionElementsConfig[i];
          let extensionElementParams = {};
          extensionElementConfig.defaults.forEach(d => extensionElementParams[d.name] = d.value);
          extensionElementsBusinessObjects.push(bpmnFactory.create(extensionElementConfig.type, extensionElementParams));
        }
          
        let receiveTaskExtensionElement = bpmnFactory.create('bpmn:ExtensionElements', {
          values: extensionElementsBusinessObjects
        });

        let serviceTaskBusinessObject = bpmnFactory.create(serviceTaskType);
        let receiveTaskBusinessObject = bpmnFactory.create(receiveTaskType);
  
        let elementsOfSameType = elementRegistry.filter(el => el.type === serviceTaskType && el.id.includes(serviceTaskProps.id));
        if(elementsOfSameType.length > 0) serviceTaskProps.id = `${serviceTaskProps.id}-${elementsOfSameType.length}`;

        elementsOfSameType = elementRegistry.filter(el => el.type === receiveTaskType && el.id.includes(receiveTaskProps.id));
        if(elementsOfSameType.length > 0) receiveTaskProps.id = `${receiveTaskProps.id}-${elementsOfSameType.length}`;

        serviceTaskBusinessObject = Object.assign(serviceTaskBusinessObject, serviceTaskProps);
        receiveTaskBusinessObject = Object.assign(receiveTaskBusinessObject, receiveTaskProps);
        receiveTaskBusinessObject.extensionElements = receiveTaskExtensionElement;

        const serviceTask = elementFactory.create(
          'shape', 
          {
            type: serviceTaskType,
            businessObject: serviceTaskBusinessObject
          }
        );

        const receiveTask = elementFactory.create(
          'shape', 
          {
            type: receiveTaskType,
            businessObject: receiveTaskBusinessObject,
            x: 200
          }
        );

        const sequenceFlow = elementFactory.createConnection({
          type: 'bpmn:SequenceFlow',
          source: serviceTask,
          target: receiveTask,
          waypoints: [{x:100, y:40}, {x:200, y:40}]
        });

        console.log(serviceTask)
        console.log(receiveTask)
        create.start(event, [serviceTask, receiveTask, sequenceFlow]);
      }
    }
    const serviceTaskProps = {
      expression: serviceTaskBeanConfig.defaults.filter(d => d.name === 'expression')[0].value, 
      id: serviceTaskBeanConfig.defaults.filter(d => d.name === 'id')[0].value,
      name: serviceTaskBeanConfig.label, 
      async: serviceTaskBeanConfig.defaults.filter(d => d.name === 'async')[0].value
    };
    const receiveTaskProps = {
      id: serviceTaskBeanConfig.partnerNode.defaults.filter(d => d.name === 'id')[0].value,
      name: serviceTaskBeanConfig.partnerNode.label,
      async: serviceTaskBeanConfig.partnerNode.defaults.filter(d => d.name === 'async')[0].value,
      extensionElements: serviceTaskBeanConfig.partnerNode.extensionElements
    };
    return {
      'create.localize_file-task': {
        group: 'activity',
        className: 'hr-icon icon-async-file-transfer',
        title: translate('Localize file task'),
        action: {
          dragstart: createTask({serviceTaskProps, receiveTaskProps}),
          click: createTask({serviceTaskProps, receiveTaskProps})
        }
      },
      // 'create.average-task': {
      //   group: 'activity',
      //   className: 'bpmn-icon-task yellow',
      //   title: translate('Create Task with average suitability score'),
      //   action: {
      //     dragstart: createTask(SUITABILITY_SCORE_AVERGE),
      //     click: createTask(SUITABILITY_SCORE_AVERGE)
      //   }
      // },
      // 'create.high-task': {
      //   group: 'activity',
      //   className: 'bpmn-icon-task green',
      //   title: translate('Create Task with high suitability score'),
      //   action: {
      //     dragstart: createTask(SUITABILITY_SCORE_HIGH),
      //     click: createTask(SUITABILITY_SCORE_HIGH)
      //   }
      // }
    }
  }
}

CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate',
  'modeling',
  'elementRegistry'
];

function createTaskCollection(event) {
  // extension element for the retry time cycle
  var failedJobRetryTmeCycle = bpmnFactory.create('camunda:FailedJobRetryTimeCycle', {
    body: 'R3/PT10S'
  });
    
  var r3pt10sExtensionElement = bpmnFactory.create('bpmn:ExtensionElements', {
    values: [ failedJobRetryTmeCycle ]
  });

  const invokeMyServicetaskShape = elementFactory.createShape({ type: 'bpmn:ServiceTask', x:0, y:0 });
  serviceTaskConfiguration(invokeMyServicetaskShape.businessObject, 'Invoke my service', '${logger}');
  invokeMyServicetaskShape.businessObject.extensionElements = r3pt10sExtensionElement;
  //console.log('the task', helloServicetaskShape);

  const exclusiveGatewayShape = elementFactory.createShape({type:'bpmn:ExclusiveGateway', x:150, y:15 });
  exclusiveGatewayShape.businessObject.name = 'continue?';

  const nextThingServiceTaskShape = elementFactory.createShape({ type: 'bpmn:ServiceTask', x:250, y:0 });
  serviceTaskConfiguration(nextThingServiceTaskShape.businessObject, 'Invoke the next service', '${logger}');
  nextThingServiceTaskShape.businessObject.extensionElements = r3pt10sExtensionElement;

  const otherThingServiceTaskShape = elementFactory.createShape({ type: 'bpmn:ServiceTask', x:250, y:130 });
  serviceTaskConfiguration(otherThingServiceTaskShape.businessObject, 'Do something else', '${logger}');
  otherThingServiceTaskShape.businessObject.extensionElements = r3pt10sExtensionElement;

  const correctItServiceTaskShape = elementFactory.createShape({ type: 'bpmn:ServiceTask', x:120, y:210 });
  serviceTaskConfiguration(correctItServiceTaskShape.businessObject, 'Correct the error', '${logger}');
  correctItServiceTaskShape.businessObject.extensionElements = r3pt10sExtensionElement;
  
  var definitions = bpmnJs.getDefinitions();
  var error = bpmnFactory.create('bpmn:Error', {errorCode: 'abc', name: 'myErrorName'});
  definitions.get('rootElements').push(error);
  
  // error event definition
  var erroreventDefinition = bpmnFactory.create('bpmn:ErrorEventDefinition', {
    errorCodeVariable: 'errorCode',
    errorMessageVariable: 'errorMessage',
    errorRef: error
  });    
  //console.log('errorEventDefinition:', erroreventDefinition);
  
  // attached boundary error event
  const erroreventShape = elementFactory.createShape({ type: 'bpmn:BoundaryEvent', x:50, y:62 });
  erroreventShape.businessObject.name = 'hallo error';
  erroreventShape.businessObject.attachedToRef = invokeMyServicetaskShape.businessObject;
  erroreventShape.businessObject.eventDefinitions = [erroreventDefinition];
  erroreventShape.host = invokeMyServicetaskShape;
  //console.log('the event', erroreventShape);

  erroreventDefinition.$parent = erroreventShape.businessObject;

  const sequenceFlowMyServiceExclusive = 
    createConnection(invokeMyServicetaskShape, exclusiveGatewayShape, [{x:100, y:40}, {x:150, y:40}]);
  
  // need a FormularExpression
  const sequenceFlowExclusiveNext = 
    createConnection(exclusiveGatewayShape, nextThingServiceTaskShape, [{x:200, y:40}, {x:250, y:40}]);
  sequenceFlowExclusiveNext.businessObject.name = 'yes';
  sequenceFlowExclusiveNext.businessObject.conditionExpression = 
    bpmnFactory.create('bpmn:FormalExpression', {body: '${continue}'});
  //console.log('conditional sequence flow: ', sequenceFlowExclusiveNext);

  const sequenceFlowExclusiveOther = 
    createConnection(exclusiveGatewayShape, otherThingServiceTaskShape, [{x:175, y:60}, {x:175, y:170}, {x:250, y:170}]);
  sequenceFlowExclusiveOther.businessObject.name = 'no';
  sequenceFlowExclusiveOther.businessObject.conditionExpression = 
    bpmnFactory.create('bpmn:FormalExpression', {body: '${not continue}'});

  const sequenceFlowErrorCorrect = 
    createConnection(erroreventShape, correctItServiceTaskShape, [{x:68, y:98}, {x:68, y:250}, {x:120, y:250}]);

  const sequenceFlowCorrectHello = 
    createConnection(correctItServiceTaskShape, invokeMyServicetaskShape, 
      [{x:220, y:250}, {x:250, y:250}, {x:250, y: 320}, {x:-30, y:320}, {x:-30, y:50}, {x:0, y:50}]);

  create.start(event, [
    invokeMyServicetaskShape, 
    erroreventShape, 
    exclusiveGatewayShape, 
    nextThingServiceTaskShape, 
    otherThingServiceTaskShape,
    correctItServiceTaskShape,
    sequenceFlowMyServiceExclusive,
    sequenceFlowExclusiveNext,
    sequenceFlowExclusiveOther,
    sequenceFlowErrorCorrect,
    sequenceFlowCorrectHello
  ]);
}
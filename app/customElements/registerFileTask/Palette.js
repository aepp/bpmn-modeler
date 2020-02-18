export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function createTask(props) {
      return function(event) {
        let businessObject = bpmnFactory.create('bpmn:ServiceTask');
  
        businessObject = Object.assign(businessObject, props);
  
        const shape = elementFactory.create(
          'shape', 
          {
            type: 'bpmn:ServiceTask',
            businessObject: businessObject
          }
        );
        create.start(event, shape);
      }
    }
    const taskProps = {
      expression: '${registerFileDelegate.registerSourceFileById(\'RESOURCE\', exportOrderResult.vioExportResourceId, fileName, execution.processInstanceId)}', 
      id: 'register_file', 
      name: 'File registrieren', 
      async: 'true'
    };
    return {
      'create.register_file-task': {
        group: 'activity',
        className: 'fas fa-cogs red',
        title: translate('Create register_file Task'),
        action: {
          dragstart: createTask(taskProps),
          click: createTask(taskProps)
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
  'translate'
];
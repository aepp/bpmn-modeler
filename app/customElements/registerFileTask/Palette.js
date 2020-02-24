import beansConfig from '../../../resources/common-tasks-meta-model';

export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate, elementRegistry, beanName) {
    console.log('beanName', beanName);
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
    this.elementRegistry = elementRegistry;
    this.beanName = beanName;
    this.beanConfig = beansConfig.beans.filter(b => b.name === beanName)[0];

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate,
      elementRegistry,
      beanName,
      beanConfig
    } = this;

    function createTask(props) {
      return function(event) {
        let type = 'bpmn:ServiceTask';
        let businessObject = bpmnFactory.create(type);

        const elementsOfSameType = elementRegistry.filter(el => el.type === type && el.id.includes(props.id));
        if(elementsOfSameType.length > 0) props.id = `${props.id}-${elementsOfSameType.length}`;

        businessObject = Object.assign(businessObject, props);

        const shape = elementFactory.create(
          'shape', 
          {
            type,
            businessObject
          }
        );
        create.start(event, shape);
      }
    }

    let defaultExpression = beanConfig.defaults.filter(d => d.name === 'expression')[0];
    let defaultId = beanConfig.defaults.filter(d => d.name === 'id')[0];
    let defaultAsync = beanConfig.defaults.filter(d => d.name === 'async')[0];

    const taskProps = {
      name: beanConfig.label,
      expression: defaultExpression ? defaultExpression.value : '',
      id: defaultId ? defaultId.value : '',
      async: defaultAsync ? defaultAsync.value : ''
    };
    return {
      [`create.${beanName}`]: {
        group: 'activity',
        className: `hr-icon icon-${beanConfig.iconClassName}`,
        title: translate(beanConfig.label),
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
  'translate',
  'elementRegistry',
  'beanName'
];
CustomPalette.$scope = ['request']
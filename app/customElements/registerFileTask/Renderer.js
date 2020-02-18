import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate
} from 'tiny-svg';

import {
  getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import { isNil } from 'min-dash';

const BEAN = 'registerFileDelegate';
const getMethodName = method => method + '(';
const METHODS = {
  registerSourceFileById: 'registerSourceFileById',
  registerById: 'registerById',
  registerFile: 'registerFile',
  registerFiles: 'registerFiles'
};

const HIGH_PRIORITY = 1500,
      TASK_BORDER_RADIUS = 2,
      COLOR_GREEN = '#52B415',
      COLOR_PURPLE = '#6e24bf',
      COLOR_PINK = '#bf2481',
      COLOR_BLUE = '#2472bf';


export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {
    // ignore labels
    if(!is(element, 'bpmn:ServiceTask') || element.labelTarget) return false;

    const businessObject = getBusinessObject(element);
    if(businessObject.expression && businessObject.expression.indexOf(BEAN) > 0){
      // console.log(businessObject);
      return true;
    }
    return false;
    // return is(element, 'bpmn:ServiceTask') && !element.labelTarget;
  }

  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    const expression = this.getExpression(element);

    if (!isNil(expression)) {
      const color = this.getColor(expression || '');

      const rect = drawRect(parentNode, 120, 20, TASK_BORDER_RADIUS, color);
  
      svgAttr(rect, {
        transform: 'translate(-20, -10)'
      });

      var text = svgCreate('text'); 

      svgAttr(text, {
        fill: '#fff',
        transform: 'translate(-15, 5)'
      });

      svgClasses(text).add('djs-label'); 
    
      svgAppend(text, document.createTextNode(BEAN)); 
    
      svgAppend(parentNode, text);
    }

    return shape;
  }

  getShapePath(shape) {
    if (is(shape, 'bpmn:ServiceTask')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }

  getExpression(element) {
    const businessObject = getBusinessObject(element);
  
    const { expression } = businessObject;

    return expression ? expression : null;
  }

  getColor(expression) {
    if (expression.includes(getMethodName(METHODS.registerById))) {
      return COLOR_GREEN;
    } else if (expression.includes(getMethodName(METHODS.registerSourceFileById))) {
      return COLOR_PURPLE;
    } else if (expression.includes(getMethodName(METHODS.registerFile))) {
      return COLOR_PINK;
    } else if (expression.includes(getMethodName(METHODS.registerFiles))) {
      return COLOR_BLUE;
    }

    return COLOR_BLUE;
  }
}

CustomRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color
  });

  svgAppend(parentNode, rect);

  return rect;
}
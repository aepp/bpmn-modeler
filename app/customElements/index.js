import RegisterFileTaskContextPad from './registerFileTask/ContextPad';
import RegisterFileTaskPalette from './registerFileTask/Palette';
import RegisterFileTaskRenderer from './registerFileTask/Renderer';
import LocalizeFileTaskContextPad from './localizeFileTask/ContextPad';
import LocalizeFileTaskPalette from './localizeFileTask/Palette';
import LocalizeFileTaskRenderer from './localizeFileTask/Renderer';

const getConfigByBeanName = beanName => {
  let contextPad = null;
  let palette = null;
  let renderer = null;

  let providers = {};
  let init = [];

  switch(beanName){
    case 'asyncFileTransfer':
      contextPad = LocalizeFileTaskContextPad;
      palette = LocalizeFileTaskPalette;
      renderer = LocalizeFileTaskRenderer;
      break;
    default: 
    contextPad = RegisterFileTaskContextPad;
    palette = RegisterFileTaskPalette;
    renderer = RegisterFileTaskRenderer;
  }

  if(contextPad) {
    providers[`${beanName}ContextPad`] = ['type', contextPad];
    init.push(`${beanName}ContextPad`);
  }
  if(palette) {
      providers[`${beanName}Palette`] = ['type', palette];
      init.push(`${beanName}Palette`);
  }
  if(renderer) {
      providers[`${beanName}Renderer`] = ['type', renderer];
      init.push(`${beanName}Renderer`);
  }

  return {providers, init};
};

export default beanName => {
  const {providers, init} = getConfigByBeanName(beanName);

  const config = Object.assign({
    __exports__: init.concat(['beanName']),
    __init__: init,
    beanName: ['factory', conflict => conflict],
    conflict: ['value', beanName]
  }, providers);
  return config;
};
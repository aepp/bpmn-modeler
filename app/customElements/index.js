import RegisterFileTaskContextPad from './registerFileTask/ContextPad';
import RegisterFileTaskPalette from './registerFileTask/Palette';
import RegisterFileTaskRenderer from './registerFileTask/Renderer';

export default {
  __init__: [ 'registerFileTaskContextPad', 'registerFileTaskPalette', 'registerFileTaskRenderer' ],
  registerFileTaskContextPad: [ 'type', RegisterFileTaskContextPad ],
  registerFileTaskPalette: [ 'type', RegisterFileTaskPalette ],
  registerFileTaskRenderer: [ 'type', RegisterFileTaskRenderer ]
};
var LISTENER_TYPE_LABEL = {
    class: 'Java Class',
    expression: 'Expression',
    delegateExpression: 'Delegate Expression',
    script: 'Script'
};

export const getListenerType = listener => listener && Object.keys(LISTENER_TYPE_LABEL).filter(lType => listener[lType] !== undefined)[0];
**THIS PACKAGE HAS BEEN ABANDONED**

# ignition-js

A beautiful error page for inspecting your JavaScript errors more closely

## Installation

### Standard installation

`yarn add ignition-js --dev`

```js
const config = {
    editor: 'vscode',
    theme: 'light',
};

if (process.env.NODE_ENV === 'development') {
    require('@facadecompany/ignition-js').default({ config });
}
```

### With Vue integration

Simply pass the `Vue` object in the `ignition-js` config.

```js
window.Vue = require('vue');

if (process.env.NODE_ENV === 'development') {
    require('@facadecompany/ignition-js').default({ Vue }); // <-- here
}
```

Note: If you're already using the `flare-client` with the Vue integration, you won't have to run this line, as `ignition-js` will piggyback off of the existing instance.

### With React integration

// TODO

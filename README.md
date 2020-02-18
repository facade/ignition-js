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

    // Optional Vue integration
    // Vue.use(require('@flareapp/flare-vue').flareVue);
}
```

### With Vue integration

Run this line **after** initializing the `ignition-js` client. Make sure it's only run in development mode.

If you're already using the `flare-client` with the Vue integration, you won't have to run this line, as `ignition-js` will piggyback off of the existing instance.

```js
if (process.env.NODE_ENV === 'development') {
    require('@facadecompany/ignition-js').default({});
    Vue.use(require('@flareapp/flare-vue').flareVue); // <-- This line here
}
```

### With React integration

// TODO

## Example setup with flare-clint

If you already have the `flare-client` set up with an integration to Vue, you won't have to add the Vue integration a second time:

```js
import { flare } from '@flareapp/flare-client';
import { flareVue } from '@flareapp/flare-vue';

flare.light('project-key');

window.Vue = require('vue');
Vue.use(flareVue);

if (process.env.NODE_ENV === 'development') {
    require('@facadecompany/ignition-js').default({});
    // No extra step needed for Vue integration, bcause ignition-js will use the error listener that was created in `flare.light`.
}
```

If you only register the `flare-client` in a production environment, you will need to use the extra step from the [with-vue-integration](TODO:link) section.

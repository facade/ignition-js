# ignition-js
A beautiful error page for inspecting your JavaScript errors more closely

### Installation

`yarn add ignition-js --dev`

```js
const config = {
    editor: "vscode",
    theme: "light"
};

if (process.env.NODE_ENV === "development") {
    require("@facadecompany/ignition-js").default({ config });
}
```

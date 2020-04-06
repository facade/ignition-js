export const ignitionErrorSelectorHTML = `
    <select
        id="__ignition__selector"
        style="
            position: absolute;
            right: 0;
            bottom: 0;
            margin: 10px;
            border: none;
            font-size: 16px;
            background-color: #f44336;
            color: #FFFFFF;
            z-index: 5;
        "
    >
        <option value="placeholder"></option>
    </select>
`;

export const selectorHTML = `
    <div
        style="
            height: 100%;
            width: 100%;
            background-color: red;
            border-radius: 5px;
            cursor: pointer;
        "
    >
        <p id="__ignition__error-selector-text">1 error found</p>
    </div>
`;

export const dropdownHTML = `
    <div id="app"></div>
`;

export const ignitionErrorContainerHTML = `
    <div
        style="
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            height: 90%;
            width: 90%;
            background-color: #FFFFFF;
            border: 1px solid black;
        "
    >
        <div
            id="__ignition__close"
            style="
                position: absolute;
                top: 0;
                right: 0;
                cursor: pointer;
                font-size: 30px;
            "
        >
            X
        </div>

        <iframe width="100%" height="100%"></iframe>
    </div>
`;

export const iframeHTMl = `
    <body>
        <div id="app">foo</div>
    </body>
`;

export const ignitionLoaderScript = `
    window.tabs = [];

    window.ignite({
        report: **report**,
        config: **config**,
        solutions: **solutions**,
        telescopeUrl: '',
        shareEndpoint: 'https://flareapp.io/api/public-reports',
        defaultTab: 'StackTab',
        defaultTabProps: {},
    }).start();
`;

export const debugScript = `
    var console = {
        __on: {},
        addEventListener: function(name, callback) {
            this.__on[name] = (this.__on[name] || []).concat(callback);
            return this;
        },
        dispatchEvent: function(name, value) {
            this.__on[name] = this.__on[name] || [];
            for (var i = 0, n = this.__on[name].length; i < n; i++) {
                this.__on[name][i].call(this, value);
            }
            return this;
        },
        log: function() {
            var a = [];
            // For V8 optimization
            for (var i = 0, n = arguments.length; i < n; i++) {
                a.push(arguments[i]);
            }
            this.dispatchEvent('log', a);
        },
    };

    // vue-devtools
    (function(d, script) {
        script = d.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = function(){
            // remote script has loaded
        };
        script.src = 'http://localhost:8098';
        d.getElementsByTagName('head')[0].appendChild(script);
    }(document));
`;

export const selectorIframeScript = `
    var listener = {
        __on: {},
        addEventListener: function(name, callback) {
            this.__on[name] = (this.__on[name] || []).concat(callback);
            return this;
        },
        dispatchEvent: function(name, value) {
            this.__on[name] = this.__on[name] || [];
            for (var i = 0, n = this.__on[name].length; i < n; i++) {
                this.__on[name][i].call(this, value);
            }
            return this;
        },
        clicked: function() {
            this.dispatchEvent('clicked');
        },
        incomingChange: function() {
            var a = [];
            // For V8 optimization
            for (var i = 0, n = arguments.length; i < n; i++) {
                a.push(arguments[i]);
            }
        }
    };

    document.addEventListener('click', () => listener.clicked());
`;

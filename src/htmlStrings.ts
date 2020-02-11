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
        "
    >
        <option value="placeholder"></option>
    </select>
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
        solutions: [],
        telescopeUrl: '',
        shareEndpoint: '',
        defaultTab: 'StackTab',
        defaultTabProps: {},
    }).start();
`;

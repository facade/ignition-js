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
        id="__ignition__container"
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
        <iframe width="100%" height="100%"></iframe>
    </div>
`;

export const iframeHTMl = `
    <body>
        <div id="app">foo</div>

        <script>**ignition-ui**</script>

        <script>
            // TODO: import '@flareapp/ignition-ui' somehow
            window.tabs = [];

            /* window.ignite({
                report: **report**,
                config: {
                    directorySeparator: '/',
                    editor: 'vscode',
                    enableRunnableSolutions: false,
                    enableShareButton: false,
                    localSitesPath: '',
                    remoteSitesPath: '',
                    theme: 'light',
                },
                solutions: [],
                telescopeUrl: '',
                shareEndpoint: '',
                defaultTab: 'StackTab',
                defaultTabProps: {},
            }).start(); */
        </script>
    </body>
`;

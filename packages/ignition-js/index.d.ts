type InitParams = {
    config?: Ignition.config;
};

declare module 'ignitionIframeScript' {
    export default string;
}
declare module 'selectorIframeScript' {
    export default string;
}
declare module 'dropdownIframeScript' {
    export default string;
}

namespace Flare {
    type Report = import('@flareapp/flare-client/src/types').Flare.ErrorReport;

    type StackFrame = import('@flareapp/flare-client/src/types').Flare.StackFrame;
}

interface Window {
    flare: import('node_modules/@flareapp/flare-client/src/FlareClient').default;
}

namespace Ignition {
    type config = {
        directorySeparator: string;
        editor: string;
        enableRunnableSolutions: boolean;
        enableShareButton: boolean;
        localSitesPath: string;
        remoteSitesPath: string;
        theme: 'light' | 'dark';
        Vue?: import('vue/types').VueConstructor;
        applicationPath?: string;
    };
}

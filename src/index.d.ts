type InitParams = {
    config: Ignition.config;
};

declare module 'ignitionIframeScript' {
    export default string;
}

type FlareReport = {
    context: {};
};

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
    };
}

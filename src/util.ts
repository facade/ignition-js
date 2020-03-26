import { ignitionLoaderScript } from './htmlStrings';

export function addRequiredContext(report: Flare.Report) {
    return {
        ...report,
        application_path: '', // TODO: add application path if we add it in https://github.com/facade/ignition-js/issues/14
        context: {
            ...report.context,
            request_data: {},
            headers: [],
            session: {},
            route: {},
            user: {},
            dumps: [],
            logs: [],
        },
    };
}

type HydrateIgnitionLoaderParams = {
    report: Flare.Report;
    config: {};
};

export function hydrateIgnitionLoader({ report, config }: HydrateIgnitionLoaderParams) {
    return ignitionLoaderScript
        .replace('**report**', JSON.stringify(addRequiredContext(report)))
        .replace('**config**', JSON.stringify(config))
        .replace('**solutions**', JSON.stringify(report.solutions));
}

export function addScriptToIframe(iframeElement: HTMLIFrameElement, scriptString: string) {
    const script = iframeElement.contentWindow!.document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = scriptString;

    iframeElement.contentDocument!.body.appendChild(script);
}

export function isUndefinedOrNull(value: any) {
    if (value === null || value === undefined) {
        return true;
    }

    return false;
}

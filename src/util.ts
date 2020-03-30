import { ignitionLoaderScript } from './htmlStrings';

export function addRequiredContext(report: Flare.Report, applicationPath?: string) {
    return {
        ...report,
        application_path: applicationPath,
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
    config: Ignition.config;
};

export function hydrateIgnitionLoader({ report, config }: HydrateIgnitionLoaderParams) {
    return ignitionLoaderScript
        .replace('**report**', JSON.stringify(addRequiredContext(report, config.applicationPath)))
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

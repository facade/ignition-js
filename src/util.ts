import { ignitionLoaderScript } from './htmlStrings';

export function addRequiredContext(report: FlareReport) {
    return {
        ...report,
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
    report: FlareReport;
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

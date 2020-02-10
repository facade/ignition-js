// Importing ignition-ui as a string using raw-loader (see webpack config)
import ignitionIframeScript from 'ignitionIframeScript';

import {
    ignitionErrorSelectorHTML,
    ignitionErrorContainerHTML,
    ignitionLoaderScript,
    iframeHTMl,
} from './htmlStrings';
import { addRequiredContext, hydrateIgnitionLoader } from './util';

// initialize the Flare client if it wasn't already initialized
if (!window.flare) {
    require('@flareapp/flare-client');
}

const { flare } = window;
const errors: Array<Error> = [];

flare.beforeEvaluate = (error: Error) => {
    errors.push(error);

    showIgnitionErrorSelector();

    return false;
};

function showIgnitionErrorSelector() {
    let selector: HTMLSelectElement = document.getElementById(
        '__ignition__selector',
    ) as HTMLSelectElement;

    if (!selector) {
        const div = document.createElement('div');
        div.innerHTML = ignitionErrorSelectorHTML;

        document.body.appendChild(div);

        selector = document.getElementById('__ignition__selector') as HTMLSelectElement;

        selector.addEventListener('change', handleSelectError);
    }

    selector.options[0].text = `Ignition found ${errors.length} error${
        errors.length > 1 ? 's' : ''
    } (click to show)`;

    const index = errors.length - 1;

    selector.options.add(new Option(`Error ${index + 1}: ${errors[index].message}`, index));
}

function showAndGetErrorIframe(): HTMLIFrameElement {
    const existingModal = document.getElementById('__ignition__modal');

    if (!existingModal) {
        const errorModal = document.createElement('div');
        errorModal.id = '__ignition__modal';
        errorModal.innerHTML = ignitionErrorContainerHTML;
        document.body.appendChild(errorModal);

        document
            .getElementById('__ignition__close')!
            .addEventListener('click', () => errorModal.remove());
    }

    const iframe = document.querySelector('#__ignition__modal iframe') as HTMLIFrameElement;

    return iframe;
}

function handleSelectError(e: Event) {
    // @ts-ignore
    const { value } = e.target;

    if (value === 'placeholder') {
        return;
    }

    const iframe = showAndGetErrorIframe();

    // Clear the iframe in case we were already displaying an error.
    iframe.contentDocument!.body.innerHTML = '';

    // Generate a report for the error and show it in the container
    flare.createReport(errors[value]).then((report: FlareReport) => {
        const ignitionLoaderContent = hydrateIgnitionLoader(ignitionLoaderScript, {
            report: addRequiredContext(report),
            config: {},
        });

        const div = iframe.contentWindow!.document.createElement('div');
        div.innerHTML = iframeHTMl;
        iframe.contentDocument!.body.appendChild(div);

        addScriptToIframe(iframe, ignitionIframeScript);
        addScriptToIframe(iframe, ignitionLoaderContent);
    });
}

function addScriptToIframe(iframeElement: HTMLIFrameElement, scriptString: string) {
    const script = iframeElement.contentWindow!.document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = scriptString;
    iframeElement.contentDocument!.body.appendChild(script);
}

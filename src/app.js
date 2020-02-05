// Importing ignition-ui as a string using raw-loader (see webpack config)
import ignitionIframeScript from 'ignitionIframeScript';

import {
    ignitionErrorSelectorHTML,
    ignitionErrorContainerHTML,
    ignitionLoaderScript,
    iframeHTMl,
} from './htmlStrings';

const { flare } = window;
const errors = [];

const errorModal = document.createElement('div');
errorModal.innerHTML = ignitionErrorContainerHTML;
errorModal.style.display = 'none';
document.body.appendChild(errorModal);
const iframe = document.querySelector('#__ignition__container > iframe');

if (flare) {
    flare.beforeEvaluate = error => {
        errors.push(error);

        showIgnitionErrorSelector();

        return false;
    };
}

function showIgnitionErrorSelector() {
    let selector = document.getElementById('__ignition__selector');

    if (!selector) {
        const div = document.createElement('div');
        div.innerHTML = ignitionErrorSelectorHTML;

        document.body.appendChild(div);

        selector = document.getElementById('__ignition__selector');

        selector.addEventListener('change', handleSelectError);
    }

    selector.options[0].text = `Ignition found ${errors.length} error${
        errors.length > 1 ? 's' : ''
    } (click to show)`;

    const index = errors.length - 1;

    selector.options.add(new Option(errors[index].message, index));
}

function handleSelectError(e) {
    const { value } = e.target;

    if (value === 'placeholder') {
        return;
    }

    // Show error container
    errorModal.style.display = 'block';

    const iframeDocument = iframe.contentDocument;

    // Clear the iframe in case we were already displaying an error.
    iframeDocument.body.innerHTML = '';

    // Generate a report for the error and show it in the container
    flare.createReport(errors[value]).then(report => {
        const ignitionLoaderContent = ignitionLoaderScript.replace(
            '**report**',
            JSON.stringify(report),
        );

        const div = iframe.contentWindow.document.createElement('div');
        div.innerHTML = iframeHTMl;
        iframeDocument.body.appendChild(div);

        addScriptToIframe(iframe, ignitionIframeScript);
        addScriptToIframe(iframe, ignitionLoaderContent);
    });
}

function addScriptToIframe(iframeElement, scriptString) {
    const iframeDocument = iframeElement.contentDocument;

    const script = iframeElement.contentWindow.document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = scriptString;
    iframeDocument.body.appendChild(script);
}

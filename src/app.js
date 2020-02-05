import { ignitionErrorSelectorHTML, ignitionErrorContainerHTML, iframeHTMl } from './htmlStrings';

const { flare } = window;
const errors = [];

if (flare) {
    flare.beforeEvaluate = error => {
        errors.push(error);

        showIgnitionErrorSelector();

        return false;
    };
}

const errorModal = document.createElement('div');
errorModal.innerHTML = ignitionErrorContainerHTML;
errorModal.style.display = 'none';
document.body.appendChild(errorModal);
const iframe = document.querySelector('#__ignition__container > iframe');

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

    // Generate a report for the error and show it in the container
    flare.createReport(errors[value]).then(report => {
        console.log(report);

        // TODO: replace **ignition-ui** with the content of the ignition-ui library somehow
        const iframeContent = iframeHTMl.replace('**report**', JSON.stringify(report));

        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(iframeContent);
        iframe.contentWindow.document.close();
    });
}

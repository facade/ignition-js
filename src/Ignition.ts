// Importing ignition-ui as a string using raw-loader (see webpack config)
import ignitionIframeScript from 'ignitionIframeScript';

import {
    ignitionErrorSelectorHTML,
    ignitionErrorContainerHTML,
    ignitionLoaderScript,
    iframeHTMl,
} from './htmlStrings';
import { addRequiredContext, hydrateIgnitionLoader } from './util';
import FlareClient from '@flareapp/flare-client/src/FlareClient';

export default class Ignition {
    public config: Ignition.config = {
        directorySeparator: '/',
        editor: 'vscode',
        enableRunnableSolutions: false,
        enableShareButton: true,
        localSitesPath: '',
        remoteSitesPath: '',
        theme: 'light',
    };

    public flare: FlareClient = window.flare;

    public errors: Array<Error> = [];

    private iframe: HTMLIFrameElement | null = null;

    constructor({ config }: InitParams) {
        this.config = { ...this.config, ...config };

        this.initializeFlare();
    }

    private initializeFlare() {
        // initialize the Flare client if it wasn't already initialized
        if (!window.flare) {
            require('@flareapp/flare-client');
        }

        this.flare = window.flare;

        this.flare.beforeEvaluate = (error: Error) => {
            this.errors.push(error);

            this.showIgnitionErrorSelector();

            return false;
        };
    }

    private showIgnitionErrorSelector() {
        let selector: HTMLSelectElement = document.getElementById(
            '__ignition__selector',
        ) as HTMLSelectElement;

        if (!selector) {
            const div = document.createElement('div');
            div.innerHTML = ignitionErrorSelectorHTML;

            document.body.appendChild(div);

            selector = document.getElementById('__ignition__selector') as HTMLSelectElement;

            selector.addEventListener('change', e => this.handleSelectError(e));
        }

        selector.options[0].text = `Ignition found ${this.errors.length} error${
            this.errors.length > 1 ? 's' : ''
        } (click to show)`;

        const index = this.errors.length - 1;

        selector.options.add(
            new Option(`Error ${index + 1}: ${this.errors[index].message}`, index.toString()),
        );
    }

    private showErrorIframe() {
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

        this.iframe = document.querySelector('#__ignition__modal iframe') as HTMLIFrameElement;
    }

    private handleSelectError(e: Event) {
        // @ts-ignore
        const { value } = e.target;

        if (value === 'placeholder') {
            return;
        }

        this.showErrorIframe();

        if (!this.iframe) {
            return;
        }

        // Clear the iframe in case we were already displaying an error.
        this.iframe.contentDocument!.body.innerHTML = '';

        // Generate a report for the error and show it in the container
        this.flare.createReport(this.errors[value]).then((report: FlareReport) => {
            const ignitionLoaderContent = hydrateIgnitionLoader(ignitionLoaderScript, {
                report: addRequiredContext(report),
                config: this.config,
            });

            if (!this.iframe) {
                return;
            }

            const div = this.iframe.contentWindow!.document.createElement('div');
            div.innerHTML = iframeHTMl;
            this.iframe.contentDocument!.body.appendChild(div);

            this.addScriptToIframe(this.iframe, ignitionIframeScript);
            this.addScriptToIframe(this.iframe, ignitionLoaderContent);
        });
    }

    private addScriptToIframe(iframeElement: HTMLIFrameElement, scriptString: string) {
        const script = iframeElement.contentWindow!.document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = scriptString;
        iframeElement.contentDocument!.body.appendChild(script);
    }
}

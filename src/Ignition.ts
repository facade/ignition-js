// Importing ignition-ui as a string using raw-loader (see webpack config)
import ignitionIframeScript from 'ignitionIframeScript';
import { flareVue } from '@flareapp/flare-vue';

import {
    ignitionErrorSelectorHTML,
    ignitionErrorContainerHTML,
    iframeHTMl,
    debugScript,
} from './htmlStrings';
import { addRequiredContext, hydrateIgnitionLoader, addScriptToIframe } from './util';
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
        Vue: undefined,
    };

    public flare: FlareClient = window.flare;

    public errors: Array<Error> = [];

    private iframe: HTMLIFrameElement | null = null;

    constructor({ config }: InitParams) {
        this.config = { ...this.config, ...config };

        this.initializeFlare();
        this.initializeVue();
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

    private initializeVue() {
        if (this.config.Vue) {
            this.config.Vue.use(flareVue);
        }
    }

    private showIgnitionErrorSelector() {
        let selector = document.getElementById('__ignition__selector') as HTMLSelectElement;

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
            const ignitionLoaderContent = hydrateIgnitionLoader({
                report: addRequiredContext(report),
                config: this.config,
            });

            if (!this.iframe) {
                return;
            }

            const div = this.iframe.contentWindow!.document.createElement('div');
            div.innerHTML = iframeHTMl;
            this.iframe.contentDocument!.body.appendChild(div);

            // Adding ignition-ui and the initialization script to the iframe's body
            addScriptToIframe(this.iframe, ignitionIframeScript);
            addScriptToIframe(this.iframe, ignitionLoaderContent);

            // Calling console.log on all console logs inside of the iframe
            if (process.env.NODE_ENV === 'development') {
                addScriptToIframe(this.iframe, debugScript);

                (this.iframe.contentWindow!.console as any).addEventListener(
                    'log',
                    (value: any) => {
                        console.log.apply(null, value);
                    },
                );
            }
        });
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
}

import { flareVue } from '@flareapp/flare-vue';
import getObjectHash from 'object-hash';

// Importing scripts as string using raw-loader (see webpack config)
import ignitionIframeScript from 'ignitionIframeScript';
/* import selectorIframeScript from 'selectorIframeScript'; */
import dropdownIframeScript from 'dropdownIframeScript';

import {
    ignitionErrorSelectorHTML,
    ignitionErrorContainerHTML,
    iframeHTMl,
    debugScript,
    selectorHTML,
    dropdownHTML,
    dropdownBridgeScript,
} from './htmlStrings';
import { hydrateIgnitionLoader, addScriptToIframe } from './util';
import FlareClient from '@flareapp/flare-client/src/FlareClient';
import { resolveStack } from './sourcemaps';

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
        applicationPath: undefined,
    };

    public flare: FlareClient = window.flare;

    public errors: Array<{ error: Error; hash: string; occurrences: number }> = [];

    private errorIframe: HTMLIFrameElement | null = null;
    private selectorIframe: HTMLIFrameElement | null = null;
    private dropdownIframe: HTMLIFrameElement | null = null;

    constructor({ config }: InitParams) {
        this.config = { ...this.config, ...config };

        this.toggleShowErrorDropdown = this.toggleShowErrorDropdown.bind(this);

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
            const hash = getObjectHash(error);
            const existingErrorIndex = this.errors.findIndex(error => error.hash === hash);

            // an error with this hash already exists, so we add 1 to the occurrences count
            if (existingErrorIndex !== -1) {
                this.errors[existingErrorIndex].occurrences += 1;
            }

            // no error with this hash exists yet, so we create a new one
            if (existingErrorIndex === -1) {
                this.errors.push({ error, hash, occurrences: 1 });
            }

            this.updateIgnitionErrorSelector();

            return false;
        };
    }

    private initializeVue() {
        if (this.config.Vue) {
            this.config.Vue.use(flareVue);
        }
    }

    /* private showIgnitionErrorSelector() {
        let selector = document.getElementById('__ignition__selector') as HTMLSelectElement;

        if (!selector) {
            // TODO: create 2 iframes to house the selector and dropdown

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
            new Option(`Error ${index + 1}: ${this.errors[index].error.message}`, index.toString()),
        );
    } */

    private updateIgnitionErrorSelector() {
        let selector = document.getElementById('__ignition__selector') as HTMLSelectElement;

        if (!selector) {
            // If the selector hasn't been created yet, create it now
            this.showErrorSelector();

            const div = document.createElement('div');
            div.innerHTML = ignitionErrorSelectorHTML;

            document.body.appendChild(div);

            selector = document.getElementById('__ignition__selector') as HTMLSelectElement;

            selector.addEventListener('change', e => this.handleSelectError(e));
        }

        this.updateSelectorErrorAmount();

        /* (selectorIframe.contentWindow as any).bridge.notify(); */

        selector.options[0].text = `Ignition found ${this.errors.length} error${
            this.errors.length > 1 ? 's' : ''
        } (click to show)`;

        const index = this.errors.length - 1;

        selector.options.add(
            new Option(`Error ${index + 1}: ${this.errors[index].error.message}`, index.toString()),
        );
    }

    private showErrorSelector() {
        const selectorIframe = document.createElement('iframe');
        const dropdownIframe = document.createElement('iframe');

        selectorIframe.setAttribute(
            'style',
            'height: 50px; width: 300px; margin: 5px; border: none; position: fixed; bottom: 0; right: 0; z-index: 100;',
        );
        dropdownIframe.setAttribute(
            'style',
            'display: none; height: 50px; width: 300px; margin: 5px; border: none; position: fixed; bottom: 50px; right: 0; z-index: 100;',
        );

        document.body.appendChild(selectorIframe);
        document.body.appendChild(dropdownIframe);

        const selectorDocument = selectorIframe.contentDocument!;
        const dropdownDocument = dropdownIframe.contentDocument!;

        selectorDocument.body.innerHTML = selectorHTML;
        dropdownDocument.body.innerHTML = dropdownHTML;

        selectorDocument.body.style.margin = '0';
        dropdownDocument.body.style.margin = '0';

        addScriptToIframe(dropdownIframe, dropdownIframeScript);
        addScriptToIframe(dropdownIframe, dropdownBridgeScript);

        selectorDocument.body.addEventListener('click', this.toggleShowErrorDropdown);

        this.selectorIframe = selectorIframe;
        this.dropdownIframe = dropdownIframe;
    }

    private updateSelectorErrorAmount() {
        const errorAmount = this.errors.length;
        const occurrenceAmount = this.errors.reduce((occurrenceAmount, error) => {
            return occurrenceAmount + error.occurrences;
        }, 0);

        const node = this.selectorIframe?.contentDocument?.getElementById(
            '__ignition__error-selector-text',
        );

        if (node) {
            node.innerText = `ignition-js encountered ${errorAmount} unique error${
                errorAmount > 1 ? 's' : ''
            } (${occurrenceAmount} total occurrence${occurrenceAmount > 1 ? 's' : ''})`;
        }
    }

    private toggleShowErrorDropdown() {
        if (!this.dropdownIframe) {
            return;
        }

        if (this.dropdownIframe.style.display === 'none') {
            this.dropdownIframe.style.display = 'block';
            document.addEventListener('click', this.toggleShowErrorDropdown);
        } else {
            this.dropdownIframe.style.display = 'none';
            document.removeEventListener('click', this.toggleShowErrorDropdown);
        }
    }

    private async handleSelectError(e: Event) {
        // @ts-ignore
        const { value } = e.target;

        if (value === 'placeholder') {
            return;
        }

        this.showErrorIframe();

        if (!this.errorIframe) {
            return;
        }

        // Clear the iframe in case we were already displaying an error.
        this.errorIframe.contentDocument!.body.innerHTML = '';

        // Generate a report for the error
        const report = await this.flare.createReport(this.errors[value].error);

        if (!report) {
            return;
        }

        // Use sourcemaps to resolve the bundled code to its original format
        const resolvedStack = await resolveStack(report.stacktrace);

        // Show the report in the ignition container
        const ignitionLoaderContent = hydrateIgnitionLoader({
            report: { ...report, stacktrace: resolvedStack },
            config: this.config,
        });

        if (!this.errorIframe) {
            return;
        }

        const div = this.errorIframe.contentWindow!.document.createElement('div');
        div.innerHTML = iframeHTMl;
        this.errorIframe.contentDocument!.body.appendChild(div);

        // Adding ignition-ui and the initialization script to the iframe's body
        addScriptToIframe(this.errorIframe, ignitionIframeScript);
        addScriptToIframe(this.errorIframe, ignitionLoaderContent);

        // Allow iframe console.log calls to reach the console when developing ignition-js
        if (process.env.NODE_ENV === 'development') {
            addScriptToIframe(this.errorIframe, debugScript);

            (this.errorIframe.contentWindow!.console as any).addEventListener(
                'log',
                (value: any) => {
                    console.log.apply(null, value);
                },
            );

            (this.errorIframe.contentWindow!.console as any).addEventListener(
                'error',
                (value: any) => {
                    console.error.apply(null, value);
                },
            );
        }
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

        this.errorIframe = document.querySelector('#__ignition__modal iframe') as HTMLIFrameElement;
    }
}

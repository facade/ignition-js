import Vue from 'vue';
import App from './components/App';

export default class Ignition {
    constructor(data) {
        console.log(data);
        this.data = data;

        this.tabCallbacks = [];
    }

    registerBuiltinTabs() {
        Vue.component('AppTab', require('./components/Tabs/AppTab').default);
        Vue.component('ContextTab', require('./components/Tabs/ContextTab').default);
        Vue.component('DebugTab', require('./components/Tabs/DebugTab').default);
        Vue.component('RequestTab', require('./components/Tabs/RequestTab').default);
        Vue.component('StackTab', require('./components/Tabs/StackTab').default);
        Vue.component('UserTab', require('./components/Tabs/UserTab').default);
    }

    registerCustomTabs() {
        this.tabCallbacks.forEach(callback => callback(Vue, this.data));

        this.tabCallbacks = [];
    }

    registerTab(callback) {
        this.tabCallbacks.push(callback);
    }

    createContainer() {
        const modalStyles = [
            'position: fixed;',
            'z-index: 1000;',
            'left: 0;',
            'top: 0;',
            'width: 100%;',
            'height: 100%;',
            'overflow: auto;',
            'background-color: rgba(0,0,0,0.5);',
        ];
        const modal = document.createElement('div');
        modal.style = modalStyles.join(' ');

        const errorPage = document.createElement('div');
        errorPage.id = 'ignition-error-page';

        modal.appendChild(errorPage);
        document.body.appendChild(modal);
    }

    start() {
        this.registerBuiltinTabs();

        this.registerCustomTabs();

        this.createContainer();

        window.app = new Vue({
            data: () => this.data,

            render(h) {
                return h(App, {
                    props: {
                        report: {
                            ...this.report,
                            stacktrace: this.report.stacktrace.map(frame => ({
                                ...frame,
                                relative_file: frame.file.replace(
                                    `${this.report.application_path}/`,
                                    '',
                                ),
                            })),
                        },
                        config: this.config,
                        solutions: this.solutions,
                        telescopeUrl: this.telescopeUrl,
                        shareEndpoint: this.shareEndpoint,
                        defaultTab: this.defaultTab,
                        defaultTabProps: this.defaultTabProps,
                    },
                });
            },
        }).$mount('#ignition-error-page');
    }
}

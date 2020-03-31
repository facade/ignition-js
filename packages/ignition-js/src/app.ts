import Ignition from './Ignition';

export default function initializeIgnition(initParams: InitParams = {}) {
    return new Ignition(initParams);
}

export { FlareErrorBoundary as IgnitionErrorBoundary } from '@flareapp/flare-react';

import Ignition from './Ignition';

export default function initializeIgnition(initParams: InitParams = {}) {
    return new Ignition(initParams);
}

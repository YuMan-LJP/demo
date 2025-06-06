import mitt from 'mitt';

const emitter = new mitt()

export default {
    install: (app) => {
        app.config.globalProperties["$bus"] = emitter;
    }
}
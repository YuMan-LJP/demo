import LoadingComponent from './Loading.vue';

const Loading = {}

// Vue暴露了一个install方法，用于自定义插件
Loading.install = function (Vue) {
    // 创建一个子类
    const LoadingConstructor = Vue.extend(LoadingComponent);
    // 实例化这个子类
    const instance = new LoadingConstructor();
    // 创建一个div元素，并把实例挂载到div元素上
    instance.$mount(document.createElement('div'));
    // 将el插入到body元素中
    document.body.appendChild(instance.$el);

    // 添加实例方法
    Vue.prototype.$setBusy = (msg) => {
        if (msg) {
            instance.msg = msg;
        }
        instance.isShow = true;
    };
    Vue.prototype.$clearBusy = () => {
        instance.isShow = false;
    };
}

export default Loading;
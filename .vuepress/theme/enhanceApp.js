import vuescroll from 'vuescroll';
import moment from 'moment'

export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  // ...做一些其他的应用级别的优化
  Vue.use(vuescroll, {
    ops: {
      bar: {
        background: "#c1c1c1"
      }
    }, // 在这里设置全局默认配置
    name: 'VueScroll' // 在这里自定义组件名字，默认是vueScroll
  });
  Vue.prototype.$moment = moment;
}
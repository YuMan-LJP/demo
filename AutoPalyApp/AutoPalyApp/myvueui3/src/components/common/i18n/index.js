import { createI18n } from 'vue-i18n'
 
//多语言使用方法：
// $t：普通词
// $tc：单复数
// $te：check 翻译key是否存在
// $d：时间日期
// $n：货币数字
const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'zh',
  messages: {
    'zh': require('./zh'),
    'en': require('./en')
  },
})
 
export default i18n
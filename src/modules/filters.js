import Vue from 'vue'
import i18n from '@/plugins/i18n'

// custom filters
Vue.filter('numToLocale', val => val.toLocaleString(i18n.locale))

Vue.filter('intToLocale', val => val.toLocaleString(i18n.locale, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}))


Vue.filter('currency', val => val.toLocaleString(i18n.locale, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}))

Vue.filter('currencyInt', val => (val / 100).toLocaleString(i18n.locale, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}))

Vue.filter(
  'truncate',
  (text, stop, clamp) => text.slice(0, stop) + (stop < text.length ? clamp || '...' : '')
)


Vue.filter('secondsToClock', seconds => new Date(seconds * 1000).toISOString().substr(14, 5))

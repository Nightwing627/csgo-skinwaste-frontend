import Errors from './errors'
import Toast from '@/components/toast'
import i18n from '@/plugins/i18n'

const balErrors = ['toWager', 'toDeposit']

export default error => {
  let err = { ...error }

  if (process.env.NODE_ENV === 'development') console.log(error)

  if (process.env.NODE_ENV === 'production') {
    // bugsnag integration
  }

  if (!err.code) {
    err = {
      code: -1,
      message: 'Unknown Error'
    }
  }

  const errorData = err.errors || {}
  Object.keys(errorData).forEach(i => {
    if (balErrors.includes(i)) {
      errorData[i] = (errorData[i] / 100).toLocaleString(i18n.locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  })

  // time to minutes
  Object.keys(errorData).forEach(i => {
    if (['timeLeft'].includes(i)) {
      errorData[i] = Math.round(errorData[i] / 1000 / 60)
    }
  })


  const errorString = i18n.t(`errors.${Errors[err.code]}`, errorData)

  Toast.open({
    type: 'error',
    text: `${errorString} (${err.code})`,
    closable: false
  })
}

import { Howl, Howler } from 'howler'
import clamp from 'lodash.clamp'
import extend from 'lodash.assignin'

/**
 * FFMPEG COMMANDS FOR BATCH CONVERSION
 *
 * WAV -> MP3: FOR /F "tokens=*" %G IN ('dir /b *.wav') DO ffmpeg -i "%G" -acodec mp3 "%~nG.mp3"
 * WAV -> WEBM: FOR /F "tokens=*" %G IN ('dir /b *.wav') DO ffmpeg -i "%G" "%~nG.webm"
 */

const SOUNDS = {
  // toasts
  toast_success: 'success',
  toast_error: 'error',
  toast_info: 'info',

  tradeReady: 'tradeReady',

  // chat
  // chat_mention: 'chat/mention',
  // chat_send: 'chat/send',
  // chat_announcement: 'chat/announcement',

  roll: 'roll',
  coinflip_roll: 'coinflipRoll',
  coin_party: 'coinRain',
  roulette_spin: 'rouletteSpin',
  roulette_gold: 'rouletteGold',
  roulette_win: 'rouletteWin',
  announcement: 'announcement'
}

export function play(sound, options = {}) {
  if (!sound || typeof SOUNDS[sound] === 'undefined') {
    return console.error('[sound.js] no sound provided')
  }

  // eslint-disable-next-line
  const webm = require(`@/assets/sounds/${SOUNDS[sound]}.webm`)
  // eslint-disable-next-line
  const mp3 = require(`@/assets/sounds/${SOUNDS[sound]}.mp3`)

  let setup = {
    src: [webm, mp3],
    format: ['webm', 'mp3'],
    autoplay: true,
    preload: true
  }

  if (options.volume) {
    extend(options, {
      volume: clamp(options.volume, 0, Howler.volume())
    })
  }

  setup = Object.assign(setup, options)

  return new Howl(setup)
}

export function setVolume(vol) {
  Howler.volume(vol)
}

export function getVolume() {
  return Howler.volume()
}

export function setMute(state) {
  Howler.mute(state)
}

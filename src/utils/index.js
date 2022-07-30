import errorToast from './errorToast'
import * as chat from './chat'

export { errorToast, chat }

export const ID = () => `_${Math.random().toString(36).substr(2, 9)}`

export const SeededRand = seed => {
  const mod1 = 7247
  const mod2 = 7823

  seed = (seed * seed) % (mod1 * mod2)
  return seed / (mod1 * mod2)
}

export const LCG = s => () => ((s = Math.imul(741103597, s)) >>> 0) / 2 ** 32

export const sleep = ms => new Promise(res => {
  setTimeout(res, ms)
})

export const CenteredPopup = (url, title, w, h) => {
  // Fixes dual-screen position Most browsers Firefox
  const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width

  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height

  const left = width / 2 - w / 2 + dualScreenLeft
  const top = height / 2 - h / 2 + dualScreenTop
  const newWindow = window.open(url, title, `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`)

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }

  return newWindow
}

export const handleTokenParam = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  if (!token) return

  localStorage.setItem('token', token)

  urlParams.delete('token')
  const url = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`

  window.history.replaceState(null, null, url)
}


const OPEN_STATES = ['waiting', 'active']
export const parseJackpot = pot => ({
  id: pot._id,
  roundId: pot.roundID,
  status: pot.state,
  open: OPEN_STATES.includes(pot.state),
  rolledAt: pot.state === 'complete' ? pot.endTime : null,
  rollingAt: pot.secondsTillRoll ? Date.now() + pot.secondsTillRoll : null,

  pf: {
    hash: pot.gameHash,
    ticket: pot.percent || null,
    randomHash: pot.randomHash || null,
    roll: pot.roll || null,
    seed: pot.unencodedServerHash || null,
    total: pot.pot || null,
    winnerId: pot.winnerId || null
  },

  bets: pot.bets.map(i => ({
    id: i._id,
    amount: i.amount,
    items: i.items,
    userId: i.user
  })),

  players: Object.values(pot.players).reduce((acc, player) => {
    acc[player._id] = {
      id: player._id,
      username: player.username,
      avatar: player.avatar,
      steamId: player.steamID,
      level: player.level,
      rank: player.rank
    }
    return acc
  }, {})
})

const COINFLIP_STATES = ['Joinable', 'Joined', 'Complete', 'Complete']
export const parseCoinflip = game => {
  const data = {
    id: game.gameID,
    state: game.state,
    status: COINFLIP_STATES[game.state],
    total: game.pot,
    rolledAt: game.endTime || false,
    rollingAt: game.secondsTillRoll ? Date.now() + game.secondsTillRoll : null,
    pf: {
      hash: game.gameHash,
      ticket: game.percent || null,
      randomHash: game.randomHash || null,
      roll: game.roll || null,
      seed: game.unencodedServerHash || null,
      total: game.pot || null,
      winnerId: game.winnerId || null
    },
    creator: game.createdBy,
    t: game.t,
    ct: game.ct,
    range: game.range
  }

  if (game.winnerId) {
    const players = [game.ct, game.t]
    data.winner = players.find(i => i.user._id === game.winnerId)
  }

  return data
}

export const parseWheel = (pot, isHistory = false) => {
  const players = pot.players || {}
  return {
    id: pot._id,
    roundId: pot.roundID,
    status: pot.state,
    open: pot.state === 'active',
    rolledAt: pot.state === 'complete' ? pot.endTime : null,
    rollingAt: pot.secondsTillRoll ? Date.now() + pot.secondsTillRoll : null,

    pf: {
      hash: pot.gameHash,
      randomHash: pot.randomHash || null,
      results: !isHistory ? pot.results || [] : pot.results.reverse(),
      seed: pot.unencodedServerHash || null
    },

    bets: !isHistory ? pot.bets : {},

    players: !isHistory ? Object.values(players).reduce((acc, player) => {
      acc[player._id] = {
        id: player._id,
        username: player.username,
        avatar: player.avatar,
        steamId: player.steamID,
        level: player.level,
        rank: player.rank
      }
      return acc
    }, {}) : {}
  }
}

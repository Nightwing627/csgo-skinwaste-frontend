/* eslint-disable no-cond-assign */
/* eslint-disable import/prefer-default-export */

import emojiRegex from 'emoji-regex'

import emojis from 'gemoji'
import customEmotes from '@/components/Sidebar/views/chat/emotes'


const emojire = emojiRegex().source.replace(/\/|g/g, '')
const RE = `(@[A-z0-9#.:_-]+#[0-9]{4})|(:[0-9A-Za-z-_]+:|${emojire})`
const BLOCK_REGEX = new RegExp(RE, 'g')

const acEmoteRE = /:([0-9A-Za-z-_]{2,})$/

// const BLOCK_REGEX = /(@[A-z0-9#.\-:_]+#[0-9]{4})|(:[A-Za-z]+:)/g

export const tokenize = message => {
  const tokens = []
  const blocks = []

  let results
  while ((results = BLOCK_REGEX.exec(message)) !== null) {
    if (results[1]) {
      const match = results[1]
      blocks.push({
        type: 'mention',
        payload: match.substring(1),
        from: results.index,
        to: results.index + match.length
      })
    }
    if (results[2]) {
      const match = results[2]
      blocks.push({
        type: 'emote',
        payload: match,
        from: results.index,
        to: results.index + match.length
      })
    }
  }

  if (blocks.length) {
    // console.log(blocks)

    let currIndex = 0
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]

      // don't push to tokens if empty string
      if (message.substring(currIndex, block.from) === '') {
        currIndex = block.to

        // push block
        tokens.push({
          type: block.type,
          payload: block.payload
        })
        continue
      }

      tokens.push({
        type: 'rawtext',
        payload: message.substring(currIndex, block.from)
      })
      currIndex = block.to

      // push block behind text
      tokens.push({
        type: block.type,
        payload: block.payload
      })
    }

    // Last element
    if (message.substring(currIndex, message.length) !== '') {
      tokens.push({
        type: 'rawtext',
        payload: message.substring(currIndex, message.length)
      })
    }
  } else {
    tokens[0] = {
      type: 'rawtext',
      payload: message
    }
  }

  return tokens
}

export const parseMessage = chat => {
  const data = chat
  data.message = tokenize(chat.message)

  /** TODO
   *
   * Process mention pings
   *
   */

  const allEmojis = chat.message.every(i => i.type === 'emote')
  const allEmojisWSpaces = chat.message.every(i => i.type !== 'mention')
    && chat.message.filter(i => i.type === 'rawtext').every(i => !i.payload.replace(/\s/g, '').length)


  if (allEmojis || allEmojisWSpaces) data.emoteOnly = true

  return data
}

/**
 * Returns the last possible emote match of the message or false
 * @param {String} message input message
 * @returns string match or false
 */
export const acEmote = message => {
  const match = message.match(acEmoteRE)
  if (match && match[1]) return match[1]
  return false
}


/**
 * Returns the last possible emote match of the message or false
 * @param {String} message input message
 * @returns string match or false
 */
export const replaceEmote = (message, emote) => message.replace(acEmoteRE, `:${emote}:`)


// arrays brother
export const emotes = [...Object.keys(customEmotes), ...Object.keys(emojis.name)]

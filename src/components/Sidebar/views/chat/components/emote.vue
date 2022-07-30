<template>
  <img
    v-if="emote"
    class="emoji mr-1"
    :src="ripped ? 'https://cdn.frankerfacez.com/emoticon/383816/1' : image"
    :alt="gemoji ? gemoji.name : data"
    :title="gemoji ? gemoji.name : data"
    :class="{ripped}"
    @error="ripped = true"
  >
  <span v-else class="mr-1 caption">{{ data }}</span>
</template>

<script>
import gemojis from 'gemoji'
import customEmotes from '../emotes'

export default {
  name: 'ComponentMessageEmote',
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ripped: false
    }
  },
  computed: {
    image() {
      if (!this.emote) return false

      if (this.emote.type === 'gemoji') {
        return `https://twemoji.maxcdn.com/2/72x72/${toCodePoint(this.emote.emoji)}.png`
      }
      if (this.emote.type === 'custom') {
        return this.emote.emoji
      }

      return false
    },
    gemoji() {
      if (this.emote && this.emote.type === 'gemoji') {
        return gemojis.name[this.emote] || gemojis.unicode[this.emote]
      }
      return false
    },
    emote() {
      const emote = this.data.replace(/:/g, '')

      const gemoji = gemojis.name[emote] || gemojis.unicode[emote] || false
      if (gemoji) {
        return {
          type: 'gemoji',
          emoji: gemoji.emoji
        }
      }

      if (customEmotes[emote]) {
        return {
          type: 'custom',
          emoji: customEmotes[emote]
        }
      }

      return false
    }
  }
}

function toCodePoint(unicode) {
  const r = []
  let c = 0
  let p = 0
  let i = 0

  while (i < unicode.length) {
    c = unicode.charCodeAt(i++)
    if (p) {
      r.push(((p << 10) + c - 56613888).toString(16))
      p = 0
    } else if (c >= 0xd800 && c <= 0xdbff) {
      p = c
    } else {
      r.push(c.toString(16))
    }
  }
  return r.join('-')
}
</script>

<style lang="scss" scoped>
img.emoji {
  height: 1.5em;
  // width: 1.5em;
  margin: 0 0.05em 0 0.1em;
  vertical-align: -0.1em;

  &.ripped {
    // display: none;
    // background: red;
    opacity: 0.3;
  }
}
</style>

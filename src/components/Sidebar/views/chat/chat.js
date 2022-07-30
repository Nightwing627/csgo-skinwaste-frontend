import { mapGetters, mapActions, mapMutations } from 'vuex'

import sortBy from 'lodash.sortby'
import UserMessage from './components/UserMessage.vue'
import TipMessage from './components/TipMessage.vue'
import Announcement from './components/Announcement.vue'
import Coinparty from './components/Coinparty.vue'

import Emote from './components/emote'

import { acEmote, replaceEmote, emotes } from '@/utils/chat'
import { errorToast } from '@/utils'

// set

export default {
  name: 'SidebarViewChat',
  components: {
    UserMessage,
    TipMessage,
    Announcement,
    Emote,
    Coinparty
  },
  data() {
    return {
      scrollPaused: false,
      eventHandlers: {},
      autocomplete: {
        open: false,
        selected: 0,
        emotes: [],
        mentions: [],
        commands: []
      },
      agreeing: false
    }
  },
  watch: {
    messages(val, old) {
      if (val && !old) {
        this.$nextTick(() => this.scrollToBottom(true))
      }

      this.$nextTick(this.scrollToBottom)
    },
    currentRoom() {
      this.$nextTick(() => this.scrollToBottom(true))
    },
    input(val) {
      if (val && val.length > 1) {
        // reset to 0
        this.autocomplete.selected = 0

        // TODO: broaden this to all types of autocomplete
        const emote = acEmote(val)
        if (emote) {
          const filtered = sortBy(
            emotes.filter(
              k => k.toLowerCase().indexOf(emote.toLowerCase()) !== -1
            ),
            x => x.length
          )

          if (filtered.length > 10) filtered.length = 10

          this.autocomplete.emotes = filtered

          if (filtered.length) this.autocomplete.open = true
          else if (this.autocomplete.open) this.autocomplete.open = false
        } else if (this.autocomplete.open) {
          this.autocomplete.open = false
          if (this.autocomplete.emotes.length) this.autocomplete.emotes = []
        }
      } else if (this.autocomplete.open) {
        this.autocomplete.open = false
        if (this.autocomplete.emotes.length) this.autocomplete.emotes = []
      }
    },
    'chatOpen.open': function onSidebarOpen(val) {
      if (val) this.$nextTick(() => this.scrollToBottom(true))
    }
  },
  computed: {
    ...mapGetters({
      config: 'config',
      messages: 'chat/messages',
      availableRooms: 'chat/roomNames',
      currentRoom: 'chat/currentRoom',
      sending: 'chat/isSending',
      onlineCount: 'chat/onlineCount',
      user: 'user/getUser',
      chatOpen: 'sidebar',
      focused: 'windowFocused'
    }),
    input: {
      get() {
        return this.$store.state.chat.input
      },
      set(v) {
        this.setInput(v)
      }
    }
  },
  async mounted() {
    try {
      await this.getChat()
      await this.$nextTick()
      this.getCoinparty()
      this.scrollToBottom(true)
    } catch (e) {
      // console.error(e)
    }
  },
  methods: {
    ...mapActions({
      sendMessage: 'chat/send',
      getChat: 'chat/getChat',
      getCoinparty: 'coinparty/get'
    }),
    ...mapMutations({
      setCurrentRoom: 'chat/setCurrentRoom',
      receiveMessage: 'chat/receiveMessage',
      setInput: 'chat/setInput',
      setSidebar: 'setSidebar',
      setChatRulesAgree: 'user/setChatRulesAgree'
    }),
    toggleEmojis() {
      this.autocomplete.emotes = emotes
      this.autocomplete.open = !this.autocomplete.open
    },
    onKeypress(e) {
      if (e.key === 'Enter') {
        e.preventDefault()
        this.send()
      }
    },
    onKeyDown(e) {
      if (this.autocomplete.open) {
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (this.autocomplete.selected === 0) this.autocomplete.selected = this.autocomplete.emotes.length - 1
          else this.autocomplete.selected -= 1
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault()
          if (
            this.autocomplete.selected
            === this.autocomplete.emotes.length - 1
          ) this.autocomplete.selected = 0
          else this.autocomplete.selected += 1
        }

        if (e.key === 'Tab' || e.key === 'Enter') {
          e.preventDefault()
          const selected = this.autocomplete.emotes[this.autocomplete.selected]
          this.setInput(replaceEmote(this.input, selected))
        }
      }
    },
    replaceEmote(emote) {
      if (!this.autocomplete.open) return
      let replace = replaceEmote(this.input, emote)
      if (this.input === replace) replace += `:${emote}:` // if user clicks on emote instead of using auto complete
      this.setInput(replace)
      this.$refs.input.focus()
    },
    scrollToBottom(forced = false) {
      if (!this.chatOpen.open) return
      const messagesDiv = this.$el.querySelector('.messages')
      if (this.scrollPaused && !forced) return

      messagesDiv.scrollTop = messagesDiv.scrollHeight
    },
    send(message = this.input) {
      if (this.sending) return false
      if (!message.replace(/\s/g, '').length) return false

      this.scrollToBottom(true)

      return this.sendMessage({
        message,
        room: this.currentRoom
      })
    },
    onScrollMessage(e) {
      const el = e.target
      const height = el.scrollHeight - el.offsetHeight

      if (el.scrollTop < height - 100) {
        this.scrollPaused = true
      } else this.scrollPaused = false
    },
    closeChat() {
      this.setSidebar(false)
    },
    async agreeChatRules() {
      if (this.agreeing) return

      this.agreeing = true

      this.$socket.emit('chat.agreeRules', err => {
        this.agreeing = false

        if (err) {
          errorToast(err)
          return
        }

        this.setChatRulesAgree(true)
        this.$toast.open({ type: 'success', text: 'Thanks :)' })
      })
    }
  }
}

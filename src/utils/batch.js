import EventEmitter from 'events'

export default class BatchProcess extends EventEmitter {
  constructor(delay = 50, batchSize = 100) {
    super()
    this.queue = []
    this.processing = false

    this.delay = delay
    this.batchSize = batchSize
  }

  add(el) {
    this.queue.unshift(el)
    this.run()
  }

  run(internal = false) {
    if (!this.queue.length) {
      this.processing = true
      return
    }

    if (this.processing && !internal) return

    this.processing = true

    const batch = this.queue.splice(0, this.batchSize)
    this.emit('process', batch)

    setTimeout(() => this.run(true), this.delay)
  }
}

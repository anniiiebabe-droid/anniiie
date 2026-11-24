Component({
  properties: {
    size: { type: String, value: 'medium' },
    equipped: { type: Object, value: {} },
    expression: { type: String, value: 'happy-face' },
    interactive: { type: Boolean, value: false },
    mood: { type: String, value: 'calm' }
  },
  methods: { tap() { if (this.data.interactive) this.triggerEvent('interact') } }
})

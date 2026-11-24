Component({
  properties: {
    size: { type: String, value: 'medium' },
    equipped: { type: Object, value: {} },
    expression: { type: String, value: 'default' },
    interactive: { type: Boolean, value: false }
  },
  methods: { tap() { if (this.data.interactive) this.triggerEvent('interact') } }
})

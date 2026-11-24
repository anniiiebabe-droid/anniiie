Component({
  properties: { item: Object },
  methods: {
    detail() { this.triggerEvent('detail', { id: this.data.item.id }) },
    consume() { this.triggerEvent('consume', { id: this.data.item.id }) }
  }
})

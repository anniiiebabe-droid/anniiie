const dataManager = require('./storage/data-manager')

App({
  onLaunch() {
    dataManager.initialize()
  },
  globalData: {
    lastReward: null
  }
})

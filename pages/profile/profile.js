const report = require('../../services/report-service')
const dm = require('../../storage/data-manager')
const ls = require('../../services/lingling-service')
Page({
  data: { report: {}, lingling: {}, reminders: true, profile: {}, avatarInitial: '先', showEditor: false, draftNickname: '', draftAvatar: '', draftInitial: '先' },
  onShow() { if (this.getTabBar()) this.getTabBar().setData({ selected: 3 }); const state = dm.getState(), profile = state.profile || {}; this.setData({ report: report.current(), lingling: ls.summary(state.lingling), reminders: state.preferences.reminders, profile, avatarInitial: String(profile.nickname || '先').charAt(0) }) },
  go(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  toggle(e) { dm.update(state => { state.preferences.reminders = e.detail.value }); this.setData({ reminders: e.detail.value }) },
  wechatLogin() { wx.showLoading({ title: '正在登录' }); wx.login({ success: () => { const nickname = this.data.profile.nickname === '惜食新朋友' ? '微信用户' : this.data.profile.nickname; dm.update(state => { state.profile.loggedIn = true; state.profile.nickname = nickname; state.profile.loginAt = Date.now() }); wx.hideLoading(); this.onShow(); wx.showToast({ title: '登录成功', icon: 'success' }) }, fail: () => { wx.hideLoading(); wx.showToast({ title: '登录失败，请重试', icon: 'none' }) } }) },
  chooseAvatar(e) { const avatarUrl = e.detail.avatarUrl; dm.update(state => { state.profile.avatarUrl = avatarUrl }); this.setData({ 'profile.avatarUrl': avatarUrl }) },
  openEditor() { const profile = this.data.profile; this.setData({ showEditor: true, draftNickname: profile.nickname || '', draftAvatar: profile.avatarUrl || '', draftInitial: String(profile.nickname || '先').charAt(0) }) },
  closeEditor() { this.setData({ showEditor: false }) }, noop() {},
  chooseDraftAvatar(e) { this.setData({ draftAvatar: e.detail.avatarUrl }) },
  nicknameInput(e) { const value = e.detail.value; this.setData({ draftNickname: value, draftInitial: String(value || '先').charAt(0) }) },
  saveProfile() { const nickname = this.data.draftNickname.trim() || '微信用户', avatarUrl = this.data.draftAvatar; dm.update(state => { state.profile.nickname = nickname; state.profile.avatarUrl = avatarUrl }); this.setData({ showEditor: false, 'profile.nickname': nickname, 'profile.avatarUrl': avatarUrl, avatarInitial: nickname.charAt(0) }); wx.showToast({ title: '资料已保存', icon: 'success' }) },
  about() { wx.showModal({ title: '关于先吃 FIRST BITE', content: '根据食材知识库、购买日期与储存位置估算建议食用日期，帮助家庭减少食物浪费。日期仅供参考，本产品不判断食品安全。\n\n课程展示版 · 本地数据模式', showCancel: false }) },
  reset() { wx.showModal({ title: '重置全部数据？', content: '食材、食用记录、令令成长和装扮都会恢复初始状态，此操作无法撤销。', confirmColor: '#b25443', success: result => { if (result.confirm) { dm.reset(); wx.showToast({ title: '已重置', icon: 'success' }); this.onShow() } } }) }
})

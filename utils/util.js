const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
   // + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getAccountUserSelfPatient () {
  const that = this;
  return app.agriknow2.getAccountUserSelfPatient().then(res => {
    if (res.status === 0) {
      that.setData({
        userPatientId:res.data.userPatientId,
        userProfileId: res.data.userProfileId
      });
      return res.status
    } 
  }).catch(err => {
    console.log(err)
  })
}

module.exports = {
  formatTime,
  getAccountUserSelfPatient
}

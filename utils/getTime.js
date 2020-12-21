function getTime(time){
  let ptime = new Date(time.replace(/-/g, '/')).getTime();
  let systemInfo = wx.getSystemInfoSync();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  const fortyEightHours = 24 * 60 * 60 * 1000 * 2;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const today = `${year}/${month}/${day}`; 
  const todayTime = new Date(today).getTime();
  const yesterdayTime = new Date(todayTime - twentyFourHours).getTime();
  const lastYesterdayTime = new Date(todayTime - fortyEightHours).getTime();
  if( ptime >= todayTime ){
      // return '今天 '+time.split(' ')[1]..slice(0,5);
      return 'today ' + time.split(' ')[1].slice(0,5);
  }
  else if( ptime < todayTime && yesterdayTime <= ptime ){
      return 'yesterday ' + time.split(' ')[1].slice(0,5);
  } else if( ptime < yesterdayTime ){
    return "day " + time.split(' ')[1].slice(0,5);
  }
  // else if( ptime < yesterdayTime && lastYesterdayTime <= ptime ){
  //   return "day " + time.split(' ')[1].slice(0,5);
  // }
 
};
function getTimeState (time) {
  let hours = new Date(time.replace(/-/g, '/')).getHours();
  let text = '';
  // 判断当前时间段
  if (hours >= 0 && hours <= 12) {
      text = 'morning';
  } else if (hours > 12 && hours <= 18) {
      text = 'afternoon';
  } else if (hours > 18 && hours <= 24) {
      text = 'evening';
  }
  return text;
}
const formatTime = date => {
  const time = new Date(date.replace(/-/g, '/'));
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
   // + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTimeYM = date => {
  const time = new Date(date.replace(/-/g, '/'));
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()

  return year + '年' + month + '月' + day + '日'
  // [year, month, day].map(formatNumber).join('/')
   // + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  getTime: getTime,
  getTimeState:getTimeState,
  formatTime:formatTime,
  formatTimeYM:formatTimeYM
}
function constructor1() {
  this.now = new Date();
  this.nowYear = this.now.getYear(); //当前年 
  this.nowMonth = this.now.getMonth(); //当前月 
  this.nowDay = this.now.getDate(); //当前日 
  this.nowDayOfWeek = this.now.getDay(); //今天是本周的第几天 
  this.nowYear += (this.nowYear < 2000) ? 1900 : 0;
}
//格式化数字
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//格式化日期
function formatDate(date) {
  let myyear = date.getFullYear();//表示年份的 4 位数字
  let mymonth = date.getMonth() + 1; //数字
  let myweekday = date.getDate();
  return [myyear, mymonth, myweekday].map(this.formatNumber).join('.');
}
// //格式化日期
// function dayDate(date) {
//   let myyear = date.getFullYear();//表示年份的 4 位数字
//   let mymonth = date.getMonth() + 1; //数字
//   let myweekday = date.getDate();
//   return [myyear, mymonth, myweekday].map(this.formatNumber).join('-');
// }
//获取某月的天数
function getMonthDays(myMonth) {
  let monthStartDate = new Date(this.nowYear, myMonth, 1);
  let monthEndDate = new Date(this.nowYear, myMonth + 1, 1);
  let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}
//获取本季度的开始月份
function getQuarterStartMonth() {
  let startMonth = 0;
  if (this.nowMonth < 3) {
    startMonth = 0;
  }
  if (2 < this.nowMonth && this.nowMonth < 6) {
    startMonth = 3;
  }
  if (5 < this.nowMonth && this.nowMonth < 9) {
    startMonth = 6;
  }
  if (this.nowMonth > 8) {
    startMonth = 9;
  }
  return startMonth;
}
//获取本周的开始日期
function getWeekStartDate() {
  return this.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + 1));
}
//获取本周的结束日期
function getWeekEndDate() {
  return this.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay + (6 - this.nowDayOfWeek + 1)));
}
//获取今天的日期
function getNowDate() {
  return this.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay));
}
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getMyDay(date){
  var week;
  if (date.getDay() == 0) week = "周日"
  if (date.getDay() == 1) week = "周一"
  if (date.getDay() == 2) week = "周二"
  if (date.getDay() == 3) week = "周三"
  if (date.getDay() == 4) week = "周四"
  if (date.getDay() == 5) week = "周五"
  if (date.getDay() == 6) week = "周六"
  return week;
}

/*获取当月的天数 */
function getCountDays() {
  var curDate = new Date();
/* 获取当前月份 */
  var curMonth = curDate.getMonth();
/*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
curDate.setMonth(curMonth + 1);
/* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
curDate.setDate(0);
/* 返回当月的天数 */
return curDate.getDate();
}

// 语法：将时间设置为下个月的第零天，getDate() 获取的就是上个月的天数
function getCountSomeDays(year,month) {
  return new Date(year, month, 0).getDate();
}

module.exports = {
  formatNumber: formatNumber,
  constructor1: constructor1,
  formatDate: formatDate,
  getMonthDays: getMonthDays,
  getQuarterStartMonth: getQuarterStartMonth,
  getWeekStartDate: getWeekStartDate,
  getNowDate: getNowDate,
  getWeekEndDate: getWeekEndDate,
  formatTime: formatTime,
  getMyDay: getMyDay,
  getCountDays:getCountDays,
  getCountSomeDays:getCountSomeDays
}
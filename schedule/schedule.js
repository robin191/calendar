// component-robin/schedule/schedule.js
const GetTime = require("../../utils/time.js");
const moment = require("../../utils/moment.min.js");
import {calendar} from '../../utils/calendar.js';
const app = getApp();
Component({
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      let nowDate = new Date();
      let fullYear = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
      let date = nowDate.getDate();        //日
      this.setData({
        fullYear: fullYear,
        month:month,
        initialYear:fullYear,
        initialMonth:month,
        initialDay:date
      });
      console.log(date)
      this.onGetSomeMonthList(fullYear,month,month- 1);
      // this.onTodayList();
    },
    ready: function() {
      let that = this;
      let query = wx.createSelectorQuery().in(this);
      //选择id
      query.select('#schedule').boundingClientRect()
      query.exec(function (res) {
        that.triggerEvent('onScheduleHeight', res[0].height); //保存到数据库
      });
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekList:[{
      dayOfWeek: "日",
    },{
      dayOfWeek: "一", 
    },
    {
      dayOfWeek: "二", 
    },
    {
      dayOfWeek: "三",
    },
    {
      dayOfWeek: "四", 
    },
    {
      dayOfWeek: "五", 
    },
    {
      dayOfWeek: "六",
    }],
    monthList:[],
    isChecked:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetSomeMonthList(yy,mm) {
      console.log(yy,mm)
      const that =this;
      const num = moment(yy + "/" + mm,"YYYY-MM").daysInMonth();
      console.log(num,"当月天数");
      const wwArr = ["日", "一", "二", "三", "四", "五", "六"];
      let startDate = new Date(mm + "/" + 1 + "/" + yy).getDay();
      let startDayOfWeek = wwArr[startDate];
      console.log(startDayOfWeek,startDate)
      let lastMNum;
      if(mm == 1) {
        lastMNum = moment(yy - 1 + "/" + 12,"YYYY-MM").daysInMonth();
      } else {
        lastMNum = moment(yy + "/" + (mm - 1),"YYYY-MM").daysInMonth();
      }
      console.log(startDayOfWeek,startDate,lastMNum)
      let MonthList = [];
      let delay;
      if (startDate !== 0) {
         delay = startDate - 1;
      } else {
        delay = 0;
      };

      let number = 1;
      
      for (let i = 0; i < 35; i++) {
        // debugger
        if (i < delay) {
          let oldMM = mm;
          let oldYY = yy;
          if(mm == 1 ) {
            oldYY = yy - 1;
            oldMM = 13;
          };
          MonthList.unshift({
            Gregorian:lastMNum,
            lunar: calendar.solar2lunar(oldYY,oldMM - 1,lastMNum),
            isCheck:false,
            isBefore:true
          });
          lastMNum--
        } else {
          console.log(delay + num - 1)
          if(i > delay + num - 1) {
            let lastMM = mm;
            let lastYY = yy;
            if(mm == 12 ) {
              lastYY = yy + 1;
              lastMM = 0
            };
            console.log(delay + num - 1)
            MonthList.push({
              Gregorian:number,
              lunar: calendar.solar2lunar(lastYY,lastMM + 1,number),
              isCheck:false,
              isAfter:true
            });
            number++
          } else {
            MonthList.push({
              Gregorian:i - delay + 1,
              lunar: calendar.solar2lunar(yy,mm,i - delay + 1),
              isCheck: this.data.initialDay == i - delay + 1 && this.data.initialMonth == mm && this.data.initialYear == yy ? true : false,
              isDay: this.data.initialDay == i - delay + 1 && this.data.initialMonth == mm && this.data.initialYear == yy ? true : false,
            });
          }
        }
      };
      that.setData({
        monthList: MonthList,
      });
      that.listBetweenTime();
      console.log(that.data)
    },

    onTodayList() {  //当天列表
      let day = this.data.initialDay;
      if(day < 10) {
        day = "0" + day
      };

      let data = {
        day: this.data.initialYear + "-" + this.data.initialMonth + "-" + day,
        userId: app.globalDatas.userProfileId,
        userType:2
      };
      this.triggerEvent('listByDay', data); 
    },

    listBetweenTime(e) {
      let data = {
        "beginTime": this.data.monthList[0].lunar.date + " 00:00:00",
        "endTime": this.data.monthList[34].lunar.date + " 23:59:59",
        "userId": app.globalDatas.userProfileId,
        "userType": 2
      };
     
      app.requestApi.requestAll(`app/mySchedule/listBetweenTime`,{data}).then(res => {
        console.log(res);
        if(res.status === 0){
          res.data.forEach((it,index) => {
            this.data.monthList[index].isEvent = it.isEvent;
          })
          
          this.setData({
            monthList: this.data.monthList,
          });
          console.log(this.data.monthList);
        }
      }).catch(err => console.log(err,"========== 报错 ==========="))
    },

    onToAllList() {
      this.triggerEvent('onToAllList'); //所有列表
    },

    onToToday() {
      console.log('onToToday')
      if(this.data.isChecked) {
        this.setData({
          fullYear: this.data.initialYear,
          month:this.data.initialMonth,
        });
        this.onGetSomeMonthList(this.data.initialYear,this.data.initialMonth,this.data.initialMonth - 1)
      } else {
        this.setData({
          fullYear: this.data.initialYear,
          month:this.data.initialMonth,
        });
        this.onGetSomeMonthList(this.data.initialYear,this.data.initialMonth,this.data.initialMonth - 1);
        setTimeout(() => {
          this.onResult();
          this.data.result.forEach((it,index) => {
            it.forEach((item,idx) => {
              if(item.isDay) {
                this.setData({
                  todayIndex: index,
                  monthList:this.data.result[index],
                });
              }
            })
          });
        },200);
      }
     
    },

    onTochange() {
      this.setData({
        isChecked: !this.data.isChecked
      });
      console.log(this.data)
      let that = this;
      let query = wx.createSelectorQuery().in(this);
      //选择id
      query.select('#schedule').boundingClientRect()
      query.exec(function (res) {
        that.triggerEvent('onScheduleHeight', res[0].height); //保存到数据库
      });
      console.log(this.data)
      if(!this.data.isChecked) {
        let monthList = this.data.monthList;
        monthList.forEach((i,idx) => {
          if(i.isDay) {
            this.setData({
              isMonth: true,
            },()=>{
              console.log(this.data)
            if(this.data.isMonth) {
                this.onResult();
                console.log(this.data);
                setTimeout(() => {
                  this.data.result.forEach((it,index) => {
                    it.forEach((item,idx) => {
                      if(item.isDay) {
                        this.setData({
                          todayIndex: index,
                          monthList:this.data.result[index],
                        });
                      }
                    })
                  });
                },100)
            }
            });
          };
        });
      } else {
        this.setData({
          todayIndex: 0,
        });
        this.onGetSomeMonthList(this.data.fullYear,this.data.month,this.data.month - 1);
      }
           
    },

    onResult() {
      let monthListSome = this.data.monthList;
      let result = [];
      for(let i = 0;i < monthListSome.length; i += 7){
          result.push(monthListSome.slice(i,i + 7));
      };
      console.log(result);
      this.setData({
        result: result,
      });
    },

    onCheckedDay(e) {
      console.log(e.currentTarget.dataset)
      let {index,item} = e.currentTarget.dataset;
      console.log(index,item);
      this.data.monthList.forEach((it,idx) => {
        if(idx == index) {
          this.data.monthList[idx].isCheck = true
        } else {
          this.data.monthList[idx].isCheck = false
        }
      })
      
      this.setData({
        monthList:this.data.monthList
      });

      let data = {
        day: item.lunar.date,
        userId: app.globalDatas.userProfileId,
        userType:2
      };
      console.log(data)
      this.triggerEvent('listByDay', data); //点击列表
    },

    touchStart: function(e){
      let sx = e.touches[0].pageX;
      let sy = e.touches[0].pageY;
      this.setData({
          touchS: [sx,sy]
      })
    },
    touchMove: function(e){
      let sx = e.touches[0].pageX;
      let sy = e.touches[0].pageY;
      this.setData({
          touchE: [sx, sy],
          touchChange: (sx - this.data.touchS[0])/2,
      });
    },

    onAnimation () {
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
      delay: 0
    });

    animation.translateY(0).opacity(0.2).step()
    animation.translateY(0).opacity(1).step()
    const params  = animation.export();

    this.setData({
      animation: params,
    });
    },

    onAnimationLeft () {
      let animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
        delay: 0
      });
  
      animation.opacity(0.2).translate(-500, 0).step()
      animation.opacity(0.2).translate(500, 0).step()
      const params  = animation.export();
  
      this.setData({
        animation: params,
      });
    },

    onAnimationRight () {
      let animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
        delay: 0
      });
  
      animation.opacity(0.2).translate(500, 0).step()
      const params  = animation.export();
  
      this.setData({
        animation: params,
      });
    },


     
    touchEnd: function(e){
      let yy = this.data.fullYear;
      let mm = this.data.month;
      console.log(yy,mm);
     
      if(this.data.touchChange > 30){
        this.onAnimation();
        console.log('右滑');
        if(this.data.isChecked) {
          if(mm == 1) {
            this.setData({
              fullYear: --yy,
              month:12
            })
          } else {
            this.setData({
              month: --mm,
            });
          };
          this.onGetSomeMonthList(this.data.fullYear,this.data.month,this.data.month - 1);
        } else {
          if(this.data.isMonth) {
            let todayIndex = this.data.todayIndex;
            if(todayIndex < 5 && todayIndex !== 0) {
              todayIndex = todayIndex - 1;
              this.setData({
                todayIndex: todayIndex,
                monthList:this.data.result[todayIndex],
              });
            } else if(todayIndex == 0){
              if(mm == 1) {
                this.setData({
                  fullYear: --yy,
                  month:12
                })
              } else {
                this.setData({
                  month: --mm,
                });
              };
              this.onGetSomeMonthList(this.data.fullYear,this.data.month,this.data.month - 1);
              setTimeout(() => {
                this.onResult();
                this.setData({
                  todayIndex:4,
                  monthList:this.data.result[4],
                });
              },200)
              
            }
          } else {
            this.setData({
              monthList:this.data.result[0],
            });
          }
          
        }
      }else if(this.data.touchChange < -30){
        this.onAnimation();
        console.log('左滑');
        if(this.data.isChecked) {
          if(mm == 12) {
            this.setData({
              fullYear: ++yy,
              month:1
            });
          } else {
            this.setData({
              month: ++mm,
            });
          };
  
          this.onGetSomeMonthList(this.data.fullYear,this.data.month,this.data.month - 1);
        } else {
          if(this.data.isMonth) {
            console.log(this.data);
            let todayIndex = this.data.todayIndex;
            if(todayIndex < 5 && todayIndex !== 4) {
              todayIndex = todayIndex + 1;
              this.setData({
                todayIndex: todayIndex,
                monthList:this.data.result[todayIndex],
              });
            } else if(todayIndex == 4){
              console.log(this.data,'ddd');
              if(mm == 12) {
                this.setData({
                  fullYear: ++yy,
                  month:1
                });
              } else {
                this.setData({
                  month: ++mm,
                });
              };
              this.onGetSomeMonthList(this.data.fullYear,this.data.month,this.data.month - 1);
              setTimeout(() => {
                this.onResult();
                this.setData({
                  todayIndex:0,
                  monthList:this.data.result[0],
                });
              },200)

            }
          } else {
            this.setData({
              monthList:this.data.result[0],
            });
          }
        }

        
      }else{
        console.log('静止')
      }
      this.setData({
          touchChange: 0,
      })
      
    },

    
  }
})

 // MonthList[delay] = {
          //   Gregorian:lastMNum,
          //   lunar: calendar.solar2lunar(yy,mm - 1,lastMNum),
          //   isCheck:false,
          // }
           // MonthList.push({
        //   // time: yy + '-' + (mm >= 10 ? mm : ('0' + mm)) + "-" + (day >= 10 ? day : ('0' + day)),
        //   dayOfWeek: wwArr[i],
        //   day: day >= 10 ? day : ('0' + day),
        //   dayMs: startMs + i * ddMs,
        //   isEvent: false,
        // })
        // onGetMonthList(yymmdd) {
        //   // let nextMNum = moment(yy + "/" + (mm + 1),"YYYY-mm").daysInMonth();
        //  // let endOfMonth = this.endDate(); // 获取本月最后一天
        //  // console.log(startDate,endOfMonth);
        //  // let fullYear = nowDate.getFullYear();
        //  // let month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
        //  // let startofweek = startDate.getDay();
        //  // let endofweek = endOfMonth.getDay();
        //    // const weekMs = 7 * 24 * 60 * 60 * 1000;
        //  // const ddMs = 1 * 24 * 60 * 60 * 1000;
        //  // const nowDate = yymmdd ? new Date(yymmdd) : new Date();
        //  // const nowDateMs = nowDate.getTime();
         
        //  // const ww = nowDate.getDay();
        //  const that =this;
        //  const num = GetTime.getCountDays();
        //  console.log(num);
        
        //  let startDate = this.InitDate();//当月第一天
        //  let endOfMonth = this.endDate(); // 获取本月最后一天
        //  console.log(startDate,endOfMonth);
        
        //  let startofweek = startDate.getDay();
        //  let endofweek = endOfMonth.getDay();
        //  console.log(startofweek,endofweek);
        //  const wwArr = ["日", "一", "二", "三", "四", "五", "六"];
        //  let startDayOfWeek = wwArr[startofweek];
        //  console.log(startofweek,endofweek);
   
        //  const weekMs = 7 * 24 * 60 * 60 * 1000;
        //  const ddMs = 1 * 24 * 60 * 60 * 1000;
        //  const nowDate = yymmdd ? new Date(yymmdd) : new Date();
        //  const nowDateMs = nowDate.getTime();
         
        //  // const ww = nowDate.getDay();
         
        //  let MonthList = [];
        //  // let startMs = nowDateMs - ww * ddMs + num * weekMs;
         
        //  for (let i = 1; i <= num; i++) {
        //    // const day = new Date(startMs + i * ddMs).getDate();
        //    // const changeDay = new Date(startMs + i * ddMs)
        //    // const yy = changeDay.getFullYear();
        //    // const mm = changeDay.getMonth() + 1;
        //    // const dd = changeDay.getDate();
        //    MonthList.push({
        //      // time: yy + '-' + (mm >= 10 ? mm : ('0' + mm)) + "-" + (day >= 10 ? day : ('0' + day)),
        //      dayOfWeek: wwArr[i],
        //      day: day >= 10 ? day : ('0' + day),
        //      dayMs: startMs + i * ddMs,
        //      // isDay: this.data. === (startMs + i * ddMs) ? true : false,
        //      isEvent: false,
        //      isCheck:false,
        //    })
        //  };
        //  that.setData({
        //    MonthList: MonthList,
        //  })
         // const data = {
         //   beginTime: wwList[0].dayMs,
         //   endTime: wwList[6].dayMs,
         // }
         // app.requestApi.requestAll('/app/mySchedule/listBetweenTime',{data}).then(res => {
         //   if(res.status === 0){
         //     let list = [];
         //     for(let i = 0; i < 7; i++){
         //       list.push(Object.assign({},wwList[i],res.data[i]));
         //       if(wwList[i].isDay){
         //         this.setData({
         //           detailDay: res.data[i].time,
         //         })
         //         that.onGetDetailList();
         //       }
         //     }
         //     that.setData({
         //       weekList: list,
         //     })
         //     console.log(list,4444444)
         //   }
           
         // }).catch(err=>console.log(err,'======== 报错 =========='))
      //  },
   
      //  InitDate() {
      //    const date = new Date()
      //    date.setDate(1)
      //    console.log(date)   //Mon Jul 01 2019
      //    return date
      //  },
   
      //  //获取当月最后一天
      //  endDate() {
      //    const date = new Date()
      //    date.setMonth(date.getMonth() + 1)  //默认从0开始
      //    date.setDate(0)  //获取最后一天
      //    return date
      //  },
   
      //   time(myDate) {
      //    let year=myDate.getFullYear();    //年
      //    let mouth=myDate.getMonth()+1;    //月
      //    let date=myDate.getDate();        //日
      //    let hours=myDate.getHours();      //时
      //    let minutes=myDate.getMinutes();  //分
      //    let seconds=myDate.getSeconds();   //秒
      //    console.log("当前日期为："+year+"年"+","+mouth+"月"+","+date+"日"+" "+hours+"时"+":"+minutes+"分"+":"+seconds+"秒")
      //  },
      // async getWeekStartDate(numDay) {
      //   let that = this;
      //   this.now = new Date();
      //   this.nowYear = this.now.getYear(); //当前年 
      //   this.nowMonth = this.now.getMonth(); //当前月 
      //   this.nowDay = this.now.getDate(); //当前日 
      //   this.nowDayOfWeek = this.now.getDay(); //今天是本周的第几天 
      //   this.nowYear += (this.nowYear < 2000) ? 1900 : 0;
  
      //   let dateStart = GetTime.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + numDay));
      //   let dateEnd = GetTime.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + 6 + numDay));
      //   // 获取今天日期
      //   let now = GetTime.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay));
      //   let nowCe = now.replace(/\./g, "-");
      //   now = now.replace(/-/g, "/");
      //   now = now.substring(5);
      //   let now2 = now.split('.');
      //   //获取月
      //   let dataS = dateStart.split('.');
      //   let [startYear, startMouth, startDay] = dataS;
      //   console.log(now2)
        
      //   this.setData({
      //     dateStart: dateStart,
      //     dateEnd: dateEnd,
      //     now: now,
      //     now2: now2[1],
      //     nowCe: nowCe,
      //     startMouth: Number(startMouth)
      //   })
      //   let da = [dateStart, dateEnd, nowCe];
       
      //   console.log('dataInfo')
      //   const info =  await that.getWlist();
      //   console.log(info,'getWlist')
      //   if(info) {
      //     return da
      //   }
        
      // },
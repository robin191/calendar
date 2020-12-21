var mydate= new Date();//获取当前时间
mydate.setMinutes(mydate.getMinutes()+1); //当前时间加1分钟
var end_time = new Date(mydate).getTime();//月份是实际月份-1
var sys_second = (end_time-new Date().getTime())/1000;
var timer = setInterval(function(){
      if (sys_second > 1) {
          sys_second -= 1;
          var second = Math.floor(sys_second % 60);
      } else { 
          
      }
  }, 1000);

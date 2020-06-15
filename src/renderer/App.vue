<template>
  <div ref="clock" class="clock"></div>
</template>

<script>
import moment from 'moment-timezone';
import './assets/lib/flipclock.min';
  export default {
    name: 'app',
    data(){
      return {
        clock: null
      }
    },
    methods: {
        start( targetDate ){
          let now = moment.now();
          // 距离多少秒
          let diff = targetDate.diff(now, 'seconds');
          if (diff < 0){
            diff = 0;
          }
          this.clock = this.genClock(diff);
        },
        genClock(diff){
          return $(this.$refs.clock).FlipClock(diff, {
            // clockFace:DailyCounter | HourlyCounter | MinuteCounter | TwelveHourClock | TwentyFourHourClock | Counter
            clockFace: "DailyCounter",
            // autostart: false, // 自动增量
            countdown: true, // 倒计时向下
            //minimumDigits: 5,        //设定位数
            language: 'chinese',
            callbacks: {
              start() {
                console.log('倒计时开始');
              },
              stop() {
                console.log('倒计时结束');
              },
              interval() {
                // clock.increment();
              }  //destroy | create | init | interval | start | stop | reset
            }
          });
        },
        reset(){
          let targetDate = moment(moment.now().valueOf() + 1000 * 60); // 一分钟后
          this.start(targetDate);
        }
    },
    created(){
      window.vm = this;
    },
    mounted(){
      let targetDate = moment(moment.now().valueOf() + 1000 * 60 * 30); // 30分钟后
      this.start(targetDate);
    }
  }
</script>

<style>
@import url('assets/css/flipclock.css');
.clock {
    width: 650px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}
.flip-clock-label{
      font-size: 1.5em;
}
</style>

<template>
  <div>
    <img :src="page" @click="tigger" :style="imgStyle">
    <el-tooltip class="item" effect="light" content="点击打开设置" placement="top">
      <div ref="clock" class="clock" @click="openChangeTime"></div>
    </el-tooltip>

    <time-select ref="timeSelect" @submit="changeTime"></time-select>
  </div>
</template>

<script>
import moment from 'moment-timezone';
import './assets/lib/flipclock.min';
import TimeSelect from './components/TimeSelect';
import Page from '../../static/images/page.jpg';

const TYPE = {TIME: 'time', STEP: 'step'};
  export default {
    name: 'app',
    components: {
      TimeSelect
    },
    data(){
      return {
        clock: null,
        running: false,
        page: Page,
        img_width: 0,
        img_height: 0
      }
    },
    computed: {
      imgStyle(){
        return `width: ${this.img_width - 20}px; height: ${this.img_height - 20}px;`
      }
    },
    methods: {
      openChangeTime(){
        this.$refs.timeSelect.open();
      },
      changeTime( data ){
        const {
          type,
          time,
          step,
          duration
        } = data;
        if (type === TYPE.TIME){
          this.start(moment(time, 'YYYY-MM-DD HH:mm:ss'));
        }else if(type === TYPE.STEP){
          let targetDate = moment().add(step , duration);
          this.start(targetDate);
        }
      },
      start( targetDate ){
        this.running = true;
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
              // console.log('倒计时开始');
            },
            stop() {
              // console.log('倒计时结束');
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
      },
      tigger(){
        const running = this.clock.running;
        if (running){
          this.clock.stop();
        }else{
          this.clock.start();
        }
      },
      getWindowZise(){
        let currentWindow = this.$electron.remote.getCurrentWindow();
        return currentWindow.getContentSize();
      }
    },
    created(){
      window.vm = this;
      // 设置图片大小
      const [width , height] = this.getWindowZise();
      this.img_width = width;
      this.img_height = height;

      // 窗口大小发生改变。
      this.$electron.ipcRenderer.on('resize', (event , [width , height]) => {
        this.img_width = width;
        this.img_height = height;
      })
    },
    mounted(){
      this.start(moment());
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
    cursor: pointer;
}
div{
  cursor: pointer;
}
.flip-clock-label{
      font-size: 1.5em;
}
</style>

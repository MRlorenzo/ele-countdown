<template>
    <div class="bg" :style="imgStyle" @click.stop="tigger">

        <div ref="clock" @click.stop="openChangeTime" :style="clockStyle"></div>

        <time-select ref="timeSelect" @submit="changeTime"></time-select>

        <!--借助浏览器加载图片-->
        <img v-show="show" ref="page" :src="page"/>
    </div>

</template>

<script>
	import moment from 'moment';
	import './assets/lib/flipclock.min';
	import TimeSelect from './components/TimeSelect';
	import Page from '../../static/images/page.jpg';
	import Mousetrap from 'mousetrap';
	import {getBase64Image} from './utils';

	const TYPE = {TIME: 'time', STEP: 'step'};
	export default {
		name: 'app',
		components: {
			TimeSelect
		},
		data() {
			return {
				clock: null,
				page: Page,
                imgURL: Page,
				loadImgError: false,
				clock_width: 0,
				clock_height: 0,
                win_width: 0,
                win_height:0,
                show: false
			}
		},
		computed: {
			imgStyle() {
				return `background-image: url(${this.imgURL});
                width: ${this.win_width}px;
                height: ${this.win_height}px;`;
			},
			clockStyle() {
				const left = ~~((this.win_width - this.clock_width)/2);
                const top = ~~((this.win_height - this.clock_height)/2);
				return `margin-left: ${left}px;
      	        margin-top: ${top}px;`
			}
		},
		methods: {
			openChangeTime() {
				this.$refs.timeSelect.open();
			},
			changeTime(data) {
				const {
					type,
					time,
					step,
					duration
				} = data;
				if (type === TYPE.TIME) {
					this.start(moment(time, 'YYYY-MM-DD HH:mm:ss'));
				} else if (type === TYPE.STEP) {
					let targetDate = moment().add(step, duration);
					this.start(targetDate);
				}
			},
			start(targetDate) {
				let now = moment.now();
				// 距离多少秒
				let diff = targetDate.diff(now, 'seconds');
				if (diff % 10 === 9) {
					++diff;
				}
				this.clock = this.genClock(diff);
				this.clock.stop();
			},
			genClock(diff) {
				return $(this.$refs.clock).FlipClock(diff, {
					// clockFace:DailyCounter | HourlyCounter | MinuteCounter | TwelveHourClock | TwentyFourHourClock | Counter
					clockFace: "DailyCounter",
					// autostart: false, // 自动增量
					countdown: true, // 倒计时向下
					//minimumDigits: 5,        //设定位数
					language: 'chinese',
					/*callbacks: {
                      start() {
                        // console.log('倒计时开始');
                      },
                      stop() {
                        // console.log('倒计时结束');
                      },
                      interval() {
                        // clock.increment();
                      }  //destroy | create | init | interval | start | stop | reset
                    }*/
				});
			},
			tigger($event) {
				console.log('tigger')
				const running = this.clock.running;
				if (running) {
					this.clock.stop();
				} else {
					this.clock.start();
				}
			},
			getWindowZise() {
				let currentWindow = this.$electron.remote.getCurrentWindow();
				return currentWindow.getContentSize();
			},
			oncontextmenu($event) {
				this.$electron.ipcRenderer.send('changeImage');
				this.$electron.ipcRenderer.once('changeImage-done', (event, [filePath]) => {
					this.page = filePath;
				});
			},
			whenImageLoad() {
				let img = this.$refs.page;
				// 图片加载成功
				img.onload = (event) => {
					this.loadImgError = false;
					// base64 getBase64Image(img)
					this.imgURL = getBase64Image(img);
				}
				// 图片加载失败
				img.onerror = (event) => {
					this.loadImgError = true;
				}
			},
            autoSize(){
				this.clock_width = $(this.$refs.clock).width();
				this.clock_height = $(this.$refs.clock).height();

				// 设置图片大小
				const [width, height] = this.getWindowZise();
				this.win_width = width;
				this.win_height = height;

				// 窗口大小发生改变。
				this.$electron.ipcRenderer.on('resize', (event, [width, height]) => {
					this.win_width = width;
					this.win_height = height;

					this.clock_width = $(this.$refs.clock).width();
					this.clock_height = $(this.$refs.clock).height();
				});
            }
		},
		created() {
			window.vm = this;

		},
		mounted() {
			this.start(moment());
			this.autoSize();

			Mousetrap.bind(['f12', 'ctrl+shift+i'], () => {
				this.$electron.ipcRenderer.send('openDevTools');
			});

			this.whenImageLoad();

			document.oncontextmenu = this.oncontextmenu;
		}
	}
</script>

<style>
    @import url('assets/css/flipclock.css');

    body {
        margin: 0;
    }

    div {
        cursor: pointer;
    }

    .flip-clock-label {
        font-size: 1.5em;
    }

    .bg {
        margin: 0;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-attachment: fixed;
    }
</style>

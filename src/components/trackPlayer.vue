<template>
  <div class="trackContainer">
    <div class="toolsSum">
      <div class="tools">
        <i
          class="el-icon-setting"
          style="font-size: 20px;margin-top: 3px;margin-right: 3px;cursor: pointer;"
          @click="showSetting"
        ></i>
        <el-dialog
          center
          no-scrollbar
          title="轨迹播放设置"
          :visible.sync="settingVisible"
          :modal="false"
        >
          <el-form
            ref="form"
            label-position="right"
            :model="form"
            label-width="120px"
            content-width="240px"
          >
            <el-form-item label="地图自动居中">
              <el-switch v-model="form.mapCenter"></el-switch>
            </el-form-item>
            <el-form-item label="超速阈值">
              <el-input v-model="form.overSpeed"></el-input>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="checkDialog()">取消</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="tools">
        <span
          class="fullScreen"
          ref="fullScreen"
          id="fullScreen"
        ></span>
      </div>
    </div>
    <div class="player">
      <div
        class="main openlayersMap"
        ref="rootmap"
        id="trackPlayer"
        @contextmenu.prevent="drawComplete()"
      >
      </div>
      <div
        class="toolBar"
        v-show="isReady"
      >
        <div class="slider">
          <el-slider
            v-model="timeValue"
            :show-tooltip="false"
            style="height:10px"
          ></el-slider>
        </div>
        <div class="btn_sum">
          <span
            class="stop"
            v-if="isPlay"
            @click="handlePlay"
          ></span>
          <span
            class="start"
            v-if="!isPlay"
            @click="handlePlay"
          ></span>
          <span
            class="back"
            @click="backPlay"
          ></span>
          <span
            @click="changeSpeed"
            style="cursor: pointer;"
          >{{ speed }}X</span>
          <span
            class="forward"
            @click="forwardPlay"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Map from '../js/openlayer.js';

export default {
  name: 'TrackPlayer',
  components: {

  },
  data() {
    return {
      map: null,
      wholeDetail: {},
      settingVisible: false,
      form: {
        mapCenter: false,
        overSpeed: ''
      },
      trackDetail: {
        path: [],
        speed: []
      },
      isClient: false,
      timeValue: 0,
      isPlay: false,
      isReady: false,
      speed: 1,
      speedList: [1, 2, 4],
      startTime: 0,
      timeChange: false
    };
  },
  created() {
    let setting = localStorage.getItem('playSetting');
    if (setting) {
      this.form = JSON.parse(setting);
      this.tempForm = this.form;
    }
  },
  watch: {
    speed(v) {
      this.map.changeSpeed(v);
    },
    timeValue(v) {
      this.map.timeTo(v);
      // this.handleTimeTip(v);
    },
    'form.mapCenter': function (v) {
      this.map.setViewLock(v);
    },
    'form.overSpeed': function () {
      clearTimeout(this.timeChange);
      this.timeChange = setTimeout(() => {
        this.draw();
      }, 500);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.map = new Map('trackPlayer');
      this.map.initAnimation(false);
      this.map.initFullScreen(this.$refs.fullScreen, document.getElementsByClassName('trackMap')[0]);
      this.eventListen();
    },
    eventListen() {
      let that = this;
      this.map.getEventEmitter().on('freshTime', (time) => {
        that.timeValue = time;
      });
      this.map.getEventEmitter().on('switchPlay', () => {
        that.handlePlay();
      });
    },
    showSetting() {
      this.settingVisible = true;
      if (this.isPlay) {
        this.map.stopAnimation(false);
      }
      this.isPlay = false;
    },
    checkDialog() {
      this.settingVisible = false;
    },
    draw() {
      if (!this.isReady) { return; }
      const speed = this.form.overSpeed;
      if (speed) {
        let redList = [];
        let intSpeed = parseInt(speed);
        let tempIndex = -1;
        this.wholeDetail.speed.forEach((item, index) => {
          item = typeof item === 'number' ? item : parseInt(item);
          if (item > intSpeed) {
            if (tempIndex === index) {
              this.wholeDetail.path[index + 1] ? redList[redList.length - 1].push(this.wholeDetail.path[index + 1]) : () => { };
            } else {
              this.wholeDetail.path[index + 1] ? redList.push([this.wholeDetail.path[index], this.wholeDetail.path[index + 1]]) : () => { };
            }
            tempIndex = index + 1;
          }
        });
        this.map.addRedPath(redList);
      } else {
        this.map.addRedPath([]);
      }
    },
    initPlay(list, flag = true) {
      this.isReady = true;
      this.wholeDetail = list;
      this.map.addPath(list.path);
      this.map.addVehicleInfo(list.speed, list.direction);
      this.map.addVehicle('vehicle', 0);
      if (flag) { //是不是需要进行绘制时间间隔点和超速路段
        this.map.setViewLock(this.form.mapCenter);
        this.draw();
      } else {
        this.map.setViewLock(true);
      }
    },
    exitPlay() {
      this.isReady = false;
      this.timeValue = 0;
      if (this.isPlay) {
        this.map.stopAnimation(false);
      }
      this.isPlay = false;
      this.map.clearAnimation();
    },
    handlePlay() {
      if (this.isPlay) {
        this.map.stopAnimation(false);
      } else {
        this.map.startAnimation();
      }
      this.isPlay = !this.isPlay;
    },
    changeSpeed() {
      let index = this.speedList.indexOf(this.speed);
      if (index === this.speedList.length - 1) {
        index = -1;
      }
      this.speed = this.speedList[index + 1];
    },
    backPlay() {
      this.map.back();
    },
    forwardPlay() {
      this.map.forward();
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .overlay_4 {
  width: 15px;
  height: 18px;
  margin-left: 20px;
  z-index: 2;
  cursor: pointer;
}
.box {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0px;
  left: 0px;
}
.trackContainer {
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.32), 0 0 6px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  position: relative;
  /deep/ .overlay_text {
    background-color: rgba(0, 0, 0, 0.363);
    padding: 5px 10px;
    border-radius: 3px;
    margin-left: 20px;
    margin-top: 10px;
    color: white;
    max-width: 280px;
  }
  /deep/ .rangingTip {
    background-color: white;
    padding: 3px 5px;
    border: 1px solid #9f9f9f;
    border-radius: 3px;
    margin-bottom: 15px;
    color: #9f9f9f;
    max-width: 180px;
  }
  .toolsSum {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 9;
    display: flex;
    .tools {
      display: flex;
      margin-left: 20px;
      background-color: #ffffff;
      border-radius: 3px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.32), 0 0 6px rgba(0, 0, 0, 0.04);
      color: rgb(29, 29, 29);
      padding: 8px 5px 8px 10px;
      .icomoon-floor_state_setting {
        position: relative;
        top: 2px;
        left: -2px;
      }
      // 全屏按钮的样式
      .alarmSum {
        background-image: url("../assets/common_alarm.svg");
        width: 25px;
        height: 25px;
        background-size: 100% 100%;
        margin-right: 5px;
        cursor: pointer;
      }
      .distance {
        background-image: url("../assets/common_ranging.svg");
        width: 25px;
        height: 25px;
        background-size: 100% 100%;
        margin-right: 10px;
        cursor: pointer;
      }
      .fullScreen {
        // background-image: url("../assets/common_windows_maximum.svg");
        width: 25px;
        height: 25px;
        position: relative;
      }
      .fullScreen-false {
        background-image: url("../assets/common_windows_maximum.svg");
        background-repeat: no-repeat;
        background-position-x: 10px;
      }
      .fullScreen-true {
        background-image: url("../assets/common_windows_min.svg");
        background-repeat: no-repeat;
        background-position-x: 10px;
      }
      /deep/ .fullScreenBtn {
        position: absolute;
        top: 0px;
        left: 0px;
        padding: 0;
      }
      /deep/ .fullScreenBtn button {
        background-color: transparent !important;
        margin: 0px !important;
        outline: none;
        width: 25px;
        height: 25px;
        background-size: 100% 100%;
        margin-left: 10px;
        cursor: pointer;
      }
      /deep/ .fullScreenBtn .fullScreenBtn-false {
        background-image: url("../assets/common_windows_maximum.svg");
      }
      /deep/ .fullScreenBtn .fullScreenBtn-true {
        background-image: url("../assets/common_windows_min.svg");
      }
    }
  }
  .player {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    /deep/ .speedTip {
      margin-left: 22px;
      background-color: #f5f5f4;
      border-radius: 3px;
      padding: 3px 6px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.32), 0 0 6px rgba(0, 0, 0, 0.04);
    }
    /deep/ .speedTip::before {
      content: "";
      border-style: solid;
      border-width: 5px 5px 5px 5px;
      border-color: transparent #f5f5f4 transparent transparent;
      width: 0px;
      height: 0px;
      position: absolute;
      left: 13px;
      top: 25px;
    }
    .blank {
      width: 100%;
      height: 30px;
    }
    .toolBar {
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 0px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.32), 0 0 6px rgba(0, 0, 0, 0.04);
      .timeTip {
        position: absolute;
        font-size: 10px;
        color: #f83138;
        top: 1px;
        min-width: 96px;
      }
      /deep/ .el-slider__runway {
        margin-top: -6px !important;
      }
      /deep/ .el-slider__button {
        border: none !important;
        background-color: rgb(255, 255, 255);
        border-radius: 3px !important;
        width: 15px !important;
        height: 10px !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.22), 0 0 6px rgba(0, 0, 0, 0.04);
      }
      /deep/ .el-slider__bar {
        height: 6px;
        background-color: #fa3239 !important;
        border-top-left-radius: 0px !important;
        border-bottom-left-radius: 0px !important;
      }
      /deep/ .el-slider__button-wrapper {
      }
      /deep/ .el-slider__runway {
        background-color: transparent !important;
      }
      /deep/.el-slider__button.dragging:after,
      /deep/.el-slider__button.hover:after,
      /deep/.el-slider__button:hover:after {
        display: none;
      }
      .btn_sum {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        top: -9px;
        .stop {
          background-image: url("../assets/common_window_max.svg");
          width: 25px;
          height: 25px;
          background-size: 100% 100%;
          margin: 0 10px;
          cursor: pointer;
        }
        .start {
          background-image: url("../assets/common_video_play.svg");
          width: 25px;
          height: 25px;
          background-size: 100% 100%;
          margin: 0 10px;
          cursor: pointer;
        }
        .back {
          background-image: url("../assets/common_angles_left.svg");
          width: 25px;
          height: 25px;
          background-size: 100% 100%;
          margin: 0 10px;
          cursor: pointer;
        }
        .speed {
          background-image: url("../assets/common_video_play.svg");
          width: 25px;
          height: 25px;
          background-size: 100% 100%;
          margin: 0 10px;
          cursor: pointer;
        }
        .forward {
          background-image: url("../assets/common_angles_right.svg");
          width: 25px;
          height: 25px;
          background-size: 100% 100%;
          margin: 0 10px;
          cursor: pointer;
        }
      }
    }
    .main {
      width: 100%;
      height: 100%;
      /deep/ .ol-zoom {
        position: absolute;
        right: 15px;
        bottom: 50px;
        top: auto;
        left: auto;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.32), 0 0 6px rgba(0, 0, 0, 0.04);
        button {
          background-color: white;
          color: #000000c7;
          outline: none;
          cursor: pointer;
          margin: 0px;
          border: none;
        }
        button:first-child::after {
          content: "";
          width: 50%;
          position: absolute;
          right: 25%;
          top: 25px;
          border-bottom: 1px solid #00000030;
        }
        button:hover {
          background-color: rgb(224, 224, 224);
        }
      }
    }
  }
}
</style>

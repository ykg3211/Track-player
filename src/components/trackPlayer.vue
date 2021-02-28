<template>
  <div class="player">
    <div
      class="main"
      ref="rootmap"
      id="map"
      @contextmenu.prevent="contextmenu()"
    >
    </div>
    <div class="blank"></div>
    <div class="toolBar">
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
        <span @click="changeSpeed">{{speed}}X</span>
        <span
          class="forward"
          @click="forwardPlay"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { vehicle } from '../js/config';
import map from '../js/openlayer.js';
import { toStringXY } from 'ol/coordinate';

export default {
  name: 'trackPlayer',
  components: {
  },
  data() {
    return {
      map: null,
      timeValue: 0,
      isPlay: false,
      speed: 1,
      speedList: [1, 2, 4, 8]
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    speed(v) {
      this.map.changeSpeed(v);
    },
    timeValue(v) {
      this.map.timeTo(v);
    }
  },
  methods: {
    init() {
      this.map = new map('map');
      this.map.initAnimation(false);
      this.map.addPath(this.creatPath(), []);
      this.map.addVehicle('vehicle', 0);
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
    creatPath() {
      let start = [120.164839, 30.168857];
      let path = [start];
      for (let i = 0; i < 100; i++) {
        let x = (Math.random() / 100) - 0.005;
        let y = (Math.random() / 100) - 0.005;
        let temp = [path[i][0] + x, path[i][1] + y];
        temp = toStringXY(temp, 6).split(', ');
        temp = [parseFloat(temp[0]), parseFloat(temp[1])];
        path.push(temp);
      }
      return path;
    },
    contextmenu() {
      this.map.stopAnimation();
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
    },
  }
};
</script>

<style lang="less" scoped>
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
.player {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
    /deep/ .el-slider__runway {
      margin-top: -6px !important;
    }
    /deep/ .el-slider__button {
      border: none !important;
      background-color: rgb(218, 218, 218);
      border-radius: 3px !important;
      width: 15px !important;
      height: 10px !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }
    /deep/ .el-slider__bar {
      background-color: #fa3239 !important;
      border-top-left-radius: 0px !important;
      border-bottom-left-radius: 0px !important;
    }
    /deep/ .el-slider__runway {
      background-color: transparent !important;
    }
    .btn_sum {
      width: 100%;
      height: 30px;
      margin-top: -10px;
      display: flex;
      justify-content: center;
      align-items: center;
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
      bottom: 20px;
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
</style>

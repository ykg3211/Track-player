<template>
  <div class="trackPlayBackMain">
    <div class="trackMap">
      <trackPlayer ref="trackPlayer"></trackPlayer>
    </div>
    <div class="buttonList">
      <button
        class="bu start"
        @click="start"
      >开始</button>
      <button
        class="bu clear"
        @click="clear"
      >清空</button>
    </div>
  </div>
</template>

<script>
import trackPlayer from '../components/trackPlayer.vue';
import { toStringXY } from 'ol/coordinate';

export default {
  name: 'Index',
  components: {
    trackPlayer
  },
  data() {
    return {
      map: null,
    };
  },
  methods: {
    start() {
      this.$refs.trackPlayer.exitPlay();
      this.$refs.trackPlayer.initPlay(this.creatPath());
    },
    clear() {
      this.$refs.trackPlayer.exitPlay();
    },
    creatPath() {
      let start = [116.397228, 39.909604];
      let path = [start];
      let speed = [0];
      let direction = [0];
      for (let i = 0; i < 100; i++) {
        let x = (Math.random() / 1000) - 0.0005;
        let y = (Math.random() / 1000) - 0.0005;
        let temp = [path[i][0] + x, path[i][1] + y];
        temp = toStringXY(temp, 6).split(', ');
        temp = [parseFloat(temp[0]), parseFloat(temp[1])];
        path.push(temp);

        speed.push(Math.floor(Math.random() * 150));

        direction.push(Math.floor(Math.random() * 360));
      }
      return {
        path: path,
        speed: speed,
        direction: direction
      };
    }
  }
};
</script>

<style scoped lang="less">
.trackPlayBackMain {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .trackMap {
    width: 80%;
    height: 80%;
  }
  .buttonList {
    display: flex;
    margin: 30px 0;
    button {
      width: 80px;
      height: 30px;
      margin: 0 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 15px;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.22), 0 0 6px rgba(0, 0, 0, 0.04);
      outline: none;
      border: none;
      background-color: rgb(248, 248, 248);
      color: rgb(107, 107, 107);
    }
    .bu:active {
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.32), 0 0 6px rgba(0, 0, 0, 0.04);
    }
  }
}
</style>

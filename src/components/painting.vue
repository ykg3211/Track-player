<template>
  <div
    class="main"
    ref="rootmap"
    id="map"
  >
  </div>
</template>

<script>
/* eslint-disable */
import { colors, vehicle, car, path } from '../js/config';
import map from '../js/openlayer.js';

export default {
  name: 'trackPlayer',
  components: {
  },
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    this.init();
  },
  watch: {

  },
  methods: {
    init() {
      this.map = new map('map');

      // this.map.initPaint();
      this.map._mouseMoveEvent();
    },
  }
};
</script>

<style lang="less" scoped>
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
/deep/ .overlay_text {
  background-color: rgba(235, 235, 235, 0.445);
  padding: 5px 10px;
  border-radius: 5px;
}
</style>

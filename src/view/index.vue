<template>
  <div class="box">
    <div style="margin: -30px 0px 30px 0px">
      <el-radio-group v-model="type">
        <el-radio :label="1">轨迹回放</el-radio>
        <el-radio :label="2">绘制</el-radio>
      </el-radio-group>
    </div>
    <div class="window">
      <keep-alive v-if="type === 1">
        <trackPlayer></trackPlayer>
      </keep-alive>
      <keep-alive v-if="type === 2">
        <painting></painting>
      </keep-alive>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import trackPlayer from '../components/trackPlayer.vue';
import painting from '../components/painting.vue';

export default {
  name: 'Maptalks',
  components: {
    trackPlayer,
    painting
  },
  data() {
    return {
      type: 2
    };
  },
  mounted() {

  },
  watch: {

  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0px;
  left: 0px;
  .window {
    width: 700px;
    height: 500px;
    border: 1px solid;
    overflow: hidden;
    position: relative;
  }
}
</style>

<template>
  <div class="box">
    <div class="window">
      <trackPlayer></trackPlayer>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import trackPlayer from '../components/trackPlayer.vue';

export default {
  name: 'Openlayers',
  components: {
    trackPlayer,
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

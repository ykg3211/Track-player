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
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.22), 0 0 6px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    position: relative;
  }
}
</style>

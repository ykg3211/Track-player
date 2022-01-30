<template>
  <div class="sopTemplate" :title="config">
    <div class="title">
      <span v-if="!isEdit">{{ data.title }}</span>
      <el-input
        v-else
        style="width: 180px"
        @change="changeTitle_"
        v-model="data.title"
        size="mini"
        placeholder="请输入内容"
      ></el-input>
      <el-button @click="deleteSop_" icon="el-icon-delete" size="mini" circle></el-button>
    </div>
    <div class="content">
      <el-input
        type="textarea"
        :rows="2"
        @change="changeTextContent_"
        placeholder
        v-model="data.textContent"
      ></el-input>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'SopTemplate',
  components: {
  },
  props: {
    config: {
      type: Object,
      require: true,
      default: () => {
        return {};
      }
    },
    index: {
      type: Number,
      require: true,
      default: -1
    }
  },
  data() {
    return {
      data: {
        title: '',
        textContent: ''
      },
      isEdit: false
    };
  },
  computed: {

  },
  created() {
    this.data.title = this.config.data.title || '';
    this.isEdit = this.config.isEdit;
  },
  methods: {
    ...mapMutations('sop', [
      'changeTitle',
      'changeTextContent',
      'deleteSop'
    ]),
    changeTitle_(title) {
      this.changeTitle([this.index, title]);
    },
    changeTextContent_(content) {
      this.changeTextContent([this.index, content]);
    },
    deleteSop_() {
      this.deleteSop(this.index);
    }
  }
};
</script>

<style scoped lang="less">
.sopTemplate {
  width: 100%;
  height: 100%;
  .title {
    width: 100%;
    height: 40px;
    background-color: rgb(232, 232, 232);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .content {
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>

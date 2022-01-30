<template>
  <div class="sopTemplate" :title="config">
    <div class="title">
      <span v-if="!isEdit">{{ data.title }}</span>
      <el-input v-else style="width: 180px" v-model="data.title" size="mini" placeholder="请输入内容"></el-input>
      <el-button @click="deleteSop" icon="el-icon-delete" size="mini" circle></el-button>
    </div>
    <div class="content">
      <el-input type="textarea" :rows="2" placeholder v-model="data.textContent"></el-input>
      <div class="btnBox">
        <el-button @click="() => {}" icon="el-icon-delete" size="mini">添加联系人</el-button>
        <el-button @click="() => {}" icon="el-icon-delete" size="mini">导入文件</el-button>
        <el-button @click="() => {}" icon="el-icon-delete" size="mini">删除全部</el-button>
      </div>
      <div class="contactBox width100">
        <div class="contactItem" v-for="(item, index) in data.contactList" :key="index">
          <div class="contactName flexCenter">
            <span>123</span>
            <el-button @click="() => {}" icon="el-icon-delete" size="mini" circle></el-button>
          </div>
          <div>321</div>
        </div>
      </div>
      <div class="width100 actionBox" style="padding: 3px 5px">
        <el-checkbox
          v-model="data.actionStatus"
          style="margin: 8px 0"
        >Response status that requires the operator to make as</el-checkbox>
        <div v-if="data.actionStatus" class="statusList">
          <div class="statusItem" v-for="(item, index) in data.actionsList" :key="index">
            <el-input
              style="width: 180px"
              v-model="data.actionsList[index]"
              size="mini"
              placeholder="请输入内容"
            ></el-input>

            <span>{{ item }}</span>
            <el-button @click="deleteActionStatus(index)" icon="el-icon-delete" size="mini" circle></el-button>
          </div>
          <div class="statusItem statusItemAdd" @click="addStatus">
            <span>add</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from './EventBus';
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
        textContent: '',
        fileList: [],
        contactList: [],
        actionStatus: false,
        actionsList: []
      },
      isEdit: false
    };
  },
  computed: {

  },
  created() {
    this.data = this.config.data;
    this.isEdit = this.config.isEdit;
    EventBus.$on('sendInfo', this.sendInfo);
  },
  beforeDestroy() {
    EventBus.$off('sendInfo', this.sendInfo);
  },
  methods: {
    sendInfo() {
      console.log('sendInfo');
    },
    deleteSop() {
      this.$emit('deleteSop', this.index);
    },
    addStatus() {
      this.data.actionsList.push('12');
    },
    deleteActionStatus(index) {
      this.data.actionsList.splice(index, 1);
    }
  }
};
</script>

<style scoped lang="less">
.sopTemplate {
  width: 100%;
  height: 100%;
  .width100 {
    width: 100%;
  }
  .flexCenter {
    display: flex;
    align-content: center;
    justify-content: space-between;
    box-sizing: border-box;
  }
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
    .btnBox {
      width: 100%;
      margin: 10px 0;
      display: flex;
      align-items: center;
    }
    .contactBox {
      margin-bottom: 4px;
      .contactItem {
        background-color: rgb(243, 243, 243);
        .contactName {
          width: 100%;
          padding: 3px 5px;
        }
      }
    }
    .actionBox {
      text-align: left;
      .statusList {
        overflow: hidden;
        .statusItemAdd {
          border: 1px dashed rgba(0, 0, 0, 0.2) !important;
          cursor: pointer;
        }
        .statusItem {
          float: left;
          height: 28px;
          display: flex;
          justify-content: space-between;
          align-content: center;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-sizing: border-box;
          margin-right: 10px;
          margin-bottom: 5px;
          span {
            padding: 0 20px;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>

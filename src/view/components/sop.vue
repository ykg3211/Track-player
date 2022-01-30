<template>
  <div class="sop">
    <div>{{ sopList }}</div>
    <el-button icon="el-icon-add" @click="getAllInfo" size="mini">123</el-button>
    <el-popover placement="top-start" width="200" trigger="hover">
      <el-button icon="el-icon-add" slot="reference" size="mini">添加响应动作</el-button>
      <div>
        <div class="sopBtn" @click="add(sopType.SOP_PHONE)">拨打电话</div>
        <div class="sopBtn" @click="add(sopType.SOP_EMAIL)">发送邮件</div>
        <div class="sopBtn" @click="add(sopType.SOP_EVIDENCE)">保存证据</div>
        <div class="sopBtn" @click="add(sopType.SOP_CONSTOM)">自定义动作</div>
      </div>
    </el-popover>

    <draggable
      v-model="sopList"
      class="list-group"
      tag="ul"
      v-bind="dragOptions"
      @start="dragStart"
      @end="dragEnd"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <div
          class="sopBox"
          v-for="(item, index) in sopList"
          :key="item.id"
          :class="{'arrow' : index !== sopList.length - 1}"
        >
          <sopTemplate @deleteSop="deleteSop" :config="item" :index="index"></sopTemplate>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import sopTemplate from './sopTemplate.vue';
import { sopType, template } from '../../view/components/constant';
import { EventBus } from './EventBus';
export default {
  name: 'Sop',
  components: {
    draggable,
    sopTemplate
  },
  data() {
    this.sopType = sopType;
    return {
      list: new Array(10).fill().map((name, index) => {
        return { name, order: index + 1 };
      }),
      drag: false,
      sopList: [
        {
          id: 0,
          type: 0,
          isEdit: true,
          data: {
            title: '',
            textContent: '',
            fileList: [],
            contactList: [1],
            actionStatus: true,
            actionsList: [12, 3, 2]
          }
        },
        {
          id: 1,
          type: 0,
          isEdit: true,
          data: {
            title: '',
            textContent: '',
            fileList: [],
            contactList: [],
            actionStatus: false,
            actionsList: []
          }
        }
      ],
      sopID: 2
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  created() {
  },
  methods: {
    dragStart() {
      this.drag = true;
    },
    dragEnd() {
      this.drag = false;
    },
    deleteSop(index) {
      this.sopList.splice(index, 1);
    },
    add(type) {
      const temp = JSON.parse(JSON.stringify(template));
      this.sopList.push(Object.assign(temp, {
        id: this.sopID++,
        type
      }));
    },
    getAllInfo() {
      EventBus.$emit('sendInfo');
    }
  }
};
</script>

<style scoped lang="less">
.sop {
  .sopBtn:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .sopBtn {
    margin: 5px 0;
    padding: 5px 10px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .sopBox {
    width: 500px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    background-color: white;
    margin: 20px 0;
    border-radius: 3px;
    // overflow: hidden;
    position: relative;
  }
  .arrow::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 20px;
    background-color: rgb(225, 225, 225);
    bottom: -20px;
  }
}
</style>

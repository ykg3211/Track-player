<template>
  <div class="sop">
    <div>{{ sopList }}</div>
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
      v-model="sopList_"
      class="list-group"
      tag="ul"
      v-bind="dragOptions"
      @start="dragStart"
      @end="dragEnd"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <div class="sopBox" v-for="(item, index) in sopList" :key="item.id">
          <sopTemplate :config="item" :index="index"></sopTemplate>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import sopTemplate from './sopTemplate.vue';
import { mapState, mapMutations } from 'vuex';
import { sopType } from './constant';

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
      sopList_: []
    };
  },
  computed: {
    ...mapState({
      sopList: state => state.sop.sopList
    }),
    // ...mapGetters('cart', {
    //   products: 'cartProducts',
    //   total: 'cartTotalPrice'
    // }),
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  watch: {
    sopList_: {
      immediate: false,
      handler(v) {
        this.setSopList(v);
      }
    }
  },
  created() {
    this.sopList_ = this.sopList;
  },
  methods: {
    ...mapMutations('sop', [
      'addSop',
      'setSopList'
    ]),
    dragStart() {
      this.drag = true;
    },
    dragEnd() {
      this.drag = false;
    },
    add(type) {
      this.addSop(type);
    }
  }
};
</script>

<style scoped lang="less">
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
  overflow: hidden;
}
</style>

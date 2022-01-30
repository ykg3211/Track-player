import {sopType, template} from '../../view/components/constant';
const getSopTemplate = function(config) {
  const temp = JSON.parse(JSON.stringify(template));
  return Object.assign(temp, config);
};

const state = () => ({
  isEdit: true,
  sopList: [
    {
      id: 0,
      type: 0,
      isEdit: true,
      data: {
        title: '123',
        textContent: ''
      }
    },
    {
      id: 1,
      isEdit: true,
      data: {}
    }
  ],
  sopId: 2
});

// getters
const getters = {
  // cartTotalPrice: (state, getters) => {
  //   return getters.cartProducts.reduce((total, product) => {
  //     return total + product.price * product.quantity
  //   }, 0)
  // }
};

// actions
const actions = {

};

// mutations
const mutations = {
  changeTitle (state, [index, title]) {
    const temp = state.sopList[index];
    temp.title = title;
    state.sopList.splice(index, temp);
  },
  changeTextContent (state, [index, content]) {
    const temp = state.sopList[index];
    temp.textContent = content;
    state.sopList.splice(index, temp);
  },
  setSopList(state, sopList) {
    console.log(state);
    state.sopList = sopList;
  },
  deleteSop(state, index) {
    state.sopList.splice(index, 1);
  },
  addSop (state, type) {
    state.sopList.push(getSopTemplate({
      id: state.sopId++,
      type,
      isEdit: state.isEdit
    }));
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

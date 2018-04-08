<template>
  <div class="chooser-component">
      <ul class="chooser-list">
          <li v-for="(item, index) in selections" :key="index" @click="selectItem(index)" :class="{active: selectIndex===index}">{{ item.label }}</li>
      </ul>
  </div>
</template>
<script>
export default {
  props: {
    selections: {
      type: Array,
      default: () => {
        return {
          label: 'test',
          value: 0
        }
      }
    }
  },
  data () {
    return {
      selectIndex: 0
    }
  },
  methods: {
    selectItem (index) {
      this.selectIndex = index
      this.$emit('on-change', this.selections[this.selectIndex])
    }
  }
}
</script>
<style scoped>
.chooser-component {
  position: relative;
  display: inline-block;
}
.chooser-list li{
  display: inline-block;
  border: 1px solid #e3e3e3;
  height: 25px;
  line-height: 25px;
  padding: 0 8px;
  margin-right: 5px;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
}
.chooser-list li.active {
  border-color: #4fc08d;
  background: #4fc08d;
  color: #fff;
}
</style>

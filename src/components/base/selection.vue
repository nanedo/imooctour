<template>
  <div class="selection-component" @click.stop>
      <div class="selection-show" @click="changeDrop">
          <span> {{ this.selections[this.selected].label }} </span>
          <div class="arrow"></div>
      </div>
      <transition name="dropList">
        <div class="selection-list" v-show="isDroped">
            <ul>
                <li v-for="(item, index) in selections" :key="index" @click="selectItem(index)">
                    {{ item.label }}
                </li>
            </ul>
        </div>
      </transition>
  </div>
</template>
<script>
import {eventBus} from '../../eventBus'

export default {
  mounted () {
    eventBus.$on('reset-component', () => {
      console.log('emit quick2?', this.isDroped.toString())
      this.isDroped = false
    })
  },
  props: {
    selections: {
      type: Array,
      default: () => {
        return [{
          label: 'test',
          value: 0
        }]
      }
    }
  },
  data () {
    return {
      selected: 0,
      isDroped: false
    }
  },
  methods: {
    changeDrop () {
      if (this.isDroped === false) {
        eventBus.$emit('reset-component')
      }
      this.isDroped = !this.isDroped
      console.log('emit quick?', this.isDroped.toString())
    },
    selectItem (val) {
      this.selected = val
      this.isDroped = false
      this.$emit('on-change', this.selections[this.selected])
    }
  }
}
</script>
<style scoped>

.selection-component {
  position: relative;
  display: inline-block;
}
.selection-show {
  border: 1px solid #e3e3e3;
  padding: 0 20px 0 10px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  height: 25px;
  line-height: 25px;
  border-radius: 3px;
  background: #fff;
}
.selection-show .arrow {
  display: inline-block;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #e3e3e3;
  width: 0;
  height: 0;
  margin-top: -1px;
  margin-left: 6px;
  margin-right: -14px;
  vertical-align: middle;
}
.selection-list {
  display: inline-block;
  position: absolute;
  left: 0;
  top: 25px;
  width: 100%;
  background: #fff;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  z-index: 5;
}
.selection-list li {
  padding: 5px 15px 5px 10px;
  border-left: 1px solid #e3e3e3;
  border-right: 1px solid #e3e3e3;
  cursor: pointer;
  background: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

}
.selection-list li:hover {
  background: #e3e3e3;
}
.dropList-enter,.dropList-leave-to{
    opacity: 0;
}
.dropList-enter-active,
.dropList-leave-active{
    transition: all .3s ease;
}
</style>

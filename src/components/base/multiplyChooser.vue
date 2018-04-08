<template>
  <div class="chooser-component">
      <ul class="chooser-list">
          <li v-for="(item, index) in selections" :key="index" @click="changeActive(index)" :class="{active: checkActive(index)}">{{ item.label }}</li>
      </ul>
  </div>
</template>
<script>
export default {
  created () {
      
  },
  props: {
      selections: {
          type: Array,
          default: [{
              label: 'test',
              value: 0
          }]
      }
  },
    data () {
        return {
            // 如果采用对象的形式，因为没有提前初始化好属性名造成不能自动响应
            selectIndex: [0]
        }
    },
    methods: {
        checkActive (index){
            // 如果存在则返回false，否则返回true
            return this.selectIndex.indexOf(index) !== -1
        },
        changeActive (index) {
            if(this.selectIndex.indexOf(index) !== -1){
                this.selectIndex = this.selectIndex.filter(el => {
                    return el!==index
                })
            }else{
                this.selectIndex.push(index)
            }
            this.$emit('on-change',this.selectIndex.map(el => {
                return this.selections[el]
            }))
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

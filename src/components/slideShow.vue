<template>
  <div class="slide-show" @mouseover="clearInv" @mouseout="runInv">
      <div class="slide-img">
          <a :href="slides[nowIndex].href">
              <transition :name="slideEnterTrans">
                <img v-if="isShow" :src="slides[nowIndex].src" alt="">
              </transition>
              <!-- 当切换到isShow为false时，显示下面这张 -->
              <transition :name="slideLeaveTrans">
                <img v-if="!isShow" :src="slides[nowIndex].src" alt="">
              </transition>
          </a>
      </div>
      <h2>{{ slides[nowIndex].title }}</h2>
      <ul class="slide-pages">
          <li @click="goto(prevIndex)">&lt;</li>
          <li v-for="(slide, index) in slides" :key="index" @click="goto(index)">
              <a :class="{on: index === nowIndex}">{{ index + 1 }}</a>
          </li>
          <li @click="goto(nextIndex)">&gt;</li>
      </ul>
  </div>
</template>
<script>
export default {
  props: {
      slides: {
          type: Array,
          default: [],
          required: true
      },
      inv: {
          type: Number,
          default: 1000
      },
      doSomethingByEmit: {
          type: Function
      }
  },
  data () {
      return {
          nowIndex: 0,
          isShow: true,
          slideLeaveTrans: 'slide-trans-old',
          slideEnterTrans: 'slide-trans'
      }
  },
  computed: {
      prevIndex () {
          
          if(this.nowIndex === 0){
              return this.slides.length - 1
          }
          return this.nowIndex - 1
      },
      nextIndex () {
          
          if(this.nowIndex === this.slides.length - 1){
              return 0
          }
          return this.nowIndex + 1
      }
  },
  methods: {
      goto (index) {
          // 根据大小比较判断切换方向
          if(this.nowIndex<index){
              this.slideLeaveTrans = 'slide-trans-old'
              this.slideEnterTrans = 'slide-trans'
          }else{
              this.slideLeaveTrans = 'slide-trans-old-right'
              this.slideEnterTrans = 'slide-trans-right'
          }
          
          // this.$emit('doSomethingByEmit', this.nowIndex)

          this.isShow = false
          //通过显隐执行动画，切换状态
          setTimeout(() => {
              this.isShow = true
              this.nowIndex = index
          }, 10)
      },
      runInv () {
          this.invId = setInterval(() => {
              this.goto(this.nextIndex)
          }, this.inv)
      },
      clearInv () {
          clearInterval(this.invId)
      }
  },
  mounted () {
      this.runInv()
  }
}
</script>
<style scoped>
.slide-trans-enter-active, .slide-trans-right-enter-active {
  transition: all .5s;
}
.slide-trans-enter {
  transform: translateX(900px);
}
.slide-trans-right-enter {
  transform: translateX(-900px);
}
.slide-trans-old-leave-active {
  transition: all .5s;
  transform: translateX(-900px);
}
.slide-trans-old-right-leave-active{
  transition: all .5s;
  transform: translateX(900px);
}
.slide-show {
  position: relative;
  margin: 15px 15px 15px 0;
  width: 900px;
  height: 500px;
  overflow: hidden;
}
.slide-show h2 {
  position: absolute;
  width: 100%;
  height: 100%;
  color: #fff;
  background: #000;
  opacity: .5;
  bottom: 0;
  height: 30px;
  text-align: left;
  padding-left: 15px;
}
.slide-img {
  width: 100%;
}
.slide-img img {
  width: 100%;
  position: absolute;
  top: 0;
}
.slide-pages {
  position: absolute;
  bottom: 10px;
  right: 15px;
}
.slide-pages li {
  display: inline-block;
  padding: 0 10px;
  cursor: pointer;
  color: #fff;
}
.slide-pages li .on {
  text-decoration: underline;
}
</style>

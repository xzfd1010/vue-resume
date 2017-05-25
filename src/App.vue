<template>
  <div id="app">
    <StyleEditor ref="styleEditor" :code="currentStyle"></StyleEditor>
    <ResumeEditor ref="resumeEditor" :markdown="currentMarkdown" :enableHtml="enableHtml"></ResumeEditor>
  </div>
</template>

<script>
  import StyleEditor from './components/StyleEditor'
  import ResumeEditor from './components/ResumeEditor'
  import './assets/reset.css'

  export default {
    name: 'app',
    components: {
      StyleEditor,
      ResumeEditor
    },
    data(){
      return {
        interval: 10,
        currentStyle: '',
//        是否启用markdown转换吧？
        enableHtml: false,
//        在style中展示的东西，分为3个数组是因为展示的顺序不同
        fullStyle: [
          `/*
* Inspired by http://strml.net/
* 大家好，我是Nick
* 看了饥人谷方方老师做的vue简历，我也想动手做一份！
* 说做就做，我也来写一份简历！
*/

/* 首先给所有元素加上过渡效果 */
* {
  -webkit-transition: all .3s;
  transition: all .3s;
}
/* 白色背景太单调了，我们来点背景 */
html {
  color: rgb(222,222,222); background: rgb(0,43,54);
}
/* 文字离边框太近了 */
.styleEditor {
  padding: .5em;
  border: 1px solid;
  margin: .5em;
  overflow: auto;
  width: 45vw; height: 90vh;
}
/* 代码高亮 */
.token.selector{ color: rgb(133,153,0); }
.token.property{ color: rgb(187,137,0); }
.token.punctuation{ color: yellow; }
.token.function{ color: rgb(42,161,152); }

/* 加点 3D 效果呗 */
html{
  -webkit-perspective: 1000px;
          perspective: 1000px;
}
.styleEditor {
  position: fixed; left: 10px; top: 0;
  -webkit-transition: none;
  transition: none;
  -webkit-transform: rotateY(10deg) translateZ(-100px) ;
          transform: rotateY(10deg) translateZ(-100px) ;
}

/* 接下来我给自己准备一个编辑器 */
.resumeEditor{
  position: fixed; right: 0; top: 0;
  padding: .5em;  margin: .5em;
  width: 48vw; height: 90vh;
  border: 1px solid;
  background: white; color: #222;
  overflow: auto;
}
/* 好了，我开始写简历了 */


`,
          `
/* 这个简历好像差点什么
 * 对了，这是 Markdown 格式的，我需要变成对 HR 更友好的格式
 * 简单，用开源工具翻译成 HTML 就行了
 */
`
          ,
          `
/* 再对 HTML 加点样式 */
.resumeEditor{
  padding: 2em;
}
.resumeEditor h2{
  display: inline-block;
  border-bottom: 1px solid;
  margin: 1em 0 .5em;
}
.resumeEditor ul,.resumeEditor ol{
  list-style: none;
}
.resumeEditor ul> li::before{
  content: '•';
  margin-right: .5em;
}
.resumeEditor ol {
  counter-reset: section;
}
.resumeEditor ol li::before {
  counter-increment: section;
  content: counters(section, ".") " ";
  margin-right: .5em;
}
.resumeEditor blockquote {
  margin: 1em;
  padding: .5em;
  background: #ddd;
}
`],
//        当前的markdown
        currentMarkdown: '',
        fullMarkdown:  `仲程
----

前端工程师，现任职于国付宝信息科技有限公司。

技能
----

* 前端开发

工作经历
----

1. 国付宝信息技术有限公司

链接
----

* [GitHub](https://github.com/xzfd1010)

> 如果你喜欢这个效果，Fork [方方的项目](https://github.com/jirengu-inc/animating-resume)，打造你自己的简历！

`
      }
    },
    created(){
//      生命周期钩子函数，创建组件的时候执行：
      this.makeResume()
    },
    methods: {
      makeResume: async function () {
//          五个函数的作用一会儿看一下，利用async，相当于每次执行完了一个函数再执行下一个函数，这已经是同步了吧？？？
        await this.progressivelyShowStyle(0);
        await this.progressivelyShowResume();
        await this.progressivelyShowStyle(1);
        await this.showHtml();
        await this.progressivelyShowStyle(2)
      },
      showHtml: function () {
        return new Promise((resolve) => {
          this.enableHtml = true;
          resolve()
        })
      },
      progressivelyShowStyle(n){
        return new Promise(resolve => {
//              设定时间间隔
          let interval = this.interval;
          let showStyle = (async function () {
//                  n一共有3个，第一个是初始化样式，第二个是将右侧的markdown格式的语法变为html，第三个是对html添加样式
            let style = this.fullStyle[n];
//                  如果style为false，说明未传入，直接返回
            if (!style) {
              return;
            }
            //计算前n个style的字符总数
            let length = this.fullStyle.filter((_, index) => index <= n).map((item) => item.length).reduce((p, c) => p + c, 0);
            let prefixLength = length - style.length;
            if (this.currentStyle.length < length) {
//                console.log(this);
              let l = this.currentStyle.length - prefixLength;
              let char = style.substring(l, l + 1) || ' ';
              this.currentStyle += char;
              if (style.substring(l - 1, l) === '\n' && this.$refs.styleEditor) {
                this.$nextTick(() => {
                  this.$refs.styleEditor.goBottom();
                })
              }
              setTimeout(showStyle, interval);
            } else {
              resolve();
            }
          }).bind(this);
          showStyle()
        })
      },
      progressivelyShowResume(){
        return new Promise((resolve) => {
          let length = this.fullMarkdown.length;
          let interval = this.interval;
          let showResume = () => {
            if (this.currentMarkdown.length < length) {
              this.currentMarkdown = this.fullMarkdown.substring(0, this.currentMarkdown.length + 1);
              let lastChar = this.currentMarkdown[this.currentMarkdown.length - 1];
              let prevChar = this.currentMarkdown[this.currentMarkdown.length - 2];
              if (prevChar === '\n' && this.$refs.resumeEditor) {
                this.$nextTick(() => this.$refs.resumeEditor.goBottom())
              }
              setTimeout(showResume, interval);
            } else {
              resolve()
            }
          };
          showResume()
        })
      }
    },
    computed: {
      styleCode(){
        return '<style>' + this.code + '</style>'
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    min-height: 100vh;
  }

  * {
    -webkit-transition: all .3s;
    transition: all .3s;
  }
</style>

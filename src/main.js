import Vue from 'vue'
import Timeline from '@/components/Timeline'

Vue.config.productionTip = false

let element = document.getElementById("project-timeline-demo")
if (element) {
  new Vue({
    el: "#project-timeline-demo",
    components: {
      Timeline
    },
  })
}

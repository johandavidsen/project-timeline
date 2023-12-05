import { createApp } from 'vue/dist/vue.esm-bundler'
import TimeLine from '@/components/Time-line.vue'

if (document.getElementById("project-timeline-demo")) {
  const app = createApp({})
  app.component('TimeLine', TimeLine)
  app.mount("#project-timeline-demo")
}

# project-timeline

![GitHub package.json version](https://img.shields.io/github/package-json/v/johandavidsen/project-timeline?style=flat-square)


## Project Installation
Assumption is that [VueJS](), [jQuery]() and [lightGallery]() are available in the
global space.

```javascript
const Timeline = require('project-timeline/dist/project-timeline.umd.min')

let element = document.getElementById("project-timeline-demo")
if (element) {
  new Vue({
    el: "#project-timeline-demo",
    components: {
      Timeline
    },
  })
}
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

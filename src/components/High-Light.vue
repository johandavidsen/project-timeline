<script setup>
import {onMounted, ref} from "vue"
import lightGallery from "lightgallery"
import lgZoom from 'lightgallery/plugins/zoom'
import lgVideo from 'lightgallery/plugins/video'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import 'lightgallery/css/lightgallery-bundle.css'

const props = defineProps({
  dataEvent: {
    type: Object,
    required: true
  }
})

const hover = ref(false)
const tooltip = ref(props.dataEvent.tooltip)
const dynamic = ref([])
const show = ref(false)

onMounted(() => {
  if (tooltip.value) {
    //let target = $(this.$refs.h)
    //target.tooltip()
  }

  if (props.dataEvent.entries) {
    for (let i = 0; i < props.dataEvent.entries.length; i++) {
      let entry = props.dataEvent.entries[i]

      if (entry.src) {
        dynamic.value.push(entry)
      }
    }
  }
})

function _click() {
  show.value = !show.value

  if (show.value) {
    // Mount gallery
    lightGallery(document.getElementById('event-gallery'),{
      plugins: [lgZoom, lgThumbnail, lgVideo],
      speed: 500,
      mode: 'lg-fade',
    })
  }


}

function _activeGallery(options) {
  // Destroy previous selector if found
  if ($(this).data('lightGallery')) {
    $(this).data('lightGallery').destroy(true);
  }

  let target = $(this)

  //target.on('onSlideItemLoad.lg', () => setInterval(this._updateImage, 5000))

  setTimeout(function () {
    target.lightGallery(options);
  }, 250);
}

function _toggleHover() {
  hover.value = !hover.value
}

</script>

<template>
  <div
      ref="h"
      class="circle"
      tabindex="0"
      data-toggle="tooltip"
      data-placement="top"
      data-iframe="true"
      :title="tooltip"
      :class="{ active: hover }"
      @focusin="_toggleHover"
      @focusout="_toggleHover"
      @mouseover="_toggleHover"
      @mouseleave="_toggleHover"
      @click="_click">
    <div id="event-gallery"
        v-if="show">
      <a
          v-for="item in dynamic"
          href="#"
          :key="item.date"
          :data-src="item.src"
      >
        <img class="img-responsive" :src="item.thumb"  alt=""/>
      </a>
    </div>
  </div>
</template>

<style>

.circle {
  width: 15px;
  height: 15px;
  background: white;
  border-radius: 15px;
  position: absolute;
  top: -7px;
  border: 2px solid #00adef;
  cursor: pointer;
  z-index: 1;
}

.circle:before {
  content: '';
  width: 7px;
  height: 7px;
  background: #00adef;
  position: absolute;
  border-radius: 100%;
  top: 2px;
  left: 2px;
  display: none;
}

.circle.hover:before, .circle.active:before {
  display: block;
}

.circle.hover .popupSpan, .circle.active .popupSpan {
  display: block;
}

.circle.active .popupSpan {
  top: -40px;
}
</style>


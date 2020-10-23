<template>
    <div class="circle"
         tabindex="0"
         data-toggle="tooltip"
         data-placement="top"
         data-iframe="true"
         v-bind:title="tooltip"
         v-on:focusin="_toggleHover"
         v-on:focusout="_toggleHover"
         v-on:mouseover="_toggleHover"
         v-on:mouseleave="_toggleHover"
         v-bind:class="{ active: hover }"
         v-on:click="_click"
         ref="h">
    </div>
</template>

<script>

  export default {
    name: "Event",

    props: [
      'dataEvent'
    ],

    data () {
      return {
        hover: false,
        tooltip: this.dataEvent.tooltip,
        dynamic: []
      }
    },

    mounted () {
      if (this.tooltip) {
        let target = $(this.$refs.h)
        target.tooltip()
      }

      if (this.dataEvent.entries) {
        for(let i = 0; i < this.dataEvent.entries.length; i++) {
          let entry = this.dataEvent.entries[i]

          if (entry.src) {
            this.dynamic.push(entry)
          }
        }
      }
    },

    methods: {

      _click () {

        if (this.dataEvent.entries) {

          //  if images
          for(let i = 0; i < this.dataEvent.entries.length; i++) {
            let entry = this.dataEvent.entries[i]

            if (entry.link) {

              if (entry.target) {
                window.open(entry.link, entry.target)
              } else {
                window.location = entry.link
              }
              return
            }
          }

          let options = {
            dynamic: true,
            dynamicEl: this.dynamic,
            hash: false,
            iframe: true
          }

          this._activeGallery(options)

        }
      },

      _activeGallery (options) {
        // Destroy previous selector if found
        if ($(this).data('lightGallery')) {
          $(this).data('lightGallery').destroy(true);
        }

        let target = $(this)

        target.on('onSlideItemLoad.lg', () => setInterval(this._updateImage, 5000))

        setTimeout(function()
        {
          target.lightGallery(options);
        }, 250);
      },

      _toggleHover() {
        this.hover = !this.hover
      }
    }
  }
</script>

<style lang="scss">
    $primary: #00adef;

    .circle {
        width: 15px;
        height: 15px;
        background: white;
        border-radius: 15px;
        position: absolute;
        top: -7px;
        border: 2px solid $primary;
        cursor: pointer;
        z-index: 1;
    }

    .circle:before {
        content: '';
        width: 7px;
        height: 7px;
        background: $primary;
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


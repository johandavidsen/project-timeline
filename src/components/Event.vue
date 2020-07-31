<template>
    <div class="circle"
         v-on:mouseover="_toggleHover"
         v-on:mouseleave="_toggleHover"
         v-bind:class="{ active: hover }"
         v-on:click="_click"></div>
</template>

<script>
  export default {
    name: "Event",

    props: [
      'dataEvent'
    ],

    data () {
      return {
        hover: false
      }
    },

    methods: {

      _click () {
        let dynamic = []
        if (this.dataEvent.entries) {
          for (let i = 0; i < this.dataEvent.entries.length; i++) {
            dynamic.push(this.dataEvent.entries[i])
          }
        }

        let options = {
          dynamic: true,
          dynamicEl: dynamic,
          hash: false
        }

        // Destroy previous selector if found
        // eslint-disable-next-line no-undef
        if ($(this).data('lightGallery')) {
          // eslint-disable-next-line no-undef
          $(this).data('lightGallery').destroy(true);
        }

        // eslint-disable-next-line no-undef
        let target = $(this)
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
        top: -9px;
        border: 2px solid $primary;
        cursor: pointer;
        z-index: 1;
    }

    .circle:before {
        content: '';
        width: 9px;
        height: 9px;
        background: $primary;
        position: absolute;
        border-radius: 100%;
        top: 3px;
        left: 3px;
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


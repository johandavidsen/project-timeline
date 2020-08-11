<template>
    <div class="project-timeline">
        <div class="line-cont">
            <div class="line">
                <div v-bind:key="`t-${tkey}`"
                     v-for="({ year, yearGap, textMargin }, tkey) in years"
                     class="year"
                     v-bind:style="{ left: yearGap + '%' }">
                    <p v-bind:style="'margin-left:' + textMargin + ';'">{{ year }}</p>
                </div>
                <div v-bind:key="`p-${pkey}`"
                     v-for="({ year, yearGap, textMargin}, pkey) in progressedTime"
                     class="progressed-year"
                     v-bind:style="{ left: yearGap + '%' }">
                  <p v-bind:style="'margin-left:' + textMargin + ';'" class="primary">{{ year }}</p>
                </div>
                <div class="progressed-time" v-bind:style="{ width: progressedTimeline + '%' }"></div>
                <i v-if="progressedTimeline > 0" class="fas fa-plane airplane fa-2x" v-bind:style="{ left: time + '%' }"></i>
                <Event v-bind:key="`m-${mkey}`"
                        v-for="({ date, marker }, mkey) in relevantEvents"
                        v-bind:data-event="markers.find(entry => entry.date === date)"
                        v-bind:style="{ left:  marker + '%'}"
                        >
                </Event>
            </div>
        </div>
        <div ref="project-content" class="project-content">
          <slot></slot>
      </div>
    </div>
</template>

<script>
  import Event from "@/components/Event"

  export default {
    name: 'Timeline',

    props: [
      'dataStartDate',
      'dataEndDate'
    ],

    data({dataStartDate, dataEndDate}) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth()
      const currentDay = currentDate.getDate()
      let startYear = Number(dataStartDate.split('-')[2])
      let endYear = Number(dataEndDate.split('-')[2])
      let years = []
      let progressedTime = []
      let time = 0

      if (endYear < startYear) {
        throw Error('Last year is later then first year')
      }
      // Get all years
      while (startYear <= endYear) {
        years.push({ year: startYear })
        startYear++
      }

      // Get the width of the year
      const gap = 100 / (years.length - 1);
      const day = gap / 360

      years.forEach((year, index) => {
        // Build timeline
        if (index === 0) {
          year.yearGap = 0
          year.textMargin = '0px'
        }

        if (index > 0) {
          year.yearGap = gap * index
          year.textMargin = '-17px'
        }

        if (index === years.length - 1) {
          year.yearGap = 100
          year.textMargin = '-32px'
        }

        // Populate timeline
        if (year.year <= currentYear) {
          progressedTime.push({
            year: year.year,
            yearGap: year.yearGap,
            textMargin: year.textMargin
          })
        }

        if (year.year === currentYear) {
          let days = ((currentMonth * 30) + currentDay) * day
          time = year.yearGap + days
        }
      })

      return {
        years: years,
        progressedTime: progressedTime,
        time: time,
        markers: []
      }
    },

    computed: {
      relevantEvents: function () { return this.markers.filter((m) => m.marker > 0) },
      progressedTimeline: function () { if (this.time > 0) { return this.time + 1 } return this.time }
    },

    mounted() {
      this._mapMarkers(Array.from(this.$refs["project-content"].childNodes))

    },

    methods: {

      _mapMarkers (entries) {
        let self = this

        let f = entries.filter(entry => { if (entry.dataset) { return entry }})

        this.markers = f.map((entry) => {
          if (entry.childNodes.length >= 1) {
            // Several items
            let subEntries = Array.from(entry.childNodes)
              .filter(child => /DIV/.test(child.tagName))

            return {
              date: entry.dataset.date,
              marker: self._calcMarkerDate(entry),
              entries: subEntries.filter(element => self._removeInvalidDiv(element)).map(element => self._divToObject(element))
            }
          }
        })
      },

      _calcMarkerDate (entry) {
        const gap = 100 / (this.years.length - 1);
        const day = gap / 360
        let thisYear = parseInt(entry.dataset.date.split('-')[2])
        let thisMonth = parseInt(entry.dataset.date.split('-')[1])
        let thisDay = parseInt(entry.dataset.date.split('-')[0])

        let days = ((thisMonth * 30) + thisDay) * day
        return ((thisYear - this.years[0].year) * gap) + days
      },

      _removeInvalidDiv (entry) {
        return entry.dataset.src
      },

      _divToObject (entry) {
        let r = {}

        if (entry.dataset.thumb !== undefined)  {
          r.thumb = entry.dataset.thumb
        }

        if (entry.dataset.src !== undefined) {
          r.src = entry.dataset.src
        }

        if (entry.dataset.html !== undefined) {
          r.html = entry.dataset.html
        }

        if (entry.textContent !== undefined && entry.textContent.length !== 0) {
          r.caption = entry.textContent
        }

        return r
      }
    },

    components: {
      Event
    }
  }
</script>

<style lang="scss">
    $primary: #00adef;

    .primary {
        color: $primary;
    }

    .none {
        display: none;
    }

    .project-gallery {
        display: none;
    }

    .project-timeline {
        height: 50px;
        padding: 10px 0;
    }

    .project-content {
      display: none;
    }

    .line-cont {
        width: 100%;
        height: 20%;
    }

    .line {
        height: 2px;
        width: 100%;
        background: #adb5bd;
        margin: auto;
        top: 50%;
        transform: translateY(-50%);
        position: relative;
    }

    .year {
        height: 15px;
        width: 2px;
        background: #adb5bd;
        position: absolute;
        padding-top: 15px;
    }

    .progressed-year {
        height: 15px;
        width: 2px;
        background: $primary;
        position: absolute;
        padding-top: 15px;
    }

    .progressed-time {
        height: 2px;
        background: $primary;
        margin: auto;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
    }

    .airplane {
        position: absolute;
        top: -15px;
    }
</style>


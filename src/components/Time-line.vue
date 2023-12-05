<script setup>
import Event from "@/components/High-Light.vue"
import {onMounted, ref} from "vue"

const props = defineProps({
  dataStartDate: {
    type: String,
    required: true
  },
  dataEndDate: {
    type: String,
    required: true
  }
})

/**
 * Build timeline structure
 *
 * Current Date
 */
const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth()
const currentDay = currentDate.getDate()

/**
 * Start and end date
 */
let startYear = Number(props.dataStartDate.split('-')[2])
let endYear = Number(props.dataEndDate.split('-')[2])

/**
 * An array of the number of years.
 */
let years = ref([])

/**
 * An array of the number of years that have passed.
 */
let progressedTime = []

/**
 * A percentage indicator of the current time.
 */
let time = ref(0)

/**
 * An array of all markers
 */
let markers = ref([])

/**
 * Validation, check if the last year is later then the first year.
 */
if (endYear < startYear) {
  throw Error('Last year is later then first year')
}

/**
 * Count the years
 */
while (startYear <= endYear) {
  years.value.push({year: startYear})
  startYear++
}

/**
 * Get the width of the year
 */
const gap = 100 / (years.value.length - 1);
const day = gap / 365

/**
 * Build the data structure for the component.
 */
years.value.forEach((year, index) => {

  // Build timeline
  if (index === 0) {
    year.yearGap = 0
    year.textMargin = '0px'
  }

  if (index >= 1) {
    year.yearGap = gap * index
    year.textMargin = '-17px'
  }

  if (index === years.value.length - 1) {
    year.yearGap = 100
    year.textMargin = '-32px'
  }

  // Populate timeline
  if (year.year < currentYear) {
    progressedTime.push({
      year: year.year,
      yearGap: year.yearGap,
      textMargin: year.textMargin
    })
  }

  if (year.year === currentYear) {
    let days = ((currentMonth * 30) + currentDay) * day
    time.value = (year.yearGap - gap) + days
  }
})

onMounted(() => {
  markers.value = _mapMarkers(Array.from(document.getElementById("project-content").childNodes))
})

function _mapMarkers(entries) {
  let f = entries.filter(entry => {
    if (entry.dataset) {
      return entry
    }
  })

  return f.map((entry) => {
    if (entry.childNodes.length >= 1) {
      // Several items
      let subEntries = Array.from(entry.childNodes)
          .filter(child => /DIV/.test(child.tagName))

      return {
        date: entry.dataset.date,
        tooltip: entry.dataset.tooltip ? entry.dataset.tooltip : null,
        marker: _calcMarkerDate(entry),
        entries: subEntries.filter(element => _removeInvalidDiv(element)).map(element => _divToObject(element))
      }
    }
  })
}

function _calcMarkerDate(entry) {
  const gap = 100 / (years.value.length - 1);
  const day = gap / 365

  let thisYear = parseInt(entry.dataset.date.split('-')[2])
  let thisMonth = parseInt(entry.dataset.date.split('-')[1])
  let thisDay = parseInt(entry.dataset.date.split('-')[0])

  let days = (((thisMonth - 1) * 30) + thisDay) * day
  return ((thisYear - years.value[0].year) * gap) + days
}

function _removeInvalidDiv(entry) {
  return entry.dataset.src || entry.dataset.link
}

function _divToObject(entry) {
  let r = {}

  if (entry.dataset.thumb !== undefined) {
    r.thumb = entry.dataset.thumb
  }

  if (entry.dataset.src !== undefined) {
    r.src = entry.dataset.src
  }

  if (entry.dataset.html !== undefined) {
    r.html = entry.dataset.html
  }

  if (entry.textContent !== undefined && entry.textContent.length !== 0) {
    r.subHtml = entry.innerHTML
  }

  if (entry.dataset.link !== undefined) {
    r.link = entry.dataset.link
  }

  if (entry.dataset.target !== undefined) {
    r.target = entry.dataset.target
  }

  return r
}
</script>

<template>
  <div class="project-timeline">
    <div class="line-cont">
      <div class="line">
        <div
            v-for="({ year, yearGap, textMargin }, tKey) in years"
            :key="`t-${tKey}`"
            class="year"
            :style="{ left: yearGap + '%' }">
          <p :style="'margin-left:' + textMargin + ';'">
            {{ year }}
          </p>
        </div>
        <div
            v-for="({ year, yearGap, textMargin}, pKey) in progressedTime"
            :key="`p-${pKey}`"
            class="progressed-year"
            :style="{ left: yearGap + '%' }">
          <p :style="'margin-left:' + textMargin + ';'" class="primary">
            {{ year }}
          </p>
        </div>
        <div class="progressed-time" :style="{ width: time + '%' }"></div>
        <i v-if="time > 0" class="fas fa-plane airplane fa-2x" :style="{ left: time + '%' }"></i>
        <Event
v-for="({ date, marker }, mKey) in markers"
               :key="`m-${mKey}`"
               :data-event="markers.find(entry => entry.date === date)"
               :style="{ left:  marker + '%'}"
        >
        </Event>
      </div>
    </div>
    <div id="project-content" class="project-content">
      <slot></slot>
    </div>
  </div>
</template>

<style>

.primary {
  color: #00adef;
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
  background: #00adef;
  position: absolute;
  padding-top: 15px;
}

.progressed-time {
  height: 2px;
  background: #00adef;
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


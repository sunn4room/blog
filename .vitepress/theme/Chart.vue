<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { useData } from 'vitepress'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({
  config: {
    type: String,
    required: true,
  },
})

const { isDark } = useData()
const chartCanvas = ref(null)
let chartObj = null
onMounted(() => {
  watchEffect(() => {
    Chart.defaults.animation.duration = 0
    Chart.defaults.backgroundColor = '#0000'
    Chart.defaults.borderColor = isDark.value ? '#bbb5' : '#4445'
    Chart.defaults.color = isDark.value ? '#bbb' : '#444'
    if (chartObj !== null) {
      chartObj.destroy()
    }
    const chartConfig = JSON.parse(decodeURIComponent(props.config))
    chartObj = new Chart(chartCanvas.value, {...chartConfig})
  })
})
</script>

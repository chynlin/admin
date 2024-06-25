<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="item of 9" :key="item" class="h-72 bg-white shadow rounded">
      <div class="chart w-full h-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted } from 'vue';
type EChartsOption = echarts.EChartsOption;

const option: EChartsOption = {
  title: {
    show: true,
    text: '本月銷售額',
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    },
  ],
};
const option2: EChartsOption = {
  title: {
    show: true,
    text: '本月訂單數量',
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
    },
  ],
};
onMounted(() => {
  const domList = document.querySelectorAll('.chart')!;
  domList.forEach((e: HTMLElement, index: number) => {
    const myChart = echarts.init(e);
    if (index % 2 === 0) {
      option && myChart.setOption(option);
    } else {
      option && myChart.setOption(option2);
    }
  });
});
</script>

<style></style>

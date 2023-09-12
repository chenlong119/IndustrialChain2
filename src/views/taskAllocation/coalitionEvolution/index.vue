<script setup>
import {getCurrentInstance, onBeforeUnmount, onMounted, ref, watch} from 'vue'

const {proxy} = getCurrentInstance();
const chart1 = ref(null);
const chart2 = ref(null);
const echarts = proxy.$echarts;
let option1 = {
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  legend: {
    data: ['联盟1', '联盟2', '联盟3'],
  },
  tooltip: {
    formatter: (params) => {
      return taskList[params.data.category] + "<br/>" + "属于联盟" + (params.data.category + 1);
    }
  },
  graphic: [
    {
      type: 'polygon',
      shape: {
        points: [[40, 70], [850, 70], [810, 200], [0, 200]]
      },
      style: {
        fill: '#eee',
        stroke: 'red',
        lineWidth: 3,
        opacity: 0.3, //透明度
        shadowBlur: 10, //边框阴影模糊程度
        shadowColor: 'black', //边框阴影颜色
        shadowOffsetX: 5, //边框阴影水平偏移量
        shadowOffsetY: 5 //边框阴影垂直偏移量
      }
    },
    {
      type: 'polygon',
      shape: {
        points: [[0, 390], [810, 390], [850, 250], [40, 250]]  //左下、右下、右上、左上
      },
      style: {
        fill: '#eee',
        stroke: 'blue',
        lineWidth: 3,
        opacity: 0.3,
        shadowBlur: 10,
        shadowColor: 'black',
        shadowOffsetX: 5,
        shadowOffsetY: 5
      }
    },
    {
      type: 'polygon',
      shape: {
        points: [[0, 600], [810, 600], [850, 450], [40, 450]]  //左下、右下、右上、左上
      },
      style: {
        fill: '#eee',
        stroke: 'green',
        lineWidth: 3,
        opacity: 0.2,
        shadowBlur: 10,
        shadowColor: 'black',
        shadowOffsetX: 5,
        shadowOffsetY: 5
      }
    }
  ],
  series: [
    {
      type: 'graph',
      layout: 'none',
      symbolSize: 43,
      roam: false,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'circle'],
      edgeSymbolSize: [10, 10],
      edgeLabel: {
        fontSize: 20
      },
      data: [
        {
          name: '企业1',
          x: 200,
          y: 200,
          category: 0,
        },
        {
          name: '企业2',
          x: 350,
          y: 200,
          category: 0,
        },
        {
          name: '企业3',
          x: 450,
          y: 100,
          desc: '销售汽车玻璃',
          category: 1
        },
        {
          name: '企业4',
          x: 350,
          y: 300,
          desc: '销售电动汽车',
          category: 0,
        },
        {
          name: '企业5',
          x: 450,
          y: 350,
          category: 2,
        },
        {
          name: '企业6',
          x: 500,
          y: 200,
          category: 0,
        },
        {
          name: '企业7',
          x: 200,
          y: 300,
          category: 1,
        },
        {
          name: '企业8',
          x: 600,
          y: 100,
          category: 2,
        },
        {
          name: '企业9',
          x: 600,
          y: 300,
          category: 1,
        },
        {
          name: '企业10',
          x: 600,
          y: 450,
          category: 2,
        },
        {
          name: '企业11',
          x: 350,
          y: 400,
          category: 0,
        },
        {
          name: '企业12',
          x: 700,
          y: 200,
          category: 1,
        },
        {
          name: '企业13',
          x: 700,
          y: 60,
          category: 2,
        },
        {
          name: '企业14',
          x: 700,
          y: 400,
          category: 0,
        },
        {
          name: '企业15',
          x: 500,
          y: 470,
          category: 1,
        },
        {
          name: '企业16',
          x: 200,
          y: 450,
          category: 2,
        },
        {
          name: '企业17',
          x: 800,
          y: 400,
          category: 0,
        },
        {
          name: '企业18',
          x: 800,
          y: 100,
          category: 1,
        },
        {
          name: '企业19',
          x: 600,
          y: 250,
          category: 2,
        },

      ],
      links: [
        {
          source: '企业2',
          target: '企业1',

          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业3',
          target: '企业4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业1',
          target: '企业3',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业2',
          target: '企业3',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业2',
          target: '企业4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业1',
          target: '企业4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业3',
          target: '企业5',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业6',
          target: '企业4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业5',
          target: '企业10',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业8',
          target: '企业10',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业12',
          target: '企业14',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业11',
          target: '企业15',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业13',
          target: '企业17',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业18',
          target: '企业16',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业16',
          target: '企业19',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '企业7',
          target: '企业16',
          lineStyle: {
            curveness: 0.2
          }
        },
      ],
      categories: [{name: '联盟1'}, {name: '联盟2'}, {name: '联盟3'}],
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }
    }
  ]
};
const data2 = [
  {
    name: '企业1',
    x: 200,
    y: 200,
    category: 0,
  },
  {
    name: '企业2',
    x: 350,
    y: 200,
    category: 1,
  },
  {
    name: '企业3',
    x: 450,
    y: 100,
    desc: '销售汽车玻璃',
    category: 2
  },
  {
    name: '企业4',
    x: 350,
    y: 300,
    desc: '销售电动汽车',
    category: 0,
  },
  {
    name: '企业5',
    x: 450,
    y: 400,
    category: 1,
  },
  {
    name: '企业6',
    x: 500,
    y: 200,
    category: 0,
  },
  {
    name: '企业7',
    x: 200,
    y: 300,
    category: 1,
  },
  {
    name: '企业8',
    x: 600,
    y: 100,
    category: 0,
  },
  {
    name: '企业9',
    x: 600,
    y: 300,
    category: 1,
  },
  {
    name: '企业10',
    x: 600,
    y: 450,
    category: 2,
  },
  {
    name: '企业11',
    x: 350,
    y: 400,
    category: 0,
  },
  {
    name: '企业12',
    x: 700,
    y: 200,
    category: 1,
  },
  {
    name: '企业13',
    x: 700,
    y: 60,
    category: 1,
  },
  {
    name: '企业14',
    x: 700,
    y: 500,
    category: 0,
  },
  {
    name: '企业15',
    x: 500,
    y: 500,
    category: 1,
  },
  {
    name: '企业16',
    x: 200,
    y: 450,
    category: 2,
  },
  {
    name: '企业17',
    x: 800,
    y: 400,
    category: 1,
  },
  {
    name: '企业18',
    x: 800,
    y: 100,
    category: 1,
  },
  {
    name: '企业19',
    x: 900,
    y: 300,
    category: 2,
  }];
const taskList = ["生产电动汽车", "生产电瓶车", "生产自行车"]
const data3 = [
  {
    name: '企业1',
    x: 200,
    y: 200,
    category: 1,
  },
  {
    name: '企业2',
    x: 350,
    y: 200,
    category: 0,
  },
  {
    name: '企业3',
    x: 450,
    y: 100,
    desc: '销售汽车玻璃',
    category: 3
  },
  {
    name: '企业4',
    x: 350,
    y: 300,
    desc: '销售电动汽车',
    category: 0,
  },
  {
    name: '企业5',
    x: 450,
    y: 500,
    category: 1,
  },
  {
    name: '企业6',
    x: 500,
    y: 200,
    category: 3,
  },
  {
    name: '企业7',
    x: 200,
    y: 300,
    category: 0,
  },
  {
    name: '企业8',
    x: 600,
    y: 100,
    category: 2,
  },
  {
    name: '企业9',
    x: 600,
    y: 300,
    category: 1,
  },
  {
    name: '企业10',
    x: 600,
    y: 450,
    category: 1,
  },
  {
    name: '企业11',
    x: 350,
    y: 400,
    category: 0,
  },
  {
    name: '企业12',
    x: 700,
    y: 200,
    category: 2,
  },
  {
    name: '企业13',
    x: 700,
    y: 60,
    category: 2,
  },
  {
    name: '企业14',
    x: 700,
    y: 550,
    category: 1,
  },
  {
    name: '企业15',
    x: 500,
    y: 500,
    category: 3,
  },
  {
    name: '企业16',
    x: 200,
    y: 450,
    category: 2,
  },
  {
    name: '企业17',
    x: 800,
    y: 400,
    category: 0,
  },
  {
    name: '企业18',
    x: 800,
    y: 100,
    category: 1,
  },
  {
    name: '企业19',
    x: 900,
    y: 300,
    category: 2,
  },

];
const data4 = [
  {
    name: '企业1',
    x: 200,
    y: 200,
    category: 3,
  },
  {
    name: '企业2',
    x: 350,
    y: 200,
    category: 1,
  },
  {
    name: '企业3',
    x: 450,
    y: 100,
    desc: '销售汽车玻璃',
    category: 2
  },
  {
    name: '企业4',
    x: 350,
    y: 300,
    desc: '销售电动汽车',
    category: 0,
  },
  {
    name: '企业5',
    x: 450,
    y: 550,
    category: 1,
  },
  {
    name: '企业6',
    x: 500,
    y: 200,
    category: 1,
  },
  {
    name: '企业7',
    x: 200,
    y: 300,
    category: 0,
  },
  {
    name: '企业8',
    x: 600,
    y: 100,
    category: 2,
  },
  {
    name: '企业9',
    x: 600,
    y: 300,
    category: 3,
  },
  {
    name: '企业10',
    x: 600,
    y: 450,
    category: 1,
  },
  {
    name: '企业11',
    x: 350,
    y: 400,
    category: 0,
  },
  {
    name: '企业12',
    x: 700,
    y: 200,
    category: 1,
  },
  {
    name: '企业13',
    x: 700,
    y: 60,
    category: 2,
  },
  {
    name: '企业14',
    x: 700,
    y: 450,
    category: 1,
  },
  {
    name: '企业15',
    x: 500,
    y: 500,
    category: 3,
  },
  {
    name: '企业16',
    x: 200,
    y: 450,
    category: 2,
  },
  {
    name: '企业17',
    x: 800,
    y: 400,
    category: 0,
  },
  {
    name: '企业18',
    x: 800,
    y: 100,
    category: 1,
  },
  {
    name: '企业19',
    x: 900,
    y: 300,
    category: 2,
  },

];
const option2 = {
  series: [{
    data: data2,
  }]
};
const option3 = {
  legend: {
    data: ['联盟1', '联盟2', '联盟3', '联盟4'],
  },
  series: [{
    data: data3,
    categories: [{name: '联盟1'}, {name: '联盟2'}, {name: '联盟3'}, {name: '联盟4'}],
  }]
};
const option4 = {
  legend: {
    data: ['联盟1', '联盟2', '联盟3', '联盟4'],
  },
  series: [{
    data: data4,
    categories: [{name: '联盟1'}, {name: '联盟2'}, {name: '联盟3'}, {name: '联盟4'}],
  }]
};
let interval = null;
let index = 1;
let myChart2 = null;
let myChart1 = null;
const date = ref(null);
watch(date, () => {
  let random = Math.random();
  if (random < 0.33) {
    myChart1.setOption(option2);
    myChart2.setOption(option2);
  } else if (random < 0.66) {
    myChart1.setOption(option3);
    myChart2.setOption(option3);
  } else {
    myChart1.setOption(option4);
    myChart2.setOption(option4);
  }
})

const startTimer = () => {
  console.log("leave")
  interval = setInterval(() => {
    if (index === 1) {
      myChart2.setOption(option1);
      index++;
    } else if (index === 2) {
      myChart2.setOption(option2);
      index++;
    } else if (index === 3) {
      myChart2.setOption(option3);
      index++;
    } else {
      myChart2.setOption(option4);
      index = 1;
    }
  }, 2000)
}
onMounted(() => {
  myChart1 = echarts.init(chart1.value);
  myChart2 = echarts.init(chart2.value);
  myChart1.setOption(option1);
  myChart2.setOption(option1);
  startTimer();
})
const stopTimer = () => {
  console.log("enter")
  clearInterval(interval);
}
onBeforeUnmount(() => {
  clearInterval(interval);
})
</script>

<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card :shadow="'hover'">
          <template #header>
            <span style="margin-right: 10px">初始企业联盟状态</span>
            <el-date-picker
                v-model="date"
                type="date"
                placeholder="请选择日期"
                size="default"
            />
          </template>
          <div ref="chart1" style="width: 100%; height:700px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :shadow="'hover'">
          <template #header>
            <h2>后续3天企业联盟状态变化</h2>
          </template>
          <div ref="chart2" style="width: 100%; height:700px" @mouseenter="stopTimer" @mouseleave="startTimer"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">


</style>
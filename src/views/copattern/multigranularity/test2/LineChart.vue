<template>
    <div>
     
        
          <div class="box-card">
            <div ref="lineChartRef" class="chart"></div>
          </div>
       
      
    </div>
  </template>
  
  
  <script>
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts';
  
  import { ElTable, ElTableColumn, ElTag, ElRow, ElCol } from 'element-plus';
  
  export default {
    components: {
      ElTable,
      ElTableColumn,
      ElTag,
      ElRow,
      ElCol,
    },
    setup() {
      
      const lineChartRef = ref(null);
  
    
  
      onMounted(() => {
        // 创建扇形图
        
  
    
 
  
  // 创建折线图
  const lineChart = echarts.init(lineChartRef.value);
  const lineOption = {
    title: {
      text: '90分以上的企业数目',
      x: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bolder'
      }
    },
    tooltip: { 
      trigger: 'axis',
      formatter: '时间: {b0}<br/>数目: {c0}'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [56, 67, 85, 93, 107],
        type: 'line',
        areaStyle: {},
        smooth: true,
        itemStyle: {
          color: '#a18cd1',
          borderColor: '#754fa0'
        }
      },
    ],
  };
  
  lineChart.setOption(lineOption);
      });
  
      return {
        
        lineChartRef,
       
      };
    },
  };
  
  
  </script>
<style scoped>






.box-card {
   
  margin-top:20px;
  width: 96%;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
  background-color: #ffffff;
}

.chart {
  height: 280px; 
   /* 设置宽度为100%，以确保它填满其容器 */
}
/* 其他样式保持不变 */
</style>
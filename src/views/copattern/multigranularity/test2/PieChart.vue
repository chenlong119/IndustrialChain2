<template>
    <div>
     
          <div class="box-card">
            <div ref="pieChartRef" class="chart"></div>
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
      const pieChartRef = ref(null);
     
  
      const productData = ref([
        { id: 1, name: '产品1', status: '合格' },
        { id: 2, name: '产品2', status: '不合格' },
        { id: 3, name: '产品3', status: '待定' },
        { id: 4, name: '产品4', status: '合格' },
        { id: 5, name: '产品5', status: '不合格' },
        { id: 6, name: '产品6', status: '合格' },
        { id: 7, name: '产品7', status: '待定' },
        { id: 8, name: '产品8', status: '合格' },
        { id: 9, name: '产品9', status: '不合格' },
        { id: 10, name: '产品10', status: '待定' }
      ]);
  
      onMounted(() => {
        // 创建扇形图
        const pieChart = echarts.init(pieChartRef.value);
  const pieOption = {
    title: {
      text: '当前不同分数段的比例',
      x: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bolder'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { name: '<60', value: 46 },
          { name: '60-70', value: 67 },
          { name: '70-80', value: 72 },
          { name: '80-90', value: 90 },
          { name: '90-100', value: 107 },
        ],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        }
      },
    ],
  };
  pieChart.setOption(pieOption);
  
  // 创建折线图

      });
  
      return {
        pieChartRef,
        
        productData,
      };
    },
  };
  
  
  </script>
<style scoped>



.box-card {
  margin-top:20px;
  
  width: 100%;
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
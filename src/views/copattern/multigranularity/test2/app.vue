<template>
    <div id="app">
      <div class="side-panel">
        <rank-list-1 
        :data="rankData1">
      </rank-list-1>
      </div>
  
      <div class="main-panel">
    <!-- Table Component -->
    <table-component :data="tableData"></table-component>

    <!-- Chart Components -->
    <el-row :gutter="3" class="row-container">
      <el-col :span="12">
        <line-chart :data="lineChartData" class="chart-item"></line-chart>
      </el-col>
      <el-col :span="12">
        <pie-chart :data="pieChartData" class="chart-item"></pie-chart>
      </el-col>
    </el-row>
  </div>
  
      <div class="side-panel">
        <rank-list-2 :data="rankData2"></rank-list-2>
      </div>
    </div>
  </template>
  
  <script>
  import RankList1 from './RankList1.vue';
  import RankList2 from './RankList2.vue';
  import TableComponent from './TableComponent.vue';
  import LineChart from './LineChart.vue';
  import PieChart from './PieChart.vue';
  
  export default {
    components: {
      RankList1,
      RankList2,
      TableComponent,
      LineChart,
      PieChart,
    },
    data() {
      return {
        rankData1: [],  // Data for rank list 1
        rankData2: [],  // Data for rank list 2
        tableData: [],  // Data for the table
        lineChartData: [],  // Data for the line chart
        pieChartData: [],  // Data for the pie chart
      };
    },
    mounted() {
      // TODO: Fetch or set the data for the components here
    }
  };
  </script>
  
  <style>
  #app {
    display: flex;
    padding: 20px;
  }

  .side-panel {
    width: 20%; 
    margin-left: 10px;
    margin-right: 10px;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 12px;
  }
  
  .main-panel {
    width: 58%;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 12px;
  }
  .row-container {
  display: flex; /* Set the container to flex layout */
}

.chart-item {
  width: 100%; /* Allow each chart to take the full width of its container */
}
.chart-item:last-child {
  margin-right: 0;
}

  </style>
  
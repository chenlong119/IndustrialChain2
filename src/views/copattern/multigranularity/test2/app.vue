<template>
    <div id="app">
      <div class="side-panel">
        <rank-list-1 :data="rankData1"></rank-list-1>
      </div>
  
      <div class="main-panel">
        <!-- Table Component -->
        <table-component :data="tableData"></table-component>
  
        <!-- Line Chart Components -->
        <div class="chart-container">
          <line-chart-1 :data="lineChartData1"></line-chart-1>
          <line-chart-2 :data="lineChartData2"></line-chart-2>
        </div>
      </div>
  
      <div class="side-panel">
        <rank-list-2 :data="rankData2"></rank-list-2>
      </div>
    </div>
  </template>
  
  <script>
  import RankList1 from './components/RankList1.vue';
  import RankList2 from './components/RankList2.vue';
  import TableComponent from './components/TableComponent.vue';
  import LineChart1 from './components/LineChart1.vue';
  import LineChart2 from './components/LineChart2.vue';
  
  export default {
    components: {
      RankList1,
      RankList2,
      TableComponent,
      LineChart1,
      LineChart2,
    },
    data() {
      return {
        rankData1: [],  // Data for rank list 1
        rankData2: [],  // Data for rank list 2
        tableData: [],  // Data for table
        lineChartData1: [],  // Data for line chart 1
        lineChartData2: [],  // Data for line chart 2
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
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .side-panel {
    width: 20%;
    margin-right: 10px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 12px;
  }
  
  .main-panel {
    width: 58%;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 12px;
  }
  
  .chart-container {
    display: flex;
    gap: 20px;
    margin-top: 20px;
  }
  </style>
  
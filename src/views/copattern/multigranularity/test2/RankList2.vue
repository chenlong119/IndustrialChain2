<template>
    <el-col>
      <div class="box-card">
        <h3 class="productStatusTitle">企业评分排行</h3>
        <el-table :data="rankData" class="el-table" stripe>
          
          <!-- Ranking Column -->
          <el-table-column type="index" label="排名"   align="center"></el-table-column>
          
          <!-- Enterprise Group Name Column -->
          <el-table-column prop="name" label="企业群名称"  width="120" align="right"></el-table-column>
  
          <!-- Score Column -->
          <el-table-column prop="score" label="分数"  align="center"></el-table-column>
          
        </el-table>
      </div>
    </el-col>
  </template>
  
  <script>
  export default {
    data() {
      return {
        rankData: [
          { name: '小鸭家电', score: 98.5},
          { name: '比亚迪汽车', score: 97.0},
          { name: '金德利集团', score: 96.8 },
          { name: '金钟科技', score: 96.7 },
          { name: '济南粮食集团', score: 95.8},
          { name: '金德利集团', score: 95.4 },
          { name: '国投聚力', score: 95.2 },
          { name: '中国化工', score: 94.8 },
          { name: '澳利集团', score: 94.5 },
          { name: '齐鲁化纤', score: 94.2 },
        ],
   
      };
    },
  };
  </script>
  <style scoped>
  :deep(.el-table .el-table__body tr){
      height: 80px;
      min-height: 80px;
  }
  .box-card {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
  background-color: #ffffff;
}

  
  .productStatusTitle {
      margin-top: 20px;
      font-weight: bold;
      text-align: center;
  }
  
  .el-table {
      border-radius: 12px;
      margin-top: 20px;
      
  }
  </style>
  

  
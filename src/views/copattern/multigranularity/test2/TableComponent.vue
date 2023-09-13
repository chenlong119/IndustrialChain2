<template>
  <div>
    <h2 class="table-title">企业数据表</h2>
    
    <div>
      <el-select  class="el-select" v-model="filterType" placeholder="筛选企业种类" >
      <el-option
        v-for="option in uniqueTypes"
        :key="option"
        :label="option"
        :value="option">
      </el-option>
    </el-select> 
        <el-input v-model="searchTerm" style="width: 300px;margin-bottom: 5px;" placeholder="请输入搜索关键词"></el-input>
    <el-button class="btn1" type="primary" @click="searchTasks" style="margin-bottom: 5px;"><el-icon><Search /></el-icon>搜索</el-button>

     
    </div>

    <el-table :data="filteredData" style="width: 100% " height="498px" padding="10px">
      <el-table-column prop="id" label="企业编号" width="100" align="center"></el-table-column>
      <el-table-column prop="name" label="企业名称" width="200" align="center"></el-table-column>
      <el-table-column prop="type" label="企业种类" width="180" align="center"></el-table-column>
      <el-table-column prop="cooperation_count" label="企业合作次数" width="180" align="center"></el-table-column>
      <el-table-column prop="score" label="企业评分" width="200" align="center"></el-table-column>
      <el-table-column 
        label="查看详情" 
        width="180" align="center"
        >
        <template #default="{ row }">
          <el-button @click="viewDetails(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ElTable, ElTableColumn, ElButton, ElInput, ElSelect, ElOption } from 'element-plus';

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElInput,
    ElSelect,
    ElOption,
  },
  data() {
    return {
      data: [
        { id: '001', name: '比亚迪汽车', type: '汽车', cooperation_count: 5, score: 90 },
        { id: '002', name: '小鸭家电', type: '技术', cooperation_count: 3, score: 85 },
        { id: '003', name: '济南粮食集团', type: '食物', cooperation_count: 8, score: 88 },
        { id: '004', name: '金德利集团', type: '餐饮', cooperation_count: 6, score: 92 },
        { id: '005', name: '金钟科技', type: '科技', cooperation_count: 4, score: 83 },
        { id: '006', name: '齐鲁化纤', type: '化纤', cooperation_count: 7, score: 89 },
        { id: '007', name: '元首集团', type: '服装', cooperation_count: 2, score: 96 },
        { id: '008', name: '澳利集团', type: '农业', cooperation_count: 1, score: 87 },
        { id: '009', name: '中国化工', type: '化工', cooperation_count: 9, score: 91 },
        
      ],
      searchTerm: '',
      filterType: '',
    };
  },
  computed: {
    uniqueTypes() {
      const types = new Set(this.data.map(item => item.type));
      return [...types];
    },
    filteredData() {
      return this.data.filter(item => 
        item.name.includes(this.searchTerm) && 
        (this.filterType ? item.type === this.filterType : true)
      );
    }
  },
  methods: {
    viewDetails(row) {
      console.log('Details for row:', row);
      // 在这里你可以添加跳转到详情页或弹出一个包含详情的模态框的逻辑
    }
  }
};
</script>

<style scoped>

:deep(.el-table .el-table__body tr) {
    height: 45px !important;
}

:deep(.el-table .el-table__body tr td) {
    line-height: 3px !important;
}
.page-title {
  text-align: center;
  font-weight: bold;
  font-size: 1.8em;
  margin-bottom: 20px;
}

.divider {
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.table-title {
  text-align: center;
  font-weight: bold;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.el-select {
  
  width: 100%;
  max-width: 200px;
  margin-bottom: 5px;
  margin-left: 220px;
  
}
.el-input {
  
  width: 100%;
  max-width: 200px;
  margin-bottom: 5px;
  margin-left: 100px;
  
}


.el-table {
  border-radius: 12px;
  margin-top: 2px;
  padding: 0;
  width: 100%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
}
.el-table-column {
  text-align: center;
  height: 20px;
  
}

.el-button {
  padding: 6px 16px;
  font-size: 12px;
}

.mt-4 {
  margin-top: 2px;
}
</style>

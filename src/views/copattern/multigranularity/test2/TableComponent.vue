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
      <el-table-column 
      prop="id" 
      label="企业编号"  
      width=100 
      align="center">
    </el-table-column>

      <el-table-column 
      prop="name" 
      label="企业名称"  
      align="center">
    </el-table-column>

      <el-table-column 
      prop="type" 
      label="企业种类"  
      align="center">
    </el-table-column>

      <el-table-column 
      prop="cooperation_count" 
      label="企业合作次数"  
      align="center">
    </el-table-column>

      <el-table-column 
      prop="score" 
      label="企业评分"  
      align="center">
    </el-table-column>

      <!-- <el-table-column 
      label="查看详情" 
      width="180" align="center">
      <template #default="{ row }">
        <el-button @click="viewDetails(row)">详情</el-button>
      </template>
  </el-table-column> -->
  <el-table-column 
      label="查看详情" 
      width="180" align="center">
      <template #default="{ row }">
        <el-button 
        @click="viewDetails(row)">详情</el-button>
        <el-dialog 
        v-model="dialogVisible"
        title="企业详情"
        
        :modal="false">
  
    <div v-if="dialogContent">
      <p>1. 企业名称: {{ dialogContent.name }}</p>
      <p>2. 近期评分: {{ dialogContent.recentScores }}</p>
      <p>3. 评分较高: {{ dialogContent.highScores }}</p>
      <p>4. 评分较低: {{ dialogContent.lowScores }}</p>
    </div>
  
  <span slot="footer" class="dialog-footer">
    <el-button @click="closeDialog">关闭</el-button>
  </span>
</el-dialog>
      </template>
  </el-table-column>
    </el-table>
    
  </div>
</template>

<script >
import {  ElDialog,ElTable, ElTableColumn, ElButton, ElInput, ElSelect, ElOption } from 'element-plus';
import { ref } from 'vue'

const dialogVisible = ref(false)
export default {
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElInput,
    ElDialog,
    ElSelect,
    ElOption,
    
  },
  data() {
    return {
     
      dialogContent: null,
     
      data: [
        
        { 
          id: '001', 
          name: '比亚迪汽车', 
          type: '汽车', 
          cooperation_count: 5, 
          score: 92 ,
          recentScores: [92,90,96,95,97],
          highScores: '质量评分，售后服务',
          lowScores: '交易便捷性'
        },
        { 
          id: '002', 
          name: '小鸭家电', 
          type: '技术', 
          cooperation_count: 3, 
          score: 85 ,
          recentScores: [92,90,96,95,97],
          highScores: '质量评分，售后服务',
          lowScores: '交易便捷性',
        },
        { 
          id: '003', 
          name: '济南粮食集团', 
          type: '食物', 
          cooperation_count: 8, 
          score: 88 ,
          recentScores: [92,90,96,95,97],
          highScores: '质量评分，售后服务',
          lowScores: '交易便捷性',
        },

        { 
          id: '004', 
          name: '金德利集团', 
          type: '餐饮', 
          cooperation_count: 6, 
          score: 92 ,
          recentScores: [92,90,96,95,97],
          highScores: '质量评分，售后服务',
          lowScores: '交易便捷性',
        },
        { 
          id: '005', 
          name: '金钟科技', 
          type: '科技', 
          cooperation_count: 4, 
          score: 83,
          recentScores: [92,90,96,95,97],
          highScores: '质量评分，售后服务',
          lowScores: '交易便捷性',
         },
        { 
          id: '006', 
          name: '齐鲁化纤', 
          type: '化纤', 
          cooperation_count: 7, 
          score: 89 ,
          recentScores: [92,90,96,95,97],
          highScores: '质量评分，售后服务',
          lowScores: '交易便捷性',
        },
        { 
          id: '007', 
          name: '元首集团', 
          type: '服装', 
          cooperation_count: 2, 
          score: 96 ,
          recentScores: [92,90,96,95,97],
          highScores: '质量评分，售后服务',
          lowScores: '交易便捷性',
        },
        { 
          id: '008', 
          name: '澳利集团', 
          type: '农业', 
          cooperation_count: 1, 
          score: 87 ,
          recentScores: [92,90,96,95,97],
          highScores: '质量评分，售后服务',
          lowScores: '交易便捷性',
        },
        { 
          id: '009', 
          name: '中国化工', 
          type: '化工', 
          cooperation_count: 9, 
          score: 91 ,
          recentScores: [92,90,96,95,97],
          highScores: '质量评分，售后服务',
          lowScores: '交易便捷性',
        },
       
      ],
      searchTerm: '',
      filterType: '',
      dialogVisible: false,
      currentRow: null,
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
    },
  },
  methods: {
    viewDetails(row) {
      this.dialogContent = {
        name: row.name,
        recentScores: row.recentScores.join(', '),
        highScores: row.highScores,
        lowScores: row.lowScores,
      };
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
  }
};
</script>

<style scoped>
 .el-overlay {
    background-color: rgba(255, 255, 255, 0.8)!important; /* 或任何其他颜色 */
  }
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
  z-index: 1;
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
.dialog-footer button:first-child {
  margin-right: 10px;
}
.el-button {
  padding: 6px 16px;
  font-size: 12px;
}

.mt-4 {
  margin-top: 2px;
}
/* 为弹窗添加自定义样式 */
:deep(.el-dialog__wrapper) {
  background-color: rgba(0, 0, 0, 0.5); /* 调整为你想要的颜色和透明度 */
}


/* 通用样式调整 */
:deep(.el-dialog) {
  background-color: #f9f9f9; /* 使用更柔和的背景颜色 */
  border-radius: 15px; 
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* 添加柔和的阴影效果 */
  padding: 20px; /* 添加内部填充以创建更多空间 */
}

:deep(.el-dialog__title) {
  font-weight: 600; /* 使标题更加粗体 */
  font-size: 20px; /* 增加标题字体大小 */
  color: #333; /* 为标题设置深色字体 */
  margin-bottom: 20px; /* 增加标题和内容之间的间距 */
}

:deep(.el-dialog__body) {
  padding:  5px 10px; /* 添加内部填充以创建更多空间 */
  font-size: 16px; /* 增加主体字体大小 */
  line-height: 1.7; /* 设置更大的行高来改善可读性 */
  color: #555; /* 为文本设置深色字体 */
}

:deep(.el-dialog__body p) {
 
  margin: 10px 0; 
  padding: 0 0 0 30%; /* 调整这个值来改变文字的起始位置 */
  text-align: left; 
  border-left: 3px solid #007BFF; 

  &::before {
    content: '';
   
  margin-left: 40px;
    top: 0;
    bottom: 0;
    width: 3px; /* 将它更改为你想要的宽度 */
   
  }
}



/* 按钮样式调整 */
:deep(.dialog-footer) {
  border-top: 1px solid #e9e9e9; /* 添加一个顶部边界来分隔底部按钮区域 */
  padding-top: 15px; /* 在按钮区域上方添加一些填充 */
}

:deep(.dialog-footer .el-button) {
  font-size: 16px; /* 增加字体大小来强调按钮 */
  background-color: #007BFF; /* 设置一个明亮的背景色来吸引注意力 */
  border-color: #007BFF; /* 使边界颜色与背景颜色匹配 */
  color: #fff; /* 为按钮文字设置一个亮白色 */
}

:deep(.dialog-footer .el-button:hover) {
  background-color: #0056b3; /* 添加一个深色的悬停效果 */
  border-color: #0056b3; /* 使悬停边框颜色匹配背景色 */
}


</style>






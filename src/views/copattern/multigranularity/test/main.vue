<template>
  
<div>

  <div class="container">
      <h1 class="page-title">企业协同效果评估系统</h1>
      <hr class="divider">
      <el-form 
      :model="feedbackForm" 
      label-width="100px" 
      class="demo-form">
          <div class="select-container">
              <label for="search">选择待评估任务：</label>
              <el-select 
              v-model="selectedTask" 
              placeholder="请选择一个任务进行评价">
                  <el-option 
                  v-for="task in tasks" 
                  :key="task.value" 
                  :label="task.label" 
                  :value="task.value">
                </el-option>
              </el-select>
              <el-select 
              v-model="selectedTask" 
              placeholder="请选择要评价的公司">
                  <el-option 
                  v-for="task in tasks" 
                  :key="task.value" 
                  :label="task.name" 
                  :value="task.value" 
                  :name="task.name">
                </el-option>
              </el-select>
          </div>

          <!-- 上半部分 -->
          <el-row 
          :gutter="20" 
          class="row-container">
              <!-- 第一部分 -->
              <el-col 
              :span="12" 
              class="chart-container">
                  <div class="box-card">
                      <DeliveryFeedback 
                      :feedbackForm="feedbackForm" />
                  </div>
              </el-col>

              <!-- 第二部分 -->
              <el-col 
              :span="12" 
              class="chart-container">
                  <div class="box-card">
                      <ProductQualityFeedback :feedbackForm="feedbackForm" />
                  </div>
              </el-col>
          </el-row>

          <!-- 下半部分 -->
          <el-row 
          :gutter="20" 
          class="row-container">
              <!-- 第三部分 -->
              <el-col 
              :span="12" 
              class="chart-container">
                  <div class="box-card">
                      <ServiceFeedback :feedbackForm="feedbackForm" />
                  </div>
              </el-col>

              <!-- 第四部分 -->
              <el-col 
              :span="12" 
              class="chart-container">
                  <div class="box-card">
                      <TransactionFeedback :feedbackForm="feedbackForm" />
                  </div>
              </el-col>
          </el-row>

          <!-- 提交按钮 -->
          <div class="submit-button">
            <el-button 
            type="primary" 
            @click.prevent="submitForm">
            提交
          </el-button>
</div>
      </el-form>
  </div>

  <footer style="margin-left: 20px;">
      <p>© 2023 东南大学 仅供测试</p>
  </footer>
  </div>
</template>

<script>
import DeliveryFeedback from './DeliveryFeedback.vue';
import ProductQualityFeedback from './ProductQualityFeedback.vue';
import ServiceFeedback from './ServiceFeedback.vue';
import TransactionFeedback from './TransactionFeedback.vue';
import { ElMessageBox } from 'element-plus';

export default {
  data() {
      return {
        
          dialogVisible: false,
          qualityStrength: '92.5',
          goodPoints: '',
          badPoints: '',
          feedbackForm: {
              deliveryFeedback: '',
              productQualityFeedback: '',
              serviceFeedback: '',
              transactionFeedback: '',
          },
          selectedTask: '',
          tasks: [
              { value: 'task1',
               label: '任务 1', 
               name: "比亚迪"},
              { value: 'task2',
               label: '任务 2', 
               name: "小鸭家电"},
              { value: 'task3', 
              label: '任务 3', 
              name: "固特异轮胎"},
              { value: 'task4', 
              label: '任务 4',
               name: "永恒电机"},
              { value: 'task5',
               label: '任务 5', 
               name:"齐鲁化纤"},
              { value: 'task6', 
              label: '任务 6' ,
              name:"金钟科技"},
          ],
      };
  },
  components: {
      DeliveryFeedback,
      ProductQualityFeedback,
      ServiceFeedback,
      TransactionFeedback,
  },
  methods: {
    submitForm() {
    console.log('表单已提交:', this.feedbackForm);

    // 你应该基于“feedbackForm”的数据来确定这些值
    this.qualityStrength = '92.5';
    this.goodPoints = '1.价格 2.质量 3.文档完整性';
    this.badPoints = '1.产品外观 2.产品包装 3.售后服务';
    
    ElMessageBox.alert(` <div style="padding-left: 35px;">
        <strong>提交成功！</strong><br/>
        
        <strong>质量评分：</strong>${this.qualityStrength}<br/>
        <strong>得分较高：</strong>${this.goodPoints}<br/>
        <strong>得分较低：</strong>${this.badPoints}<br/></div>
    `, '企业协同效果评估系统', {
        confirmButtonText: 'OK', 
                                    
        dangerouslyUseHTMLString: true, // 允许HTML字符串
        callback: (action) => {
            console.log(`action: ${action}`);
        },
    });
},

},
};
</script>



  <style>
  


.container {
  font-family: 'Arial, sans-serif';
  margin: 0 auto; /* Remove the margin and add auto to center it horizontally */
  max-width: 80%;
  color: #333;

  flex-direction: column;
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */


  box-sizing: border-box; /* To include padding and border in element's total width and height */
}

.row-container {
    display: flex;
  margin-bottom:20px;
}

.chart-container {
    
  font-size: 120%;
  display: flex;
  flex-direction: column;
  gap: 20;
}

.box-card {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  background-color: #fff;
  transition: transform 0.3s;
  min-height: 300px;
}

.box-card:hover {
  transform: translateY(-10px);
}

h3 {
  font-size: 1.2em;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #dddcdc;
  padding-bottom: 10px;
}
.select-container {
  
    text-align: center;
  margin: 20px;
}
.search-container label {
  margin-right: 20px;
}

.el-button {
  font-size: 1.2em; /* 增加字体大小 */
  padding: 15px 30px; /* 增加内部填充来增大按钮 */
}

.submit-button {
  text-align: center;
  margin-top: 20px;
  
  
}
 
.page-title {
  text-align: center;
  font-weight: bold;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.divider {
  border: 1px solid #817e7e;
  margin-bottom: 10px;
}
.section-title{
display: flex;
margin-top: 10px;
}
  </style>

<template>
    <div class="feedback-section">
      <h3 class="section-title">交货情况</h3>
      
      <div class="feedback-content">
        <!-- 应交货数量 -->
        <el-form-item label="应交数量">
          <span style="margin-left: 5px;">{{ deliveryData.scheduledQuantity }}</span><div style="margin-left: 15px;">件</div>
        </el-form-item>
    
        <!-- 实收数量 -->
        <el-form-item label="实收数量">
          <el-input v-model="feedbackForm.receivedQuantity" placeholder="请输入实收数量" style="width: 150px;margin-left: 5px;"></el-input><div style="margin-left: 10px;">件</div>
        </el-form-item>
    
        <!-- 约定时间 -->
        <el-form-item label="约定时间">
          <span style="margin-left: 10px;">{{ deliveryData.scheduledTime }}</span>
        </el-form-item>
    
        <!-- 实际收货时间 -->
        <el-form-item label="到货时间">
          <el-date-picker
            v-model="feedbackForm.actualDeliveryTime"
            type="datetime"
            placeholder="选择实际收货时间"
            style="width: 170px"
          ></el-date-picker>
        </el-form-item>
      </div>
<!-- 价格评价 -->


  <!-- 将评价文本移出循环，并根据hoveredPriceEvaluationIndex变量显示文本 -->
 


  
    </div>
  </template>
  
  
  <script>
  export default {
    props: {
      feedbackForm: {
        type: Object,
        default: () => ({
          receivedQuantity: null,
          actualDeliveryTime: null,
          priceEvaluation: 0,
        }),
      },
      deliveryData: {
        type: Object,
        default: () => ({
          scheduledQuantity: "2560",  // 你可以根据实际情况来填写默认值
          scheduledTime: "2023-09-01 10:00:00", // 你可以根据实际情况来填写默认值
        }),
      }},
      data() {
  return {
    hoveredPriceEvaluationIndex: -1,
    selectedRatingText: null,  // 新增用于存储选中的评价文本
  };
},

methods: {
  hoverOverPriceEvaluation(index) {
    this.hoveredPriceEvaluationIndex = index;
  },
  hoverOutPriceEvaluation() {
    this.hoveredPriceEvaluationIndex = -1;
  },
  setPriceEvaluationRating(rating) {
    this.feedbackForm.priceEvaluation = rating;
    if (this.selectedRatingText !== null && this.feedbackForm.priceEvaluation === rating) { 
      // 如果用户点击的是当前选定的评价，则取消选定
      this.selectedRatingText = null;  
    } else {
      this.selectedRatingText = ["不满意", "基本满意", "非常满意"][rating - 1];  // 设置选定的评价文本
    }
  },
},
  };
  </script>
  
  <style>
.feedback-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feedback-content {

  margin-top: 0px;
 max-width: max-content;
}
.rating-container {
  font-family: 'Arial', sans-serif; /* 使用Arial字体 */
  font-size: 14px; /* 字体大小为14px */
}
.section-title {
  text-align: center; /* 确保标题居中 */
}
.box-card:hover + .divider {
  border-color: #409eff; /* 修改分隔线的颜色为蓝色 */
}
/* 添加一个新的CSS类来设置悬停文本的样式 */
.hover-text {
  position: absolute;
  top: -20px; /* 根据需要调整位置 */
  left: 0;
  width: 100%;
  text-align: center;
}
/* 添加一个新的CSS类来设置评价文本的样式 */
.rating-text {
  margin-left: 10px; /* 根据需要调整位置 */
  font-size: 14px; /* 设置字体大小 */
  color: #333; /* 设置字体颜色 */
  font-weight: 500; /* 设置字体权重 */
  transition: color 0.3s ease; /* 添加颜色过渡效果 */
}

.rating-container:hover .rating-text {
  color: #ff6600; /* 设置悬停时的字体颜色 */
}


  </style>
  
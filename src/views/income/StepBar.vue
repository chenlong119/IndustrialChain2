<template>
  <div>
<!--    <el-card class="step-card">-->
<!--      <el-steps :active="active" align-center>-->
<!--        <el-step title="选择企业" :icon="OfficeBuilding" description="Step 1" finish-status="success"/>-->
<!--        <el-step title="修改连接关系" :icon="Switch" description="Step 2"/>-->
<!--        <el-step title="确定参数" :icon="Edit" description="Step 3"/>-->
<!--        <el-step title="收益评估" :icon="TrendCharts" description="Step 4"/>-->
<!--      </el-steps>-->
<!--    </el-card>-->

    <el-card class="content-card">
      <div v-show="active === 0">
        <Step1 @onGraph="handleGraph" @onRelatedNodesWith="handleRelatedNodesWith"></Step1>
      </div>
      <div v-show="active === 1">
        <Step2 @onRelationModify="handleRelatedNodesWithout" :relatedNodesWithGlobal="relatedNodesWithGlobal"></Step2>
      </div>
      <div v-show="active === 2">
        <Step3 @onFormInput="onFormInput" :graphGlobal="graphGlobal"
               :relatedNodesWithoutGlobal="relatedNodesWithoutGlobal"></Step3>
      </div>
      <div v-show="active === 3">
        <Step4 :step3Param="step3Param"></Step4>
      </div>
    </el-card>
    <div class="button-container">
      <el-button :icon="ArrowLeft" type="primary" plain style="margin-top: 12px" @click="back"
                 v-show="active !== 0">上一步
      </el-button>
      <div class="right-button-container">
        <el-button type="primary" plain style="margin-top: 12px" @click="next" v-show="active !== 3">下一步
          <el-icon>
            <ArrowRight/>
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>


<script setup>
import {OfficeBuilding, Switch, Edit, TrendCharts, ArrowLeft, ArrowRight} from '@element-plus/icons-vue'
import {ref, reactive, computed, nextTick} from 'vue'
import Step1 from './components/Step1.vue'
import Step2 from './components/Step2.vue'
import Step3 from './components/Step3.vue'
import Step4 from './components/Step4.vue'


//关联节点和连接信息（含节点自身）——Step1获得
const relatedNodesWithGlobal = reactive({})
//关系图中的节点信息——Step1获得
const graphGlobal = reactive({})
//关联节点和连接信息（不含节点自身）——Step2获得
const relatedNodesWithoutGlobal = reactive({})
//用户输入的参数信息——Step3获得
const formGlobal = reactive({})


//获取Step1的关联节点、关系图信息
const handleRelatedNodesWith = (value) => {
  // console.log(value)
  nextTick(() => {
    Object.assign(relatedNodesWithGlobal, value);
  });
  // 将响应式对象转换为普通的对象数组
  // console.log("转换前的对象数组：", relatedNodesWithGlobal);
  // const objArray = toRaw(nodeGlobal);
  // console.log("转换后的对象数组：", objArray);
};
const handleGraph = (value) => {
  // console.log(value)
  nextTick(() => {
    Object.assign(graphGlobal, value);
  });
};

//获取Step2的参数信息
const handleRelatedNodesWithout = (value) => {
  nextTick(() => {
    Object.assign(relatedNodesWithoutGlobal, value);
  });
  // console.log("step2提交的参数：", relatedNodesWithoutGlobal);
  // // 将响应式对象转换为普通的对象数组
  // console.log("step3提交的参数：", formGlobal);
  // const objArray = toRaw(step2Param);
  // console.log("转换后的对象数组：", objArray);
};

//获取Step3的参数信息
const onFormInput = (value) => {
  Object.assign(formGlobal, value);
};


//计算用户是否选择了节点(Step1)
const isEmptyNode = computed(() => {
  return Object.keys(relatedNodesWithGlobal).length === 0;
});
//计算用户是否修改了连接关系（Step2）
const isModifyRelation = computed(() => {
  return (
      Object.keys(relatedNodesWithoutGlobal).length === 0 ||
      Object.values(relatedNodesWithoutGlobal).every(item => !item)
  );
});
//计算用户是否输入了参数（Step3）
const isEmptyForm = computed(() => {
  const values = Object.values(formGlobal);
  return values.every(value => {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '';
    }
  });
});

//步骤条
const active = ref(0)
const back = () => {
  if (active.value-- < 0) active.value = 3
}
const next = () => {
  if (active.value === 0) {
    if (!isEmptyNode.value) {
      active.value = 1;
    } else {
      alert('请先选择需要进行收益评估的企业');
    }
  } else if (active.value === 1) {
    if (!isModifyRelation.value) {
      active.value = 2;
    } else {
      alert('请先提交关联关系');
    }
  } else if (active.value === 2) {
    if (!isEmptyForm.value) {
      active.value = 3;
    } else {
      alert('请先提交收益评估的参数');
    }
  }
}
</script>


<style>
.step-card {
  margin-left: 12px;
  margin-right: 12px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.1);
}

.content-card {
  margin-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
  height: 650px;
  background-color: rgba(255, 255, 255, 0.1);
}

.button-container {
  margin-left: 12px;
  margin-right: 12px;
  display: flex;
  justify-content: space-between;
}

.right-button-container {
  margin-left: auto;
}
</style>

  
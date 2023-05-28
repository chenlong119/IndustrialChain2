<template>
  <el-form ref="inputFormRef" :model="inputForm" :rules="rules" label-width="200px" class="demo-ruleForm" size="default"
    status-icon>
    <el-form-item label="评估企业id：" prop="nodeId">
      <span style="font-weight: bold;">{{ nodeId }}</span>
    </el-form-item>
    <el-form-item label="评估企业：" prop="nodeName">
      <span style="font-weight: bold;">{{ nodeName }}</span>
    </el-form-item>

    <el-row :gutter="10">
      <el-col :span="6">
        <el-form-item label="所处领域：" prop="nodeFiled">
          <span style="font-weight: bold;">{{ nodeFiled }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所处产业链：" prop="nodeCategory">
          <span style="font-weight: bold;">{{ nodeCategory }}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="关联企业总数：" prop="totalNum">
      <span style="font-weight: bold;">{{ totalNum }}</span>
    </el-form-item>

    <el-form-item label="供应关系企业数量：" prop="supplyNum">
      <span style="font-weight: bold;">{{ supplyNum }}</span>
    </el-form-item>

    <el-form-item label="合作关系企业数量：" prop="cooperationNum">
      <span style="font-weight: bold;">{{ cooperationNum }}</span>
    </el-form-item>

    <el-form-item label="竞争关系企业数量：" prop="competitiveNum">
      <span style="font-weight: bold;">{{ competitiveNum }}</span>
    </el-form-item>

    <el-form-item label="评估时间：" prop="time">
      <el-select v-model="inputForm.time" placeholder="请选择评估时间">
        <el-option label="1个月" value="1" />
        <el-option label="3个月" value="3" />
        <el-option label="6个月" value="6" />
        <el-option label="12个月" value="12" />
      </el-select>
    </el-form-item>

    <el-form-item label="风险选择：" prop="preference">
      <el-radio-group v-model="inputForm.preference">
        <el-radio label="偏好" />
        <el-radio label="中立" />
        <el-radio label="规避" />
      </el-radio-group>
    </el-form-item>

    <el-form-item label="合作策略：" prop="strategy">
      <el-checkbox-group v-model="inputForm.strategy">
        <el-checkbox label="合作优先" name="1" />
        <el-checkbox label="竞争优先" name="2" />
        <el-checkbox label="公平优先" name="3" />
        <el-checkbox label="群体优先" name="4" />
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="备注：" prop="remark">
      <el-input v-model="inputForm.remark" maxlength="10" placeholder="请输入备注" show-word-limit type="text"
        :style="{ width: '600px' }" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(inputFormRef)">
        提交
      </el-button>
      <el-button @click="resetForm()">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { watch, nextTick, computed } from 'vue'
import isEqual from 'lodash/isEqual';

const emits = defineEmits(['onFormInput']);  //定义组件的自定义事件

//接收数据
const props = defineProps({
  graphGlobal: Object,
  relatedNodesWithoutGlobal: Array,
});
const nodeId = ref('')
const nodeName = ref('')
const nodeFiled = ref('')
const nodeCategory = ref('')
const nodeNetwork = ref('')
const nodes = ref<Node[]>([]);
interface Node {
  id: string,
  name: string,
  index: number,
  filed: string,
  category: string,
  network: string[],
  relation: string[],
  x: number,
  y: number,
  deleted: boolean
}

// 监听父组件中step1的参数值，当值发生变化时，更新本组件的数据
watch(
  () => props.graphGlobal,
  (newVal) => {
    nextTick(() => {
      if (newVal && newVal.nodes && newVal.links) {
        nodeId.value = newVal.id;
        nodeName.value = newVal.name;
        nodeFiled.value = newVal.filed;
        nodeCategory.value = newVal.category;
        nodeNetwork.value = newVal.network;
      }
    });
  },
  { deep: true, immediate: true, flush: 'sync' }
);

// 实时更新关联企业数据（每次更新只计算1遍）
let isComputed = false
watch(
  () => props.relatedNodesWithoutGlobal,
  (newVal) => {
    nextTick(() => {
      if (newVal) {
        Object.assign(nodes, newVal);
        if (!isComputed) {
          isComputed = true
          Calculate(nodes)
        }
      }
    });
  },
  {
    deep: true,
    flush: 'sync'
  }
);

const totalNum = ref(0)
const supplyNum = ref(0)
const cooperationNum = ref(0)
const competitiveNum = ref(0)
function Calculate(nodes) {
  const nodesArray = nodes.value  //将ref对象转换为数组
  for (const node of nodesArray) {
    if (!node.deleted) {
      totalNum.value++
    }
    if (!node.deleted && node.relation.includes('供应关系')) {
      supplyNum.value++
    }
    if (!node.deleted && node.relation.includes('合作关系')) {
      cooperationNum.value++
    }
    if (!node.deleted && node.relation.includes('竞争关系')) {
      competitiveNum.value++
    }

  }
}

//表单输入数据
const formSize = ref('default')
const inputFormRef = ref<FormInstance>()
const inputForm = reactive({
  time: '',
  preference: '',
  strategy: [],
  remark: ''
})
//输入规则
const rules = reactive<FormRules>({
  time: [
    {
      required: true,
      message: '评估时间未选择',
      trigger: 'change',
    },
  ],
  preference: [
    {
      required: true,
      message: '风险偏好未选择',
      trigger: 'change',
    },
  ],
  strategy: [
    {
      type: 'array',
      required: true,
      message: '合作策略未选择',
      trigger: 'change',
    },
  ]
})

// 记录上次提交的表单参数
let lastInputForm=ref({});
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // 检查表单参数是否更改
  if (inputForm && lastInputForm && isEqual(inputForm, lastInputForm)) {
    alert('表单参数没有更改，请勿重复提交');
    return;
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      alert('参数已提交');
      // 将表单数据传递给父组件
      emits('onFormInput', inputForm);
      lastInputForm.value = { ...inputForm }; // 更新上次提交的表单参数
      console.log('提交成功!', inputForm);
    } else {
      console.log('提交失败!', fields);
    }
  });
};

// 重置表单数据
const resetForm = () => {
  // 清除表单项的校验状态
  inputFormRef.value?.resetFields();
  // 重置表单数据
  Object.keys(inputForm).forEach(key => {
    if (Array.isArray(inputForm[key])) {
      inputForm[key] = []; // 重置数组类型的属性
    } else {
      inputForm[key] = ''; // 重置其他类型的属性
    }
  });
  // lastInputForm.value = { ...inputForm }; // 更新上次提交的表单参数
  Object.assign(lastInputForm.value,inputForm);
  console.log('重置表单数据', inputForm);
  emits('onFormInput', inputForm);
}

</script>

<template>
  <!-- <p>评估时间：{{ time }}</p> -->
  <p>收益评估部分</p>
  <p>评估时间：{{ formData.time }}</p>
  <p>风险选择：{{ formData.preference }}</p>
  <p>合作策略：{{ formData.strategy }}</p>
  <p>{{ relatedNodesData }}</p>
</template>
  
  
<script lang="ts" setup>
import { colProps } from 'element-plus';
import { reactive, ref, toRefs, toRaw } from 'vue'
import { watch, watchEffect, nextTick } from 'vue'

//接收数据
const props = defineProps({
  formGlobal: Object,
  relatedNodesWithoutGlobal: Object,
  relatedNodesWithoutGlobalRefs: Object,
});
const formData = ref(
  {
    time: '',
    preference: '',
    strategy: '',
    remark: '',
  }
)
const relatedNodesData = ref<Node[]>([]);
// const refs = ref<Node[]>([]);
const refs = reactive<Node[]>([]);
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

watch(
  () => props.formGlobal,
  (newVal) => {
    nextTick(() => {
      if (newVal) {
        formData.value.time = newVal.time;
        formData.value.preference = newVal.preference;
        formData.value.strategy = newVal.strategy;
        formData.value.remark = newVal.remark;
      }
    });
  },
  { deep: true, immediate: true, flush: 'sync' }
);


// 监听父组件传递的响应式对象数组
watchEffect(() => {

  //只能获取第一次提交的关系，无法实时更新
  Object.assign(relatedNodesData, props.relatedNodesWithoutGlobal);
  console.log("relatedNodesData", relatedNodesData.value);

  // 可以实时更新，但是无法解包获取具体数据
  // 方法一：父组件使用toRef，子组件使用ref对象存储
  // relatedNodesData.value = props.relatedNodesWithoutGlobalRefs as Node[];

  // if (props.relatedNodesWithoutGlobalRefs) {
  //   console.dir(props.relatedNodesWithoutGlobalRefs);
  // }

  // if (props.relatedNodesWithoutGlobalRefs) {
  //   const _object = Reflect.get(props.relatedNodesWithoutGlobalRefs, "_object");
  //   console.log("_object", _object);
  // }


});


</script>

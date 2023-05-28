<template>
    <!-- <p>评估时间：{{ time }}</p> -->
    <p>收益评估部分</p>
</template>
  
  
<script setup>
import { reactive, ref } from 'vue'
import { watch, nextTick } from 'vue'

//接收数据
const props = defineProps({
  formGlobal: Object,
});
const time = ref('')
// const nodeName = ref('')
// const links = ref([]);

watch(
  () => props.formGlobal,
  (newVal) => {
    nextTick(() => {
      // console.log("step4接收到的参数：", newVal);
      if (newVal) {
        time.value = newVal.time;
      }
    });
  },
  { deep: true, immediate: true, flush: 'sync' }
);

</script>

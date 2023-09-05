<script setup>
import {onMounted, onUnmounted} from "vue";
import Table from "./components/Table.vue"
import FlowChart from "@/views/taskAllocation/dispatch/components/FlowChart.vue";

onMounted(() => {
  console.log('dispatch mounted');
})
onUnmounted(() => {
  console.log('dispatch unmount');
})

</script>

<template>
  <div>
    <Table></Table>
    <FlowChart></FlowChart>
  </div>
</template>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
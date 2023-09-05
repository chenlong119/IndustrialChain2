<script setup>
import Input from './input/index.vue';
import Detail from './detail/index.vue';
import Dispatch from './dispatch/index.vue';
import {ref} from "vue";

const active = ref(0);
</script>

<template>
  <div>
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="任务输入"/>
      <el-step title="任务分配详情"/>
      <el-step title="任务调度"/>
    </el-steps>
    <div class="body">
      <Input v-show="active==0"/>
      <Detail v-show="active==1"></Detail>
      <Dispatch v-show="active==2"></Dispatch>
    </div>
    <div class="footer">
      <el-button type="primary" @click="active--" :disabled="active==0">上一步</el-button>
      <el-button type="primary" @click="active++" :disabled="active==2">下一步</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footer {
  display: flex;
  justify-content: space-between;
  margin: 50px 10px;
}
</style>
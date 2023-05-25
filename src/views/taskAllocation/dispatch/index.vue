<script setup>
import {useRouter} from "vue-router";
import {useDispatchStore} from "@/store/modules/dispatch";

const dispatchStore = useDispatchStore();
const router = useRouter();
router.addRoute('Scheduling',{
  path:'',
  name:'table',
  component:()=>import('./components/Table.vue')
});
router.addRoute('Scheduling',{
  path:'/allocation/scheduling/flowchart',
  name:'flowchart',
  component:()=>import('./components/Flowchart.vue')
});
router.addRoute('Scheduling',{
  path:'/allocation/scheduling/operator',
  name:'operator',
  component:()=>import('./components/Operator.vue')
});
if(!dispatchStore.flag){
  router.push({name:'table'});
  dispatchStore.setFlag(true);
}
</script>

<template>
  <div>
    <div class="header">
      <el-button-group>
        <el-button @click="$router.push({name:'table'})" type="primary">表格视图</el-button>
        <el-button @click="$router.push({name:'flowchart'})" type="primary">流程图视图</el-button>
        <el-button @click="$router.push({name:'operator'})" type="primary">操作员管理</el-button>
      </el-button-group>
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
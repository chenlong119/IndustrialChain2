<script setup>
import Step1 from './components/Step1.vue'
import Step2 from './components/Step2.vue'
import Step3 from './components/Step3.vue'
import {computed, nextTick, onMounted, ref, watch} from "vue";
import jsonData from "../../assets/dataFusion/task.json"
import * as echarts from 'echarts/core';
import {reactive} from 'vue'
import axios from 'axios';

// 读取json数据并将其存储到nodeData数组和linkData数组中
const nodeData = reactive([]);
const linkData = reactive([]);
const emits = defineEmits(['onNodeSelected']);
for (const node of jsonData.nodes) {
  nodeData.push({
    id: node.id,
    name: node.name,
    requirements: node.requirements,
    products: node.products,
    deadline: node.deadline,
    lastTime: node.lastTime,
    numbers: node.numbers,
    lists: node.lists,
    category: node.category,
    x: node.x,
    y: node.y
  });
}
for (const link of jsonData.links) {
  linkData.push({
    source: link.source,
    target: link.target,
    relation: link.label.formatter,
  });
}

// 计算与所选节点相关的所有节点信息和连接信息
const selectedNode = ref(""); //用户选择的节点
const relatedNodesWithout = reactive([]);
const relatedNodeIds = new Set();

watch([selectedNode], () => {
  if (!selectedNode.value) {
    relatedNodes.value = [];
    return;
  }
  // 获取与所选节点相关的所有连接
  const relatedLinks = linkData.filter(
      (link) => link.source === selectedNode.value || link.target === selectedNode.value
  );
  relatedNodeIds.clear();
  for (const link of relatedLinks) {
    relatedNodeIds.add(link.source);
    relatedNodeIds.add(link.target);
  }
  let tempRelatedNodes1 = nodeData.filter((node) => relatedNodeIds.has(node.id) && node.id !== selectedNode.value); //没有加上选中节点
  // 将相关连接信息添加到相关节点信息中，并添加序号
  tempRelatedNodes1.forEach((node, index) => {
    node.relation = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation)
        .join(",");
    node.index = index + 1;
  });
  relatedNodesWithout.value = tempRelatedNodes1;
  console.log(relatedNodesWithout.value);

}, { deep: true });
//"查看详情"功能
const infoDialogVisible = ref(false)
const formLabelWidth = '140px'
let info = ref({
  id: '',
  name: '',
  index: -1,
  requirements: '',
  products:'',
  deadline:'',
  lastTime:'',
  numbers:'',
  lists:'',
  category: '',
  relation: [],
  x: -1,
  y: -1,
  deleted: false
});
const handleInfo = (row) => {
  infoDialogVisible.value = true
  info.value = row
}

const buttonNames = ['任务聚类划分', '任务关联分析'];
const active = ref(0)
const formInline = reactive({
  user: '',
  region: '',
})
const taskData = reactive({
  name: "",
  requirements: "",
  products: "",
  deadline: "",
  lastTime: "",
  numbers: "",
  lists: "",
})
let tableData = reactive({
  filterData: []
})
const open = ref(false);
const title = ref("");
const state = reactive({
  dormitory: [],
  currentPage: 1,
  totalCount: 100,
  pageSizes: [5, 10],
  PageSize: 5,
})

function handleSizeChange(val) {
  // 改变每页显示的条数
  this.PageSize = val
  // 注意：在改变每页显示的条数时，要将页码显示到第一页
  this.state.currentPage = 1
}

//分页展示，每页展示8个任务
const pageSize = 5
//当前页
let currentPage = ref(1);
let currentTaskList = computed(() => {
  return tableData.filterData.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
})
const handleCurrentChange = (val) => {
  currentPage.value = val
}
const {proxy} = getCurrentInstance();
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    requirements: null,
    products: null,
    ddl: null,
    duration: null,
    number: null,
    lists: null
  },
  rules: {
    name: [
      {required: true, message: "任务名称不能为空", trigger: "blur"}
    ],
    requirements: [
      {required: true, message: "任务资源需求不能为空", trigger: "change"}
    ],
    products: [
      {required: true, message: "任务预估产量不能为空", trigger: "change"}
    ],
    ddl: [
      {required: true, message: "任务截止时间不能为空", trigger: "blur"}
    ],
    duration: [
      {required: true, message: "任务持续时长不能为空", trigger: "blur"}
    ],
    number: [
      {required: true, message: "任务参与企业数量不能为空", trigger: "blur"}
    ],
    lists: [
      {required: true, message: "任务参与企业名单不能为空", trigger: "change"}
    ]
  }
});
const {queryParams, form, rules} = toRefs(data);

const back = () => {
  active.value--
}
const next = () => {
  active.value++
}

function searchTasks() {
  const category = formInline.region;
  axios.get('/src/assets/dataFusion/task.json').then(response => {
    let data = response.data.nodes;
    tableData.filterData = data.filter(item => item.category == category);
    console.log(tableData.filterData)
  })
  currentPage.value = 1;
}

function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加任务表 ";
}

function reset() {
  form.value = {
    id: null,
    name: null,
    requirements: null,
    products: null,
    ddl: null,
    duration: null,
    number: null,
    lists: null,
  };
  proxy.resetForm("taskAllocationRef");
}

const indexMethod = (index) => {
  return index + 1;
};

function submitForm() {
  // proxy.$refs["taskAllocationRef"].validate(valid => {
  //   if (valid) {
  //     if (form.value.id != null) {
  //       updateTaskAllocation(form.value).then(response => {
  //         proxy.$modal.msgSuccess("修改成功");
  //         open.value = false;
  //         getList();
  //       });
  //     } else {
  //       addTaskAllocation(form.value).then(response => {
  //         proxy.$modal.msgSuccess("新增成功");
  //         open.value = false;
  //         getList();
  //       });
  //     }
  //   }
  // });
  proxy.$refs["taskAllocationRef"].validate(valid => {
    if (valid) {
      proxy.$modal.msgSuccess("新增成功");
      open.value = false;
    }
  });
}

function cancel() {
  open.value = false;
  reset();
}

</script>

<template>
  <div>
    <div class="topicText">
      <h2>群智汇聚</h2>
    </div>
    <el-tabs style="margin-left:20px" @tab-click="handleClick">
      <el-tab-pane label="多重产业链模型">
        <el-card class="content-card">
          <div v-if="active === 0">
            <Step1></Step1>
          </div>
          <div v-if="active === 1">
            <Step2></Step2>
          </div>
          <div v-if="active === 2">
            <Step3></Step3>
          </div>
        </el-card>
        <div class="button-container">
          <el-button :icon="ArrowLeft" type="primary" plain style="margin-top: 12px" @click="back"
                     v-show="active !== 0">上一步
          </el-button>
          <div class="right-button-container">
            <el-button type="primary" plain style="margin-top: 12px" @click="next" v-show="active !== 2">
              {{ buttonNames[active] }}
              <el-icon>
                <ArrowRight/>
              </el-icon>
            </el-button>
          </div>
        </div>


        <!--          <el-col :span="10">-->
        <!--            <el-card class="box-card" style="width: 400px;height:400px;margin-left: 20px">-->
        <!--              <template #header>-->
        <!--                <div class="card-header">-->
        <!--                  <span>任务简介</span>-->
        <!--                </div>-->
        <!--              </template>-->
        <!--              <div class="text item">-->
        <!--                {{ '任务名称: ' + taskData.name }}-->
        <!--              </div>-->
        <!--              <div class="text item">-->
        <!--                {{ '资源需求: ' + taskData.requirements }}-->
        <!--              </div>-->
        <!--              <div class="text item">-->
        <!--                {{ '预期产量: ' + taskData.products }}-->
        <!--              </div>-->
        <!--              <div class="text item">-->
        <!--                {{ '截止时间: ' + taskData.deadline }}-->
        <!--              </div>-->
        <!--              <div class="text item">-->
        <!--                {{ '预估耗时: ' + taskData.lastTime }}-->
        <!--              </div>-->
        <!--              <div class="text item">-->
        <!--                {{ '参与企业数量: ' + taskData.numbers }}-->
        <!--              </div>-->
        <!--              <div class="text item">-->
        <!--                {{ '参与企业名单: ' + taskData.lists }}-->
        <!--              </div>-->
        <!--            </el-card>-->
        <!--          </el-col>-->
      </el-tab-pane>
      <!--      <el-tab-pane label="新任务输入">-->

      <!--      </el-tab-pane>-->
      <el-tab-pane label="聚类查询">
        <el-row>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="聚类基准">
              <el-input v-model="formInline.user" placeholder="紧急性"/>
            </el-form-item>
            <el-form-item label="紧急性查询">
              <el-select v-model="formInline.region" placeholder="类别查询">
                <el-option label="紧急性1" value="紧急性1"/>
                <el-option label="紧急性2" value="紧急性2"/>
                <el-option label="紧急性3" value="紧急性3"/>
                <el-option label="紧急性4" value="紧急性4"/>
                <el-option label="紧急性5" value="紧急性5"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchTasks">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>

        <el-row>
          <el-col>
            <el-table :data="currentTaskList" style="width: 100%" class="table">
              <el-table-column fixed prop="name" label="任务" width="150px"/>
              <el-table-column prop="requirements" label="需要资源数量" width="150px"/>
              <el-table-column prop="products" label="预估产量" width="150px"/>
              <el-table-column prop="deadline" label="截止时间" width="150px"/>
              <el-table-column prop="lastTime" label="预估耗时" width="150px"/>
              <el-table-column prop="numbers" label="参与企业数量" width="150px"/>
              <el-table-column prop="lists" label="参与企业名单" width="400px"/>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="tableData.filterData.length"
                @current-change="handleCurrentChange"
                class="mt-4"
            />
          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="关联查询">
        <div>
          <span style="font-size: 14px; font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif">目标关联任务:</span>
          <el-select v-model="selectedNode" class="m-2" placeholder="请选择任务" size="large" filterable>
            <el-option v-for="item in nodeData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <el-main>
          <div style="margin-bottom: 15px;"><span style="font-size: 14px">耦合关系展现：</span></div>
          <el-table :data="relatedNodesWithout.value" style="width: 775px;height:260px" highlight-current-row
                    :header-cell-style="{height: '60px',}" :row-style="{ textAlign: 'center', height: '54px', }" class="my-table">
            <el-table-column fixed type="index" :index="indexMethod" label="序号" width="100" />
            <el-table-column prop="id" label="任务id" width="100" />
            <el-table-column prop="name" label="任务名称" width="150" />
            <el-table-column prop="category" label="紧急程度" width="150" />
            <el-table-column prop="relation" label="关联程度" width="150" />


            <el-table-column prop="infomation" label="任务信息" width="120">
              <template #default="scope">
                <el-button link type="primary" @click="handleInfo(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination v-model="currentPage" :page-size="pageSize" :pager-count="11" layout="prev, pager, next"
                         :total="relatedNodesWithout.length" @current-change="handleCurrentChange"
                         @size-change="handleSizeChange" />

          <el-dialog v-model="infoDialogVisible" title="任务详情" align-center>
            <el-form :model="info">
              <el-form-item label="" :label-width="formLabelWidth">
                任务id：{{ info.id }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                任务名称：{{ info.name }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                任务资源需求：{{ info.requirements }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                任务预估产量：{{ info.products }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                任务截止时间：{{ info.deadline }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                任务持续时间：{{ info.lastTime }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                任务参与企业数量：{{ info.numbers }}
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                任务参与企业名单：{{ info.lists }}
              </el-form-item>
            </el-form>
          </el-dialog>

        </el-main>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>


el-row {
  margin-bottom: 20px;
}

el-row:last-child {
  margin-bottom: 0;
}

el-col {
  border-radius: 4px;
}

grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.table {
  border: #2c3e50;
  align-content: center;
}

.topicText {
  text-align: center;
  font-family: BlinkMacSystemFont;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.flex-container {
  display: flex;
  align-items: center;
}

.header-text {
  margin-right: 10px;
  font-weight: bold
}

.card-header {
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  text-align: center;
}

.box-card {
  width: 480px;
}


</style>

<template>
  <span style="font-weight: bold;">当前评估企业：{{ nodeName }}</span><br />
  <span style="font-weight: bold;">关联企业列表：</span>

  <div class="search-box">
    <div class="search-container">
      <span style="font-weight: bold;">搜索：</span>
      <el-input v-model.trim="searchParam" placeholder="请输入企业名/连接关系" />
      <el-button :icon="Search" class="search-btn" @click="handleSearch"></el-button>
      <el-button @click="clearSearch">清空搜索</el-button>
    </div>
    <div class="add-container">
      <el-button class="add-btn" type="primary" @click="addNode">新增节点</el-button>
      <el-button class="add-btn" type="primary" @click="recoverAllNodes">重置关联关系</el-button>
    </div>
  </div>

  <el-table :data="pagedRelatedNodes" style="width: 100%;height:480px" highlight-current-row :header-cell-style="{
    // textAlign: 'center',
    height: '60px',
  }" :row-style="{ height: '50px' }" class="my-table">

    <el-table-column fixed type="index" :index="indexMethod" align="center" label="序号" width="100" />
    <el-table-column prop="id" label="企业id" align="center" width="100" />
    <el-table-column prop="name" label="企业名称" align="center" width="250" />
    <el-table-column prop="filed" label="所处领域" align="center" width="250" />
    <el-table-column prop="category" label="所处产业链" align="center" width="250" />
    <el-table-column label="连接关系" align="center" width="250">
      <template #default="scope">
        <span class="el-dropdown-link">
          <template v-for="(rel) in scope.row.relation">
            <el-tag :type="getRelationTagType(rel)" disable-transitions>
              {{ rel }}
            </el-tag>
          </template>
        </span>
      </template>
    </el-table-column>

    <el-table-column prop="tool" label="操作" align="center" width="400">
      <template #default="scope">
        <el-button type="primary" :icon="Edit" circle @click="editNode(scope.row)" />



        <el-button type="danger" :icon="Delete" circle @click="deleteNode(scope.row)" />
      </template>
    </el-table-column>
  </el-table>

  <br />
  <el-form-item>
    <el-button type="primary" @click="submitModify">
      提交
    </el-button>
  </el-form-item>

  <el-pagination v-model="currentPage" :page-size="pageSize" :pager-count="11" layout="prev, pager, next"
    :total="relatedNodes.length" @current-change="handleCurrentChange" @size-change="handleSizeChange"
    style="float: right; margin: 20px;" :hide-on-single-page="value" />

  <el-dialog v-model="editDialogVisible" title="修改关联关系" align-center>
    <el-form :model="nodeGlobal">
      <el-form-item label="" :label-width="formLabelWidth">
        企业id：{{ nodeGlobal.id }}
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        企业名称：{{ nodeGlobal.name }}
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        连接关系：
        <el-checkbox label="供应关系" v-model="nodeGlobal.relation" :true-value="'供应关系'" :false-value="''"></el-checkbox>
        <el-checkbox label="合作关系" v-model="nodeGlobal.relation" :true-value="'合作关系'" :false-value="''"></el-checkbox>
        <el-checkbox label="竞争关系" v-model="nodeGlobal.relation" :true-value="'竞争关系'" :false-value="''"></el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">确认修改</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="addDialogVisible" title="新增节点" align-center>
    <el-form :model="nodeGlobal">
      <el-form-item label="" :label-width="formLabelWidth">
        企业id：{{ nodeGlobal.id }}
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        企业名称：{{ nodeGlobal.name }}
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        连接关系：
        <el-checkbox label="供应关系" @change="handleRelationChange"></el-checkbox>
        <el-checkbox label="合作关系" @change="handleRelationChange"></el-checkbox>
        <el-checkbox label="竞争关系" @change="handleRelationChange"></el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确认新增</el-button>
      </span>
    </template>
  </el-dialog>
</template>



<script lang="ts" setup>
import {
  Search,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { watch, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const emits = defineEmits(['onRelationModify']);  //定义组件的自定义事件


//接收数据
const props = defineProps({
  relatedNodesWithGlobal: Object,
});
//选中节点信息
const nodeId = ref('')
const nodeName = ref('')
const nodeFiled = ref('')
const nodeCategory = ref('')
const nodeNetwork = ref([])
//表格信息
const relatedNodes = ref<Node[]>([])
const allNodes = ref<Node[]>([])
const initialNodes = ref<Node[]>([])
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
//初始化全局Node节点
let nodeGlobal = ref<Node>({
  id: '',
  name: '',
  index: -1,
  filed: '',
  category: '',
  network: [] as string[],
  relation: [] as string[],
  x: -1,
  y: -1,
  deleted: false
});

//监听数据
watch(
  () => props.relatedNodesWithGlobal,
  (newVal) => {
    nextTick(() => {
      if (newVal && newVal.nodes) {
        nodeId.value = newVal.nodes[0].id;
        nodeName.value = newVal.nodes[0].name;
        nodeFiled.value = newVal.nodes[0].filed;
        nodeCategory.value = newVal.nodes[0].category;
        nodeNetwork.value = newVal.nodes[0].network;
        relatedNodes.value = newVal.nodes.slice(1);//用于展示的关联节点
        allNodes.value = newVal.nodes.slice(1);//最新最全的节点
        initialNodes.value = newVal.nodes.slice(1);//初始节点
        //将数组中的relation属性转换为字符串数组
        relatedNodes.value = newVal.nodes.slice(1).map(node => {
          return {
            ...node,
            deleted: false,
            relation: [node.relation]
          }
        })
        allNodes.value = newVal.nodes.slice(1).map(node => {
          return {
            ...node,
            deleted: false,
            relation: [node.relation]
          }
        })
        initialNodes.value = newVal.nodes.slice(1).map(node => {
          return {
            ...node,
            deleted: false,
            relation: [node.relation]
          }
        })


      }

    });
  },
  { deep: true, immediate: true, flush: 'sync' }
);

//连接关系标签颜色
const getRelationTagType = (rel: string): string => {
  switch (rel) {
    case '供应关系':
      return 'warning'
    case '合作关系':
      return 'success'
    case '竞争关系':
      return 'info'
    default:
      return ''
  }
}
//数据分页和连接关系筛选
const currentPage = ref(1)         //当前页
const pageSize = ref(8)            //每页显示的数据条数
const value = ref(true)            //是否隐藏分页器
function handleSizeChange(size) {
  pageSize.value = size;
  currentPage.value = 1;
}
function handleCurrentChange(newPage) {
  currentPage.value = newPage;
}
// 过滤已删除的节点
const filteredNodes = computed(() => {
  return relatedNodes.value.filter(node => !node.deleted)
})
//分页后的数据
const pagedRelatedNodes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  if (!Array.isArray(filteredNodes.value) || filteredNodes.value.length === 0) { return []; }
  return filteredNodes.value.slice(start, end);
});
//分页之后的序号
const indexMethod = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1;
};


// “搜索”功能
const searchParam = ref<string>('')
const handleSearch = () => {
  if (searchParam.value === '') {
    ElMessage({
      type: 'warning',
      message: '请输入搜索内容',
    })
    return
  }
  const searchResult = relatedNodes.value.filter(node => {
    return node.name.includes(searchParam.value as string) || (Array.isArray(node.relation) && node.relation.some(relation => relation === searchParam.value))
  })
  if (searchResult.length === 0) {
    ElMessage({
      type: 'warning',
      message: '未找到相关企业',
    })
    return
  }
  relatedNodes.value = searchResult
  currentPage.value = 1
}
//清空搜索
function clearSearch() {
  searchParam.value = ''
  relatedNodes.value = allNodes.value
  currentPage.value = 1
}


//“删除关联企业”功能
const deleteNode = (row) => {
  ElMessageBox.confirm(
    '是否要删除该关联企业?',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '关联企业已删除',
      })
      //删除该节点(逻辑删除)
      allNodes.value = allNodes.value.map(node => {
        if (node.id === row.id) {
          return {
            ...node,
            deleted: true
          }
        } else {
          return node
        }
      })
      //更新搜索结果列表
      relatedNodes.value = allNodes.value.filter(node => {
        return node.name.includes(searchParam.value)
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

//“修改关联关系”功能
const editDialogVisible = ref(false)
const formLabelWidth = '140px'
const editNode = (row: Node) => {
  editDialogVisible.value = true
  const nodeTemp: Node = {
    id: '',
    name: '',
    index: -1,
    filed: '',
    category: '',
    network: [] as string[],
    relation: [] as string[],
    x: -1,
    y: -1,
    deleted: false
  }
  nodeTemp.id = row.id
  nodeTemp.name = row.name
  if (Array.isArray(row.relation)) {
    nodeTemp.relation = row.relation;
  } else {
    nodeTemp.relation = [row.relation];
  }
  nodeGlobal.value = { ...nodeTemp } //赋值给全局变量node
}
// 处理关联关系改变事件（获取多选框事件）
function handleRelationChange(relation: string) {
  const exists = JSON.stringify(nodeGlobal.value.relation).includes(JSON.stringify(relation));
  if (!exists) {
    nodeGlobal.value.relation.push(relation);
  } else {
    nodeGlobal.value.relation.splice(nodeGlobal.value.relation.indexOf(relation), 1);
  }
}
//保存修改
function saveEdit() {
  if (nodeGlobal.value.relation.length === 0) {
    alert('请选择至少一个连接关系!');
  } else {
    //更新节点信息
    allNodes.value = allNodes.value.map(node => {
      if (node.id === nodeGlobal.value.id) {
        return {
          ...node,
          relation: nodeGlobal.value.relation
        }
      } else {
        return node
      }
    })
    //更新搜索结果列表
    relatedNodes.value = allNodes.value.filter(node => {
      return node.name.includes(searchParam.value)
    })
    //清空全局变量nodeGlobal
    Object.assign(nodeGlobal.value, {
      id: '',
      name: '',
      index: -1,
      filed: '',
      category: '',
      network: [] as string[],
      relation: [] as string[],
      x: -1,
      y: -1,
      deleted: false
    })
    editDialogVisible.value = false //关闭弹窗
  }
}



//“新增节点”功能(TODO)
const addDialogVisible = ref(false)
const addNode = () => {
  addDialogVisible.value = true
}



// 初始化（重置）企业关联列表
const recoverAllNodes = () => {
  Object.assign(allNodes.value,initialNodes.value)
  //更新搜索结果列表
  relatedNodes.value = allNodes.value.filter(node => {
    return node.name.includes(searchParam.value)
  })
}

//提交修改后的关联关系
let previousSubmission = ref();
const submitModify = () => {
  if (previousSubmission && JSON.stringify(previousSubmission) === JSON.stringify(allNodes)) {
    alert('关联关系没有更改，请勿重复提交');
  } else {
    previousSubmission = JSON.parse(JSON.stringify(allNodes));
    emits('onRelationModify', allNodes);
    alert('关联关系提交成功');
  }
}


</script>

<style>
.search-box {
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 500px; */
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  padding: 0 15px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-label {
  margin-right: 10px;
  font-weight: bold;
}

.search-box .el-input {
  border-radius: 20px;
  background-color: transparent;
  border: none;
  box-shadow: none;
  flex: 1;
}

.add-container {
  margin-left: 500px;
}
</style>
<template>
    <div>
      <el-main style="width: 100%;">
        <el-table :data="tableData" border stripe :header-cell-class-name="headerBg"  max-height="500" :fit="true">
          <el-table-column type="selection" width="65"> <!--多选框-->
          </el-table-column>
          <el-table-column prop="taskName" label="数据需求" >
          </el-table-column>
          <el-table-column prop="taskReleaser" label="数据请求方" >
          </el-table-column>
          <el-table-column prop="dataRelease" label="发布日期" >
          </el-table-column>
          <el-table-column prop="dataFinish" label="完成日期" >
            <template #header="{ column }">
              <el-tooltip effect="dark" content="这里是悬浮内容" placement="top-start">
                <span>{{ column.label }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="taskState" label="数据共享状态" >
          </el-table-column>        
          <el-table-column label="数据提供方" align="center">
            <template #default="scope">
              <el-tooltip class="item" effect="dark" placement="top">
                <template #content>
                  <!-- 显示 dataProviders 数组中的每个元素 -->
                  <el-tag v-for="(item, index) in scope.row.dataProviders" :key="index" type="success">{{ item }}</el-tag>
                </template>
                <div>{{ scope.row.dataProviders.length }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="加权增益数值">
            <template #default="scope">
              <el-link @click="showProfitDetails(scope.row)">{{ calculateWeightedGain(scope.row) }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="所属产业链" prop="chain" >
          </el-table-column>
          <el-table-column label="评价" align=“center”> 
            <!-- 添加自定义模板 --> 
            <template #default="scope"> 
              <el-tooltip class="item" effect="dark" :content="scope.row.comment" placement="top">
                <el-rate v-model="scope.row.commentScore" disabled> 
                </el-rate> 
              </el-tooltip>
            </template> 
          </el-table-column>
          <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
            <template #default="scope">
                <el-tooltip content="修改" placement="top" v-if="scope.row.userId !== 1">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" v-if="scope.row.userId !== 1">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']"></el-button>
                </el-tooltip>
            </template>
          </el-table-column>
        </el-table>     
      </el-main>

      <el-dialog title="详细信息" v-model="isProfitVisible" @close="hideProfitDetails" class="custom-dialog">
        <div v-if="selectedRow">
          <p>参与企业：</p>
          <ul>
            <li v-for="(provider, index) in selectedRow.dataProviders">
              {{ provider }} - {{ selectedRow.dataProviderValues[index] }} - {{ selectedRow.dataProviderRates[index] }}%
            </li>
          </ul>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hideProfitDetails">关闭</el-button>
        </span>
      </el-dialog>


    </div>
  </template>

  <script setup>
  import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
  import  * as echarts from 'echarts'

 

  const isPopupVisible = ref(false);
  const isProfitVisible = ref(false);
  const selectedRow=reactive({taskName:'四月电池销量',
            taskReleaser:'小鸭家电',
            profit:10,
            data:"2022.5.1",
            taskState:'已完成',
            dataProviders: ['南孚电池', '超威电池'],
            dataProviderValues:['20','15'],
            dataProviderRates:[87,13],
            accepter: '南孚电池',
            chain:'家电产业链',
            commentScore: 3,
            comment:'符合要求',
            enterpriseRelationshipStrength: 8,
            sharedPointsGain: 20,
            continuousSharingRewards: 15,
            afterSalesEvaluationGain: 5});
  const showPopup = () => {
    isPopupVisible.value = true;
  };
  const showProfitDetails = (row) =>{
    console.log(selectedRow);
    // selectedRow = row;
      // Object.assign(selectedRow, row);
      Object.keys(row).forEach((key) => {
          selectedRow[key] = row[key];
        });
      nextTick(() => {
    console.log("selectedRow updated:", selectedRow);
    isProfitVisible.value = true;
  });

    };
  const hideProfitDetails = () => {
    isProfitVisible.value = false;
  };

  const hidePopup = () => {
    isPopupVisible.value = false;
  };

  const tablename = ref(null);
  const tableData = ref([]);
  function load() {  //加载
      tablename.value='上传记录表'
      const dataInit=[
        { 
          taskName:'四月电池销量',
          taskReleaser:'小鸭家电',
          profit:10,
          dataRelease:"2023.5.1",
          dataFinish:"2023.6.1",
          taskState:'已完成',
          dataProviders: ['南孚电池', '超威电池'],
          dataProviderValues:['20','15'],
          dataProviderRates:[87,13],
          accepter: '南孚电池',
          chain:'家电产业链',
          commentScore: 3,
          comment:'符合要求',
          enterpriseRelationshipStrength: 8,
          sharedPointsGain: 20,
          continuousSharingRewards: 15,
          afterSalesEvaluationGain: 5
          },
        { 
          taskName:'五月A型芯片计划产量',
          taskReleaser:'小鸭家电',
          profit:50,
          dataRelease:"2023.4.12",
          dataFinish:"2022.4.13",
          taskState:'已完成',
          dataProviders: ['中兴公司', '台积电'],
          dataProviderValues:['85','15'],
          dataProviderRates:[68,32],
          accepter: '台积电' ,
          chain:'家电产业链',
          commentScore: 1,
          comment:'数据量偏小，不推荐',
          enterpriseRelationshipStrength: 8,
          sharedPointsGain: 20,
          continuousSharingRewards: 15,
          afterSalesEvaluationGain: 5
          },
        { 
          taskName:'618家电类销售综合数据',
          taskReleaser:'小鸭家电',
          profit:100,
          dataRelease:"2023.2.1",
          dataFinish:"2022.2.12",
          taskState:'已完成',
          dataProviders: ['淘宝', '京东','拼多多'],
          dataProviderValues:['20','15','42'],
          dataProviderRates:[21,25,54],
          accepter: '京东' ,
          chain:'家电产业链',
          commentScore: 3,
          comment:'/',
          enterpriseRelationshipStrength: 8,
          sharedPointsGain: 20,
          continuousSharingRewards: 15,
          afterSalesEvaluationGain: 5
          },
        { 
          taskName:'21年人力平均工资',
          taskReleaser:'小鸭家电',
          profit:30,
          dataRelease:"2022.9.16",
          dataFinish:"/",
          taskState:'未完成',
          dataProviders: [],
          dataProviderValues:[],
          dataProviderRates:[],
          accepter: '无' ,
          chain:'家电产业链',
          commentScore: 2,
          comment:'/',
          enterpriseRelationshipStrength: 8,
          sharedPointsGain: 20,
          continuousSharingRewards: 15,
          afterSalesEvaluationGain: 5
          },
        { 
          taskName:'双十一电视销售数据',
          taskReleaser:'闲鱼',
          profit:100,
          dataRelease:"2022.5.1",
          dataFinish:"2022.6.1",
          taskState:'已完成',
          dataProviders: ['小鸭家电', '苏宁家电',' 国美家电'],
          dataProviderValues:['20','15','23'],
          dataProviderRates:[56,13,31],
          accepter: '小鸭家电' ,
          chain:'家电产业链',
          commentScore: 3,
          comment:'/',
          enterpriseRelationshipStrength: 8,
          sharedPointsGain: 20,
          continuousSharingRewards: 15,
          afterSalesEvaluationGain: 5
          },
          ]
      tableData.value=dataInit
  };
  onMounted(() => {
    load();
    });
  function calculateWeightedGain(row) {
  // 在这里计算加权增益数值
  // 您的计算逻辑可以放在这里
  // 示例：假设计算逻辑是简单的加总
  const weightedGain = row.dataProviders.reduce((total, provider, index) => {
    return total + (row.dataProviderValues[index] * row.dataProviderRates[index] / 100);
  }, 0);

  // 使用 toFixed 保留一位小数并将结果转换为浮点数
  return parseFloat(weightedGain.toFixed(1));
  };

  </script>
  
  <style scoped>
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .headerBg{
    background: #eee!important;
  }
  .custom-dialog {
  /* 自定义样式 */
  width: 400px; /* 设置宽度 */
}

/* 自定义 footer 样式 */
.custom-dialog .dialog-footer {
  text-align: right;
}

/* 自定义关闭按钮样式 */
.custom-dialog .el-button {
  margin-left: 10px;
}
  </style>
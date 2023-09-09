<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-row>
          <el-card class="card" style="width:100%; height: 430px">
            <template #header><span style="font-size: 20px; font-weight: bold;">任务运行状态展示</span></template>
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <div class="rectangle">
                <div v-for="(color, index) in circleColors" :key="index" :class="{ circle: true, flashing: index === 5 }"
                  :style="{
                    backgroundColor: index === 5 ? 'red' : '#ccffcc',
                    width: circleSizes[index] + 'px',
                    height: circleSizes[index] + 'px',
                    left: fixedCirclePositions[index].left + 'px',
                    top: fixedCirclePositions[index].top + 'px'
                  }" @mouseover="(event) => showTooltip(event, index)" @mouseout="(event) => hideTooltip(event)"
                  @click="index === 5 ? showMessage() : null">
                  <span>任务{{ index + 1 }}</span>

                </div>
                <div class="custom-tooltip">
                  当前任务出现突发情况<br />点击任务节点查看详情
                </div>
              </div>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="card" style="width:100%; height: 430px">
            <template #header><span style="font-size: 20px; font-weight: bold;">协同模式分类统计图</span></template>
            <el-form :model="form" label-width="260px">

              <div ref="sit2" style="width: 100%; height: 330px; margin-bottom: 20px;"></div>
            </el-form>

            <div class="el-table el-table--enable-row-hover el-table--medium">
              <div ref="Info" style="width:900px; height: 350px" />
            </div>

          </el-card>
        </el-row>
      </el-col>
      <el-drawer direction="rtl" v-model="showDrawerVar">
    <h2>
      {{ start }}与{{ end }}合作历史详情
    </h2>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="序号" prop="id"></el-table-column>
        <el-table-column label="任务名称" prop="taskName"></el-table-column>
        <el-table-column label="交付日期" prop="deliveryDate"></el-table-column>
        <el-table-column label="交付体验" prop="deliveryExperience"></el-table-column>
      </el-table>
    </div>
    <div style="text-align: center; margin-top: 20px;">
    <el-button type="primary" @click="handleSearch">添加合作评价</el-button>
  </div>
  </el-drawer>
      <el-col :span="12">
        <el-row>
          <el-card class="card" style="width:100%; height: 430px">
            <template #header><span style="font-size: 20px; font-weight: bold;">企业群详情统计表</span></template>
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <div ref="Info" style="width:900px; height: 350px" />
              <el-row justify="center" class="tab-row">
                <el-col :span="8">
                  <span>选择查询类型：</span>
                  <el-select v-model="queryType" placeholder="选择查询类型">
                    <el-option label="企业群名称" value="企业群名称"></el-option>
                    <el-option label="企业群编号" value="企业群编号"></el-option>
                    <el-option label="参与任务" value="参与任务"></el-option>
                    <el-option label="协同模式" value="协同模式"></el-option>
                    <!-- 添加更多选项根据实际需要 -->
                  </el-select>
                </el-col>
                <!-- 添加查询输入框 -->
                <el-col :span="8" class="query-input">
                  <span>请输入查询内容：</span>
                  <el-input v-model="queryInput" placeholder="请输入查询内容"></el-input>
                </el-col>
                <!-- 添加查询按钮 -->
                <el-col :span="4" class="query-botton">
                  <el-col :span="1"></el-col> <!-- 添加一个空白列 -->
                  <el-row :span="1"></el-row> <!-- 添加一个空白列 -->
                  <el-button type="primary" @click="handleSearch">查询</el-button>
                </el-col>
                <el-row :span="1"></el-row> <!-- 添加一个空白列 -->
              </el-row><!-- 表格 -->
              <div class="table-container">
                <el-row justify="center" class="tab-row">
                  <el-col :span="22">
                    <el-table :data="filteredData" border max-height="239" v-fit-columns style="width: 100%">
                      <el-table-column prop="no" label="序号" align="center" />
                      <el-table-column prop="name" label="企业群名称" align="center" />
                      <el-table-column prop="number" label="企业群编号" align="center">

                      </el-table-column>
                      <el-table-column prop="task" label="参与任务" align="center">
                      </el-table-column>
                      <el-table-column prop="divname" label="企业个数" align="center" />
                      <el-table-column prop="model" label="协同模式" align="center" />
                    </el-table>
                  </el-col>
                </el-row>

                <div class="pagination">
                  <button @click="prevPage">上一页</button>
                  <span>第 {{ currentPage }} 页</span>
                  <button @click="nextPage">下一页</button>
                </div>
              </div>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="card" style="width:100%; height: 430px">
            <template #header><span style="font-size: 20px; font-weight: bold;">多模式协同下企业关系展示</span></template>
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <div ref="Info" style="width:900px; height: 300px" />
            </div>
            <div ref="taskLinkageInfo1" style="width:850px; height: 350px" />
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
const showTooltip = (event, index) => {
  event.target.title = tooltips[index];
}
const hideTooltip = (event) => {
  event.target.title = '';
}
const tooltips = [
  '任务1:苏州汽车组装   状态：正常',
  '任务2:无锡汽车组装   状态：正常',
  '任务3:昆山汽车组装   状态：正常',
  '任务4:常州汽车组装   状态：正常',
  '任务5:苏州汽车原材料   状态：正常',
  '任务6:无锡汽车原材料   状态：异常\n 点击查看异常',
  '任务7:昆山汽车原材料   状态：正常',
  '任务8:常州汽车原材料   状态：正常',
  '任务9:南京汽车组装    状态：正常',
  '任务10:南京汽车原材料   状态：正常',
  '任务11:泰州汽车组装    状态：正常',
  '任务12:泰州汽车原材料    状态：正常',
  '任务13:徐州汽车组装      状态：正常',
];
export default {
  name: "YourComponent",
  data() {
    return {
      circleColors: ["#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9", "#BBDEFB", "#B3E0E3", "#C8E6C9", "#F0F4C3", "#B3E0E3", "#C8E6C9", "#F0F4C3", "#F0F4C3"],
      circleSizes: [50, 70, 60, 80, 100, 110, 75, 85, 65, 65, 80, 65, 90],
      fixedCirclePositions: [
        { left: 50, top: 50 },
        { left: 230, top: 30 },
        { left: 400, top: 50 },
        { left: 450, top: 130 },
        { left: 250, top: 140 },
        { left: 580, top: 120 },
        { left: 80, top: 150 },
        { left: 550, top: 20 },
        { left: 100, top: 10 },
        { left: 35, top: 210 },
        { left: 210, top: 235 },
        { left: 330, top: 220 },
        { left: 430, top: 250 },
      ],
      queryType: '', // 保存查询类型
      queryInput: '', // 保存查询输入
      selectedLinkId: null,
      constraintData: [
        {
          no: "1",
          name: "无锡汽车组装企业群",
          number: "TSJ100092876533",
          task: "任务3",
          divname: "5",
          model: "跨企业跨链跨群",

        },
        {
          no: "2",
          name: "苏州汽车组装企业群",
          number: "TSJ100016876088",
          task: "任务1",
          divname: "4",
          model: "跨企业跨群",
        },
        {
          no: "3",
          name: "昆山汽车组装企业群",
          number: "TSJ100092876910",
          task: "任务2",
          divname: "6",
          model: "跨企业跨链跨群",
        },
        {
          no: "4",
          name: "杭州中控台原材料企业群",
          number: "TSJ100092125619",
          task: "任务10",
          divname: "6",
          model: "跨企业跨链",
        },
        {
          no: "5",
          name: "苏州中控台原材料企业群",
          number: "TSJ1023928144992",
          task: "任务8",
          divname: "4",
          model: "跨企业跨链跨群",
        },
        {
          no: "6",
          name: "苏州中控台原材料企业群",
          number: "TSJ1023928144992",
          task: "任务8",
          divname: "4",
          model: "跨企业跨链跨群",
        },
      ],
      originalData: [
        {
          no: "1",
          name: "无锡汽车组装企业群",
          number: "TSJ100092876533",
          task: "任务3",
          divname: "5",
          model: "跨企业跨链跨群",

        },
        {
          no: "2",
          name: "苏州汽车组装企业群",
          number: "TSJ100016876088",
          task: "任务1",
          divname: "4",
          model: "跨企业跨群",
        },
        {
          no: "3",
          name: "昆山汽车组装企业群",
          number: "TSJ100092876910",
          task: "任务2",
          divname: "6",
          model: "跨企业跨链跨群",
        },
        {
          no: "4",
          name: "杭州中控台原材料企业群",
          number: "TSJ100092125619",
          task: "任务10",
          divname: "6",
          model: "跨企业跨链",
        },
        {
          no: "5",
          name: "苏州中控台原材料企业群",
          number: "TSJ1023928144992",
          task: "任务8",
          divname: "4",
          model: "跨企业跨链跨群",
        },
        {
          no: "6",
          name: "苏州中控台原材料企业群",
          number: "TSJ1023928144992",
          task: "任务8",
          divname: "4",
          model: "跨企业跨链跨群",
        },
      ],
      currentPage: 1, // 当前显示的页数
      pageSize: 3, // 每页显示的行数
      tooltipTexts: ['提示文本1', '提示文本2', '提示文本3', '提示文本4'], // 保存不同的提示文本
    };
  },
  computed: {
    filteredData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.constraintData.slice(start, end);
    },
  },
  methods: {
    showMessage() {
      this.$nextTick(() => {
        this.$confirm(
          '异常任务：任务6--无锡汽车原材料公司<br/>任务异常原因：参与任务的企业13出现突发情况。<br/>企业异常原因：大量机器出现故障，材料供应不能按时完成。<br/>造成影响：任务延迟交付4周。<br/><br/>请问是否要立刻处理？',
          '异常详情',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            callback: action => {
              if (action === 'confirm') {
                this.showRecommendedSolution();
              }
            }
          }
        );
      });
    },
    showRecommendedSolution() {
      this.$alert(
        '推荐企业：企业31--江阴汽车原材料公司<br/>替换后效果：任务可以正常完成、协同效率高提升5%<br/>替换后协同模式：跨企业跨链跨群',
        '推荐解决方案',
        {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          callback: action => {
            if (action === 'confirm') {
              // 点击了确定按钮，进行页面跳转
              this.$router.push('/allocate/model/setAgent');
            }
          }
        }

      );
    },
    handleSearch() {
      // 获取查询条件
      const queryType = this.queryType;
      const queryInput = this.queryInput;
      const originalData = [...this.originalData];

      // 根据查询条件执行相应的查询操作
      if (queryType === '企业群名称') {
        this.constraintData = originalData.filter(item => item.name.includes(queryInput));
      } else if (queryType === '企业群编号') {
        this.constraintData = originalData.filter(item => item.number.includes(queryInput));
      } else if (queryType === '参与任务') {
        this.constraintData = originalData.filter(item => item.task.includes(queryInput));
      } else if (queryType === '协同模式') {
        this.constraintData = originalData.filter(item => item.model.includes(queryInput));
      }
      // 添加更多查询类型和逻辑根据实际需要

      // 重置当前页数为第一页
      this.currentPage = 1;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      const totalPages = Math.ceil(this.constraintData.length / this.pageSize);
      if (this.currentPage < totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
}
</script>
<script setup >
import * as echarts from "echarts";
// import graph from "@/assets/data/all_cluster.json";
import { getCache } from "@/api/monitor/cache";
import { onMounted } from 'vue';
import _ from "lodash";
import { reactive } from 'vue'
import { ref } from 'vue'
const sit2 = ref(null);
const taskLinkageInfo1 = ref(null);
let start="";
let end="";
var taskLinkageInfoIntance1;
// do not use same name with ref
  // 在 document 上添加点击事件监听，用于隐藏悬浮框
  let showDrawerVar=ref(false);
  // 添加一个函数用于显示抽屉
  function showDrawer(data) {
    showDrawerVar.value=true;
    console.log(data);
    //console.log("start:"+data.source);
    //console.log("end:"+data.target);
    start=data.source;
    end=data.target;
    // document.getElementById('1').addEventListener('click', function() {
    // showDrawer('企业17和企业13的历史合作');
    };
const form = reactive({
  name: '',
  region: '1',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
  parameter1: '200',
  parameter2: '50',
  parameter3: '40',
  parameter4: '120'
})
onMounted(() => {
  createPieChart(sit2.value);

  taskLinkageInfoIntance1 = echarts.init(taskLinkageInfo1.value);
  taskLinkageInfoIntance1.setOption(option3);
  taskLinkageInfoIntance1.on('click',(params)=>{
    const clickedElement = params.data;
  
  if (clickedElement.source && clickedElement.target) {
    showDrawer(clickedElement);
  }
  })
});
function createPieChart(chartContainer) {
  const chartInstance = echarts.init(chartContainer);
  const data = [
    { value: 5, name: '跨链跨群' },
    { value: 2, name: '跨企业' },
    { value: 15, name: '跨企业跨链' },
    { value: 35, name: '跨企业跨链跨群' },
    { value: 20, name: '跨企业跨群' },
    { value: 3, name: '跨群' },
    { value: 20, name: '跨链' },
  ];
  const taskCompletionRates = [90, 92, 94, 89, 99, 95, 98];
  // 修改点击事件监听，调用 hideDrawer 函数
  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const index = params.dataIndex;
        const defaultContent = params.marker + params.name + ' : ' + params.value + '<br/>';
        const additionalContent = '任务完成率: ' + taskCompletionRates[index] + '%<br/>';
        return defaultContent + additionalContent;
      },
    },
    series: [
      {
        type: 'pie',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  chartInstance.setOption(chartOptions);
}
var option3 = {
  tooltip: {},
  animationDurationUpdate: 50,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'none',
      symbolSize: 35,
      roam: true,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [1, 5],
      edgeLabel: {
        fontSize: 10
      },
      data: [
        {
          name: '企业 1',
          x: 20,
          y: 20,
          itemStyle: {
            color: '#e6ccff',
          },
          tooltip: {
            formatter: '节点信息：企业 1---小鸭家电 \n 企业群：山东矿业'
          }
          // 红色
        },
        {
          name: '企业 2',
          x: 35,
          y: 20,
          itemStyle: {
            color: '#e6ccff',
          },
          tooltip: {
            formatter: '节点信息：企业 2---比亚迪汽车 \n 企业群：山东矿业'
          }
          // 红色
        },
        {
          name: '企业 3',
          x: 45,
          y: 10,
          itemStyle: {
            color: '#e6ccff',
          },
          tooltip: {
            formatter: '节点信息：企业 3---江淮汽车 \n 企业群：山东矿业'
          }
          // 红色
        },
        {
          name: '企业 4',
          x: 35,
          y: 30,
          itemStyle: {
            color: '#e6ccff',
          },
          tooltip: {
            formatter: '节点信息：企业 4---武汉博泰汽 \n 企业群：山东矿业'
          }
          // 红色
        },
        {
          name: '企业 5',
          x: 45,
          y: 35,
          itemStyle: {
            color: '#e6ccff',
          },
          tooltip: {
            formatter: '节点信息：企业 5---博世集团 \n 企业群：山东矿业'
          }
          // 红色
        },
        {
          name: '企业 6',
          x: 50,
          y: 20,
          itemStyle: {
            color: '#ccffcc',
          },
          tooltip: {
            formatter: '节点信息：企业 6---上汽集团 \n 企业群：江苏金融'
          }
          // 绿色
        },
        {
          name: '企业 7',
          x: 20,
          y: 30,
          itemStyle: {
            color: '#ccffcc',
          },
          tooltip: {
            formatter: '节点信息：企业 7---一汽集团 \n 企业群：江苏金融'
          }
          // 绿色
        },
        {
          name: '企业 8',
          x: 60,
          y: 10,
          itemStyle: {
            color: '#ccffcc',
          },
          tooltip: {
            formatter: '节点信息：企业 8---国美电器 \n 企业群：江苏金融'
          }
          // 绿色
        },
        {
          name: '企业 9',
          x: 60,
          y: 30,
          itemStyle: {
            color: '#ccffcc',
          },
          tooltip: {
            formatter: '节点信息：企业 9---美国通用汽车 \n 企业群：江苏金融'
          }
          // 绿色
        },
        {
          name: '企业 10',
          x: 60,
          y: 40,
          itemStyle: {
            color: '#ccffcc',
          },
          tooltip: {
            formatter: '节点信息：企业 10---德国大众 \n 企业群：江苏金融'
          }
          // 绿色
        },
        {
          name: '企业 11',
          x: 35,
          y: 40,
          itemStyle: {
            color: '#ffffcc',
          },
          tooltip: {
            formatter: '节点信息：企业 11---长安汽车 \n 企业群：河北工业'
          }
          // 黄色
        },
        {
          name: '企业 12',
          x: 70,
          y: 20,
          itemStyle: {
            color: '#ffffcc',
          },
          tooltip: {
            formatter: '节点信息：企业 12---优信集团 \n 企业群：河北工业'
          }
          // 黄色
        },
        {
          name: '企业 13',
          x: 70,
          y: 60,
          //x: 90,
          //y: 50,
          itemStyle: {
            //color: '#ffffcc',
            color: '#e6ccff',
          },
          tooltip: {
            formatter: '节点信息：企业 13---奥迪服务 \n 企业群：河北工业'
          }
          // 黄色
        },
        {
          name: '企业 14',
          x: 70,
          y: 35,
          itemStyle: {
            color: '#ffffcc',
          },
          tooltip: {
            formatter: '节点信息：企业 14---爱普生集团 \n 企业群：河北工业'
          }
          // 黄色
        },
        {
          name: '企业 15',
          x: 50,
          y: 50,
          itemStyle: {
            color: '#ffffcc',
          },
          tooltip: {
            formatter: '节点信息：企业 15---美的集团 \n 企业群：河北工业'
          }
          // 黄色
        },
        {
          name: '企业 16',
          x: 20,
          y: 45,
          itemStyle: {
            color: '#ccf5ff',
          },
          tooltip: {
            formatter: '节点信息：企业 16---欧司朗公司 \n 企业群：浙江加工'
          }
        },
        {
          name: '企业 17',
          x: 80,
          y: 40,
          itemStyle: {
            color: '#ccf5ff',
          },
          tooltip: {
            formatter: '节点信息：企业 17---格力电器 \n 企业群：浙江加工'
          }
        },
        {
          name: '企业 18',
          x: 80,
          y: 10,
          itemStyle: {
            color: '#ccf5ff',
          },
          tooltip: {
            formatter: '节点信息：企业 18---海尔智家 \n 企业群：浙江加工'
          }
        },
        {
          name: '企业 19',
          x: 90,
          y: 30,
          itemStyle: {
            color: '#ccf5ff',
          },
          tooltip: {
            formatter: '节点信息：企业 19---苏宁易购 \n 企业群：浙江加工'
          }
        },

      ],

      // links: [],
      links: [

        {
          id: 1,
          source: '企业 17',
          target: '企业 13',

          lineStyle: {
            curveness: 0.2,
            color: 'red'
          },
          tooltip: {
            formatter: `
                连线信息：企业 17 -> 企业 13 
                跨企业跨链跨群
                <br>
                点击连线查看历史合作记录
            `
          }
        },
        {
          id: 2,
          source: '企业 19',
          target: '企业 17',
          lineStyle: {
            curveness: 0.2,
            color: 'green'
          },
          tooltip: {
            formatter: `
            连线信息：企业 19 -> 企业 17
            跨企业跨链
            <br>
            点击连线查看历史合作记录
            `
          }
        },
        {
          id: 3,
          source: '企业 4',
          target: '企业 9',
          lineStyle: {
            curveness: 0.2,
            color: 'blue'
          },
          tooltip: {
            formatter: `
            连线信息：企业 4 -> 企业 9
            跨企业跨群
            <br>
            点击连线查看历史合作记录
            `
          }
        },
        {
          id: 4,
          source: '企业 4',
          target: '企业 5',
          lineStyle: {
            curveness: 0.2,
            color: 'gray'
          },
          tooltip: {
            formatter: `
            连线信息：企业 4 -> 企业 5
            跨链跨群
            <br>
            点击连线查看历史合作记录
            `
          }
        },
        {
          id: 5,
          source: '企业 2',
          target: '企业 4',
          lineStyle: {
            curveness: 0.2,
            color: 'yellow'
          },
          tooltip: {
            formatter: `
            连线信息：企业 2 -> 企业 4 
            跨企业
            <br>
            点击连线查看历史合作记录
            `
          }

        },
        {
          id: 6,
          source: '企业 1',
          target: '企业 2',
          lineStyle: {
            curveness: 0.2,
            color: 'purple'
          },
          tooltip: {
            formatter: `
            连线信息：企业 1 -> 企业 2 
            跨链
            <br>
            点击连线查看历史合作记录
            `
          }

        },
        {
          id: 7,
          source: '企业 3',
          target: '企业 2',
          lineStyle: {
            curveness: 0.2,
            color: 'orange'
          },
          tooltip: {
            formatter: `
            连线信息：企业 3 -> 企业 2
            跨群
            <br>
            点击连线查看历史合作记录
            `
          }

        },
        {
          id: 8,
          source: '企业 6',
          target: '企业 8',
          lineStyle: {
            curveness: 0.2,
            color: 'orange'
          },
          tooltip: {
            formatter: `
            连线信息：企业 6 -> 企业 8
            跨群
            <br>
            点击连线查看历史合作记录
            `
          }

        },
        {
          id: 9,
          source: '企业 5',
          target: '企业 10',
          lineStyle: {
            curveness: 0.2,
            color: 'purple'
          },
          tooltip: {
            formatter: `
            连线信息：企业 5 -> 企业 10
            跨链
            <br>
            点击连线查看历史合作记录
            `
          }

        },
        {
          id: 10,
          source: '企业 8',
          target: '企业 12',
          lineStyle: {
            curveness: 0.2,
            color: 'yellow'
          },
          tooltip: {
            formatter: `
            连线信息：企业 8 -> 企业 12
            跨企业
            <br>
            点击连线查看历史合作记录
            `
          }

        },
        {
          id: 11,
          source: '企业 12',
          target: '企业 14',
          lineStyle: {
            curveness: 0.2,
            color: 'gray'
          },
          tooltip: {
            formatter: `
            连线信息：企业 12 -> 企业 14
            跨链跨群
            <br>
            点击连线查看历史合作记录
            `
          }

        },
        {
          id: 12,
          source: '企业 11',
          target: '企业 15',
          lineStyle: {
            curveness: 0.2,
            color: 'blue'
          },
          tooltip: {
            formatter: `
            连线信息：企业 11 -> 企业 15 
            跨企业跨群
            <br>
            点击连线查看历史合作记录
            `
          }

        },
        {
          id: 13,
          source: '企业 10',
          target: '企业 13',
          lineStyle: {
            curveness: 0.2,
            color: 'green'
          },
          tooltip: {
            formatter: `
            连线信息：企业 10 -> 企业 13
            跨企业跨链
            <br>
            点击连线查看历史合作记录
            `
          }

        },
        {
          id: 14,
          source: '企业 18',
          target: '企业 12',
          lineStyle: {
            curveness: 0.2,
            color: 'red'
          },
          tooltip: {
            formatter: `
            连线信息：企业 18 -> 企业 12
            跨企业跨链跨群
            <br>
            点击连线查看历史合作记录
            `
          }

        },
        {
          id: 15,
          source: '企业 16',
          target: '企业 5',
          lineStyle: {
            curveness: 0.2,
            color: 'red'
          },
          tooltip: {
            formatter: `
            连线信息：企业 16 -> 企业 5
            跨企业跨链跨群
            <br>
            点击连线查看历史合作记录
            `
          }

        },
        {
          id: 16,
          source: '企业 7',
          target: '企业 16',
          lineStyle: {
            curveness: 0.2,
            color: 'green'
          },
          tooltip: {
            formatter: `连线信息：企业 7 -> 企业 16
            跨企业跨链
            <br>
            点击连线查看历史合作记录
            `
          }
        },
      ],
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }
    }
  ]

};
</script>

<style scoped>
.rectangle {
  width: 750px;
  height: 350px;
  /* 调整灰色长方形的高度 */
  background-color: hwb(0 100% 0%);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  padding: 10px;
  position: relative;
}

.circle {
  background-color: #FFCDD2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 18px;
  margin: 5px;
  position: absolute;
}

.app-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
}

.card {
  width: 100%;
}

.el-row:not(:last-child) {
  margin-bottom: 20px;
}

.flashing span {
  animation: none;
  /* 移除文字的闪烁动画 */
}

.flashing {
  animation: blinking 1s infinite alternate;
}

.flashing span {
  animation: none;
  /* 移除文字的闪烁动画 */
}

@keyframes blinking {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.custom-tooltip {
  position: absolute;
  left: 580px;
  top: 250px;
  background-color: #fff;
  padding: 5px;
  border: 2px solid #ccc;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  margin-right: 8px;
  text-align: center;
  /* 将文字居中 */
  font-weight: bold;
  /* 将文字设为粗体 */
  border-radius: 5px;
  /* 添加圆角 */
}

/* 添加样式来调整查询框和文字的显示以及间隙 */
.query-type,
.query-input,
.query-button {
  margin-right: 10px;
  /* 调整查询框之间的间隙 */
}

/* 隐藏查询类型和查询内容的文字 */
.el-select__placeholder,
.el-input__placeholder {
  display: none;
}

.pagination {
  margin-top: 15px;
  text-align: center;
}

.table-container {
  height: 278px;
  /* 设置一个固定的高度，可以根据需要调整 */
  overflow-y: auto;
  /* 添加垂直滚动条，当表格数据超过容器高度时会显示滚动条 */
}</style>


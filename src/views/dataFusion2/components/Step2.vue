<template>
  <el-button type="success" plain @click="formulaVisible = true" style="margin-bottom: 10px;">模型解读</el-button>
  <el-dialog v-model="formulaVisible" title="多重产业链团体划分模型解读">
    <el-form>
      <el-form-item label="节点含义：" :label-width="formLabelWidth">
        <span>多重产业链上的企业</span>
      </el-form-item>
      <el-form-item label="网络层含义含义：" :label-width="formLabelWidth">
        <span>多重产业链上的企业组成的不同关系网络</span>
      </el-form-item>
      <el-form-item label="垂直边含义：" :label-width="formLabelWidth">
        <span>同一企业在不同关系网络中的映射</span>
      </el-form-item>
      <el-form-item label="不同颜色节点含义：" :label-width="formLabelWidth">
        <span>企业被划分到不同的企业协作团体</span>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div class="common-layout">
    <div id="main2" ref="chartContainer"
         style="width: 750px;height:400px;background-color: rgba(250,247,247,0.5)"></div>
    <div id="pieChart" ref="pieChart"
         style="width: 750px;height:400px;background-color: rgba(250,247,247,0.5)"></div>
  </div>
  <br>
  <div class="common-layout">
    <div class="container">
      <el-row>
          <el-form :inline="true" :model="singleCompanyForm" class="demo-form-inline">
            <el-form-item label="企业个体查询">
              <!--            <el-input v-model="singleCompanyForm.companyName" placeholder="请输入企业名称"/>-->
              <el-autocomplete
                  v-model="singleCompanyForm.companyName"
                  placeholder="请输入企业名称"
                  :fetch-suggestions="querySearch"
                  :trigger-on-focus="false"
                  clearable
                  class="inline-input w-50"
                  @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <!-- 查询按钮 -->
            <el-form-item>
              <el-button type="primary" @click="searchSingleCompany">查询</el-button>
            </el-form-item>
          </el-form>
      </el-row>
      <el-row>
        <el-table :data="currentTaskList2" style="width: 100%" class="table">
          <el-table-column fixed prop="name" label="企业名称" width="" align="center"/>
          <el-table-column prop="chain" label="所属产业链" width="" align="center"/>
          <el-table-column prop="category" label="所属企业团体" width="" align="center"/>
          <el-table-column prop="requirements" label="核心业务" width="" align="center"/>
          <el-table-column prop="field" label="企业性质" width="" align="center"/>
          <el-table-column prop="products" label="市场份额" width="" align="center"/>
          <el-table-column prop="numbers" label="子企业数量" width="" align="center"/>
        </el-table>
      </el-row>
    </div>
    <div class="container">
      <el-row>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="企业团体查询">
            <el-select v-model="formInline.region" placeholder="类别查询" @change="showGroupFeatures">
              <el-option label="团体1" value="团体1"/>
              <el-option label="团体2" value="团体2"/>
              <el-option label="团体3" value="团体3"/>
              <el-option label="团体4" value="团体4"/>
              <el-option label="团体5" value="团体5"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchTasks">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <el-table :data="currentTaskList" style="width: 100%" class="table">
          <el-table-column fixed prop="name" label="企业名称" width="" align="center"/>
          <el-table-column prop="chain" label="所属产业链" width="" align="center"/>
          <el-table-column prop="requirements" label="核心业务" width="" align="center"/>
          <el-table-column prop="field" label="企业性质" width="" align="center"/>
          <el-table-column prop="products" label="市场份额" width="" align="center"/>
          <el-table-column prop="numbers" label="子企业数量" width="" align="center"/>
          <el-table-column prop="frequency" label="团体合作次数" width="" align="center"/>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="tableData.filterData.length"
            @current-change="handleCurrentChange"
            class="mt-4"
        />
      </el-row>
<!--      <el-row>-->
<!--        <el-col v-if="selectedGroup" span="6">-->
<!--          <div class="feature-item">-->
<!--            <p>{{ selectedGroup }}特征</p>-->
<!--            <p>{{ selectedGroupFeature }}</p>-->
<!--          </div>-->
<!--        </el-col>-->
<!--      </el-row>-->
    </div>
  </div>
</template>


<script setup>
import {ref, reactive, computed, watch, onMounted, nextTick} from 'vue'
import * as echarts from 'echarts'
import axios from "axios";  //引入echarts
const formulaVisible = ref(false)
const singleCompanyForm = reactive({
  companyName: ""
})
const companyName = ref([
  { value: '宁德时代' },
  { value: '中国铝业'},
  { value: '万山特钢股份'},
  { value: '南钢股份'},
  { value: '中煤能源集团'},
  { value: '中国石化化工'},
  { value: '中国中材集团'},
  { value: '爱康科技'},{ value: '中国海螺集团'},
  { value: '瓜子二手车'},{ value: '顺丰速运'},
  { value: '阳光人力资源'},{ value: '博世集团'},
  { value: '比亚迪'},{ value: '宝钢再生资源'},
  { value: '新型建材集团'},{ value: '京东数科'},
  { value: '阿里巴巴集团'},{ value: '爱驰汽车科技'},
  { value: '苏宁易购'}
])

const selectedGroup = ref(null)
const selectedGroupFeature = ref(null);
const groupFeatures = [
  {name: "团体1", feature: "原材料供应商，均位于产业链上游"},
  {name: "团体2", feature: "环保公司，主要涉及二手市场以及材料回收处理"},
  {name: "团体3", feature: "提供人力物流资源"},
  {name: "团体4", feature: "产业链核心环节，产品制造以及整合"},
  {name: "团体5", feature: "IT企业，致力于信息化处理以及智能产品"}
]
const chartContainer = ref(null);
const pieChart = ref(null);
let myChart = null;
const formInline = reactive({
  user: '',
  region: '',
})

let tableData = reactive({
  filterData: []
})
let tableData2 = reactive({
  filterData: []
})
const pageSize = 3




//当前页
let currentPage = ref(1);
let currentTaskList = computed(() => {
  return tableData.filterData.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
})
let currentTaskList2 = computed(() => {
  return tableData2.filterData.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
})
const handleCurrentChange = (val) => {
  currentPage.value = val
}
const querySearch = (queryString, cb) => {
  const results = queryString
      ? companyName.value.filter(createFilter(queryString))
      : companyName.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString) => {
  return (restaurant) => {
    return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
const handleSelect = (item) => {
  console.log(item)
}
function showGroupFeatures() {
  selectedGroup.value = formInline.region;
  selectedGroupFeature.value = groupFeatures.find(group => group.name === formInline.region)?.feature || '';
}

function searchSingleCompany() {
  const name = singleCompanyForm.companyName;
  console.log(name)
  axios.get('/src/assets/dataFusion/step2.json').then(response => {
    let data = response.data.nodes;
    tableData2.filterData = data.filter(item => item.name == name);
    //console.log(tableData.filterData)
  })
  currentPage.value = 1;
}

function searchTasks() {
  const category = formInline.region;
  axios.get('/src/assets/dataFusion/step2.json').then(response => {
    let data = response.data.nodes;
    tableData.filterData = data.filter(item => item.category == category);
  })
  currentPage.value = 1;
}
const groupData = [
  { name: '团体1', info: '宁德时代，中国铝业，万山特钢股份，南钢股份，中煤能源集团', feature: "原材料供应商，均位于产业链上游", value: 5 },
  { name: '团体2', info: '爱康科技，瓜子二手车，宝钢再生资源，新型建材集团', feature: "环保公司，主要涉及二手市场以及材料回收处理", value: 4 },
  { name: '团体3', info: '中国海螺集团，顺丰速运，阳光人力资源，博世集团，爱驰汽车科技', feature: "提供人力物流资源", value: 4 },
  { name: '团体4', info: '中国石化化工，中国中材集团，比亚迪，苏宁易购', feature: "产业链核心环节，产品制造以及整合", value: 5 },
  { name: '团体5', info: '京东数科，阿里巴巴集团', feature: "IT企业，致力于信息化处理以及智能产品", value: 2 },
];
const pieData = [];
for (const group of groupData) {
  const dataItem = {
    value: group.value,
    name: group.name,
  };
  pieData.push(dataItem);
}

const createPieChart = () => {
      const chartInstance = echarts.init(pieChart.value);

      const chartOptions = {
        title: {
          text: '企业协作团体总览图',
          textAlign: 'center', // 设置标题文本水平居中
          left: '50%', // 将标题水平居中
          bottom: 10, // 距离底部的距离
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{b} :<br/>企业数量： {c} ({d}%)'
          formatter: function(params) {
            // 查找对应团体的企业信息
            const groupInfo = groupData.find(group => group.name === params.name);
            if (groupInfo) {
              return `${params.name}企业数量: ${params.value} (${params.percent}%)<br>企业名单：${groupInfo.info}<br>团体特征：${groupInfo.feature}`;
            } else {
              return `${params.name}: ${params.value} (${params.percent}%)`;
            }
          },
        },
        legend: {
          textStyle:
              {
                color: 'black',
                fontSize: 10,
              },
          left:'center',
        },
        series: [
          {
            type: 'pie',
            left: 'center',
            bottom: 0,
            radius: '70%',
            roseType: 'area',
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            focusNodeAdjacency: true,
            itemStyle: {
              borderWidth: 1,
            },
          },
        ],

      };

      chartInstance.setOption(chartOptions);
    }
;
onMounted(async () => {
  createPieChart();

  const chartDom = chartContainer.value;
  const myChart = echarts.init(chartDom);
  const response = await axios.get('/src/assets/dataFusion/company.json');
  const graph = response.data;


  const containerWidth = chartContainer.value.clientWidth;
  const containerHeight = chartContainer.value.clientHeight;

//计算polygon的相对坐标点
  function calculatePoints(points) {
    const widthRatio = containerWidth / 800; // 宽度比例
    const heightRatio = containerHeight / 500; // 高度比例
    return points.map(point => [point[0] * widthRatio, point[1] * heightRatio]);
  }

// 计算节点的相对位置
  graph.nodes.forEach(node => {
    node.x = node.x / 800 * containerWidth;
    node.y = node.y / 500 * containerHeight;
  });

//绘制ECharts关系图
  myChart.setOption({
    graphic: [
      {
        type: 'group',
        position: [100, 70], // 左上角位置
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[0, -10], [650, -10], [600, 110], [-50, 110]])  // 左上、右上、右下、左下
            },
            style: {
              fill: '#eee',
              stroke: 'red',
              lineWidth: 3,
              opacity: 0.3,
              shadowBlur: 10,
              shadowColor: 'gray',
              shadowOffsetX: 5,
              shadowOffsetY: 5
            }
          },
          {
            type: 'text',
            position: [-50, 70], // 相对于 group 左上角位置的偏移量
            style: {
              text: '合作关系', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      },

      {
        type: 'group',
        position: [100, 190], // 左上角位置，根据需要进行调整
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[-10, -40], [650, -40], [615, 70], [-50, 70]])  // 左上、右上、右下、左下
            },
            style: {
              fill: '#eee',
              stroke: 'black',
              lineWidth: 3,
              opacity: 0.3,
            }
          },
          {
            type: 'text',
            position: [-50, 40], // 相对于 group 左上角位置的偏移量
            style: {
              text: '供应关系', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      },

      {
        type: 'group',
        position: [50, 310], // 左上角位置
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[0, 30], [660, 30], [700, -80], [45, -80]])  // 左下、右下、右上、左上
            },
            style: {
              fill: '#eee',
              stroke: 'blue',
              lineWidth: 3,
              opacity: 0.3,
              shadowBlur: 10,
              shadowColor: 'gray',
              shadowOffsetX: 5,
              shadowOffsetY: 5
            }
          },
          {
            type: 'text',
            position: [15, 5], // 相对于 group 左上角位置的偏移量
            style: {
              text: '竞争关系', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      }
    ],

    title: {
      text: '多重产业链企业团体划分模型',
      // subtext: '这是一个副标题',
      top: 'bottom',
      left: 'center'
    },


    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function (params) {
        // console.log(params)
        if (params.dataType === 'node') {

          var id = params.data.id;
          var name = params.data.name;
          var requirements = params.data.requirements;
          var products = params.data.products;
          var field = params.data.field;
          var chain = params.data.chain;
          var category = params.data.category;
          return "id: " + id + '<br/>' + "企业名称：" + name + '<br/>' + "核心业务：" + requirements + '<br/>' + "企业性质：" + field + '<br/>' + "市场份额：" + products+ '<br/>' + "企业所属产业链：" + chain + '<br/>' + "企业所属团体：" + category;
        }

      }
    },
    legend: [
      {
        data: graph.categories.map(function (a) {
          return a.name;
        })
      }
    ],
    animationDuration: 1500, //初始动画的时长
    animationEasingUpdate: 'quinticInOut', //节点和边的动画方式（缓动函数）
    series: [{
      type: 'graph',
      layout: 'none',
      data: graph.nodes,
      links: graph.links1,
      categories: graph.categories,
      roam: true,     //开启鼠标缩放和平移漫游

      label: {
        show: true,     //是否显示节点标签
        // position: 'right',  //节点标签的位置
        formatter: '{b}'  //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
      },

      emphasis: {
        focus: 'adjacency', //当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点，'adjacency' 表示只突出显示节点以及节点的边
        lineStyle: {    //边的设置
          width: 10,
          type: "dotted",
          // shadowBlur:0.5,
          opacity: 0.7,
        }
      },
    }]


  });

  myChart.on('click', params => {
    // if (params.componentType === 'polygon') {
    //     const nodes = myChart.getOption().series[0].data;
    //     const nodesInPolygon = nodes.filter(node => {
    //         const point = myChart.convertToPixel('grid', [node.x, node.y]);
    //         return myChart.graphic.isPointInGraphic(params.componentIndex, point);
    //     });
    //     const selectedNodes = nodesInPolygon.map(node => node.name);
    //     myChart.dispatchAction({
    //         type: 'highlight',
    //         seriesIndex: 0,
    //         name: selectedNodes
    //     });
    // }
    if (params.dataType == "node") {
      taskData.name = params.data.name;
      taskData.requirements = params.data.requirements;
      taskData.products = params.data.products;
      taskData.deadline = params.data.deadline;
      taskData.lastTime = params.data.lastTime;
      taskData.numbers = params.data.numbers;
      taskData.lists = params.data.lists;
      //console.log(params.data.name)
    }
  });

  myChart.on('mousedown', params => {
    if (params.event.target.tagName === 'CANVAS') {
      const startPoint = myChart.convertFromPixel('grid', [params.event.offsetX, params.event.offsetY]);
      let rect = null;

      const mousemoveHandler = e => {
        const curPoint = myChart.convertFromPixel('grid', [e.offsetX, e.offsetY]);
        const minX = Math.min(startPoint[0], curPoint[0]);
        const maxX = Math.max(startPoint[0], curPoint[0]);
        const minY = Math.min(startPoint[1], curPoint[1]);
        const maxY = Math.max(startPoint[1], curPoint[1]);

        if (!rect) {
          rect = myChart.graphic.add({
            type: 'rect',
            shape: {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY
            },
            style: {
              fill: 'rgba(255, 255, 255, 0.3)',
              stroke: '#666',
              lineWidth: 2
            }
          });
        } else {
          rect.setShape({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
          });
        }

        const nodes = myChart.getOption().series[0].data;
        const nodesInRect = nodes.filter(node => {
          const point = myChart.convertToPixel('grid', [node.x, node.y]);
          return myChart.graphic.isPointInGraphic(rect, point);
        });
        const selectedNodes = nodesInRect.map(node => node.name);
        myChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name: selectedNodes
        });
      };

      const mouseupHandler = () => {
        myChart.off('mousemove', mousemoveHandler);
        myChart.off('mouseup', mouseupHandler);
        if (rect) {
          myChart.graphic.remove(rect);
        }
      };

      myChart.on('mousemove', mousemoveHandler);
      myChart.on('mouseup', mouseupHandler);
    }
  });
});


</script>

<style>


.feature-item {
  border: 1px solid #ccc; /* 特征展示部分的边框样式 */
  padding: 10px; /* 特征展示部分的内边距 */
  background-color: #f5f5f5; /* 特征展示部分的背景色 */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* 特征展示部分的阴影效果 */
}

.demo-form-inline {
  margin-bottom: 20px; /* 下拉框和查询按钮之间的外边距 */
}

.table {
  margin-bottom: 20px; /* 表格下方的外边距 */
}

.common-layout {
  display: flex; /* 使用 Flexbox 布局 */
  //flex-wrap: wrap;
}

.common-layout > div {
  flex: 1; /* 平均分配容器的宽度 */
  margin: 10px; /* 可选的外边距，用于控制 <div> 之间的间距 */
  justify-content: space-between;
}

.container {
  //width: 750px;
  flex: 1; /* 自动平均分配父容器的宽度 */
  border: 1px solid #bfbfbf; /* 添加1像素黑色边框 */
  padding: 20px; /* 可选：添加内边距，使内容区域不会贴紧边框 */
}

.el-table th, .el-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 可以显示省略号 (...) 来指示截断的文本 */
}

</style>
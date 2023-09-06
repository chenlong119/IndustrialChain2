<template>
  <el-button type="success" plain @click="formulaVisible = true" style="margin-bottom: 10px;">模型解读</el-button>
  <el-dialog v-model="formulaVisible" title="多重产业链企业分布模型解读">
    <el-form label-position="left">
      <el-form-item label="节点含义：" :label-width="'150px'">
        <span>多重产业链上的企业</span>
      </el-form-item>
      <el-form-item label="网络层含义含义：" :label-width="'150px'">
        <span>多重产业链上的企业组成的不同关系网络</span>
      </el-form-item>
      <el-form-item label="垂直边含义：" :label-width="'150px'">
        <span>同一企业在不同关系网络中的映射</span>
      </el-form-item>
      <el-form-item label="不同颜色的节点含义：" :label-width="'180px'">
        <span>企业被划分到不同的企业协作团体</span>
      </el-form-item>
      <el-form-item label="不同颜色的水平边含义：" :label-width="'180px'">
        <span>从上往下依次代表着不同的关联关系：合作关系，供应关系，竞争关系</span>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div class="common-layout">
    <div id="main2" ref="chartContainer"
         style="width: 1000px;height:400px;margin: 0 auto;background-color: rgba(250,247,247,0.5)"></div>
  </div>
  <br>
  <div class="container">
    <div>
      <span style="font-size: 14px; font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin-right: 10px;">目标关系网络：</span>
      <el-select v-model="selectedRelation" class="m-2" placeholder="请选择关系网络" size="large" filterable >
        <el-option v-for="item in relationData" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <span style="font-size: 14px; font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; margin-right: 10px;">目标关联企业：</span>
      <el-select v-model="selectedNode" class="m-2" placeholder="请选择企业" size="large" filterable @change="handleSelectChange">
        <el-option v-for="item in nodeData" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <el-main>
      <div style="margin-bottom: 15px"><span style="font-size: 14px">耦合关系展现：</span></div>
      <el-table :data="relatedNodesWithout.value" style="width: 1050px;height:260px" highlight-current-row
                :header-cell-style="{height: '60px',}" :row-style="{ textAlign: 'center', height: '54px', }" class="my-table">
        <el-table-column fixed type="index" :index="indexMethod" label="序号" width="100" />
        <el-table-column prop="id" label="企业id" width="100" />
        <el-table-column prop="name" label="企业名称" width="150" />
        <el-table-column prop="category" label="所属团体" width="150" />
        <el-table-column prop="relation1" label="供应强度" width="100" />
        <el-table-column prop="relation2" label="合作强度" width="100" />
        <el-table-column prop="relation3" label="竞争强度" width="100" />
        <el-table-column prop="analysis" label="关联分析" width="150">
        </el-table-column>

        <el-table-column prop="infomation" label="企业信息" width="120">
          <template #default="scope">
            <el-button link type="primary" @click="handleInfo(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model="currentPage" :page-size="pageSize" :pager-count="11" layout="prev, pager, next"
                     :total="relatedNodesWithout.length" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange" />

      <el-dialog v-model="infoDialogVisible" title="企业详情" align-center>
        <el-form :model="info">
          <el-form-item label="" :label-width="formLabelWidth">
            企业id：{{ info.id }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            企业名称：{{ info.name }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            所属产业链：{{ info.chain }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            核心业务：{{ info.requirements }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            企业性质：{{ info.field }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            企业市场份额：{{ info.products }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            子企业数量：{{ info.numbers }}
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            团队合作次数：{{ info.frequency }}
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-main>
  </div>
</template>


<script setup>
import {ref, reactive, computed, watch, onMounted, nextTick} from 'vue'
import * as echarts from 'echarts'
import axios from "axios";  //引入echarts
import jsonData from "../../../assets/dataFusion/step3.json"
//定义组件的自定义事件
//const graph = ref(null);
const formulaVisible = ref(false)
const chartContainer = ref(null);
let myChart;
// 读取json数据并将其存储到nodeData数组和linkData数组中
const nodeData = reactive([]);
const relationData = reactive([]);
const linkData = reactive([]);
const emits = defineEmits(['onNodeSelected']);
for (const node of jsonData.nodes) {
  nodeData.push({
    id: node.id,
    name: node.name,
    chain: node.chain,
    requirements: node.requirements,
    products: node.products,
    field: node.field,
    numbers: node.numbers,
    lists: node.lists,
    category: node.category,
    frequency: node.frequency,
    x: node.x,
    y: node.y
  });
}
relationData.push(
    {
      id:1,
      name:"供应关系"
    },
    {
      id:2,
      name:"合作关系"
    },
    {
      id:3,
      name:"竞争关系"
    }
)
for (const link of jsonData.links) {
  linkData.push({
    source: link.source,
    target: link.target,
    relation1: link.label.formatter1,
    relation2: link.label.formatter2,
    relation3: link.label.formatter3,
    analysis: link.label.analysis
  });
}
//分页展示，每页展示8个企业
const pageSize = 5
//当前页
let currentPage = ref(1);
// 计算与所选节点相关的所有节点信息和连接信息
const selectedNode = ref(""); //用户选择的节点
const selectedRelation = ref("");
const relatedNodesWithout = reactive([]);
const relatedNodeIds = new Set();
const handleCurrentChange = (val) => {
  currentPage.value = val
}
function handleSizeChange(val) {
  // 改变每页显示的条数
  this.PageSize = val
  // 注意：在改变每页显示的条数时，要将页码显示到第一页
  this.state.currentPage = 1
}

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
    node.relation1 = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation1)
        .join(",");
    node.relation2 = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation2)
        .join(",");
    node.relation3 = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.relation3)
        .join(",");
    node.analysis = relatedLinks
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => link.analysis)
        .join(",");
    node.index = index + 1;
  });
  relatedNodesWithout.value = tempRelatedNodes1;
  //console.log(relatedNodesWithout.value);

}, { deep: true });
//"查看详情"功能
const infoDialogVisible = ref(false)
const formLabelWidth = '140px'
let info = ref({
  id: '',
  name: '',
  chain:'',
  index: -1,
  requirements: '',
  products:'',
  field:'',
  numbers:'',
  lists:'',
  category: '',
  frequency:'',
  relation1: [],
  relation2: [],
  relation3: [],
  analysis: [],
  x: -1,
  y: -1,
  deleted: false
});
const handleInfo = (row) => {
  infoDialogVisible.value = true
  info.value = row
}

onMounted(async () => {
  // const chartDom = document.getElementById('main2');
  // myChart = echarts.init(chartDom);
  const chartDom = chartContainer.value;
  myChart = echarts.init(chartDom);
  console.log(myChart)
  const response = await axios.get('/src/assets/dataFusion/company.json');
  const graph = response.data;
  //console.log(graph)
  // const containerWidth = document.getElementById('main2').clientWidth;// 图形容器的宽度
  // const containerHeight = document.getElementById('main2').clientHeight;// 图形容器的高度

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
      text: '多重产业链企业关联分析模型',
      // subtext: '这是一个副标题',
      top: 'bottom',
      left: 'center'
    },


    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function (params) {
        if (params.dataType === 'node') {
          var id = params.data.id;
          var name = params.data.name;
          var requirements = params.data.requirements;
          var products = params.data.products;
          var field = params.data.field;
          return "id: " + id + '<br/>' + "企业名称：" + name + '<br/>' + "核心业务：" + requirements + '<br/>' + "企业性质：" + field + '<br/>' + "市场份额：" + products;
        } else if (params.dataType === 'edge') {
          var source = params.data.source;
          var target = params.data.target;
          var label = params.data.label.formatter;
          return "企业1 id: " + source + '<br/>' + "企业2 id：" + target + '<br/>' + "关联强度：" + label;
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
      links: graph.links,
      categories: graph.categories,
      roam: true,     //开启鼠标缩放和平移漫游

      label: {
        show: true,     //是否显示节点标签
        // position: 'right',  //节点标签的位置
        formatter: '{b}'  //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
      },
      //edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [4, 6],
      edgeLabel: {
        show: true,
        // formatter: function (x) {
        //   return x.links.label.type;
        // },
        fontSize: 12,
        color: '#000000'
      },
      lineStyle: {
        // color: function (x) {
        //   console.log(x.links.label.type); // 添加调试输出
        //   return x.links.label.type === '1' ? 'green' : 'blue'; // type为1时线为绿色，否则为蓝色
        // },
        curveness: 0.2,
        width: 2,
        type: 'solid',
        arrow: {
          show: true,
          size: 6,
          offset: 0,
          symbol: 'arrow',
          symbolSize: [6, 12]
        }
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
const handleSelectChange = () => {
  let selectedNodeIndices = selectedNode.value;
  if(selectedRelation.value===2){
    selectedNodeIndices = Number(selectedNode.value) + 20;
  }
  if(selectedRelation.value===3){
    selectedNodeIndices = Number(selectedNode.value) + 40;
  }

  //selectedNodeIndices = [selectedNode.value, Number(selectedNode.value) + 20, Number(selectedNode.value) + 40];
  // 模拟鼠标悬浮在 ECharts 图表中特定节点上
  myChart.dispatchAction({
    type: 'highlight', // 触发高亮效果
    seriesIndex: 0,    // 替换成您的图表中的系列索引
    dataIndex: selectedNodeIndices, // 替换成您的数据中节点的索引或 ID
  });
};

</script>

<style>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  align-content: center;
  border: 1px solid #bfbfbf; /* 添加1像素黑色边框 */
  padding: 20px; /* 可选：添加内边距，使内容区域不会贴紧边框 */
}
.flex-container {
  display: flex;
  align-items: center;
}

.header-text {
  margin-right: 10px;
  font-weight: bold
}
.my-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>
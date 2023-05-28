<script setup>

import {onMounted} from "vue";
import * as echarts from 'echarts/core';
import {reactive} from 'vue'
import axios from 'axios';

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
  filterData:[]
})


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

function handleCurrentChange(val) {
  // 改变默认的页数
  this.state.currentPage = val
}



let myChart = null;
onMounted(async () => {
  const chartDom = document.getElementById('main');
  myChart = echarts.init(chartDom);
  const response = await axios.get('/src/assets/dataFusion/task.json');
  const graph = response.data;
  console.log(graph)
  const containerWidth = document.getElementById('main').clientWidth;// 图形容器的宽度
  const containerHeight = document.getElementById('main').clientHeight;// 图形容器的高度

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

    title: {
      // text: '多重产业链网络图',
      // subtext: '这是一个副标题',
      top: 'bottom',
      left: 'right'
    },

    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function (params) {
        // console.log(params)
        if (params.dataType === 'node') {
          // var id = params.data.id;
          // var name = params.name;
          // var filed = params.data.filed;
          // var category = params.data.category;
          // var network = params.data.network;
          // return "id: " + id + '<br/>' + "企业：" + name + '<br/>' + "所处领域：" + filed + '<br/>' + '所处产业链: ' + category + '<br/>' + '所处网络: ' + network;
          var id = params.data.id;
          var name = params.data.name;
          return   "任务：" + name;
        }
        // else if (params.dataType === 'edge') {
        //     var source = params.data.source;
        //     var target = params.data.target;
        //     var label = params.data.label.formatter;
        //     return "源节点: " + source + '<br/>' + "目标节点：" + target + '<br/>' + "连接关系：" + label;
        // }
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
      // links: graph.links,
      categories: graph.categories,
      //network: graph.network,
      roam: true,     //开启鼠标缩放和平移漫游

      label: {
        show: false,     //是否显示节点标签
        // position: 'right',  //节点标签的位置
        formatter: '{b}'  //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
      },
      // lineStyle: {
      //     normal: {
      //         color: 'source',    //边的颜色是由源节点决定的
      //         curveness: 0.4  //边的曲度，支持从 0 到 1 的值，值越大曲度越大。
      //     }
      // },
      emphasis: {
        focus: 'adjacency', //当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点，'adjacency' 表示只突出显示节点以及节点的边
        lineStyle: {    //边的设置
          width: 10,
          type: "dotted",
          // shadowBlur:0.5,
          opacity: 0.7
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

function searchTasks() {
  const category = formInline.region;
  axios.get('/src/assets/dataFusion/task.json').then(response => {
    let data = response.data.nodes;
    tableData.filterData = data.filter(item => item.category == category);
    console.log(tableData.filterData)
  })


}

</script>

<template>
  <div>
  <div class="topicText">
    <h2>数据融合</h2>
  </div>
  <el-tabs style="margin-left:20px">
    <el-tab-pane label="任务划分">
      <br/>

      <el-row style="margin-bottom:20px;">
        <el-col :span="12" style="margin-left:40px">
          <div id="main" style="width: 400px;height:400px;background-color: white"></div>
        </el-col>

        <el-col :span="10">
          <el-card class="box-card" style="width: 400px;height:400px">
            <template #header>
              <div class="card-header">
                <span>任务简介</span>
              </div>
            </template>
            <div class="text item">
              {{ '任务名称: ' + taskData.name }}
            </div>
            <div class="text item">
              {{ '资源需求: ' + taskData.requirements }}
            </div>
            <div class="text item">
              {{ '预期产量: ' + taskData.products }}
            </div>
            <div class="text item">
              {{ '截止时间: ' + taskData.deadline }}
            </div>
            <div class="text item">
              {{ '预估耗时: ' + taskData.lastTime }}
            </div>
            <div class="text item">
              {{ '参与企业数量: ' + taskData.numbers }}
            </div>
            <div class="text item">
              {{ '参与企业名单: ' + taskData.lists }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>

    <el-tab-pane label="任务查询">
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
          <el-table :data="tableData.filterData" style="width: 100%" class="table">
            <el-table-column fixed prop="name" label="任务" width="150px"/>
            <el-table-column prop="requirements" label="需要资源数量" width="150px"/>
            <el-table-column prop="products" label="预估产量" width="150px"/>
            <el-table-column prop="deadline" label="截止时间" width="150px"/>
            <el-table-column prop="lastTime" label="预估耗时" width="150px"/>
            <el-table-column prop="numbers" label="参与企业个数" width="150px"/>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="state.currentPage"
                       :page-sizes="state.pageSizes"
                       :page-size="state.PageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="state.totalCount">
        </el-pagination>
      </el-row>
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

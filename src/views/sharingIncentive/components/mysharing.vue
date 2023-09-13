<template>
  <div>
    <el-main tyle="width: 100%;">
      <div style="margin: 10px 0">
        <el-input style="width: 200px" placeholder="请输入搜索的文件名称" suffix-icon="el-icon-search" class="ml-5" v-model="Station_Number"></el-input>
        <el-date-picker
            class="ml-5"
            v-model="time"
            type="date"
            placeholder="选择日期"
        >
        </el-date-picker>
        <el-button icon="el-icon-search" style="position: relative" type="primary" @click="load">搜索</el-button>
        <el-button  icon="el-icon-refresh" type="warning" style="position: relative" @click="reset">重置</el-button>
      </div>

      <div style="margin:0">
        <el-button class="ml-5" type="primary" @click="showPopup">新增发布<i class="el-icon-circle-plus-outline"></i> </el-button>
        <!-- <el-button type="info" icon="el-icon-search" @click="showPopup">查看今日推荐</el-button> -->
        <el-popconfirm
            class="ml-5"
            title="确定批量删除这些数据吗？"
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            @confirm="delBatch"
        >
          <el-button type="danger" slot="reference" >批量删除 <i class="el-icon-remove-outline"></i> </el-button>
        </el-popconfirm>
        <!-- <el-upload action="http://localhost:9090/evaporation-merge/import"
                  :show-file-list="false"
                  accept=".xlsx"
                  :on-success="importSuccess"
                  style="display: inline-block">
          <el-button type="primary" class="ml-5">发布 <i class="el-icon-bottom"></i> </el-button>
        </el-upload>

        <el-button type="primary"  @click="exp">接收<i class="el-icon-top"></i> </el-button> -->
      </div>
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
          <el-table-column label="查看数据" align="center"  class-name="small-padding fixed-width">
            <el-button link type="primary" icon="Edit" @click="showDataDetails" ></el-button>
            <!-- <template #default="scope">
                <el-tooltip content="修改" placement="top" v-if="scope.row.userId !== 1">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top" v-if="scope.row.userId !== 1">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']"></el-button>
                </el-tooltip>
            </template> -->
          </el-table-column>
        </el-table> 

      <!-- <el-dialog title="数据上传情况" v-model="isDatadetailVisible" @close="hideDataDetails" class="custom-dialog">
        <div>
          <h4>已上传的数据：</h4>
          <ul>
            <li v-for="(dataItem, index) in dataList" :key="index">
              {{ dataItem.dataName }} - 上传企业: {{ dataItem.uploadedCompany }}
              <el-button type="text" icon="el-icon-download" @click="downloadData(dataItem)">下载</el-button>
            </li>
          </ul>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hideDataDetails">关闭</el-button>
        </span>
      </el-dialog> -->
      <el-dialog title="数据上传情况" v-model="isDatadetailVisible" @close="hideDataDetails" class="custom-dialog">
      <div>
        <h4>已上传的数据：</h4>
        <ul>
          <li v-for="(dataItem, index) in dataList" :key="index" class="data-item">
            <div class="data-name">{{ dataItem.dataName }}</div>
            <div class="uploaded-company">上传企业: {{ dataItem.uploadedCompany }}</div>
            <el-button type="text" icon="el-icon-download" @click="downloadData(dataItem)">下载</el-button>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDataDetails">关闭</el-button>
      </span>
    </el-dialog>
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
      <div style="padding: 10px 0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[ 5, 10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
      <el-dialog title="新添发布任务" width="50%" v-model="isPopupVisible"  @close="hidePopup">
        <el-form label-width="110px" size="small">
          <el-form-item label="数据需求">
            <el-input v-model="form.taskName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="数据规模">
            <el-input v-model="form.taskReleaser" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属产业链">
            <el-input v-model="form.fileSize" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="共享积分">
            <el-input v-model="form.profit" autocomplete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="上传人">
            <el-input v-model="form.smallEvaporationCapacity" autocomplete="off"></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePopup">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>

      <el-row type="flex" justify="space-around">
          <el-col :span="24">
            <el-card shadow="hover">
              <div id="echarts-line" ref="echarts_line"></div>
            </el-card>
          </el-col>
        </el-row>
      <el-row class="second" type="flex" justify="space_around">
        <el-col :span="8">
          <el-card shadow="hover">
            <div id="echarts-access" ref="echarts_access"></div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card shadow="hover">
            <div id="echarts-scatter" ref="echarts_scatter"></div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>
<script setup>
import  * as echarts from 'echarts'
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
let form = ref({
  taskName: '',
  taskReleaser: '',
  fileSize: '',
  profit: '',
    chain: '',
    network: [],
    relation: [],
    x: -1,
    y: -1,
    deleted: false
});
const dataList= reactive([  // 写死的数据示例
        { dataName: '比亚迪4月电池销量', uploadedCompany: '比亚迪' },
        { dataName: '南孚电池4月电池销量', uploadedCompany: '南孚电池' },
        { dataName: '超威电池4月电池销量', uploadedCompany: '超威电池' },
        // 添加更多数据项
      ]);
const tablename = ref(null);
const tableData = ref([]);
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
const echarts_line = ref(null);
const echarts_access = ref(null);
const echarts_scatter = ref(null);
const tableDataAdd=ref([
  { 
    taskName:'四月电池销量',
    taskReleaser:'小鸭家电',
    detail:"一份23年四月份一份某电池供应商的销量数据",
    profit:10,
    difficulty:'简单',
    probability:"95%",
    recomendation:'100%'
    },
  { 
    taskName:'五月A型芯片计划产量',
    taskReleaser:'比亚迪',
    detail:"一份23年五月份一份某公司A型芯片计划产量",
    profit:20,
    difficulty:"一般",
    probability:"80%",
    recomendation:"80%"
    },
  { 
    taskName:'21年人力平均工资',
    taskReleaser:'富士康劳务',
    detail:"一份21年的整年的公司整体综合劳务开支",
    profit:60,
    difficulty:"一般",
    probability:"70%",
    recomendation:"76.3%"
    },
  { 
    taskName:'618家电类销售综合数据',
    taskReleaser:'小鸭家电',
    detail:"一份23年618京东的家电类综合销售数据（可以提供某种类或者多种类，按照数据质量给出收益）",
    profit:"10~100",
    difficulty:"困难",
    probability:"50%",
    recomendation:"64.2%"
    },
])
const dialogWidth = ref('90%'); // Set the width as a string (e.g., '500px', '50%')
const dialogHeight = ref('500vh');


  onMounted(() => {

  createEchartsline1();
  createEchartsAccess1();
  createEchartsscater1();
  load();
  });

const isDatadetailVisible = ref(null);
const showDataDetails = () =>{
  isDatadetailVisible.value = true;
    };
  const hideDataDetails = () => {
    isDatadetailVisible.value = false;
  };
  function downloadData(dataItem) {
      // 处理下载数据的逻辑
      console.log('下载数据:', dataItem.dataName);
      ElMessage.success('下载成功！');
    };
  function delBatch(){
    //批量删除
    let ids=this.multipleSelection.map(v =>v.id)   //[{} ,{} ,{}] =>[1,2,3]
    console.log(ids)
    this.request.post("/evaporation-merge/del/batch",ids).then(res=>{
      if(res){
        this.$message.success("批量删除成功!")
        this.load()
      }else{
        this.$message.error("批量删除失败!")
      }
    })
  };
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
  function save(){  //保存
    // this.request.post("/evaporation-merge",this.form).then(res=>{
    //   if(res){
    //     this.$message.success("保存成功!")
    //     this.dialogFormVisible=false
    //     this.load()
    //   }else{
    //     this.$message.error("保存失败!")
    //   }
    // })
    ElMessage.error('发布需求积分超出当前积分，发布失败！');
  };
  function l(Station_Number){  //删除

    console.log(Station_Number)
    this.request.delete("/evaporation-merge/"+Station_Number).then(res=>{
      if(res){
        this.$message.success("删除成功!")
        this.dialogFormVisible=false
        this.load()
      }else{
        this.$message.error("删除失败!")
      }
    })
  };
  function exp(){  //导出
    console.log(this.tableData)
    var year = this.tableData[0]['year']
    var num = this.pageSize
    this.request.get("/evaporation-merge/export",{params:{year:year,Num:num}}).then(res=>{
      // 导出成功后显示消息提示框
      Message.success({
        message: '导出 Excel 数据成功！，请到D盘根目录查看',
        showClose: true,  // 是否显示关闭按钮
        duration: 3000     // 持续时间（毫秒）
      });
    }).catch(error => {
      // 导出失败后显示错误提示框
      Message.error({
        message: '导出 Excel 数据失败，请重试！',
        showClose: true,  // 是否显示关闭按钮
        duration: 3000     // 持续时间（毫秒）
      });
    });
  };
  function importSuccess(){
    this.$message.success("导入成功")
    this.load()
  };
  function reset(){
    // const axios = require('axios');  //调用axios获取api数据
    // //var url = "https://api.epmap.org/api/v1/air/station?pubtime=2022-8-4&station_code=1409A";//接口后台允许跨域了,否则获取不到数据
    // var url="https://api.epmap.org/api/v1/air/station_list"
    // axios.get(url
    //     ,{
    //   headers:{
    //      'Authorization':'APPCODE 6918864e8f774be196a00e406e987db7',
    //   }
    // }
    // ).then((response) => {
    //       console.log(response,response.data.result);
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    this.time=""
    this.Station_Number=""
    this.load()
  };
  function handleSizeChange(pageSize) {    //页面最大条数
    console.log(pageSize)
    this.pageSize = pageSize
    this.load()
  };
  function handleCurrentChange(pageNum) {   //第几页
    console.log(pageNum)
    this.pageNum = pageNum
    this.load()
  };
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

  function createEchartsscater1(){
        const myChart = echarts.init(echarts_scatter.value);
        const option = {
          title: {
            text: '近6个月收益变化表',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {          
            orient: 'vertical',
            // bottom: '2%',
            // padding: 1
            },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['三月', '四月', '五月', '六月', '七月', '八月', '九月']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '数据请求支出',
              type: 'bar',
              stack: 'inout',
              emphasis: {
                focus: 'series'
              },
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '数据提供获得',
              type: 'bar',
              stack: 'inout',
              emphasis: {
                focus: 'series'
              },
              data: [220, 182, 191, 234, 290, 330, 310]
            },
  
            {
              name: '总计收入',
              type: 'bar',
              data: [862, 1018, 964, 1026, 1679, 1600, 1570],
              emphasis: {
                focus: 'series'
              },
              markLine: {
                lineStyle: {
                  type: 'dashed'
                },
                data: [[{ type: 'min' }, { type: 'max' }]]
              }
            },
            {
              name: '上游供应商',
              type: 'bar',
              barWidth: 5,
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [620, 732, 701, 734, 1090, 1130, 1120]
            },
            {
              name: '人力资源',
              type: 'bar',
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [120, 132, 101, 134, 290, 230, 220]
            },
            {
              name: '线下零售',
              type: 'bar',
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [60, 72, 71, 74, 190, 130, 110]
            },
            {
              name: '电商零售',
              type: 'bar',
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [62, 82, 91, 84, 109, 110, 120]
            }
          ]
        };
  
        myChart.setOption(option);
  
      };
  function createEchartsAccess1(){
    const myChart = echarts.init(echarts_access.value);
    const option  = {
      title: {
        text: '近6个月数据共享产业链分布图',
        // left:0,
        top:4
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        // top: '5%',
        // left: 'center'
        orient: 'horizontal',
        bottom: '0'
      },
      series: [
        {
          name: '文件数',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 38, name: '上游供应商' },
            { value: 8, name: '人力资源' },
            { value: 25, name: '线下零售' },
            { value: 18, name: '电商零售' },
            // { value: 8, name: '山东' },
            // { value: 5, name: '河北' },
          ]
        }
      ]
    };
    myChart.setOption(option);
  };
  function createEchartsline1(){
    const myChart = echarts.init(echarts_line.value);
    const option = {
      title: {
        text: '近6个月的数据请求和数据提供数量变化曲线'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {          
        orient: 'horizontal',
        bottom: '0'},
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['三月', '四月', '五月', '六月', '七月', '八月', '九月']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} '
        }
      },
      series: [
        {
          name: '请求',
          type: 'line',
          data: [10, 11, 13, 11, 12, 12, 9],
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }]
          }
        },
        {
          name: '提供',
          type: 'line',
          data: [1, 2, 2, 5, 3, 2, 0],
          markPoint: {
            data: [{ name: '近期最低', value: -2, xAxis: 1, yAxis: -1.5 }]
          },
          markLine: {
            data: [
              { type: 'average', name: 'Avg' },
              [
                {
                  symbol: 'none',
                  x: '90%',
                  yAxis: 'max'
                },
                {
                  symbol: 'circle',
                  label: {
                    position: 'start',
                    formatter: 'Max'
                  },
                  type: 'max',
                  name: '最高点'
                }
              ]
            ]
          }
        }
      ]
    };

    myChart.setOption(option);

  };


</script>

<style scoped>
/* .second{
  padding-top: 20px;
} */
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
#echarts-line{
  height: 60vh;
  width: 100%;
}
#echarts-category{
  height: 40vh;
  width: 100%;
}
#echarts-access{
  height: 50vh;
  width: 100%;
}
#echarts-scatter{
  height: 50vh;
  width: 100%;
}
#echarts-pressure{
  height: 35vh;
  width: 100%;
}

.data-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.data-name {
  flex: 1;
  margin-right: 10px;
}

.uploaded-company {
  flex: 1;
}
</style>
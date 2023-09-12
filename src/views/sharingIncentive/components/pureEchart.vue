<template>
    <div>
      <el-main> 
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
  const echarts_line = ref(null);
  const echarts_access = ref(null);
  const echarts_scatter = ref(null);


      function load() {  //加载
        if(this.time!==""){
          var date = new Date(this.time);
          const thisYear = date.getFullYear();
          const thisMonth = (date.getMonth() + 1).toString()
          const thisDay = date.getDate().toString()
  
          this.year = `${thisYear}.0`;
          this.month  = `${thisMonth}.0`;
          this.day = `${thisDay}.0`;
  
  
          console.log(this.year);// 输出格式化后的年带小数位
          console.log(this.month) // 输出格式化后的月带小数位
          console.log(this.day)        // 输出格式化后的日带小数位
        }else{
          this.year =""
          this.month=""
          this.day=""
        }
          this.show1=true
          this.show2=true
          this.show3=true
          this.show4=true
          this.dynamicprop1 = "taskState"
          this.dynamicprop2 = "accepter"
          this.dynamicprop3 ="chain"
          this.dynamicprop4 = "comment"
          this.tablename='上传记录表'
          const dataInit=[
            { 
              taskName:'四月电池销量',
              taskReleaser:'小鸭家电',
              profit:10,
              data:"2022.5.1",
              taskState:'已完成',
              accepter: '南孚电池',
              chain:'家电产业链',
              comment:'符合要求'
              },
            { 
              taskName:'五月A型芯片计划产量',
              taskReleaser:'小鸭家电',
              profit:50,
              data:"2022.6.18",
              taskState:'已完成',
              accepter: '台积电' ,
              chain:'家电产业链',
              comment:'数据量偏小，不推荐'
              },
            { 
              taskName:'618家电类销售综合数据',
              taskReleaser:'小鸭家电',
              profit:100,
              data:"2022.7.1",
              taskState:'已接受',
              accepter: '京东' ,
              chain:'家电产业链',
              comment:'/'
              },
            { 
              taskName:'21年人力平均工资',
              taskReleaser:'小鸭家电',
              profit:30,
              data:"2022.9.15",
              taskState:'未接受',
              accepter: '无' ,
              chain:'家电产业链',
              comment:'/'
              },
            { 
              taskName:'双十一电视销售数据',
              taskReleaser:'咸鱼',
              profit:100,
              data:"2022.11.18",
              taskState:'已接受',
              accepter: '小鸭家电' ,
              chain:'家电产业链',
              comment:'/'
              },
              ]
          this.tableData=dataInit
          // this.total=res.total
        // })
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
      
    onMounted(() => {

        createEchartsline1();
        createEchartsAccess1();
        createEchartsscater1();
        // load();
        });
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
  </style>
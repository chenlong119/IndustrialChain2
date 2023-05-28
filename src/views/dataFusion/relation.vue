<template>
  <div>
  <div class="topicText">
    <h2>关联耦合</h2>
  </div>

    <el-form :inline="true">
      <el-form-item label="源任务：">
        <el-input v-model="formPredict.sourceId" placeholder="金属采购"></el-input>
      </el-form-item>
      <el-form-item label="任务概率阈值：">
        <el-input v-model="formPredict.thresholdP" placeholder="0.4"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" >预测</el-button>
      </el-form-item>
    </el-form>

    <el-table
        :data="resultPredict"
        stripe
        style="width: 100%">
      <el-table-column
          prop="target"
          label="目标任务"
          sortable>
      </el-table-column>
      <el-table-column
          prop="delay_time"
          label="发生时延"
          sortable>
      </el-table-column>
      <el-table-column
          prop="probability"
          label="发生概率"
          sortable>
      </el-table-column>
      <el-table-column
          prop="path"
          label="关联路径">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: "relation",
  data() {
    return {
      dateTimeRange: {},
      threshold_f: '',
      threshold_fp: '',
      formPredict: {
        sourceId: '',
        thresholdP: ''
      },
      resultQuery: {
        links: [],
        names: [],
        weights: []
      },
      resultPredict: [
        {
          target: '金属制造',
          delay_time: '10',
          probability: '0.8',
          path: '金属采购->金属制造',
        },
        {
          target: '半导体制造',
          delay_time: '20',
          probability: '0.6',
          path: '金属采购->半导体制造',
        },
        {
          target: '物流运输',
          delay_time: '30',
          probability: '0.4',
          path: '金属采购->物流运输',
        },
      ]
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.topicText {
  text-align: center;
  font-family: BlinkMacSystemFont;
}
</style>
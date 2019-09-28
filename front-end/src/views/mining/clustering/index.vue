<template>
  <div class="page-container">
    <div class="close-bar">
      <span class="sub-title">Clustering</span>
      <img class="collapse-icon" src="@/icons/collapse.png" alt="collapse" @click="closeTab" />
    </div>

    <div class="main-content">
      <el-collapse v-model="activeCollapse" accordion>
        <!-- K-means -->
        <el-collapse-item name="1">
          <template slot="title">
            <span class="item-title">K-means</span>
          </template>
          <div class="expansion-content" style>
            <el-checkbox-group v-model="checkListKmeans">
              <el-row>
                <el-col :span="12">
                  <el-checkbox label="Drillers Depth" />
                </el-col>
                <el-col :span="12">
                  <el-checkbox label="Injection Hours" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-checkbox label="Location" />
                </el-col>
                <el-col :span="12">
                  <el-checkbox label="Oil Production" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-checkbox label="SOR" />
                </el-col>
                <el-col :span="12">
                  <el-checkbox label="Steam Injection" />
                </el-col>
              </el-row>
            </el-checkbox-group>
          </div>
          <el-divider />
          <el-select v-model="clusterNum" placeholder="Number of clusters">
            <el-option
              v-for="item in clusterNumOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button
            type="primary"
            plain
            style="width:200px;margin-top:15px;"
            @click="applyClustering()"
          >Apply</el-button>
        </el-collapse-item>
        <!-- Hierarchical Clustering -->
        <el-collapse-item name="2">
          <template slot="title">
            <span class="item-title">Hierarchical</span>
          </template>

          <div class="expansion-content" style>
            <el-checkbox-group v-model="checkListHclust">
              <el-row>
                <el-col :span="15">
                  <el-checkbox label="Total Production Months" />
                </el-col>
                <el-col :span="15">
                  <el-checkbox label="Percentage Of months After Peak Production" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="15">
                  <el-checkbox label="Peak Production Rate" />
                </el-col>
                <el-col :span="15">
                  <el-checkbox label="Nominal Decline Rate" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="15">
                  <el-checkbox label="Arps Decline Curve Exponent" />
                </el-col>
              </el-row>
            </el-checkbox-group>
          </div>
          <el-divider />

          <div class="input-row">
            <div class="input-label">Attribute</div>
            <div style="display: inline-block;">
              <el-select v-model="clusterAttribute" placeholder="Select" style="width:140px;">
                <el-option
                  v-for="item in attributeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>

          <div class="input-row">
            <div class="input-label">Distance</div>
            <div style="display: inline-block;">
              <el-select v-model="clusterDistance" placeholder="Select" style="width:140px;">
                <el-option
                  v-for="item in distanceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>

          <div class="input-row">
            <div class="input-label">Linkage</div>
            <div style="display: inline-block;">
              <el-select v-model="clusterLinkage" placeholder="Select" style="width:140px;">
                <el-option
                  v-for="item in linkageOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>

          <el-button
            type="primary"
            plain
            style="width:200px;margin-top:15px;"
            @click="applyHieClustering()"
          >Apply</el-button>
        </el-collapse-item>
      </el-collapse>

      <el-dialog
        title="Hierarchical Clustering"
        :visible.sync="clusterDialogVisible"
        width="1000px"
        :before-close="closeDialog"
        :modal-append-to-body="false"
        top="2vh"
      >
        <div style="height: 650px;">
          <v-chart ref="cluster" :options="clusterOption" class="cluster" @click="chartEvent" />
          <v-chart ref="timeSeries" :options="timeSeriesOption" class="time-series" />
          <el-button type="primary" class="ref-button" @click="refresh">Refresh</el-button>
          <el-button type="primary" class="clo-button" @click="closeDialog">Close</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import ECharts from "vue-echarts";
import http from "@/utils/http";
var echarts = require("echarts");
export default {
  components: {
    "v-chart": ECharts
  },
  data() {
    return {
      activeCollapse: "",
      checkListKmeans: [],
      selectedCluster: [],
      checkListHclust: [],
      clusterResult: {},
      clusterAttribute: "p_gas",
      clusterDistance: "euclidean",
      distanceOptions: [
        {
          value: "euclidean",
          label: "Euclidean"
        },
        {
          value: "manhattan",
          label: "Manhattan"
        },
        {
          value: "dtw",
          label: "DTW"
        }
      ],
      clusterLinkage: "average",
      linkageOptions: [
        {
          value: "single",
          label: "Single"
        },
        {
          value: "complete",
          label: "Complete"
        },
        {
          value: "average",
          label: "Average"
        }
      ],

      attributeOptions: [
        {
          value: "p_gas",
          label: "Gas"
        },
        {
          value: "p_oil",
          label: "Oil"
        }
      ],
      wellsData: {},
      loading: true,
      clusterOption: {},
      timeSeriesOption: {},
      clusterDialogVisible: false,
      clusterNumOption: [
        {
          value: "2",
          label: "2"
        },
        {
          value: "3",
          label: "3"
        },
        {
          value: "4",
          label: "4"
        },
        {
          value: "5",
          label: "5"
        },
        {
          value: "6",
          label: "6"
        },
        {
          value: "7",
          label: "7"
        },
        {
          value: "8",
          label: "8"
        },
        {
          value: "9",
          label: "9"
        }
      ],
      clusterNum: "2"
    };
  },
  computed: {
    series() {
      var arr = [];
      for (let i = 0; i < this.wellsData.wellsNum; i++) {
        var dataType = this.wellsData.id[i];
        var temp = {
          symbol: "none",
          name: this.wellsData.uwi[i],
          type: "line",
          data: this.wellsData[dataType]
        };
        arr[i] = temp;
      }
      return arr;
    }
  },
  methods: {
    closeTab: function() {
      this.$emit("reset");
      this.$router.replace({ path: "/home" });
    },
    refresh: function() {
      this.$refs.cluster.refresh();
      this.timeSeriesOption.legend = {
        bottom: 0,
        type: "scroll",
        selected: {}
      };
      this.$refs.timeSeries.refresh();
    },
    returnList: function(list) {
      var nodeList = {};
      if (list) {
        var stack = [];
        stack.push(list);
        while (stack.length != 0) {
          var childrenItem = stack.pop();
          if (childrenItem.isLeaf) {
            var node = {};
            node[childrenItem.name] = false;
            Object.assign(nodeList, node);
          }
          var childrenList = childrenItem.children;
          for (var i = childrenList.length - 1; i >= 0; i--) {
            stack.push(childrenList[i]);
          }
        }
      }
      return nodeList;
    },
    closeDialog: function() {
      this.clusterDialogVisible = false;
    },
    chartEvent: function(params) {
      var id = params.data.id;
      var index = this.selectedCluster.indexOf(id);
      if (index > -1) {
        this.selectedCluster.splice(index, 1);
      } else {
        this.selectedCluster.push(id);
      }

      var tree = this.clusterResult;
      var nodeList = {};
      if (tree) {
        var stack = [];
        stack.push(tree);
        while (stack.length != 0) {
          var childrenItem = stack.pop();
          var index = this.selectedCluster.indexOf(childrenItem.id);
          if (index > -1) {
            var list = this.$options.methods.returnList(childrenItem);
            Object.assign(nodeList, list);
          }
          var childrenList = childrenItem.children;
          for (var i = childrenList.length - 1; i >= 0; i--) {
            stack.push(childrenList[i]);
          }
        }
      }

      this.timeSeriesOption.legend = {
        bottom: 0,
        type: "scroll",
        selected: nodeList
      };
      this.$refs.timeSeries.refresh();
    },
    applyHieClustering: function() {
      const self = this;
      self.clusterDialogVisible = true;
      http
        .get("/clusterHclust", {
          params: {
            clusterAttribute: self.clusterAttribute
          }
        })
        .then(function(response) {
          self.wellsData = response.data.wellsData;
          self.clusterResult = response.data.clusterResult;
          self.clusterOption = {
            tooltip: {
              trigger: "item",
              triggerOn: "mousemove"
            },
            series: [
              {
                type: "tree",

                data: [self.clusterResult],
                initialTreeDepth: 20,

                top: "2%",
                left: "1%",
                bottom: "20%",
                right: "1%",

                symbol: "emptyCircle",
                orient: "vertical",

                expandAndCollapse: true,

                label: {
                  normal: {
                    position: "right",
                    verticalAlign: "middle",
                    align: "right",
                    fontSize: 9
                  }
                },
                itemStyle: {},
                leaves: {
                  label: {
                    normal: {
                      position: "left",
                      rotate: -90,
                      verticalAlign: "middle",
                      align: "left"
                    }
                  }
                },

                animationDurationUpdate: 750
              }
            ]
          };
          self.timeSeriesOption = {
            tooltip: {
              trigger: "axis"
            },
            grid: {
              left: "3%",
              bottom: "20%",
              containLabel: true
            },
            legend: {
              bottom: 0,
              type: "scroll"
            },
            dataZoom: [
              {
                type: "inside"
              },
              {
                type: "slider",
                bottom: 25
              }
            ],
            toolbox: {
              feature: {
                saveAsImage: {
                  title: "Save"
                }
              }
            },
            xAxis: {
              name: "months",
              type: "category",
              boundaryGap: false,
              data: self.wellsData.label
            },
            yAxis: {
              name: "m³",
              type: "value"
            },
            series: self.series
          };
        });
    },
    applyClustering: function() {
      console.log(this.checkListKmeans);
      if (this.checkListKmeans.length != 0) {
        this.$emit("clustering", this.checkListKmeans, this.clusterNum);
      } else {
        this.$notify.info({
          title: "error",
          message: "Please select parameters"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  &-container {
    width: 340px;
    position: absolute;
    top: 0;
    background-color: white;
    z-index: 1;
    height: 100vh;
    box-shadow: 3px 3px 3px #888888;
  }
  &-text {
    font-size: 50px;
    line-height: 66px;
  }
}

.close-bar {
  width: 100%;
  height: 50px;
  text-align: center;
  position: relative;
  border-bottom: 1px solid rgba(182, 182, 182, 0.838);
}
.sub-title {
  line-height: 50px;
  font-size: 20px;
}

.collapse-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 35px;
  height: 35px;
}

.main-content {
  text-align: center;
}
.el-row {
  width: 340px;
}
.item-title {
  margin-left: 15px;
  font-size: 16px;
}

.expansion-content {
  height: 100%;
  width: 100%;
  text-align: center;
  // margin-top: 10px;
}
.el-col {
  text-align: left;
  padding-left: 20px;
}

.cluster {
  width: 950px;
  height: 300px;
}

.time-series {
  width: 950px;
  height: 300px;
}

.clo-button {
  position: absolute;
  top: 700px;
  right: 100px;
}

.ref-button {
  position: absolute;
  top: 700px;
  right: 200px;
}
.input-label {
  display: inline-block;
  width: 135px;
  text-align: left;
  font-size: 16px;
}

.input-row {
  margin: 3px 0 8px;
}
</style>

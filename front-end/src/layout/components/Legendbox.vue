<template>
  <div>
    <div class="legend">
      <i
        class="el-notification__closeBtn el-icon-close"
        style="margin-top:11px;margin-right:-5px;"
        @click="closeLegend()"
      />
      <el-collapse v-model="activeCollapse" accordion>
        <el-collapse-item name="1">
          <template slot="title">
            <span class="item-title" style="display:inline-block;">{{ legendTitle }}</span>
          </template>

          <div class="legend-content" v-if="isHclust==false">
            <div v-for="item in lengendArr" :key="item.index">
              <img class="color-icon" :src="item.iconSrc" alt />
              <span>{{ item.iconTitle }}</span>
            </div>
          </div>

          <div class="legend-content" v-if="isHclust==true">
            <v-chart ref="cluster" :options="clusterOption" class="cluster" @click="chartEvent" />
            <v-chart ref="timeSeries" :options="timeSeriesOption" class="time-series" />
          </div>
        </el-collapse-item>
      </el-collapse>
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
      activeCollapse: "1"
    };
  },
  props: {
    categoryTypeArr: {
      type: Array,
      default: () => {
        return [];
      }
    },
    catagoryTypeNum: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    legendTitle: {
      type: String,
      default: () => {
        return "";
      }
    },
    isHclust: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    clusterResult: {
      type: Object,
      default: () => {
        return {};
      }
    },
    timeSeriesOption: {
      type: Object,
      default: () => {
        return {};
      }
    },
    clusterOption: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    lengendArr() {
      var tempArr = [];
      for (let i = 0; i < this.catagoryTypeNum; i++) {
        var temp;
        if (this.categoryTypeArr[i] === "invalid") {
          temp = {
            iconSrc: require("@/icons/pin/pin-type10.png"),
            iconTitle: this.categoryTypeArr[i]
          };
        } else {
          temp = {
            iconSrc: require("@/icons/pin/pin-type" +
              (i + 1).toString() +
              ".png"),
            iconTitle: this.categoryTypeArr[i]
          };
        }
        tempArr = tempArr.concat(temp);
      }
      return tempArr;
    }
  },
  methods: {
    chartEvent: function(params) {
      if (params.data.isLeaf) {
        this.timeSeriesOption.legend.selected[params.data.name] = !this
          .timeSeriesOption.legend.selected[params.data.name];
      } else {
        this.deepFirstSearch(params.data);
      }

      params.data.isSelected = !params.data.isSelected;

      this.$refs.timeSeries.refresh();
    },
    deepFirstSearch(node) {
      if (node.children.length != 0 ) {
        if (node.children[0].isLeaf && node.children[0].isSelected) {
          this.timeSeriesOption.legend.selected[node.children[0].name] = !this
            .timeSeriesOption.legend.selected[node.children[0].name];
        }

        if (node.children[1].isLeaf && node.children[1].isSelected) {
          this.timeSeriesOption.legend.selected[node.children[1].name] = !this
            .timeSeriesOption.legend.selected[node.children[1].name];
        }

        var children = node.children;
        for (var i = 0; i < children.length; i++) {
          if(children[i].isSelected==true)
          this.deepFirstSearch(children[i]);
        }
      }
    },
    closeLegend: function() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
.legend {
  position: absolute;
  background-color: white;
  bottom: 20px;
  right: 10px;
  padding: 14px 26px 14px 13px;
  border-radius: 5px;
  box-shadow: 3px 3px 5px #888888;
}
.color-icon {
  width: 15px;
  height: 20px;
}
.item-title {
  margin-left: 15px;
  font-size: 16px;
  font-weight: bold;
}
.legend-content {
  margin: 5px 0 0 40px;
}

.cluster {
  width: 700px;
  height: 250px;
}

.time-series {
  width: 700px;
  height: 250px;
}
</style>

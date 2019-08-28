<template>
  <div>
    <el-dialog
      title="Table"
      :visible.sync="tableDialogVisible"
      width="70%"
      :modal-append-to-body="false"
      :before-close="closeTab"
      top="1vh"
    >
      <el-table :data="tableData" stripe border height="70vh" style="width: 100%">
        <el-table-column type="index" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          width="160"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-select
          v-model="table"
          @change="changeSelected"
          placeholder
          size="medium"
          style="width: 250px; margin-right: 500px"
        >
          <el-option
            v-for="item in tableOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" @click="closeTab">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "@/utils/http";
export default {
  name: "Home",
  data() {
    return {
      input: "",
      tableDialogVisible: false,
      tableData: [],
      table: "Wells",
      columns: [
        {
          prop: "UWI",
          label: "UWI"
        },
        {
          prop: "Well Name",
          label: "Well Name"
        },
        {
          prop: "Well Operator",
          label: "Well Operator"
        },
        {
          prop: "Well Status",
          label: "Well Status"
        },
        {
          prop: "Province",
          label: "Province"
        },
        {
          prop: "Class",
          label: "Class"
        },
        {
          prop: "Drillers Total Depth",
          label: "Drillers Total Depth(m)"
        },
        {
          prop: "Well Type",
          label: "Well Type"
        },
        {
          prop: "Pad",
          label: "Pad"
        },
        {
          prop: "Top Longitude",
          label: "Top Longitude"
        },
        {
          prop: "Top Latitude",
          label: "Top Latitude"
        },
        {
          prop: "Bottom Longitude",
          label: "Bottom Longitude"
        },
        {
          prop: "Bottom Latitude",
          label: "Bottom Latitude"
        }
      ],
      tableOptions: [
        {
          value: "Injection",
          label: "Injection"
        },
        {
          value: "Production",
          label: "Production"
        },
        {
          value: "Statistics",
          label: "Statistics"
        },
        {
          value: "Wells",
          label: "Wells"
        }
      ]
    };
  },
  created() {
    this.tableDialogVisible = true;
    const self = this;
    http
      .get("/getWellsData", {
        params: {}
      })
      .then(function(response) {
        self.tableData = response.data;
      });
  },
  methods: {
    closeTab: function() {
      this.tableDialogVisible = false;
      this.$router.replace({ path: "/home" });
    },
    changeSelected: function() {
      const self = this;
      switch (this.table) {
        case "Wells":
          this.columns = [
            {
              prop: "UWI",
              label: "UWI"
            },
            {
              prop: "Well Name",
              label: "Well Name"
            },
            {
              prop: "Well Operator",
              label: "Well Operator"
            },
            {
              prop: "Well Status",
              label: "Well Status"
            },
            {
              prop: "Province",
              label: "Province"
            },
            {
              prop: "Class",
              label: "Class"
            },
            {
              prop: "Drillers Total Depth",
              label: "Drillers Total Depth(m)"
            },
            {
              prop: "Well Type",
              label: "Well Type"
            },
            {
              prop: "Pad",
              label: "Pad"
            },
            {
              prop: "Top Longitude",
              label: "Top Longitude"
            },
            {
              prop: "Top Latitude",
              label: "Top Latitude"
            },
            {
              prop: "Bottom Longitude",
              label: "Bottom Longitude"
            },
            {
              prop: "Bottom Latitude",
              label: "Bottom Latitude"
            }
          ];
          http
            .get("/getWellsData", {
              params: {}
            })
            .then(function(response) {
              self.tableData = response.data;
            });
          break;
        case "Injection":
          this.columns = [
            {
              prop: "Well Id",
              label: "Well Id"
            },
            {
              prop: "Month",
              label: "Month"
            },
            {
              prop: "Year",
              label: "Year"
            },
            {
              prop: "Production Type",
              label: "Production Type"
            },
            {
              prop: "Value",
              label: "Value"
            }
          ];
          http
            .get("/getInjectionData", {
              params: {}
            })
            .then(function(response) {
              self.tableData = response.data;
            });
          break;
        case "Production":
          this.columns = [
            {
              prop: "Well Id",
              label: "Well Id"
            },
            {
              prop: "Month",
              label: "Month"
            },
            {
              prop: "Year",
              label: "Year"
            },
            {
              prop: "Cumulative Hours",
              label: "Cumulative Hours"
            },
            {
              prop: "Cumulative Gas",
              label: "Cumulative Gas(m³)"
            },
            {
              prop: "Cumulative Oil",
              label: "Cumulative Oil(m³)"
            },
            {
              prop: "Cumulative Water",
              label: "Cumulative Water(m³)"
            },
            {
              prop: "Hours",
              label: "Hours"
            },
            {
              prop: "Gas",
              label: "Gas(m³)"
            },
            {
              prop: "Gas Fluid Ratio",
              label: "Gas Fluid Ratio"
            },
            {
              prop: "Gas Oil Ratio",
              label: "Gas Oil Ratio"
            },
            {
              prop: "Oil",
              label: "Oil(m³)"
            },
            {
              prop: "Water",
              label: "Water(m³)"
            },
            {
              prop: "Water Cut",
              label: "Water Cut(%)"
            },
            {
              prop: "Water Gas Ratio",
              label: "Water Gas Ratio"
            },
            {
              prop: "Water Oil Ratio",
              label: "Water Oil Ratio"
            },
            {
              prop: "Total Fluid",
              label: "Total Fluid(m³)"
            }
          ];
          http
            .get("/getProductionData", {
              params: {}
            })
            .then(function(response) {
              self.tableData = response.data;
            });
          break;
        case "Statistics":
          this.columns = [
            {
              prop: "Injector Well Id",
              label: "Injector Well Id"
            },
            {
              prop: "Producer Well Id",
              label: "Producer Well Id"
            },
            {
              prop: "Min Injection Hour",
              label: "Min Injection Hour"
            },
            {
              prop: "Max Injection Hour",
              label: "Max Injection Hour"
            },
            {
              prop: "Average Injection Hour",
              label: "Average Injection Hour"
            },
            {
              prop: "Stddev Injection Hour",
              label: "Stddev Injection Hour"
            },
            {
              prop: "Min Injection Steam",
              label: "Min Injection Steam(m³)"
            },
            {
              prop: "Max Injection Steam",
              label: "Max Injection Steam(m³)"
            },
            {
              prop: "Average Injection Steam",
              label: "Average Injection Steam(m³)"
            },
            {
              prop: "Stddev Injection Steam",
              label: "Stddev Injection Steam(m³)"
            },
            {
              prop: "Min Production Oil",
              label: "Min Production Oil(m³)"
            },
            {
              prop: "Max Production Oil",
              label: "Max Production Oil(m³)"
            },
            {
              prop: "Average Production Oil",
              label: "Average Production Oil(m³)"
            },
            {
              prop: "Stddev Production Oil",
              label: "Stddev Production Oil(m³)"
            },
            {
              prop: "Min SOR",
              label: "Min SOR"
            },
            {
              prop: "Max SOR",
              label: "Max SOR"
            },
            {
              prop: "Average SOR",
              label: "Average SOR"
            },
            {
              prop: "Stddev SOR",
              label: "Stddev SOR"
            }
          ];
          http
            .get("/getStatisticsData", {
              params: {}
            })
            .then(function(response) {
              self.tableData = response.data;
            });
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
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

.el-row {
  margin: 10px 30px;
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
  margin-top: 15px;
}
</style>

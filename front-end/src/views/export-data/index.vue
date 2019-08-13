<template>
  <div class="home-container">
    <div class="close-bar">
      <span class="sub-title">Data-Export</span>
      <img class="collapse-icon" src="@/icons/collapse.png" alt="collapse" @click="closeTab" />
    </div>

    <div class="main-content">
      <el-row>
        <el-col :span="24">
          <span style="color:#888;font-size:16px;">Select Table</span>
        </el-col>
      </el-row>
      <el-select v-model="table" placeholder size="medium" style="width: 280px;">
        <el-option
          v-for="item in tableOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-row>
        <el-col :span="24">
          <span style="color:#888;font-size:16px;">Export Filename</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-input v-model="fileName" placeholder="(optional)" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button
            type="primary"
            plain
            style="width:150px;margin-top:10px;"
            @click="exportData"
          >Export</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import http from "@/utils/http";

export default {
  name: "Home",
  data() {
    return {
      fileName: "",
      Data: [],
      table: "Wells",
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
  methods: {
    closeTab: function() {
      this.$router.replace({ path: "/home" });
    },
    exportData: function() {
      const self = this;
      switch (this.table) {
        case "Wells":
          http
            .get("/getWellsData", {
              params: {}
            })
            .then(function(response) {
              self.Data = response.data;
              var WS = XLSX.utils.json_to_sheet(self.Data);
              var wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, WS, "wells");
              var outPutFileName;
              if (self.fileName === "") {
                outPutFileName = "wells.xlsx";
              } else {
                outPutFileName = self.fileName + ".xlsx";
              }
              XLSX.writeFile(wb, outPutFileName);
            });
            break;

        case "Injection":
          http
            .get("/getInjectionData", {
              params: {}
            })
            .then(function(response) {
              self.Data = response.data;
              var WS = XLSX.utils.json_to_sheet(self.Data);
              var wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, WS, "injection");
              var outPutFileName;
              if (self.fileName === "") {
                outPutFileName = "injection.xlsx";
              } else {
                outPutFileName = self.fileName + ".xlsx";
              }
              XLSX.writeFile(wb, outPutFileName);
            });
            break;

        case "Production":
          http
            .get("/getProductionData", {
              params: {}
            })
            .then(function(response) {
              self.Data = response.data;
              var WS = XLSX.utils.json_to_sheet(self.Data);
              var wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, WS, "production");
              var outPutFileName;
              if (self.fileName === "") {
                outPutFileName = "production.xlsx";
              } else {
                outPutFileName = self.fileName + ".xlsx";
              }
              XLSX.writeFile(wb, outPutFileName);
            });
            break;

        case "Statistics":
          http
            .get("/getStatisticsData", {
              params: {}
            })
            .then(function(response) {
              self.Data = response.data;
              var WS = XLSX.utils.json_to_sheet(self.Data);
              var wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, WS, "statistics");
              var outPutFileName;
              if (self.fileName === "") {
                outPutFileName = "statistics.xlsx";
              } else {
                outPutFileName = self.fileName + ".xlsx";
              }
              XLSX.writeFile(wb, outPutFileName);
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

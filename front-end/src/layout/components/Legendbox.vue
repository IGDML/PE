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

          <div class="legend-content">
            <div v-for="item in lengendArr" :key="item.index">
              <img class="color-icon" :src="item.iconSrc" alt />
              <span>{{ item.iconTitle }}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
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
</style>

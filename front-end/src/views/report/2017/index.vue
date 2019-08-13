<template>
  <div></div>
</template>

<script>
import http from "@/utils/http";
export default {
  name: "Home",
  data() {
    return {};
  },
  created() {
    window.open(
      "https://www.suncor.com/-/media/Files/PDF/Investor-Centre/Annual-Reports/2017-AR/English/2017_Annual_Report_EN.pdf?la=en-CA&modified=20180517214451&hash=407A58F64622AD64CA44B3AB5440EF835C397AB3"
    );
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.main-content {
  text-align: center;
  margin-top: 15px;
}
</style>

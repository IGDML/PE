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
      "https://www.suncor.com/-/media/Files/PDF/Investor-Centre/Annual-Reports/2018-AR/English/2018-annual-report-EN.pdf?modified=00010101000000&la=en-CA&hash=D2DAD0533F0DBB15436D78C6197A95B182C71D2B"
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

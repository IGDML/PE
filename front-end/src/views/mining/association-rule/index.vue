<template>
  <div>
      <transition name="fade" mode="in-out">
        <div class="association" v-if="showAssociation" >
          <el-table :data="associationData" :header-cell-style="{'text-align':'center'}"  stripe border height="50vh"  style="width: 100%">
            <el-table-column prop="Rule" label="Rule" width="60" />
            <el-table-column prop="Expression" label="Expression" width="500" />
            <el-table-column prop="Condifence" label="Condifence" width="100" />
          </el-table>
          <el-button style="margin-left:600px;" type="primary" @click="closeAssociation">Close</el-button>
        </div>
      </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAssociation: false,
      associationData: []
    }
  },
  created() {
    this.Association()
  },
  methods: {
    Association: function(params) {
      this.showAssociation = true;
      this.association();
    },
    closeAssociation() {
      this.showAssociation = false;
      this.$router.replace({ path: '/home' })
    },
    applyAssociationRule: function() {
      this.$emit('Association')
    },
    association() {
      this.associationData = [{
        Rule: 'Rule1',
        Expression: 'IF high average injection hour with low standard deviation low average injection steam with low standard deviation THEN good sor average with low sor standard deviation',
        Condifence: '90% (18/20 pairs)'
      },
      {
        Rule: 'Rule2',
        Expression: 'IF low average injection hour with high standard deviation THEN low average oil production with low standard deviation',
        Condifence: '86% (18/21 pairs)'
      },
      {
        Rule: 'Rule3',
        Expression: 'IF low average injection steam with low standard deviation  THEN low average oil production with low standard deviation',
        Condifence: '85% (47/55 pairs)'
      },
      {
        Rule: 'Rule4',
        Expression: 'IF medium average injection hour with medium standard deviation high average injection steam with medium standard deviation THEN low average oil production with low standard deviation',
        Condifence: '83% (19/23 pairs)'
      },
      {
        Rule: 'Rule5',
        Expression: 'IF low average and low standard deviation injection steam THEN good sor average with low sor standard deviation',
        Condifence: '80% (24/30 pairs)'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.association {
  position: absolute;
  background-color: white;
  bottom: 20px;
  right: 10px;
  padding: 14px 26px 14px 13px;
  border-radius: 5px;
  box-shadow: 3px 3px 5px #888888;
}

</style>

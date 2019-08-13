var db = require('../db')
var _ = require('lodash')

module.exports = {
  async getWellsData(ctx) {
    var data
    await db.Wells.findAll({
      attributes: [['w_uwi', 'UWI'], ['w_name', 'Well Name'], ['w_operator', 'Well Operator'], ['w_current_status', 'Well Status'], ['w_province', 'Province'], ['w_class', 'Class'], ['w_drillers_total_depth', 'Drillers Total Depth'], ['w_type', 'Well Type'], ['w_pad', 'Pad'], ['w_top_lng', 'Top Longitude'], ['w_top_lat', 'Top Latitude'], ['w_bottom_lng', 'Bottom Longitude'], ['w_bottom_lat', 'Bottom Latitude']]
    }).then(well => {
      well = JSON.stringify(well)
      well = JSON.parse(well)
      data = well
    })
    ctx.response.body = data
  },
  async getInjectionData(ctx) {
    var data
    await db.Injection.findAll({
      attributes: [['w_id', 'Well Id'], ['i_month', 'Month'], ['i_year', 'Year'], ['i_prod_type', 'Production Type'], ['i_value', 'Value']]
    }).then(injection => {
      injection = JSON.stringify(injection)
      injection = JSON.parse(injection)
      data = injection
    })
    ctx.response.body = data
  },
  async getProductionData(ctx) {
    var data
    await db.Production.findAll({
      attributes: [['w_id', 'Well Id'], ['p_month', 'Month'], ['p_year', 'Year'], ['p_cml_hours', 'Cumulative Hours'], ['p_cml_gas', 'Cumulative Gas'], ['p_cml_oil_bitu', 'Cumulative Oil'], ['p_cml_water', 'Cumulative Water'], ['p_hours', 'Hours'], ['p_gas', 'Gas'], ['p_gas_fluid_ratio', 'Gas Fluid Ratio'], ['p_gas_oil_ratio', 'Gas Oil Ratio'], ['p_oil', 'Oil'], ['p_oil_cut', 'Oil Cut'], ['p_water', 'Water'], ['p_water_cut', 'Water Cut'], ['p_water_gas_ratio', 'Water Gas Ratio'], ['p_water_oil_ratio', 'Water Oil Ratio'], ['p_total_fluid', 'Total Fluid']]
    }).then(production => {
      production = JSON.stringify(production)
      production = JSON.parse(production)
      data = production
    })
    ctx.response.body = data
  },
  async getStatisticsData(ctx) {
    var data
    await db.Statistics.findAll({
      attributes: [['st_injector_w_id', 'Injector Well Id'], ['st_producer_w_id', 'Producer Well Id'], ['st_min_injection_hour', 'Min Injection Hour'], ['st_max_injection_hour', 'Max Injection Hour'], ['st_avg_injection_hour', 'Average Injection Hour'], ['st_stddev_injection_hour', 'Stddev Injection Hour'], ['st_min_injection_steam', 'Min Injection Steam'], ['st_max_injection_steam', 'Max Injection Steam'], ['st_avg_injection_steam', 'Average Injection Steam'], ['st_stddev_injection_steam', 'Stddev Injection Steam'] ,['st_min_production_oil', 'Min Production Oil'], ['st_max_production_oil', 'Max Production Oil'], ['st_avg_production_oil', 'Average Production Oil'], ['st_stddev_production_oil', 'Stddev Production Oil'], ['st_min_sor', 'Min SOR'], ['st_max_sor', 'Max SOR'], ['st_avg_sor', 'Average SOR'], ['st_stddev_sor', 'Stddev SOR'] ]
    }).then(statistics => {
      statistics = JSON.stringify(statistics)
      statistics = JSON.parse(statistics)
      data = statistics
    })
    ctx.response.body = data
  }

}

var db = require('../db')
var _ = require('lodash')

const kmeans = require('ml-kmeans')
const {
  agnes
} = require('ml-hclust');
const {
  euclidean
} = require('ml-distance-euclidean');

// For hcluster
var wellsData = {}


function getClusterResult(tree) {
  var id = 0
  tree.traverse((cluster) => {
    if (cluster.isLeaf) {
      cluster.name = wellsData.uwi[cluster.index];
      cluster.height = undefined;
      cluster.size = undefined;
      cluster.index = undefined;
      cluster.id = id;
      id++
    } else {
      cluster.name = cluster.size;
      cluster.height = undefined;
      cluster.size = undefined;
      cluster.index = undefined;
      cluster.id = id
      id++
    }
  });
  return tree;
}

function getDataFeature() {
  var clusterData = []
  var number = []
  var maximum = []

  for (let i = 0; i < wellsData.id.length; i++) {
    var feature = [];
    var nums = wellsData[wellsData.id[i]].length;
    feature.push(nums);
    number.push(nums);
    var max = Math.max.apply(null, wellsData[wellsData.id[i]]);
    feature.push(max);
    maximum.push(max);
    var index = wellsData[wellsData.id[i]].indexOf(max);
    var percent = (nums - index) / nums;
    feature.push(percent);
    clusterData.push(feature);
  };
  n = Math.max.apply(null, number);
  m = Math.max.apply(null, maximum);
  for (let i = 0; i < wellsData.id.length; i++) {
    clusterData[i][0] = clusterData[i][0] / n
    clusterData[i][1] = clusterData[i][1] / m
  }
  return clusterData

}


module.exports = {
  async clusterKmeans(ctx) {
    var checkList
    var clusterNum
    var wellsQueryAttribute = []
    var statisticsQueryAttribute = []
    var dataFromWells
    var dataFromStatistics
    var data = []
    var attributeArr
    checkList = ctx.query.checkList
    clusterNum = ctx.query.clusterNum
    clusterNum = parseInt(clusterNum)
    console.log('checkList = ', checkList)
    console.log('clusterNum = ', clusterNum)
    // get the total number of the wells
    var wellsNum
    await db.Wells.count().then(c => {
      wellsNum = c
    })

    // get the data from table Wells
    if (_.includes(checkList, 'Drillers Depth')) {
      wellsQueryAttribute = wellsQueryAttribute.concat('w_drillers_total_depth')
    }
    if (_.includes(checkList, 'Location')) {
      wellsQueryAttribute = wellsQueryAttribute.concat('w_bottom_lng', 'w_bottom_lat', 'w_top_lng', 'w_top_lat')
    }
    await db.Wells.findAll({
      attributes: wellsQueryAttribute
    }).then(statistic => {
      statistic = JSON.stringify(statistic)
      statistic = JSON.parse(statistic)
      dataFromWells = statistic
    })

    // get all attributes' value from the object and store the value in a array
    attributeArr = wellsQueryAttribute
    dataFromWells = _.map(dataFromWells, (o) => {
      var temp = []
      var objectLength = _.keys(o).length
      for (let i = 0; i < objectLength; i++) {
        var attrName = attributeArr[i]
        temp[i] = o[attrName]
      }
      return temp
    })

    // get the data from table Statistics
    if (_.includes(checkList, 'SOR')) {
      statisticsQueryAttribute = statisticsQueryAttribute.concat('st_avg_sor')
    }
    if (_.includes(checkList, 'Injection Hours')) {
      statisticsQueryAttribute = statisticsQueryAttribute.concat('st_avg_injection_hour')
    }
    if (_.includes(checkList, 'Oil Production')) {
      statisticsQueryAttribute = statisticsQueryAttribute.concat('st_avg_production_oil')
    }
    if (_.includes(checkList, 'Steam Injection')) {
      statisticsQueryAttribute = statisticsQueryAttribute.concat('st_avg_injection_steam')
    }
    var temp = [
      ['st_injector_w_id', 'w_id'],
    ];

    temp = temp.concat(statisticsQueryAttribute)
    await db.Statistics.findAll({
      attributes: temp
    }).then(statistic => {
      statistic = JSON.stringify(statistic)
      statistic = JSON.parse(statistic)
      dataFromStatistics = statistic
    })
    temp = [
      ['st_producer_w_id', 'w_id'],
    ];

    temp = temp.concat(statisticsQueryAttribute)
    await db.Statistics.findAll({
      attributes: temp
    }).then(statistic => {
      statistic = JSON.stringify(statistic)
      statistic = JSON.parse(statistic)
      dataFromStatistics = dataFromStatistics.concat(statistic)
    })

    // get all attributes' value from the object and store the value in a array
    attributeArr = ['w_id']
    attributeArr = attributeArr.concat(statisticsQueryAttribute)
    dataFromStatistics = _.map(dataFromStatistics, (o) => {
      var temp = []
      var objectLength = _.keys(o).length
      for (let i = 0; i < objectLength; i++) {
        var attrName = attributeArr[i]
        temp[i] = o[attrName]
      }
      return temp
    })

    // create an array which has wellNum elements and fill all attribute with value 0
    var voidArr = _.times(wellsNum, (index) => {
      var arr = [index + 1]
      var objectLength = dataFromStatistics[0].length
      for (let i = 1; i < objectLength; i++) {
        arr[i] = 0
      }
      return arr
    })

    // conbine the void array with the vaild array
    dataFromStatistics = _.unionBy(dataFromStatistics, voidArr, (arr) => {
      return arr[0]
    })
    dataFromStatistics = _.sortBy(dataFromStatistics, (arr) => {
      return arr[0]
    })

    // merge the dataFromWells and dataFromStatistics
    for (let i = 0; i < wellsNum; i++) {
      data[i] = dataFromStatistics[i].concat(dataFromWells[i])
      data[i] = _.drop(data[i])
    }

    // use K-means to classify all the point
    var ans = kmeans(data, clusterNum, {
      initialization: 'kmeans++',
      seed: 1
    })
    ans = ans.clusters

    // return the response data
    var response = {
      'points': [],
      'categoryTypeArr': []
    }
    response.points = _.times(wellsNum, (index) => {
      return {
        'wid': index + 1,
        'label': 'Cluster' + ans[index]
      }
    })
    response.categoryTypeArr = _.times(clusterNum, (index) => {
      return 'Cluster' + index
    })
    ctx.response.body = response
  },


  async clusterHclust(ctx) {
    // get wells data
    var attribute = ctx.query.clusterAttribute
    var points = []

    db.Production.belongsTo(db.Wells, {
      foreignKey: 'w_id'
    })

    await db.Production.findAll({
      include: [{
        model: db.Wells,
        required: true,
        where: {
          w_type: "PRODUCER"
        },
        attributes: [
          ['w_uwi', 'uwi'],
          ['w_type', 'type']
        ]
      }],
      attributes: [
        ['w_id', 'wid'],
        [attribute, 'value']
      ]
    }).then(production => {
      production = JSON.stringify(production)
      production = JSON.parse(production)
      points = _.concat(points, production)
    })


    var id = _.uniqBy(points, 'wid')
    wellsData.id = _.map(id, (o) => {
      return o.wid
    })

    wellsData.uwi = _.map(id, (o) => {
      return o.well.uwi
    })

    for (let i = 0; i < wellsData.id.length; i++) {
      wellsData[wellsData.id[i]] = []
    }

    _.map(points, (o) => {
      wellsData[o.wid].push(o.value)
    })


    var arr = new Array()
    for (i = 0; i < 120; i++) {
      arr[i] = i + 1
    }
    wellsData.label = arr
    wellsData.wellsNum = wellsData.id.length

    //get cluster result

    var clusterData = getDataFeature()


    var tree = agnes(clusterData, {
      distanceFunction: euclidean,
      method: 'average'
    });

    var clusterResult = getClusterResult(tree);

    var response = {
      wellsData,
      clusterResult
    };

    ctx.response.body = response;
  }

}
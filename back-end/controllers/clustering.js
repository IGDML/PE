var db = require('../db')
var _ = require('lodash')

const kmeans = require('ml-kmeans')
const {
  agnes
} = require('ml-hclust');
const {
  distance
} = require('ml-distance');

// For hcluster
var wellsData = {}


function getClusterResult(tree) {

  tree.traverse((cluster) => {
    if (cluster.isLeaf) {
      cluster.name = wellsData.uwi[cluster.index];
      cluster.height = undefined;
      cluster.size = undefined;
      cluster.index = undefined;
      cluster.isSelected=true;
      cluster.symbolSize=8;
    } else {
      cluster.name = cluster.size;
      cluster.height = undefined;
      cluster.size = undefined;
      cluster.index = undefined;
      cluster.isSelected=false;
      cluster.symbolSize=(cluster.name/10)+12;
    }
  });
  return tree;
}

function getDataFeature(checkList) {
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

  var numberList = []
  var maximumList = []
  var percentList = []
  var result = []

  for (let i = 0; i < wellsData.id.length; i++) {
    clusterData[i][0] = clusterData[i][0] / n
    clusterData[i][1] = clusterData[i][1] / m
    numberList[i] = clusterData[i][0]
    maximumList[i] = clusterData[i][1]
    percentList[i] = clusterData[i][2]
    result[i] = []
  }

  if (_.includes(checkList, 'Total Production Months')) {
    for (let i = 0; i < wellsData.id.length; i++) {
      result[i] = result[i].concat(numberList[i])
    }
  }
  if (_.includes(checkList, 'Peak Production Rate')) {
    for (let i = 0; i < wellsData.id.length; i++) {
      result[i] = result[i].concat(maximumList[i])
    }
  }

  if (_.includes(checkList, 'Percentage Of months After Peak Production')) {
    for (let i = 0; i < wellsData.id.length; i++) {
      result[i] = result[i].concat(percentList[i])
    }
  }
  return result

}

function getSeries(tree,depth) {

  //get series
  var series = [];
  for (let i = 0; i < wellsData.wellsNum; i++) {
    var dataType = wellsData.id[i];
    var temp = {
      showSymbol: false,
      name: wellsData.uwi[i],
      type: "line",
      data: wellsData[dataType]
    };
    series[i] = temp;
  }

  //get label
  var number = []
  var label = []
  for (let i = 0; i < wellsData.id.length; i++) {
    var nums = wellsData[wellsData.id[i]].length;
    number.push(nums);
  };
  n = Math.max.apply(null, number)

  for (i = 0; i < n + 5; i++) {
    label[i] = i + 1
  }

  //get legend

  var legend={}

  tree.traverse((cluster) => {
    if (cluster.isLeaf) {
      legend[cluster.name]=false;
    } 
  });

  current=0;

  getSelected(tree, depth, current,legend);



  var result = {
    series,
    label,
    legend
  }



  return result;

}

function getSelected(tree, depth, current,legend) {
  if (current <= depth) {
    tree.isSelected=true;
    if(current==depth&&tree.isLeaf==false){
      tree.isSelected=false;
    }
    if(tree.isLeaf){
      legend[tree.name]=true;
    }
    
    current++
    if (tree.children.length != 0) {
      getSelected(tree.children[0], depth, current,legend)
      getSelected(tree.children[1], depth, current,legend)
    }
  }


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
      initialization: 'kmeans++'
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

    selectedCluster = []
    var points = []
    var checkList = ctx.query.checkList
    var clusterAttribute = ctx.query.clusterAttribute
    var clusterLinkage = ctx.query.clusterLinkage
    var clusterDistance = ctx.query.clusterDistance
    var clusterDepth = ctx.query.clusterDepth

    //get data
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
        [clusterAttribute, 'value']
      ]
    }).then(production => {
      production = JSON.stringify(production)
      production = JSON.parse(production)
      points = _.concat(points, production)
    })

    // organize data
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
    wellsData.wellsNum = wellsData.id.length
    //get cluster result

    switch (clusterDistance) {
      case "eucliean":
        var distanceFunc = distance.eucliean
        break;
      case "manhattan":
        var distanceFunc = distance.manhattan
        break;
      default:
        var distanceFunc = distance.eucliean
    }


    var clusterData = getDataFeature(checkList)
    var tree = agnes(clusterData, {
      distanceFunction: distanceFunc,
      method: clusterLinkage
    });


    var clusterResult = getClusterResult(tree);
    var timeSeries = getSeries(clusterResult,clusterDepth);


    var response = {
      timeSeries,
      clusterResult
    };

    ctx.response.body = response;
  }

}
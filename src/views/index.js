export function timestampToTime(row){
  var date1 = new Date(row.date)
  return date1.toLocaleString()
    // var date = row.date;
    // var year = date.substr(0, 4);
    // var month = date.substr(5, 2);
    // var day = date.substr(8, 2);
    // var time = date.substr(11, 5);
    // return year + "年" + month + "月" + day + "日" + " " + time;
}

export function  mapToArray(dataMap){
    var list = []
    for(var key in dataMap){
      list.push({"key": key, "value":dataMap[key]})
    }
    return list
}
import React, {useState, useEffect}from "react";
import * as echarts from "echarts";

const ChartView = (props) => {
  const {data, id, seriesName, title} = props
  const [chartView, setChartView] = useState(null)

  const setOptions = (option) => {
    chartView && chartView.setOption(option)
  }

  const init = () => {
    const chart = echarts.init(document.getElementById(id))
    chart.setOption(getOption())
    setChartView(chart)
  }

  const getData = (key) => {

    if(!data || data.length < 1){
      return []
    }
    const tmp = []
    data.forEach(item=>{
      tmp.push(key === 'name' ? item.name : item.count)
    })
    return tmp
  }

  const getOption = () => {
    const opt = {
      title: {
        text: title,
        left: 'center',
      },
      xAxis: {
        type: 'category',
        data: getData('name'),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: getData('count'),
          type: 'line',
        },
      ],
    }
    return opt
  }

  useEffect(()=>{
    init()
  },[])

  useEffect(()=>{
    setOptions(getOption())
  },[data])

  return (
    <div className="chart-view-container" id={id} style={{width:'100%',height:'100%'}} />
  )
}
export default ChartView

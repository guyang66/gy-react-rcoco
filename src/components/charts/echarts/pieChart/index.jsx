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

  const getData = () => {

    if(!data || data.length < 1){
      return []
    }

    const tmp = []
    data.forEach(item=>{
      tmp.push({
        value: item.count,
        name: item.name,
      })
    })
    return tmp
  }

  const getOption = () => {
    const opt = {
      title: {
        text: title,
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'right',
      },
      series: [
        {
          name: seriesName,
          type: 'pie',
          radius: '50%',
          data: getData(),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
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

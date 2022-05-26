import React, {useState, useEffect}from "react";
import * as echarts from "echarts";

const ChartView = (props) => {
  const {data, id} = props
  const [chartView, setChartView] = useState(null)

  const setOptions = (option) => {
    chartView && chartView.setOption(option)
  }

  const init = () => {
    const chart = echarts.init(document.getElementById(id))
    chart.setOption(getOption())
    setChartView(chart)
  }

  const getOption = () => {
    const opt = {
      title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '50%',
          data: [
            {value: data[0] ? data[0] :  1048, name: '搜索引擎'},
            {value: data[1] ? data[1] :  735, name: '直接访问'},
            {value: data[2] ? data[2] :  444, name: '邮件营销'},
            {value: data[3] ? data[3] :  142, name: '联盟广告'},
            {value: data[4] ? data[4] :  333, name: '视频广告'},
          ],
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
    <div className="chart-view-container" id={id} style={{width:'800px',height:'400px'}} />
  )
}
export default ChartView

import React, {useState, useEffect}from "react";
import {Chart} from "@antv/g2";

const ChartView = (props) => {
  const {type, data, id, x, y, length} = props
  const [chartBarView, setChartBarView] = useState(null)
  const [chartLineView, setChartLineView] = useState(null)

  const getXString = () => {
    let xString = 'name'
    if(x && x !== ''){
      xString = `${  x}`
    }
    return xString
  }

  const getYString = () => {
    let yString = 'count'
    if(y && y !== ''){
      yString = `${  y}`
    }
    return yString
  }

  const getPositionCfg = () => {
    return  `${  getXString()  }*${  getYString()}`
  }

  // 普通柱状图
  const initChartBar = (chartData) => {
    if(!chartData){
      return;
    }
    const l = length || 1

    if(chartBarView && chartData.length < 1){
      const empty = {}
      empty[getXString()] = ''
      empty[getYString()] = 0
      chartBarView.changeData([empty])
      return;
    }

    if(chartBarView){
      chartBarView.changeSize(Math.min(Math.max(470, l * 50), 1000), 350)
      chartBarView.changeData(chartData)
      return
    }
    const chart = new Chart({
      container: id,
      forceFit: true,
      height: 350,
      width: Math.min(Math.max(470, l * 50), 1000), // 最长 1000px ，最短 470px
      padding: [40,20,40,0],
    })
    chart.data(chartData);
    chart.scale('sales', {
      tickInterval: 20,
    });
    chart.interval().position(getPositionCfg()).label(getYString(),{
      textStyle: {
        file: '#4169E1',
        fontSize: '14',
        shadowBlur: 5,
        shadowcolor: '#fff',
      },
      formatter (value){
        return value
      },
    })
    chart.render();
    setChartBarView(chart)
  }

  // 普通折线图
  const initChartLine = (chartData) => {
    if(!data){
      return;
    }
    if(chartLineView && chartData.length < 1){
      const empty = {}
      empty[getXString()] = ''
      empty[getYString()] = 0
      chartLineView.changeData([empty])
      return;
    }

    if(chartLineView){
      chartLineView.changeData(chartData)
      return
    }
    const chart = new Chart(
      {
        container: id,
        autoFit: true,
        height: 350,
        width: 800,
        padding: [40,20,40,40],
      }
    )
    chart.data(chartData)
    chart.line().position(getPositionCfg()).label(getYString(),{
      textStyle: {
        file: '#4169E1',
        fontSize: '14',
        shadowBlur: 5,
        shadowcolor: '#fff',
      },
      formatter (value){
        return value
      },
    })
    chart.render();
    setChartLineView(chart)
  }

  useEffect(()=>{
    if(type === 'bar'){
      initChartBar(data)
    } else if(type === 'line'){
      initChartLine(data)
    }
  },[data])

  return (
    <div className="chart-view-container" id={id} />
  )
}
export default ChartView

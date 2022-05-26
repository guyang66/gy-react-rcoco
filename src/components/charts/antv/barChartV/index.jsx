import React, {useState, useEffect}from "react";
import {Chart} from "@antv/g2";

const ChartView = (props) => {
  const {data, id, length, aliasString} = props
  const [chartLineView, setChartLineView] = useState(null)
  const initChartLine = (chartData) => {
    if(!data){
      return;
    }
    const l = length || 2
    if(chartLineView){
      chartLineView.changeData(chartData)
      return
    }
    const chart = new Chart(
      {
        container: id,
        height: Math.max(60 * l, 240),
        width: 1000,
        padding: [40,80,40,80],
      }
    )
    chart.data(data);
    chart.scale({
      value: {
        min: 0,
        alias: aliasString,
      },
    });
    chart.axis('type', {
      title: null,
      tickLine: null,
      line: null,
    });

    chart.axis('value', {
      label: null,
      title: {
        offset: 30,
        style: {
          fontSize: 12,
          fontWeight: 300,
        },
      },
    });
    chart.legend(false);
    chart.coordinate().transpose();
    chart
      .interval()
      .position('name*count')
      .size(26)
      .label('count', {
        style: {
          fill: '#8d8d8d',
        },
        offset: 10,
      });
    chart.interaction('element-active');
    chart.render();
    setChartLineView(chart)
  }

  useEffect(()=>{
    initChartLine(data)
  },[data])

  return (
    <div className="chart-view-container" id={id} />
  )
}
export default ChartView

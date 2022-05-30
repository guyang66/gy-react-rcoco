import React, {useState, useEffect}from "react";
import {Chart} from "@antv/g2";

const ChartView = (props) => {
  const {data, id, length, aliasString, paddingLeft, viewLength} = props
  const [chartLineView, setChartLineView] = useState(null)
  const initChartLine = (chartData) => {
    if(!data){
      return;
    }
    if(chartLineView && chartData.length < 1){
      chartLineView.changeData([{name: '', count: 0}])
      chartLineView.changeSize(800,200)
      return;
    }
    const l = length || 2
    if(chartLineView){
      chartLineView.changeSize(viewLength || 800, Math.max(40 * l, 300))
      chartLineView.changeData(chartData)
      return
    }
    const chart = new Chart(
      {
        container: id,
        height: Math.max(40 * l, 240),
        width: viewLength || 800,
        padding: [10,80,40,(paddingLeft || 80)],
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

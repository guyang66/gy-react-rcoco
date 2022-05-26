import React, {useState} from "react";
import "./index.styl";
import ChartView from "@components/charts/echarts/pieChart"
import {Button} from "antd";

const Index = () => {
  const [staticsData, setStaticsData] = useState([])

  return (
    <div className="welcome-container">
      <div className="welcome-wrap FBV">
        <span className="welcome-title mar-b40">仪表盘</span>

        <div className="FBH FBAC FBJC" style={{width:'100%'}}>
          <ChartView data={staticsData} id="chartViewOne" type="bar" />
        </div>

        <div className="FBH FBAC FBJC mar-t20" style={{width: '100%'}}>
          <Button
            type="primary"
            size="large"
            style={{width: '120px'}}
            onClick={
              ()=>{
                setStaticsData([133,633,234,533,111])
              }
            }
          >
            改变数据源
          </Button>
        </div>

      </div>
    </div>
  )
}
export default Index

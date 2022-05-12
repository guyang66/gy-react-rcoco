import React, {useState} from "react";
import "./index.styl";
import ChartView from "@components/echarts/pie"
import {Button} from "antd";

const Index = () => {
  const [staticsData, setStaticsData] = useState([])

  return (
    <div className="welcome-container">
      <div className="welcome-wrap FBV">
        <span className="welcome-title">仪表盘</span>

        <ChartView data={staticsData} id="chartViewOne" type="bar" />

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
          改变
        </Button>
      </div>
    </div>
  )
}
export default Index

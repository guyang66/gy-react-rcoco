import React, {useEffect, useState} from "react";
import "./index.styl";
import apiClue from '@api/clue'
import apiConfig from '@api/config'
import {inject, observer} from "mobx-react";
import CountUp from "react-countup";
import utils from "@common/utils";
import ChartView from "@components/charts/echarts/pieChart"
import ChartViewLine from "@components/charts/echarts/lineChart"

const Index = (props) => {
  const {appStore} = props;
  const {user} = appStore

  const [clueCount, setClueCount] = useState(0)
  const [clueType, setClueType] = useState([])
  const [pvVisit, setPvVisit] = useState([])
  const [pvTrend, setPvTrend] = useState([])

  const getClueCount = () => {
    const d = utils.getCurrentDate()
    apiClue.staticsCount({startTime: d, endTime: d}).then(data=>{
      if(!data){
        return
      }
      setClueCount(data)
    })
  }

  const getClueType = () => {
    apiClue.staticsNeed({date: 'all'}).then(data=>{
      if(!data){
        return
      }
      setClueType(data)
    })
  }

  const getPvVisit = () => {
    apiConfig.staticsPvVisit({top: 10, date: 'all'}).then(data=>{
      if(!data){
        return
      }
      setPvVisit(data)
    })
  }

  const getPvTrend = () => {
    apiConfig.staticsPvLine({date: 'last_one_month'}).then(data=>{
      if(!data){
        return
      }
      setPvTrend(data)
    })
  }

  useEffect(()=>{
    getClueCount()
    getClueType()
    getPvVisit()
    getPvTrend()
  },[])

  return (
    <div className="welcome-container">
      <div className="module-view-wrap welcome-view-wrap">
        <div className="welcome-title ">
          <span className="user-name color-orange">{user.name + '，'}</span>
          欢迎来到yy管理平台~
          <a className="color-main mar-l20" href={utils.getFixUrl("/index")} target="_blank" style={{textDecoration: "underline"}}>前往官网</a>
        </div>
      </div>

      <div className="FBH mar-l10 mar-r10 mar-b20">
        <div className="layout-n-4-module mar-l10 mar-r10">
          <div className="dash-bord-title">今日线索数量</div>
          <CountUp className="dash-bord-number mar-t10 color-main" duration={clueCount ? Math.min(clueCount / 10, 2.75) : 0} start={0} end={clueCount} />
        </div>
        <div className="layout-n-4-module mar-l10 mar-r10">
          <div className="dash-bord-title">今日资源下载量</div>
          <CountUp className="dash-bord-number mar-t10 color-main" duration={0.3} start={0} end={8} />
        </div>
        <div className="layout-n-4-module mar-l10 mar-r10">
          <div className="dash-bord-title">今日PV</div>
          <CountUp className="dash-bord-number mar-t10 color-main" start={0} end={1137} />
        </div>
        <div className="layout-n-4-module mar-l10 mar-r10">
          <div className="dash-bord-title">今日UV</div>
          <CountUp className="dash-bord-number mar-t10 color-main" start={0} end={467} />
        </div>
      </div>

      <div className="FBH mar-l10 mar-r10 mar-b20">
        <div className="layout-n-2-module mar-l10 mar-r10">
          <ChartView data={clueType} id="chartViewClue" type="bar" title="线索需求类型" seriesName="需求个数" />
        </div>
        <div className="layout-n-2-module mar-l10 mar-r10">
          <ChartView data={pvVisit} id="chartPvVisit" type="bar" title="页面访问排名（前10）" seriesName="页面访问量" />
        </div>
      </div>

      <div className="FBH mar-l10 mar-r10 mar-b20">
        <div className="layout-n-1-module mar-l10 mar-r10">
          <ChartViewLine data={pvTrend} id="chartViewPvTrend" type="bar" title="官网pv趋势图" />
        </div>
      </div>

    </div>
  )
}
export default inject('appStore')(observer(Index))

import React, {useState, useEffect} from "react";
import "./index.styl";
import apiCase from '@api/case'
import {Spin, Radio} from 'antd';
import ChartView from '@components/charts/antv/normalChart'
import ChartViewBar from '@components/charts/antv/barChartV'

const IndexModule = () => {

  const [staticsRankChoose, setStaticsRankChoose] = useState(10)
  const [staticsDateChoose, setStaticsDateChoose] = useState('all')
  const [staticsViewCountLoading, setStaticsViewCountLoading] = useState(false)
  const [staticsViewCountData, setStaticsViewCountData] = useState([])

  const [staticsKeywordsChoose, setStaticsKeywordsChoose] = useState('all')
  const [staticsKeywordsLoading, setStaticsKeywordsLoading] = useState(false)
  const [staticsKeywordsData, setStaticsKeywordsData] = useState([])

  const dateSelectOptions = [
    {label: '全部', value: 'all'},
    {label: '今天', value: 'last_one_day'},
    {label: '最近三天', value: 'last_three_day'},
    {label: '最近一周', value: 'last_one_week'},
    {label: '最近一个月', value: 'last_one_month'},
    {label: '最近三个月', value: 'last_three_month'},
  ]

  const topSelectOptions = [
    {label: '前10', value: 10},
    {label: '前20', value: 20},
    {label: '全部', value: 100000},
  ]

  useEffect(()=>{
    fetchStaticsVisit()
    fetchStaticsKeywords()
  },[])

  const fetchStaticsVisit = (top, date) => {
    const p = {
      top: top || staticsRankChoose,
      date: date || staticsDateChoose,
    }
    setStaticsViewCountLoading(true)
    apiCase.staticsVisit(p).then(data=>{
      if(!data){
        return
      }
      setStaticsViewCountData(data)
      setStaticsViewCountLoading(false)
    })
  }

  const fetchStaticsKeywords = (date) => {
    const p = {
      date: date || staticsKeywordsChoose,
      type: 'caseSearchInput',
    }
    setStaticsKeywordsLoading(true)
    apiCase.staticsKeywords(p).then(data=>{
      if(!data){
        return
      }

      setStaticsKeywordsData(data)
      setStaticsKeywordsLoading(false)
    })
  }

  return (
    <div className="data-resource-container">

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">案例访问量</div>
        <Spin tip="加载中..." spinning={staticsViewCountLoading}>
          <div className="chart-view-wrap mar-l20">
            <div className="mar-b20 FBH">
              <div className="condition-title color-orange mar-r10">显示个数：</div>
              <Radio.Group
                options={topSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsRankChoose(e.target.value)
                  fetchStaticsVisit(e.target.value)
                }}
                value={staticsRankChoose}
              />
            </div>
            <div className="mar-b20 FBH">
              <div className="condition-title color-orange mar-r10">时间跨度：</div>
              <Radio.Group
                options={dateSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsDateChoose(e.target.value)
                  fetchStaticsVisit(null, e.target.value)
                }}
                value={staticsDateChoose}
              />
            </div>
            <ChartViewBar
              data={staticsViewCountData}
              id="clueStaticsViewCount"
              viewLength={800}
              paddingLeft={150}
              length={staticsViewCountData.length}
            />
          </div>
        </Spin>
      </div>

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">搜索关键词统计（排名前20）</div>
        <Spin tip="加载中..." spinning={staticsKeywordsLoading}>
          <div className="chart-view-wrap mar-l20">
            <Radio.Group
              options={dateSelectOptions}
              optionType="button"
              buttonStyle="solid"
              onChange={(e)=>{
                setStaticsKeywordsChoose(e.target.value)
                fetchStaticsKeywords(e.target.value)
              }}
              value={staticsKeywordsChoose}
            />
            <ChartView data={staticsKeywordsData} id="clueStaticsKeywords" type="bar" length={staticsKeywordsData.length} />
          </div>
        </Spin>
      </div>

    </div>
  )
}

export default IndexModule

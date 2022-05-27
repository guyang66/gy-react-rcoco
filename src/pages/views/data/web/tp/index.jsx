import React, {useState, useEffect} from "react";
import "./index.styl";
import apiNews from '@api/news'
import {Spin, Radio} from 'antd';
import ChartView from '@components/charts/antv/normalChart'
import ChartViewBar from '@components/charts/antv/barChartV'

const IndexModule = () => {

  const [staticsRankChoose, setStaticsRankChoose] = useState(10)
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
    fetchStaticsViewCount()
    fetchStaticsKeywords()
  },[])

  const fetchStaticsViewCount = (top) => {
    const p = {
      top: top || staticsRankChoose,
    }
    setStaticsViewCountLoading(true)
    apiNews.staticsViewCount(p).then(data=>{
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
      type: 'newsSearchInput',
    }
    setStaticsKeywordsLoading(true)
    apiNews.staticsKeywords(p).then(data=>{
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
        <div className="module-title mar-l20 mar-t20 mar-b10">文章浏览量排名</div>
        <Spin tip="加载中..." spinning={staticsViewCountLoading}>
          <div className="chart-view-wrap mar-l20">
            <Radio.Group
              options={topSelectOptions}
              optionType="button"
              buttonStyle="solid"
              onChange={(e)=>{
                setStaticsRankChoose(e.target.value)
                fetchStaticsViewCount(e.target.value)
              }}
              value={staticsRankChoose}
            />
            <ChartViewBar
              data={staticsViewCountData}
              id="clueStaticsViewCount"
              viewLength={1000}
              paddingLeft={450}
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

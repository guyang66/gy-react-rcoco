import React, {useState, useEffect} from "react";
import "./index.styl";
import apiActivity from '@api/activity'
import {Spin, Radio} from 'antd';
import ChartViewBar from '@components/charts/antv/barChartV'

const IndexModule = () => {

  const [staticsRankChoose, setStaticsRankChoose] = useState(10)
  const [staticsDateChoose, setStaticsDateChoose] = useState('all')
  const [staticsCategoryChoose, setStaticsCategoryChoose] = useState(null)

  const [staticsViewCountLoading, setStaticsViewCountLoading] = useState(false)
  const [staticsViewCountData, setStaticsViewCountData] = useState([])
  const [categoryOption, setCategoryOption] = useState([])
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
    getActivityCategory()
  },[])

  const getActivityCategory = () =>{
    apiActivity.getActivityCategory().then(data=>{
      if(!data){
        return
      }
      const tmp = []
      data.forEach(item=>{
        tmp.push({
          label: item.title,
          value: item.key,
        })
      })
      console.log(data)
      setCategoryOption(tmp)
      setStaticsCategoryChoose(data[0].key)
      fetchStaticsVisit(data[0].key)
    })
  }

  const fetchStaticsVisit = (category, top, date) => {
    const p = {
      category: category || staticsCategoryChoose,
      top: top || staticsRankChoose,
      date: date || staticsDateChoose,
    }
    setStaticsViewCountLoading(true)
    apiActivity.staticsVisit(p).then(data=>{
      if(!data){
        return
      }
      setStaticsViewCountData(data)
      setStaticsViewCountLoading(false)
    })
  }

  return (
    <div className="data-resource-container">

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">活动访问量</div>
        <Spin tip="加载中..." spinning={staticsViewCountLoading}>
          <div className="chart-view-wrap mar-l20">
            <div className="mar-b20 FBH">
              <div className="condition-title color-orange mar-r10">活动模块：</div>
              <Radio.Group
                options={categoryOption}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsCategoryChoose(e.target.value)
                  fetchStaticsVisit(e.target.value)
                }}
                value={staticsCategoryChoose}
              />
            </div>
            <div className="mar-b20 FBH">
              <div className="condition-title color-orange mar-r10">显示个数：</div>
              <Radio.Group
                options={topSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsRankChoose(e.target.value)
                  fetchStaticsVisit(null, e.target.value)
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
                  fetchStaticsVisit(null,null, e.target.value)
                }}
                value={staticsDateChoose}
              />
            </div>
            <ChartViewBar
              data={staticsViewCountData}
              id="clueStaticsViewCount"
              viewLength={1000}
              paddingLeft={350}
              length={staticsViewCountData.length}
            />
          </div>
        </Spin>
      </div>
    </div>
  )
}

export default IndexModule

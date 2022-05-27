import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiCase from '@api/case'
import {Spin, Radio, Table, Pagination, Input, DatePicker, Button} from 'antd';
import ChartView from '@components/charts/antv/normalChart'
import ChartViewBar from '@components/charts/antv/barChartV'
import utils from '@utils'

const {Column} = Table;
const {RangePicker} = DatePicker

const ViewModule = () => {
  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(null)
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中

  const [searchDate, setSearchDate] = useState([])
  const [pickerValue, setPickerValue] = useState(null)

  const [staticsRankChoose, setStaticsRankChoose] = useState(10)
  const [staticsDateChoose, setStaticsDateChoose] = useState('all')
  const [staticsViewCountLoading, setStaticsViewCountLoading] = useState(false)
  const [staticsViewCountData, setStaticsViewCountData] = useState(null)

  const [staticsKeywordsChoose, setStaticsKeywordsChoose] = useState('all')
  const [staticsKeywordsLoading, setStaticsKeywordsLoading] = useState(false)
  const [staticsKeywordsData, setStaticsKeywordsData] = useState(null)

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

  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 10,
    done: false,
  })

  const searchRef = useRef()

  useEffect(()=>{
    fetchStaticsVisit()
    fetchStaticsKeywords()
  },[])

  const getList = () => {
    setTableLoading(true)
    const p = {
      page: pageParams.page,
      pageSize: pageParams.pageSize,
    }
    if(searchDate && searchDate.length > 1){
      p.startTime = new Date(searchDate[0])
      p.endTime = new Date(searchDate[1])
    }
    apiCase.getStaticRecordList(p).then(data=>{
      if(!data){
        return
      }
      setTotal(data.total)
      setList(data.list)
      setTableLoading(false)
    })
  }

  useEffect(()=>{
    getList()
  },[pageParams])

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
      setStaticsViewCountData(data.reverse())
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

  const chooseSearchDate = (e,d)=>{
    setSearchDate(d)
    setPickerValue(e)
  }
  return (
    <div className="data-case-container">
      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-t20 mar-l20 mar-b10">埋点数据源</div>
        <div className="FBH FBAC">
          <div className="FBH FBAC mar-l20 h-40">
            <div className="search-title color-orange">关键词：</div>
            <Input
              className="search-input"
              allowClear
              ref={searchRef}
              placeholder="请输入名字/电话/ip..."
            />
          </div>
          <div className="FBH FBAC mar-l20 h-40">
            <div className="search-title color-orange">指定日期：</div>
            <RangePicker
              placeholder={['开始时间','结束时间']}
              value={pickerValue}
              onChange={chooseSearchDate}
              className="search-data-picker"
            />
          </div>
          <Button
            className="btn-info mar-l20"
            onClick={()=>{
              searchRef.current.handleReset()
              setSearchDate([])
              setPickerValue(null)
            }}
          >
            清空条件
          </Button>
          <Button
            className="btn-primary mar-l20"
            onClick={()=>{
              setPageParams({
                page: 1,
                pageSize: 10,
                done: false,
              })
              getList()
            }}
          >
            筛 选
          </Button>
        </div>
        <div className="table-wrap">
          <Table
            bordered
            dataSource={list}
            size="small"
            loading={tableLoading}
            scroll={{x: '100%'}}
            pagination={false}
          >
            <Column
              title="序号"
              width={60}
              align="center"
              render={(status, value, index)=>{
                return (
                  <span>{index + 1}</span>
                )
              }}
            />
            <Column
              title="案例"
              width={100}
              align="center"
              render={(status)=>{
                return (
                  <span>{status.objectId ? status.objectId.title : ''}</span>
                )
              }}
            />
            <Column title="访问者名字" dataIndex="name" key="name" width={100} align="center" />
            <Column title="访问者电话" dataIndex="phone" key="phone" width={100} align="center" />
            <Column title="动作" dataIndex="typeString" key="typeString" width={100} align="center" />
            <Column
              title="日期"
              width={150}
              align="center"
              render={(status)=>{
                return (
                  <span>{utils.getCurrentDateYYDDMMhhmmss(status.createTime)}</span>
                )
              }}
            />
            <Column title="ip" dataIndex="ip" key="ip" width={120} align="center" />
          </Table>
          {
            list.length > 0 ? (
              <div className="FBH FBAC FBJC pagination-wrap mar-t40">
                <Pagination
                  current={pageParams.page}
                  onChange={e=>{
                    setPageParams({...pageParams, page: e})
                  }}
                  Pagination
                  total={total}
                />
              </div>
            ) : null
          }

        </div>
      </div>

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
              id="caseStaticsViewCount"
              viewLength={800}
              paddingLeft={150}
              length={staticsViewCountData ? staticsViewCountData.length : 0}
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
            <ChartView data={staticsKeywordsData} id="caseStaticsKeywords" type="bar" length={staticsKeywordsData ? staticsKeywordsData.length : 0} />
          </div>
        </Spin>
      </div>

    </div>
  )
}

export default ViewModule

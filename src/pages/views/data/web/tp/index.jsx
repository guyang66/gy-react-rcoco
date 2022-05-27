import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiConfig from '@api/config'
import apiWeb from '@api/web'
import {Spin, Radio, Table, Pagination, Input, DatePicker, Button, Select} from 'antd';
import ChartView from '@components/charts/antv/normalChart'
import ChartViewBar from '@components/charts/antv/barChartV'
import utils from '@utils'

const {Column} = Table;
const {RangePicker} = DatePicker
const {Option} = Select

const ViewModule = () => {
  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(null)
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中

  const [searchDate, setSearchDate] = useState([])
  const [pickerValue, setPickerValue] = useState(null)

  const [staticsTypeChoose, setStaticsTypeChoose] = useState('total')
  const [staticsTimeChoose, setStaticsTimeChoose] = useState('2s-3m')
  const [staticsRankChoose, setStaticsRankChoose] = useState(20)
  const [staticsDateChoose, setStaticsDateChoose] = useState('all')
  const [staticsViewCountLoading, setStaticsViewCountLoading] = useState(false)
  const [staticsViewCountData, setStaticsViewCountData] = useState(null)

  const [pageNameList, setPageNameList] = useState([])

  const [staticsTotalPathChoose, setStaticsTotalPathChoose] = useState(null)
  const [staticsTotalTimeChoose, setStaticsTotalTimeChoose] = useState('2s-3m')
  const [staticsTotalDateChoose, setStaticsTotalDateChoose] = useState('last_one_week')
  const [staticsTotalLoading, setStaticsTotalLoading] = useState(false)
  const [staticsTotalData, setStaticsTotalData] = useState(null)

  const [staticsTrendPathChoose, setStaticsTrendPathChoose] = useState(null)
  const [staticsTrendDateChoose, setStaticsTrendDateChoose] = useState('last_one_week')
  const [staticsTrendTypeChoose, setStaticsTrendTypeChoose] = useState('total')
  const [staticsTrendTimeChoose, setStaticsTrendTimeChoose] = useState('2s-3m')
  const [staticsTrendLoading, setStaticsTrendLoading] = useState(false)
  const [staticsTrendData, setStaticsTrendData] = useState(null)

  const dateSelectOptions = [
    {label: '全部', value: 'all'},
    {label: '今天', value: 'last_one_day'},
    {label: '最近三天', value: 'last_three_day'},
    {label: '最近一周', value: 'last_one_week'},
    {label: '最近一个月', value: 'last_one_month'},
    {label: '最近三个月', value: 'last_three_month'},
  ]

  const dateCountSelectOptions = [
    {label: '今天', value: 'last_one_day'},
    {label: '最近三天', value: 'last_three_day'},
    {label: '最近一周', value: 'last_one_week'},
    {label: '最近一个月', value: 'last_one_month'},
    {label: '最近三个月', value: 'last_three_month'},
  ]

  const topSelectOptions = [
    {label: '前20', value: 20},
    {label: '前40', value: 40},
    {label: '全部', value: 100000},
  ]

  const typeSelectOptions = [
    {label: '总停留时间', value: 'total'},
    {label: '平均停留时间', value: 'avg'},
    {label: '单次最大停留时间', value: 'max'},
  ]

  const timeSelectOptions = [
    {label: '全部', value: 'all'},
    {label: '大于2s，小于1分钟', value: '2s-1m'},
    {label: '大于2s，小于3分钟', value: '2s-3m'},
    {label: '大于2s，小于5分钟', value: '2s-5m'},
    {label: '大于2s，小于10分钟', value: '2s-10m'},
  ]

  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 10,
    done: false,
  })

  const searchRef = useRef()

  useEffect(()=>{
    fetchStaticsVisit()
    getPageName()
  },[])

  const getPageName = () => {
    apiWeb.getAllPageNameByTdk().then(data=>{
      if(!data){
        return
      }
      setPageNameList(data)
      setStaticsTotalPathChoose('/index')
      fetchStaticsTotal('/index')

      setStaticsTrendPathChoose('/index')
      fetchStaticsTrend('/index')
    })
  }

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
    apiConfig.getStaticsTpList(p).then(data=>{
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

  const fetchStaticsVisit = (top, type, time, date) => {
    const p = {
      top: top || staticsRankChoose,
      date: date || staticsDateChoose,
      time: time || staticsTimeChoose,
      type: type || staticsTypeChoose,
    }
    setStaticsViewCountLoading(true)
    apiConfig.staticsTpVisit(p).then(data=>{
      if(!data){
        return
      }
      // 垂直柱状图需要反转一下排序
      setStaticsViewCountData(data.reverse())
      setStaticsViewCountLoading(false)
    })
  }

  const fetchStaticsTotal = (path, time, date) => {
    const p = {
      path: path || staticsTotalPathChoose,
      date: date || staticsTotalDateChoose,
      time: time || staticsTotalTimeChoose,
    }
    setStaticsTotalLoading(true)
    apiConfig.staticsTpTotal(p).then(data=>{
      if(!data){
        return
      }
      setStaticsTotalData(data)
      setStaticsTotalLoading(false)
    })
  }

  const fetchStaticsTrend = (path, type, time, date) => {
    const p = {
      path: path || staticsTrendPathChoose,
      date: date || staticsTrendDateChoose,
      time: time || staticsTrendTimeChoose,
      type: type || staticsTrendTypeChoose,
    }
    setStaticsTrendLoading(true)
    apiConfig.staticsTpTrend(p).then(data=>{
      if(!data){
        return
      }
      setStaticsTrendData(data)
      setStaticsTrendLoading(false)
    })
  }

  const chooseSearchDate = (e,d)=>{
    setSearchDate(d)
    setPickerValue(e)
  }
  return (
    <div className="data-tp-container">
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
              onChange={chooseSearchDate}
              value={pickerValue}
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
            <Column title="名字" dataIndex="name" key="name" width={100} align="center" />
            <Column title="电话" dataIndex="phone" key="phone" width={100} align="center" />
            <Column title="页面" dataIndex="pageName" key="pageName" width={100} align="center" />
            <Column title="path" dataIndex="path" key="path" width={140} align="center" />
            <Column title="停留时间" dataIndex="time" key="time" width={120} align="center" />
            <Column title="ip" dataIndex="ip" key="ip" width={120} align="center" />
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
                  className="mar-t20"
                />
              </div>
            ) : null
          }
        </div>
      </div>

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">页面访问量排行</div>
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
              <div className="condition-title color-orange mar-r10">统计类型：</div>
              <Radio.Group
                options={typeSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsTypeChoose(e.target.value)
                  fetchStaticsVisit(null, e.target.value)
                }}
                value={staticsTypeChoose}
              />
            </div>
            <div className="mar-b20 FBH">
              <div className="condition-title color-orange mar-r10">大小类型：</div>
              <Radio.Group
                options={timeSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsTimeChoose(e.target.value)
                  fetchStaticsVisit(null,null, e.target.value)
                }}
                value={staticsTimeChoose}
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
                  fetchStaticsVisit(null,null, null, e.target.value)
                }}
                value={staticsDateChoose}
              />
            </div>
            <ChartViewBar
              data={staticsViewCountData}
              id="staticsViewCount"
              viewLength={1000}
              paddingLeft={100}
              length={staticsViewCountData ? staticsViewCountData.length : 0}
            />
          </div>
        </Spin>
      </div>

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">Tp统计(单页面)</div>
        <Spin tip="加载中..." spinning={staticsTotalLoading}>
          <div className="chart-view-wrap mar-l20">
            <div className="FBH FBAC mar-l20 h-40 mar-b10">
              <div className="search-title color-orange">指定页面：</div>
              <Select
                className="w-200"
                showSearch
                onChange={e=>{
                  setStaticsTotalPathChoose(e)
                  fetchStaticsTotal(e)

                }}
                value={staticsTotalPathChoose}
              >
                {
                  pageNameList.map(item=>{
                    return (
                      <Option value={item.path} key={item.path}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className="FBH FBAC mar-l20 h-40 mar-b10">
              <div className="search-title color-orange">大小类型：</div>
              <Radio.Group
                options={timeSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsTotalTimeChoose(e.target.value)
                  fetchStaticsTotal(null, e.target.value)
                }}
                value={staticsTotalTimeChoose}
              />
            </div>
            <div className="FBH FBAC mar-l20 h-40 mar-b10">
              <div className="search-title color-orange">选择区间：</div>
              <Radio.Group
                options={dateCountSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsTotalDateChoose(e.target.value)
                  fetchStaticsTotal(null, null,e.target.value)
                }}
                value={staticsTotalDateChoose}
              />
            </div>
            <ChartView data={staticsTotalData} id="staticsTotal" type="bar" length={(staticsTotalData ? staticsTotalData.length : 0)} />
          </div>
        </Spin>
      </div>

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">Tp趋势图(单个页面)</div>
        <Spin tip="加载中..." spinning={staticsTrendLoading}>
          <div className="chart-view-wrap mar-l20">
            <div className="FBH FBAC mar-l20 h-40 mar-b10">
              <div className="search-title color-orange">指定页面：</div>
              <Select
                className="w-200"
                showSearch
                onChange={e=>{
                  setStaticsTrendPathChoose(e)
                  fetchStaticsTrend(e)
                }}
                value={staticsTrendPathChoose}
              >
                {
                  pageNameList.map(item=>{
                    return (
                      <Option value={item.path} key={item.path}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className="FBH FBAC mar-l20 h-40 mar-b10">
              <div className="search-title color-orange">统计类型：</div>
              <Radio.Group
                options={typeSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsTrendTypeChoose(e.target.value)
                  fetchStaticsTrend(null, e.target.value)
                }}
                value={staticsTrendTypeChoose}
              />
            </div>
            <div className="FBH FBAC mar-l20 h-40 mar-b10">
              <div className="search-title color-orange">大小类型：</div>
              <Radio.Group
                options={timeSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsTrendTimeChoose(e.target.value)
                  fetchStaticsTrend(null,null, e.target.value)
                }}
                value={staticsTrendTimeChoose}
              />
            </div>
            <div className="FBH FBAC mar-l20 h-40 mar-b10">
              <div className="search-title color-orange">选择区间：</div>
              <Radio.Group
                options={dateCountSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsTrendDateChoose(e.target.value)
                  fetchStaticsTrend(null,null,null,e.target.value)
                }}
                value={staticsTrendDateChoose}
              />
            </div>
            <ChartView data={staticsTrendData} id="tpTrend" type="line" length={staticsTrendData ? staticsTrendData.length : 0} />
          </div>
        </Spin>
      </div>

    </div>
  )
}

export default ViewModule

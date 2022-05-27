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

const IndexModule = () => {
  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(null)
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中

  const [searchDate, setSearchDate] = useState([])

  const [staticsRankChoose, setStaticsRankChoose] = useState(10)
  const [staticsDateChoose, setStaticsDateChoose] = useState('all')
  const [staticsViewCountLoading, setStaticsViewCountLoading] = useState(false)
  const [staticsViewCountData, setStaticsViewCountData] = useState([])

  const [staticsPvLineAllChoose, setStaticsPvLineAllChoose] = useState('last_one_week')
  const [staticsPvLineAllLoading, setStaticsPvLineAllLoading] = useState(false)
  const [staticsPvLineAllData, setStaticsPvLineAllData] = useState([])

  const [staticsUvLineAllChoose, setStaticsUvLineAllChoose] = useState('last_one_week')
  const [staticsUvLineAllLoading, setStaticsUvLineAllLoading] = useState(false)
  const [staticsUvLineAllData, setStaticsUvLineAllData] = useState([])

  const [pageNameList, setPageNameList] = useState([])

  const [staticsPvLineSinglePathChoose, setStaticsPvLineSinglePathChoose] = useState(null)
  const [staticsPvLineSingleChoose, setStaticsPvLineSingleChoose] = useState('last_one_week')
  const [staticsPvLineSingleLoading, setStaticsPvLineSingleLoading] = useState(false)
  const [staticsPvLineSingleData, setStaticsPvLineSingleData] = useState([])

  const [staticsUvLineSinglePathChoose, setStaticsUvLineSinglePathChoose] = useState(null)
  const [staticsUvLineSingleChoose, setStaticsUvLineSingleChoose] = useState('last_one_week')
  const [staticsUvLineSingleLoading, setStaticsUvLineSingleLoading] = useState(false)
  const [staticsUvLineSingleData, setStaticsUvLineSingleData] = useState([])

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
    fetchStaticsPvLineAll()
    fetchStaticsUvLineAll()
    getPageName()
  },[])

  const getPageName = () => {
    apiWeb.getAllPageNameByTdk().then(data=>{
      if(!data){
        return
      }
      setPageNameList(data)
      setStaticsPvLineSinglePathChoose('/index')
      fetchStaticsPvLineSingle('/index')

      setStaticsUvLineSinglePathChoose('/index')
      fetchStaticsUvLineSingle('/index')
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
    apiConfig.getStaticPvList(p).then(data=>{
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
    apiConfig.staticsPvVisit(p).then(data=>{
      if(!data){
        return
      }
      // 垂直柱状图需要反转一下排序
      setStaticsViewCountData(data.reverse())
      setStaticsViewCountLoading(false)
    })
  }

  const fetchStaticsPvLineAll = (date) => {
    const p = {
      date: date || staticsPvLineAllChoose,
    }
    setStaticsPvLineAllLoading(true)
    apiConfig.staticsPvLine(p).then(data=>{
      if(!data){
        return
      }

      setStaticsPvLineAllData(data)
      setStaticsPvLineAllLoading(false)
    })
  }

  const fetchStaticsUvLineAll = (date) => {
    const p = {
      date: date || staticsUvLineAllChoose,
    }
    setStaticsUvLineAllLoading(true)
    apiConfig.staticsUvLine(p).then(data=>{
      if(!data){
        return
      }

      setStaticsUvLineAllData(data)
      setStaticsUvLineAllLoading(false)
    })
  }

  const fetchStaticsPvLineSingle = (path, date) => {
    const p = {
      path: path || staticsPvLineSinglePathChoose,
      date: date || staticsPvLineSingleChoose,
    }
    setStaticsPvLineSingleLoading(true)
    apiConfig.staticsPvLine(p).then(data=>{
      if(!data){
        return
      }
      setStaticsPvLineSingleData(data)
      setStaticsPvLineSingleLoading(false)
    })
  }

  const fetchStaticsUvLineSingle = (path, date) => {
    const p = {
      path: path || staticsUvLineSinglePathChoose,
      date: date || staticsUvLineSingleChoose,
    }
    setStaticsUvLineSingleLoading(true)
    apiConfig.staticsUvLine(p).then(data=>{
      if(!data){
        return
      }
      setStaticsUvLineSingleData(data)
      setStaticsUvLineSingleLoading(false)
    })
  }

  const chooseSearchDate = (e,d)=>{
    setSearchDate(d)
  }
  return (
    <div className="data-resource-container">

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
              className="search-data-picker"
            />
          </div>
          <Button
            className="btn-info mar-l20"
            onClick={()=>{
              searchRef.current.handleReset()
              setSearchDate([])
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
              viewLength={1000}
              paddingLeft={100}
              length={staticsViewCountData.length}
            />
          </div>
        </Spin>
      </div>

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">PV趋势图(所有页面)</div>
        <Spin tip="加载中..." spinning={staticsPvLineAllLoading}>
          <div className="chart-view-wrap mar-l20">
            <Radio.Group
              options={dateCountSelectOptions}
              optionType="button"
              buttonStyle="solid"
              onChange={(e)=>{
                setStaticsPvLineAllChoose(e.target.value)
                fetchStaticsPvLineAll(e.target.value)
              }}
              value={staticsPvLineAllChoose}
            />
            <ChartView data={staticsPvLineAllData} id="clueStaticsPvLineAll" type="line" length={staticsPvLineAllData.length} />
          </div>
        </Spin>
      </div>

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">UV趋势图(所有页面)</div>
        <Spin tip="加载中..." spinning={staticsUvLineAllLoading}>
          <div className="chart-view-wrap mar-l20">
            <Radio.Group
              options={dateCountSelectOptions}
              optionType="button"
              buttonStyle="solid"
              onChange={(e)=>{
                setStaticsUvLineAllChoose(e.target.value)
                fetchStaticsUvLineAll(e.target.value)
              }}
              value={staticsUvLineAllChoose}
            />
            <ChartView data={staticsUvLineAllData} id="clueStaticsUvLineAll" type="line" length={staticsUvLineAllData.length} />
          </div>
        </Spin>
      </div>

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">PV趋势图(单个)</div>
        <Spin tip="加载中..." spinning={staticsPvLineSingleLoading}>
          <div className="chart-view-wrap mar-l20">
            <div className="FBH FBAC mar-l20 h-40">
              <div className="search-title color-orange">指定页面：</div>
              <Select
                className="w-200"
                showSearch
                onChange={e=>{
                  setStaticsPvLineSinglePathChoose(e)
                  fetchStaticsPvLineSingle(e)

                }}
                value={staticsPvLineSinglePathChoose}
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
            <div className="FBH FBAC mar-l20 h-40">
              <div className="search-title color-orange">选择区间：</div>
              <Radio.Group
                options={dateCountSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsPvLineSingleChoose(e.target.value)
                  fetchStaticsPvLineSingle(null,e.target.value)
                }}
                value={staticsPvLineSingleChoose}
              />
            </div>
            <ChartView data={staticsPvLineSingleData} id="clueStaticsPvLineSingle" type="line" length={staticsPvLineSingleData.length} />
          </div>
        </Spin>
      </div>


      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">UV趋势图(单个)</div>
        <Spin tip="加载中..." spinning={staticsUvLineSingleLoading}>
          <div className="chart-view-wrap mar-l20">
            <div className="FBH FBAC mar-l20 h-40">
              <div className="search-title color-orange">指定页面：</div>
              <Select
                className="w-200"
                showSearch
                onChange={e=>{
                  setStaticsUvLineSinglePathChoose(e)
                  fetchStaticsUvLineSingle(e)
                }}
                value={staticsUvLineSinglePathChoose}
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
            <div className="FBH FBAC mar-l20 h-40">
              <div className="search-title color-orange">选择区间：</div>
              <Radio.Group
                options={dateCountSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsUvLineSingleChoose(e.target.value)
                  fetchStaticsUvLineSingle(null,e.target.value)
                }}
                value={staticsUvLineSingleChoose}
              />
            </div>
            <ChartView data={staticsUvLineSingleData} id="clueStaticsUvLineSingle" type="line" length={staticsUvLineSingleData.length} />
          </div>
        </Spin>
      </div>

    </div>
  )
}

export default IndexModule

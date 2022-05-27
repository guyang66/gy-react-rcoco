import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiActivity from '@api/activity'
import {Spin, Radio, Input, Button, Table, Pagination, DatePicker, Select} from 'antd';
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
  const [pickerValue, setPickerValue] = useState(null)
  const [searchCategory, setSearchCategory] = useState('all')

  const [staticsRankChoose, setStaticsRankChoose] = useState(10)
  const [staticsDateChoose, setStaticsDateChoose] = useState('all')
  const [staticsCategoryChoose, setStaticsCategoryChoose] = useState(null)

  const [staticsViewCountLoading, setStaticsViewCountLoading] = useState(false)
  const [categoryOption, setCategoryOption] = useState([])
  const [categorySelectLoading, setCategorySelectLoading] = useState(true)
  const [categoryMap, setCategoryMap] = useState({})
  const [staticsViewCountData, setStaticsViewCountData] = useState(null)

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
    getActivityCategory()
  },[])

  useEffect(()=>{
    getList()
  },[pageParams])

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
    if(searchCategory && searchCategory !== 'all'){
      p.category = searchCategory
    }
    apiActivity.getStaticRecordList(p).then(data=>{
      if(!data){
        return
      }
      setTotal(data.total)
      setList(data.list)
      setTableLoading(false)
    })
  }

  const getActivityCategory = () =>{
    setCategorySelectLoading(true)
    apiActivity.getActivityCategory().then(data=>{
      if(!data){
        return
      }
      const tmp = []
      const map = {}
      data.forEach(item=>{
        tmp.push({
          label: item.title,
          value: item.key,
        })
        map[item.key] = item
      })
      setCategoryMap(map)
      setCategorySelectLoading(false)
      setCategoryOption(tmp)
      // 初始化第一个活动模块类型
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
      setStaticsViewCountData(data.reverse())
      setStaticsViewCountLoading(false)
    })
  }

  const chooseSearchDate = (e,d)=>{
    setSearchDate(d)
    setPickerValue(e)
  }

  const getCategoryString = (key) => {
    if(!key){
      return key
    }
    return categoryMap[key] ? categoryMap[key].title : key
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
              value={pickerValue}
              className="search-data-picker"
            />
          </div>
          <div className="FBH FBAC mar-l20 h-40">
            <div className="search-title color-orange">活动模块：</div>
            <Select
              className="search-select"
              value={searchCategory}
              loading={categorySelectLoading}
              onChange={
                (e)=>{
                  setSearchCategory(e)
                }
              }
            >
              <Option value="all" key="all">全部</Option>
              {
                categoryOption.map(item=>{
                  return (
                    <Option key={item.value} value={item.value}>{item.label}</Option>
                  )
                })
              }

            </Select>
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
            <Column title="动作" dataIndex="typeString" key="typeString" width={100} align="center" />
            <Column
              title="活动类型"
              width={100}
              align="center"
              render={(status)=>{
                return (
                  <span>{getCategoryString(status.category)}</span>
                )
              }}
            />

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
              id="activityStaticsViewCount"
              viewLength={1000}
              paddingLeft={350}
              length={staticsViewCountData ? staticsViewCountData.length : 0}
            />
          </div>
        </Spin>
      </div>
    </div>
  )
}

export default IndexModule

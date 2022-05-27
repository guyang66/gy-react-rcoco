import React, {useState, useEffect} from "react";
import "./index.styl";
import apiResource from '@api/resource'
import {Table, Pagination, Spin, Radio} from 'antd';
import utils from '@utils'
import ChartView from '@components/charts/antv/normalChart'

const {Column} = Table;

const ViewModule = () => {

  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(null)
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中

  const [staticsTypeChoose, setStaticsTypeChoose] = useState('all')
  const [staticsTypeLoading, setStaticsTypeLoading] = useState(false)
  const [staticsTypeData, setStaticsTypeData] = useState(null)

  const [staticsNameActionChoose, setStaticsNameActionChoose] = useState('all')
  const [staticsNameDateChoose, setStaticsNameDateChoose] = useState('all')
  const [staticsNameLoading, setStaticsNameLoading] = useState(false)
  const [staticsNameData, setStaticsNameData] = useState(null)

  const [staticsKeywordsChoose, setStaticsKeywordsChoose] = useState('all')
  const [staticsKeywordsLoading, setStaticsKeywordsLoading] = useState(false)
  const [staticsKeywordsData, setStaticsKeywordsData] = useState(null)

  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 10,
    done: false,
  })

  const dateSelectOptions = [
    {label: '全部', value: 'all'},
    {label: '今天', value: 'last_one_day'},
    {label: '最近三天', value: 'last_three_day'},
    {label: '最近一周', value: 'last_one_week'},
    {label: '最近一个月', value: 'last_one_month'},
    {label: '最近三个月', value: 'last_three_month'},
  ]

  const actionSelectOptions = [
    {label: '全部', value: 'all'},
    {label: '下载', value: 'download'},
    {label: '点击', value: 'click'},
  ]

  const getList = () => {
    setTableLoading(true)
    const p = {
      page: pageParams.page,
      pageSize: pageParams.pageSize,
    }

    apiResource.getResourceRecordList(p).then(data=>{
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

  useEffect(()=>{
    fetchStaticsType()
    fetchStaticsName()
    fetchStaticsKeywords()
  },[])

  const fetchStaticsType = (date) => {
    const p = {
      date: date || staticsTypeChoose,
    }
    setStaticsTypeLoading(true)
    apiResource.staticsType(p).then(data=>{
      if(!data){
        return
      }

      setStaticsTypeData(data)
      setStaticsTypeLoading(false)
    })
  }

  const fetchStaticsName = (action, date) => {
    const p = {
      date: date || staticsNameDateChoose,
      action: action === 'all' ? null : staticsNameActionChoose,
    }
    setStaticsNameLoading(true)
    apiResource.staticsResourceName(p).then(data=>{
      if(!data){
        return
      }
      setStaticsNameData(data)
      setStaticsNameLoading(false)
    })
  }

  const fetchStaticsKeywords = (date) => {
    const p = {
      date: date || staticsKeywordsChoose,
      type: 'resourceSearchInput',
    }
    setStaticsKeywordsLoading(true)
    apiResource.staticsKeywords(p).then(data=>{
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
        <div className="module-title mar-20">埋点数据源</div>
        <div className="table-wrap">
          <Table
            bordered
            dataSource={list}
            loading={tableLoading}
            scroll={{x: '100%'}}
            pagination={false}
            size="small"
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
            <Column title="资源标题" dataIndex="resourceTitle" key="resourceTitle" width={200} align="center" />
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
            <Column title="ip" dataIndex="ip" key="ip" width={100} align="center" />
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
        <div className="module-title mar-l20 mar-t20 mar-b10">事件类型统计</div>
        <Spin tip="加载中..." spinning={staticsTypeLoading}>
          <div className="chart-view-wrap mar-l20">
            <Radio.Group
              options={dateSelectOptions}
              optionType="button"
              buttonStyle="solid"
              onChange={(e)=>{
                setStaticsTypeChoose(e.target.value)
                fetchStaticsType(e.target.value)
              }}
              value={staticsTypeChoose}
            />
            <ChartView data={staticsTypeData} id="clueStaticsType" type="bar" length={staticsTypeData ? staticsTypeData.length : 0} />
          </div>
        </Spin>
      </div>

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">资源浏览统计</div>
        <Spin tip="加载中..." spinning={staticsNameLoading}>
          <div className="chart-view-wrap mar-l20">
            <div className="mar-b20 FBH">
              <div className="condition-title color-orange mar-r10">事件类型：</div>
              <Radio.Group
                options={actionSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsNameActionChoose(e.target.value)
                  fetchStaticsName( e.target.value)
                }}
                value={staticsNameActionChoose}
              />
            </div>
            <div className="FBH">
              <div className="condition-title color-orange mar-r10">时间跨度：</div>
              <Radio.Group
                options={dateSelectOptions}
                optionType="button"
                buttonStyle="solid"
                onChange={(e)=>{
                  setStaticsNameDateChoose(e.target.value)
                  fetchStaticsName(null, e.target.value)
                }}
                value={staticsNameDateChoose}
              />
            </div>
            <ChartView data={staticsNameData} id="resourceStaticsName" type="bar" length={staticsNameData ? staticsNameData.length : 0} />
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
            <ChartView data={staticsKeywordsData} id="resourceStaticsKeywords" type="bar" length={staticsKeywordsData ? staticsKeywordsData.length : 0} />
          </div>
        </Spin>
      </div>

    </div>
  )
}

export default ViewModule

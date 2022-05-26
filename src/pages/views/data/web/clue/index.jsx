import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiClue from '@api/clue'
import {Table, Button, Input, Tag, DatePicker, Pagination, Modal, message, Radio, Spin} from 'antd';
import {
  SearchOutlined,
} from "@ant-design/icons";
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN'
import ExportJsonExcel from 'js-export-excel';
import ChartView from '@components/charts/antv/normalChart'
import ChartViewBar from '@components/charts/antv/barChartV'

const {Column} = Table;
const {RangePicker} = DatePicker
moment.locale('zh-cn');

const IndexModule = () => {

  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(null)
  const [searchDate, setSearchDate] = useState([])
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中

  const [downloadVisible, setDownloadVisible] = useState(false)

  const [staticsTypeChoose, setStaticsTypeChoose] = useState('all')
  const [staticsTypeLoading, setStaticsTypeLoading] = useState(false)
  const [staticsTypeData, setStaticsTypeData] = useState(false)

  const [staticsNeedChoose, setStaticsNeedChoose] = useState('all')
  const [staticsNeedLoading, setStaticsNeedLoading] = useState(false)
  const [staticsNeedData, setStaticsNeedData] = useState(false)

  const [staticsOriginHrefChoose, setStaticsOriginHrefChoose] = useState([])
  const [staticsOriginHrefLoading, setStaticsOriginHrefLoading] = useState(false)
  const [staticsOriginHrefData, setStaticsOriginHrefData] = useState(false)

  const dateSelectOptions = [
    {label: '全部', value: 'all'},
    {label: '今天', value: 'last_one_day'},
    {label: '最近三天', value: 'last_three_day'},
    {label: '最近一周', value: 'last_one_week'},
    {label: '最近一个月', value: 'last_one_month'},
    {label: '最近三个月', value: 'last_three_month'},
  ]

  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 10,
    done: false,
  })

  const searchRef = useRef()

  const getList = () => {
    setTableLoading(true)
    const search = searchRef.current.state.value
    const p = {
      page: pageParams.page,
      pageSize: pageParams.pageSize,
    }
    if(searchDate && searchDate.length > 1){
      p.startTime = new Date(searchDate[0])
      p.endTime = new Date(searchDate[1])
    }
    if(search && search !== ''){
      p.searchKey = search
    }
    apiClue.getClueList(p).then(data=>{
      if(!data){
        return
      }
      setTotal(data.total)
      setList(data.list)
      setTableLoading(false)
    })
  }

  const fetchStaticsType = (date) => {
    const p = {
      date: date || staticsTypeChoose,
    }
    setStaticsTypeLoading(true)
    apiClue.staticsType(p).then(data=>{
      if(!data){
        return
      }
      setStaticsTypeData(data)
      setStaticsTypeLoading(false)
    })
  }

  const fetchStaticsNeed = (date) => {
    const p = {
      date: date || staticsNeedChoose,
    }
    setStaticsNeedLoading(true)
    apiClue.staticsNeed(p).then(data=>{
      if(!data){
        return
      }
      setStaticsNeedData(data)
      setStaticsNeedLoading(false)
    })
  }

  const fetchStaticsOriginHref = () => {
    const p = {
      startTime: staticsOriginHrefChoose[0] ? new Date(staticsOriginHrefChoose[0]) : null,
      endTime: staticsOriginHrefChoose[1] ? new Date(staticsOriginHrefChoose[1]) : null,
    }
    apiClue.staticsOriginHref(p).then(data=>{
      if(!data){
        return
      }
      setStaticsOriginHrefData(data)
      setStaticsOriginHrefLoading(false)
    })
  }

  useEffect(()=>{
    fetchStaticsType()
    fetchStaticsNeed()
    fetchStaticsOriginHref()
  },[])

  useEffect(()=>{
    getList()
  },[pageParams])

  const chooseSearchDate = (e,d)=>{
    setSearchDate(d)
  }

  const chooseStaticDate = (e,d)=>{
    setStaticsOriginHrefChoose(d)
  }

  const downloadDataAll = () => {
    const search = searchRef.current.state.value
    const p = {
      page: 1,
      pageSize: 100000,
    }
    if(search && search !== ''){
      p.searchKey = search
    }
    if(searchDate && searchDate.length > 1){
      p.startTime = new Date(searchDate[0])
      p.endTime = new Date(searchDate[1])
    }
    setTableLoading(true)
    apiClue.getClueList(p).then(data=>{
      downloadToExcel(data.list)
      setTableLoading(false)
    })
  }

  const downloadToExcel = (downloadList) => {
    if(!downloadList || downloadList.length < 1){
      message.error('没有要下载的数据!')
      return
    }
    const option = {}
    const dataTable = []
    downloadList.forEach((item, index) => {
      dataTable.push({
        order: index + 1,
        name: item.name,
        phone: item.phone,
        email: item.email,
        company: item.company,
        position: item.position,
        need: item.need,
        date: item.date,
        origin: item.origin,
        type: item.type,
        originHref: item.originHref,
        ip: item.ip,
        createTime: item.createTime,
        modifyTime: item.modifyTime,
      })
    })

    option.fileName = '官网线索下载'
    option.datas=[
      {
        sheetData: dataTable,
        sheetName: 'sheet',
        sheetFilter: ['order','date','name','company','position','phone','email','need','origin','type','originHref','ip'],
        sheetHeader: ['序号','日期','名字','公司名称','职位','手机号码','邮箱','需求','来源','来源类型','来源入口','ip'],
      },
    ]
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    setDownloadVisible(false)
  }

  return (
    <div className="app-cache-container">
      <div className="module-search-view-wrap">
        <Tag color="#4169E1" className="search-title" icon={<SearchOutlined />}>筛选</Tag>
        <div className="search-container mar-t20">
          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">关键词：</div>
            <Input
              className="search-input"
              allowClear
              ref={searchRef}
              placeholder="请输入名字/key"
            />
          </div>
          <div className="FBH FBAC mar-l20 h-80">
            <div className="n-title mar-r10">指定日期：</div>
            <RangePicker
              locale={locale}
              placeholder={['开始时间','结束时间']}
              onChange={chooseSearchDate}
              className="normal-date-picker"
            />
          </div>
        </div>
        <div className="button-view-wrap">
          <Button
            className="btn-info mar-r20"
            onClick={()=>{
              searchRef.current.handleReset()
              setSearchDate([])
            }}
          >
            清空条件
          </Button>
          <Button
            className="btn-primary mar-r20"
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
      </div>
      <div className="module-view-wrap min-h-200">
        <Button type="primary mar-t20 mar-l20" onClick={()=>{setDownloadVisible(true)}}>导出线索excel数据</Button>
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
              render={(status, value,index)=>{
                return (
                  <span>{index + 1}</span>
                )
              }}
            />
            <Column title="名字" dataIndex="name" key="name" width={100} align="center" />
            <Column title="电话" dataIndex="phone" key="phone" width={150} align="center" />
            <Column title="公司" dataIndex="company" key="company" width={150} align="center" />
            <Column title="职位" dataIndex="position" key="position" width={150} align="center" />
            <Column title="需求" dataIndex="need" key="need" width={150} align="center" />
            <Column title="时间" dataIndex="date" key="date" width={150} align="center" />
            <Column title="来源" dataIndex="origin" key="origin" width={150} align="center" />
            <Column title="来源类型" dataIndex="type" key="type" width={150} align="center" />
            <Column title="来源入口" dataIndex="originHref" key="originHref" width={150} align="center" />
            <Column title="ip" dataIndex="ip" key="ip" width={150} align="center" />
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
        <div className="module-title mar-l20 mar-t20 mar-b10">来源类型统计</div>
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
            <ChartView data={staticsTypeData} id="clueStaticsType" type="bar" length={staticsTypeData.length} />
          </div>
        </Spin>
      </div>

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">需求分类统计</div>
        <Spin tip="加载中..." spinning={staticsNeedLoading}>
          <div className="chart-view-wrap mar-l20">
            <Radio.Group
              options={dateSelectOptions}
              optionType="button"
              buttonStyle="solid"
              onChange={(e)=>{
                setStaticsNeedChoose(e.target.value)
                fetchStaticsNeed(e.target.value)
              }}
              value={staticsNeedChoose}
            />
            <ChartView data={staticsNeedData} id="clueStaticsNeed" type="bar" length={staticsNeedData.length} />
          </div>
        </Spin>
      </div>

      <div className="module-view-wrap min-h-200">
        <div className="module-title mar-l20 mar-t20 mar-b10">来源入口统计</div>
        <Spin tip="加载中..." spinning={staticsOriginHrefLoading}>
          <div className="chart-view-wrap mar-l20">
            <div className="FBH FBAC h-40">
              <RangePicker
                placeholder={['开始时间','结束时间']}
                onChange={chooseStaticDate}
                className="normal-date-picker"
              />
              <Button
                className="btn-primary mar-l20"
                onClick={()=>{
                  fetchStaticsOriginHref()
                }}
              >
                查询
              </Button>
              <div className="color-orange mar-l10">(注：不指定日期则查询全部)</div>

            </div>
            <ChartViewBar
              data={staticsOriginHrefData}
              id="clueStaticsOriginHref"
              aliasString="线索来源入口统计（个）"
              length={staticsOriginHrefData.length}
            />
          </div>
        </Spin>
      </div>

      <Modal
        visible={downloadVisible}
        className="sample-view-modal"
        width={400}
        title="确定要下载当前筛选条件下的所有数据吗？"
        cancelText="取消"
        okText="确定"
        onOk={()=>{
          downloadDataAll()
        }}
        onCancel={()=>{
          setDownloadVisible(false)
        }}
      />

    </div>
  )
}

export default IndexModule

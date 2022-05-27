import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiResource from '@api/resource'
import {message, Table, Button, Modal, Input, Tag, Select, Pagination} from 'antd';
import {SearchOutlined} from "@ant-design/icons";

const {Column} = Table;
const {Option} = Select

const ViewModule = (props) => {

  const {history} = props

  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(0)
  const [category, setCategory] = useState([])
  const [categoryMap, setCategoryMap] = useState({})
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [searchStatus, setSearchStatus] = useState(2)
  const [searchCategory, setSearchCategory] = useState('all')
  const [orderSort, setOrderSort] = useState(null)
  const [downloadSort, setDownloadSort] = useState(null)

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [handleId, setHandleId] = useState(null)
  const [sortNumber, setSortNumber] = useState(null)    //  排序的序号绑定值
  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗显示

  const [categorySelectLoading, setCategorySelectLoading] = useState(true)
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
    if(searchStatus !== 2 && searchStatus !== '2') {
      p.status = searchStatus
    }
    if(searchCategory !== 'all') {
      p.category = searchCategory
    }
    if(orderSort && orderSort !== ''){
      p.orderSort = orderSort
    }
    if(downloadSort && downloadSort !== ''){
      p.downloadSort = downloadSort
    }
    if(search && search !== ''){
      p.searchKey = search
    }

    apiResource.getResourceList(p).then(data=>{
      if(!data){
        return
      }
      setTotal(data.total)
      setList(data.list)
      setTableLoading(false)
    })
  }

  const getCategory = () => {
    apiResource.getCategoryOnlineList().then(data=>{
      if(!data){
        return
      }
      const tmp = {}
      data.forEach(item=>{
        tmp[item.key] = item
      })
      setCategory(data)
      setCategoryMap(tmp)
      setCategorySelectLoading(false)
    })
  }

  useEffect(()=>{
    getCategory()
  },[])

  useEffect(()=>{
    getList()
  },[orderSort, pageParams, downloadSort])

  const updateStatus = (id, status) => {
    updateItem(id,{status})
  }

  const updateItem = (id, content) => {
    apiResource.updateResource({id, content}).then(()=>{
      message.success('修改成功！')
      getList()
      setSortNumber(null)
      setSortVisible(false)
      setHandleId(null)
    })
  }

  const updateSort = () => {
    const id = handleId
    const order = sortNumber - 0
    const content = {order}
    updateItem(id, content)
  }

  const deleteItem = () => {
    const id = handleId
    apiResource.deleteResource({id}).then(()=>{
      message.success('修改成功！')
      getList()
      setDeleteVisible(false)
    })
  }

  const getCategoryKey = (key) => {
    if(!key || key === ''){
      return ''
    }
    return categoryMap[key] ? categoryMap[key].name : ''
  }

  return (
    <div className="resource-list-container">
      <div className="module-search-view-wrap">
        <Tag color="#4169E1" className="search-title" icon={<SearchOutlined />}>筛选</Tag>
        <div className="search-container mar-t20">
          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">资源名字：</div>
            <Input
              className="search-input"
              allowClear
              ref={searchRef}
              placeholder="请输入标题/描述/日期/类型"
            />
          </div>
          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">上线：</div>
            <Select
              className="search-select"
              value={searchStatus}
              onChange={
                (e)=>{
                  setSearchStatus(e)
                }
              }
            >
              <Option value={2}>全部</Option>
              <Option value={1}>已上线</Option>
              <Option value={0}>已下线</Option>
            </Select>
          </div>
          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">岗位分类：</div>
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
              {
                category.map(item=>{
                  return (
                    <Option key={item.key} value={item.key}>{item.name}</Option>
                  )
                })
              }

            </Select>
          </div>
        </div>
        <div className="button-view-wrap">
          <Button
            className="btn-info mar-r20"
            onClick={()=>{
              searchRef.current.handleReset()
              setSearchStatus(2)
              setSearchCategory('all')
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
        <div className="FBH mar-t20 mar-b20">
          <Button
            className="btn-success mar-l20"
            onClick={()=>{
              history.push({pathname: '/admin/web/resource/detail',state: {edit: 'Y', new: 'Y'}, search: '?new=Y'})
            }}
          >
            新增资源
          </Button>
          <Button
            className="btn-primary mar-l20"
            onClick={()=>{
              history.push({pathname: '/admin/web/resource/column'})
            }}
          >
            栏目管理
          </Button>
          <Button
            className="btn-primary mar-l20"
            onClick={()=>{
              history.push({pathname: '/admin/web/resource/category'})
            }}
          >
            分类管理
          </Button>
        </div>
        <div className="table-wrap">
          <Table
            bordered
            dataSource={list}
            loading={tableLoading}
            scroll={{x: '100%'}}
            onChange={(pagination,filters,sorter)=>{
              if(sorter){
                if(sorter.columnKey === 'order'){
                  setOrderSort(sorter.order)
                } else if (sorter.columnKey === 'download'){
                  setDownloadSort(sorter.order)
                }
              }
            }}
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
            <Column title="标题" dataIndex="title" key="title" width={120} align="center" />
            <Column title="描述" dataIndex="desc" key="desc" width={200} align="center" />
            <Column
              title="分类"
              width={100}
              align="center"
              render={(status)=>{
                return (
                  <span>{getCategoryKey(status.key)}</span>
                )
              }}
            />
            <Column title="日期" dataIndex="date" key="date" width={100} align="center" />
            <Column title="大小" dataIndex="size" key="size" width={100} align="center" />
            <Column title="类型" dataIndex="type" key="type" width={100} align="center" />
            <Column
              title="标签"
              width={100}
              align="center"
              render={(status)=>{
                return (
                  (status.tag || []).map((item,index)=>{
                    return (
                      <span>
                        {item}
                        {index < status.tag.length - 1 ? ',' : ''}
                      </span>
                    )
                  })
                )
              }}
            />
            <Column
              title="状态"
              width={80}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.status === 1 ? <span className="color-success">已上线</span> : <span className="color-red">已下线</span>
                    }
                  </>
                )
              }}
            />
            <Column title="下载量" dataIndex="download" key="download" sorter sortOrder={downloadSort} width={100} align="center" />
            <Column title="排序" dataIndex="order" sorter sortOrder={orderSort} key="order" width={80} align="center" />
            <Column
              title="操作"
              width={200}
              fixed="right"
              align="center"
              render={(state)=> {
                return (
                  <div>
                    <Button
                      className="btn-primary mar-10"
                      onClick={()=>{
                        history.push({pathname: '/admin/web/resource/detail', state: {id: state._id, edit: 'Y'}, search: '?id=' + state._id + '&edit=Y'})
                      }}
                    >
                      编辑
                    </Button>
                    {
                      state.status === 1 ? (
                        <Button
                          className="btn-warning mar-10"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 0)
                            }
                          }
                        >
                          下线
                        </Button>
                      ) : (
                        <Button
                          className="btn-success mar-10"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 1)
                            }
                          }
                        >
                          上线
                        </Button>
                      )
                    }
                    <Button
                      className="btn-tag mar-10"
                      onClick={
                        ()=>{
                          setHandleId(state._id)
                          setSortNumber(state.order)
                          setSortVisible(true)
                        }
                      }
                    >
                      排序
                    </Button>
                    <Button
                      className="btn-delete mar-10"
                      onClick={
                        ()=>{
                          setHandleId(state._id)
                          setDeleteVisible(true)
                        }
                      }
                    >
                      删除
                    </Button>
                  </div>
                ) }}
            />
          </Table>
          {
            list.length > 0 ? (
              <div className="FBH FBAC FBJC mar-t40">
                <Pagination
                  current={pageParams.page}
                  onChange={e=>{
                    setPageParams({...pageParams,page: e})
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

      <Modal
        visible={deleteVisible}
        className="sample-view-modal"
        width={400}
        title="确定要删除吗（不可恢复）？"
        cancelText="取消"
        okText="确定"
        onOk={()=>{
          deleteItem()
        }}
        onCancel={()=>{
          setDeleteVisible(false)
          setHandleId(null)
        }}
      />

      <Modal
        visible={sortVisible}
        centered
        width={300}
        className="sort-module-view-wrap"
        title="排序（序号越大，越靠前）"
        okText="保存"
        cancelText="取消"
        onOk={updateSort}
        onCancel={()=>{
          setHandleId(null)
          setSortNumber(null)
          setSortVisible(false)
        }}
      >
        <div className="FBH FBAC FBJC">
          <Input
            type="number"
            className="sort-input"
            onChange={e =>{ setSortNumber(e.target.value - 0)}}
            value={sortNumber}
          />
        </div>
      </Modal>

    </div>
  )
}

export default ViewModule

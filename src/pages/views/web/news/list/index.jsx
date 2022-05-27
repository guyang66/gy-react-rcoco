import React, {useState, useEffect, useRef} from "react";
import "./index.styl";
import apiNews from '@api/news'
import {message, Table, Button, Modal, Input, Tag, Select, Pagination} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import utils from '@utils'

const {Column} = Table;
const {Option} = Select

const ViewModule = (props) => {
  const {history} = props

  const [list, setList] = useState([])  // table 数据源
  const [total, setTotal] = useState(0)
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [searchStatus, setSearchStatus] = useState(2)
  const [searchCategory, setSearchCategory] = useState('all')
  const [searchIsRecommend, setSearchIsRecommend] = useState(2)
  const [searchIsHot, setSearchIsHot] = useState(2)
  const [searchIsTop, setSearchIsTop] = useState(2)

  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源
  const [orderSort, setOrderSort] = useState(null)
  const [viewCountSort, setViewCountSort] = useState(null)

  const [categoryMap, setCategoryMap] = useState({})
  const [categories, setCategories] = useState([])
  const [categorySelectLoading, setCategorySelectLoading] = useState(true)

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [handleId, setHandleId] = useState(null)
  const [sortNumber, setSortNumber] = useState(null)    //  排序的序号绑定值
  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗显示

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
    if(searchIsTop !== 2 && searchIsTop !== '2') {
      p.isTop = searchIsTop
    }
    if(searchIsRecommend !== 2 && searchIsRecommend !== '2') {
      p.isRecommend = searchIsRecommend
    }
    if(searchIsHot !== 2 && searchIsHot !== '2') {
      p.isHot = searchIsHot
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
    if(viewCountSort && viewCountSort !== ''){
      p.viewCountSort = viewCountSort
    }
    if(search && search !== ''){
      p.searchKey = search
    }

    apiNews.getNewsList(p).then(data=>{
      if(!data){
        return
      }
      setTotal(data.total)
      setList(data.list)
      setTableLoading(false)
    })
  }

  const getCategory = () => {
    apiNews.getNewsCategoryOnline().then(data=>{
      if(!data){
        return
      }
      const tmp = {}
      data.forEach(item=>{
        tmp[item.key] = item
      })
      setCategories(data)
      setCategoryMap(tmp)
      setCategorySelectLoading(false)
    })
  }

  useEffect(()=>{
    getCategory()
  },[])

  useEffect(()=>{
    getList()
  },[orderSort,pageParams,viewCountSort])

  const updateStatus = (id, value, key) => {
    if(key === 'status'){
      updateItem(id,{status: value})
      return
    }
    if(key === 'isTop'){
      updateItem(id,{isTop: value})
      return
    }
    if(key === 'isRecommend'){
      updateItem(id,{isRecommend: value})
      return
    }
    if(key === 'isHot'){
      updateItem(id,{isHot: value})
    }
  }

  const updateItem = (id, content) => {
    apiNews.updateNews({id, content}).then(()=>{
      message.success('修改成功！')
      getList()
      setCheckItem({})
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
    const id = checkItem._id
    apiNews.deleteNews({id}).then(()=>{
      message.success('修改成功！')
      getList()
      setDeleteVisible(false)
      setCheckItem({})
    })
  }

  const getCategoryKey = (key) => {
    if(!key || key === ''){
      return ''
    }
    return categoryMap[key] ? categoryMap[key].name : ''
  }

  return (
    <div className="news-list-container">
      <div className="module-search-view-wrap">
        <Tag color="#4169E1" className="search-title" icon={<SearchOutlined />}>筛选</Tag>
        <div className="search-container mar-t20">
          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">名字：</div>
            <Input
              className="search-input"
              allowClear
              ref={searchRef}
              placeholder="请输入标题/概要/日期..."
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
            <div className="cell-title">是否是置顶：</div>
            <Select
              className="search-select"
              value={searchIsTop}
              onChange={
                (e)=>{
                  setSearchIsTop(e)
                }
              }
            >
              <Option value={2}>全部</Option>
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </Select>
          </div>

          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">是否是推荐：</div>
            <Select
              className="search-select"
              value={searchIsRecommend}
              onChange={
                (e)=>{
                  setSearchIsRecommend(e)
                }
              }
            >
              <Option value={2}>全部</Option>
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </Select>
          </div>

          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">是否是热门：</div>
            <Select
              className="search-select"
              value={searchIsHot}
              onChange={
                (e)=>{
                  setSearchIsHot(e)
                }
              }
            >
              <Option value={2}>全部</Option>
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </Select>
          </div>

          <div className="FBH FBAC mar-l20 h-40">
            <div className="cell-title">分类：</div>
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
                categories.map(item=>{
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
              setSearchIsTop(2)
              setSearchIsRecommend(2)
              setSearchIsHot(2)
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
              history.push({pathname: '/admin/web/news/detail',state: {edit: 'Y', new: 'Y'}, search: '?new=Y'})
            }}
          >
            新增文章
          </Button>
          <Button
            className="btn-primary mar-l20"
            onClick={()=>{
              history.push({pathname: '/admin/web/news/category'})
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
                } else if (sorter.columnKey === 'viewCount'){
                  setViewCountSort(sorter.order)
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
            <Column title="标题" dataIndex="title" key="title" width={150} align="center" />
            <Column
              title="概要"
              width={200}
              align="center"
              render={status=>{
                return (
                  <span className="summary-text">{status.summary}</span>
                )
              }}
            />
            <Column
              title="封面"
              width={140}
              align="center"
              render={status=>{
                return (
                  <>
                    {
                      status.cover ? <img className="cover-img" src={utils.getFixUrl(status.cover)} alt="封面图" /> : null
                    }
                  </>
                )
              }}
            />
            <Column title="日期" dataIndex="date" key="date" width={100} align="center" />
            <Column
              title="分类"
              width={100}
              align="center"
              render={status=>{
                return getCategoryKey(status.type)
              }}
            />
            <Column title="作者" dataIndex="author" key="author" width={100} align="center" />
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
            <Column
              title="是否推荐"
              width={80}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.isRecommend ? <span className="color-success">是</span> : <span>否</span>
                    }
                  </>
                )
              }}
            />
            <Column
              title="是否热门"
              width={80}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.isHot ? <span className="color-success">是</span> : <span>否</span>
                    }
                  </>
                )
              }}
            />
            <Column
              title="是否置顶"
              width={80}
              align="center"
              render={(status)=>{
                return (
                  <>
                    {
                      status.isTop ? <span className="color-success">是</span> : <span>否</span>
                    }
                  </>
                )
              }}
            />

            <Column title="浏览量" dataIndex="viewCount" sorter sortOrder={viewCountSort} key="viewCount" width={80} align="center" />
            <Column title="排序" dataIndex="order" sorter sortOrder={orderSort} key="order" width={80} align="center" />
            <Column
              title="操作"
              width={300}
              fixed="right"
              align="center"
              render={(state)=> {
                return (
                  <div>
                    <Button
                      className="btn-primary mar-10"
                      onClick={()=>{
                        history.push({pathname: '/admin/web/news/detail', state: {id: state._id, edit: 'Y'}, search: '?id=' + state._id + '&edit=Y'})
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
                              updateStatus(state._id, 0, 'status')
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
                              updateStatus(state._id, 1, 'status')
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

                    {
                      state.isTop === 1 ? (
                        <Button
                          className="btn-warning mar-10"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 0, 'isTop')
                            }
                          }
                        >
                          取消置顶
                        </Button>
                      ) : (
                        <Button
                          className="btn-nature mar-10"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 1, 'isTop')
                            }
                          }
                        >
                          置顶
                        </Button>
                      )
                    }

                    {
                      state.isHot === 1 ? (
                        <Button
                          className="btn-warning mar-10"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 0, 'isHot')
                            }
                          }
                        >
                          取消热门
                        </Button>
                      ) : (
                        <Button
                          className="btn-warm mar-10"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 1, 'isHot')
                            }
                          }
                        >
                          设置热门
                        </Button>
                      )
                    }

                    {
                      state.isRecommend === 1 ? (
                        <Button
                          className="btn-warning mar-10"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 0, 'isRecommend')
                            }
                          }
                        >
                          取消推荐
                        </Button>
                      ) : (
                        <Button
                          className="btn-folk mar-10"
                          onClick={
                            ()=>{
                              updateStatus(state._id, 1, 'isRecommend')
                            }
                          }
                        >
                          设置推荐
                        </Button>
                      )
                    }

                    <Button
                      className="btn-delete mar-10"
                      onClick={
                        ()=>{
                          setCheckItem(state)
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
          setCheckItem({})
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
          setSortVisible(false)
          setCheckItem({})
          setHandleId(null)
          setSortNumber(null)
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

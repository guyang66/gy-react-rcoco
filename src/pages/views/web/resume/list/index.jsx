import React , {useState, useEffect, useRef} from "react";
import {withRouter} from "react-router-dom";
import "./index.styl";
import {Tag, Input, Button, Tabs, message, Table, Pagination, Select, Modal} from 'antd'
import apiResume from '@api/resume'
import {SearchOutlined} from '@ant-design/icons'

const {TabPane} = Tabs;
const {Column} = Table;
const {Option} = Select

const ResumeModule = (props) => {

  const {history} = props

  const [column, setColumn] = useState([])
  const [tabKey, setTabKey] = useState('')
  const [searchStatus, setSearchStatus] = useState(2)
  const [searchCategory, setSearchCategory] = useState('all')
  const [searchPlace, setSearchPlace] = useState('all')

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [handleId, setHandleId] = useState(null)

  const [placeMap, setPlaceMap] = useState({})
  const [places, setPlaces] = useState([])
  const [categoryMap, setCategoryMap] = useState({})
  const [categories, setCategories] = useState([])
  const [categorySelectLoading, setCategorySelectLoading] = useState(true)
  const [placeSelectLoading, setPlaceSelectLoading] = useState(true)

  const [pageParams, setPageParams] = useState({
    page: 1,
    pageSize: 10,
    done: false,
  })

  const searchRef = useRef()

  const getColumn = () => {
    apiResume.getResumeColumn().then(data=>{
      if(!data || data.length < 1){
        return
      }
      // 包装一层数据集
      const tmp = []
      data.forEach(item=>{
        item.list = [] // table渲染数据
        item.total = 0
        item.loading = true // table是否加载完成
        tmp.push(item)
      })
      setColumn(data)
      // 初始化第一个tab
      setTabKey(data[0].key)
    })
  }

  const getCategory = () => {
    apiResume.getResumeCategory().then(data=>{
      if(!data || data.length < 1){
        return
      }
      const map = {}
      data.forEach(item=>{
        map[item.key] = item
      })
      setCategoryMap(map)
      setCategories(data)
      setCategorySelectLoading(false)
    })
  }

  const getPlace = () => {
    apiResume.getResumePlace().then(data=>{
      if(!data || data.length < 1){
        return
      }
      // 包装一层数据集
      const map = {}
      data.forEach(item=>{
        map[item.key] = item
      })
      setPlaceMap(map)
      setPlaces(data)
      setPlaceSelectLoading(false)
    })
  }

  const modifyMapData = (key, obj)=>{
    if(column.length < 1){
      return
    }
    const newData = []
    column.forEach(item=>{
      if(item.key === key){
        item.list = obj.list
        item.total = obj.total
        item.loading = false
        newData.push(item)
      } else {
        newData.push(item)
      }
    })
    setColumn(JSON.parse(JSON.stringify(newData)))
  }

  const getList = (columnKey) => {
    const search = searchRef.current.state.value
    const p = {
      column: columnKey,
      page: pageParams.page,
      pageSize: pageParams.pageSize,
    }
    if(searchStatus !== 2 && searchStatus !== '2') {
      p.status = searchStatus
    }
    if(searchCategory !== 'all') {
      p.category = searchCategory
    }
    if(searchPlace !== 'all') {
      p.place = searchPlace
    }
    if(search && search !== ''){
      p.searchKey = search
    }

    apiResume.getResumeList(p).then(data=>{
      modifyMapData(tabKey, data)
    }).catch(error=>{
      message.error(error.message)
    })
  }

  useEffect(()=>{
    getColumn()
    getCategory()
    getPlace()
  },[])

  useEffect(()=>{
    getList(tabKey)
  },[tabKey, pageParams])

  const updateStatus = (id, status)=> {
    apiResume.updateResume({id, content: {status}}).then(()=>{
      message.success('修改成功！')
      getList(tabKey)
    }).catch(error=>{
      message.error(error.message)
    })
  }

  const deleteItem = (id) => {
    apiResume.deleteResume({id}).then(()=>{
      message.success('删除成功！')
      getList(tabKey)
    }).catch(error=>{
      message.error(error.message)
    }).finally(()=>{
      setIsModalVisible(false)
      setHandleId(null)
    })
  }

  const tabChange = (e) => {
    setTabKey(e)
    setPageParams({
      page: 1,
      pageSize: 10,
      done: false,
    })
  }

  const getStringByKey = (key, type) => {
    if(!key){
      return ''
    }
    if(type === 'place'){
      return placeMap[key].name ? placeMap[key].name : key
    }
    if(type === 'category'){
      return categoryMap[key].name ? categoryMap[key].name : key
    }
    return key
  }

  return (
    <div className="resume-list-container">
      <div className="resume-search-wrap">
        <Tag color="#4169E1" className="search-title" icon={<SearchOutlined />}>筛选</Tag>
        <div className="search-container">
          <div className="FBH FBAC mar-l20 h-80">
            <div className="n-title">岗位名字：</div>
            <Input
              className="n-input mar-l10"
              allowClear
              ref={searchRef}
              placeholder="请输入标题/岗位/描述"
            />
          </div>
          <div className="FBH FBAC mar-l20 h-80">
            <div className="n-title">上线：</div>
            <Select
              className="n-search"
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
          <div className="FBH FBAC mar-l20 h-80">
            <div className="n-title">岗位分类：</div>
            <Select
              className="n-search"
              value={searchCategory}
              loading={categorySelectLoading}
              onChange={
                (e)=>{
                  console.log(e)
                  setSearchCategory(e)
                }
              }
            >
              <Option value="all">全部</Option>
              {
                categories.map(item=>{
                  return (
                    <Option key={item.key} value={item.key}>{item.name}</Option>
                  )
                })
              }

            </Select>
          </div>
          <div className="FBH FBAC mar-l20 h-80">
            <div className="n-title">地区分类：</div>
            <Select
              className="n-search"
              value={searchPlace}
              loading={placeSelectLoading}
              onChange={
                (e)=>{
                  setSearchPlace(e)
                }
              }
            >
              <Option value="all">全部</Option>
              {
                places.map(item=>{
                  return (
                    <Option key={item.key} value={item.key}>{item.name}</Option>
                  )
                })
              }
            </Select>
          </div>
        </div>
        <div className="btns-container">
          <Button
            className="btn-info mar-r20"
            onClick={()=>{
              searchRef.current.handleReset()
              setSearchStatus(2)
              setSearchCategory('all')
              setSearchPlace('all')
            }}
          >
            清空条件
          </Button>
          <Button
            className="btn-primary mar-r20"
            onClick={()=>{
              getList(tabKey)
            }}
          >
            筛 选
          </Button>
        </div>
      </div>

      <div className="resume-table-wrap">
        <Tabs onChange={tabChange} type="card" className="tabs-wrap">
          {
            column.map((item) =>{
              return (
                <TabPane tab={item.name} key={item.key}>
                  {
                    <Table
                      key={item.key}
                      bordered
                      rowKey={(record) => record._id}
                      dataSource={item.list}
                      loading={item.loading}
                      scroll={{x: '100%'}}
                      pagination={false}
                    >
                      <Column
                        title="序号"
                        width={40}
                        align="center"
                        render={(status, value,index)=>{
                          return (
                            <span>{index + 1}</span>
                          )
                        }}
                      />
                      <Column title="标题" dataIndex="title" key="title" width={100} align="center" />
                      <Column
                        title="描述"
                        width={200}
                        align="center"
                        render={(status)=>{
                          return (
                            <>
                              {
                                status.desc && status.desc !== '' ? (
                                  <span>{status.desc}</span>
                                ) : <span>无</span>
                              }
                            </>
                          )
                        }}
                      />
                      <Column title="部门" dataIndex="department" key="department" width={100} align="center" />
                      <Column
                        title="城市/区域"
                        width={100}
                        align="center"
                        render={(status)=>{
                          return (
                            <span>
                              {getStringByKey(status.place, 'place')}
                            </span>
                          )
                        }}
                      />
                      <Column
                        title="岗位分类"
                        width={100}
                        align="center"
                        render={(status)=>{
                          return (
                            <>
                              <span>
                                {getStringByKey(status.category, 'category')}
                              </span>
                            </>
                          )
                        }}
                      />
                      <Column title="发布时间" dataIndex="date" releaseDate="date" width={100} align="center" />
                      <Column
                        title="状态"
                        width={80}
                        align="center"
                        render={(status)=>{
                          return (
                            <>
                              {
                                status.status === 1 ? <span style={{color: '#67c23a'}}>已上线</span> : <span style={{color: "red"}}>已下线</span>
                              }
                            </>
                          )
                        }}
                      />
                      <Column
                        title="是否置顶"
                        width={60}
                        align="center"
                        render={(status)=>{
                          return (
                            <span>{status.isTop === 1 ? '是' : '否'}</span>
                          )
                        }}
                      />
                      <Column
                        title="其他"
                        width={100}
                        align="center"
                        render={(status)=>{
                          return (
                            <>
                              <span>
                                {status.experience}
                                ,
                              </span>
                              <span>{status.education}</span>
                            </>
                          )
                        }}
                      />
                      <Column
                        title="操作"
                        width={200}
                        fixed="right"
                        align="center"
                        render={(status)=>{
                          return (
                            <div className="FBH FBJC" style={{flexWrap: 'wrap'}}>
                              <Button
                                className="btn-nature mar-10"
                                onClick={()=>{
                                  history.push({pathname: '/admin/web/resume/detail', state: {id: status._id}})
                                }}
                              >
                                详情
                              </Button>
                              <Button
                                className="btn-primary mar-10"
                                onClick={()=>{
                                  history.push({pathname: '/admin/web/resume/detail', state: {id: status._id, edit: 'Y'}, search: '?edit=Y'})
                                }}
                              >
                                编辑
                              </Button>
                              {
                                status.status === 1 ? (
                                  <Button
                                    className="btn-warning mar-10"
                                    onClick={
                                      ()=>{
                                        updateStatus(status._id,0)
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
                                        updateStatus(status._id,1)
                                      }
                                    }
                                  >
                                    上线
                                  </Button>
                                )
                              }
                              <Button
                                className="btn-delete mar-10"
                                onClick={
                                  ()=>{
                                    setHandleId(status._id)
                                    setIsModalVisible(true)
                                  }
                                }
                              >
                                删除
                              </Button>
                            </div>
                          )
                        }}
                      />

                    </Table>
                  }
                  {
                    item.list.length > 0 ? (
                      <div className="FBH FBAC FBJC pagination-wrap">
                        <Pagination
                          current={pageParams.page}
                          onChange={e=>{
                            setPageParams({...pageParams,page: e})
                          }}
                          Pagination
                          total={item.total}
                          className="mar-t20"
                        />
                      </div>
                    ) : null
                  }
                </TabPane>
              )
            })
          }
        </Tabs>
        <Button
          className="btn-add"
          type="primary"
          onClick={()=>{
            history.push({pathname: '/admin/web/resume/add'})
          }}
        >
          新增岗位
        </Button>
      </div>

      <Modal
        visible={isModalVisible}
        className="resume-list-normal-modal"
        width={400}
        cancelText="取消"
        okText="确定"
        onOk={()=>{
          deleteItem(handleId)
        }}
        onCancel={()=>{setIsModalVisible(false)}}
      >
        <p className="normal-content">确定要删除该岗位吗？</p>
      </Modal>
    </div>
  )
}

export default withRouter(ResumeModule)

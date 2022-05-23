import React, {useState, useEffect} from "react";
import "./index.styl";
import apiResume from '@api/resume'
import {message, Table, Button, Modal, Input} from 'antd';

const {Column} = Table;

const IndexModule = () => {

  const [categoryList, setCategoryList] = useState([])  // category table 数据源
  const [categoryMap, setCategoryMap] = useState([])
  const [categoryTableLoading, setCategoryTableLoading] = useState(true)

  const [placeList, setPlaceList] = useState([])
  const [placeMap, setPlaceMap] = useState([])
  const [placeTableLoading, setPlaceTableLoading] = useState(true)

  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗显示
  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源
  const [sortNumber, setSortNumber] = useState(null)    //  排序的序号绑定值

  const [currentType, setCurrentType] = useState('') // 当前操作的模块

  const [isAddVisible, setIsAddVisible] = useState(false)

  const getCategoryList = () => {
    setCategoryTableLoading(true)
    apiResume.getCategoryList().then(data=>{
      if(!data){
        return
      }
      const map = {}
      data.list.forEach(item=>{
        map[item.key] = item
      })
      setCategoryMap(map)
      setCategoryList(data.list)
      setCategoryTableLoading(false)
    })
  }

  const getPlaceList = () => {
    setPlaceTableLoading(true)
    apiResume.getPlaceList().then(data=>{
      if(!data){
        return
      }
      const map = {}
      data.list.forEach(item=>{
        map[item.key] = item
      })
      setPlaceMap(map)
      setPlaceList(data.list)
      setPlaceTableLoading(false)
    })
  }

  useEffect(()=>{
    getCategoryList()
    getPlaceList()
  },[])

  const updateStatus = (id, status, key)=> {
    if(key === 'category'){
      apiResume.updateResumeCategory({id, content: {status}}).then(()=>{
        message.success('修改成功！')
        getCategoryList()
      })
    } else if (key === 'place'){
      apiResume.updateResumePlace({id, content: {status}}).then(()=>{
        message.success('修改成功！')
        getPlaceList()
      })
    }
  }

  const deleteItem = (id, key) => {
    if(key === 'category'){
      apiResume.deleteResumeCategory({id}).then(()=>{
        message.success('删除成功！')
        getCategoryList()
      })
    } else if (key === 'place'){
      apiResume.deleteResumePlace({id}).then(()=>{
        message.success('删除成功！')
        getPlaceList()
      })
    }
  }

  const saveOrder = () => {
    const id = checkItem._id
    const content = {
      order: sortNumber,
    }
    if(currentType === 'category'){
      apiResume.updateResumeCategory({id, content}).then(()=>{
        message.success('修改成功！')
        getCategoryList()
        setSortNumber(null)
        setCheckItem({})
        setSortVisible(false)
        setCurrentType('')

      })
    } else if(currentType === 'place'){
      apiResume.updateResumePlace({id, content}).then(()=>{
        message.success('修改成功！')
        getPlaceList()
        setSortNumber(null)
        setCheckItem({})
        setSortVisible(false)
        setCurrentType('')

      })
    }
  }

  const saveInfo = () => {
    const {key} = checkItem
    if(categoryMap[key] && currentType === 'category'){
      message.warning('key 已存在！')
      return
    }

    if(placeMap[key] && currentType === 'place'){
      message.warning('key 已存在！')
      return
    }

    if(!checkItem.name || checkItem.name === ''){
      message.warning('name不能为空！')
      return
    }

    if(!checkItem.key || checkItem.key === ''){
      message.warning('name不能为空！')
      return
    }

    if(currentType === 'category') {
      apiResume.saveResumeCategory({content:{...checkItem}}).then(()=>{
        message.success('保存成功！')
        getCategoryList()
        setCheckItem({})
        setIsAddVisible(false)
        setCurrentType('')
      })
    } else if (currentType === 'place') {
      apiResume.saveResumePlace({content:{...checkItem}}).then(()=>{
        message.success('保存成功！')
        getPlaceList()
        setCheckItem({})
        setIsAddVisible(false)
        setCurrentType('')
      })
    }
  }

  return (
    <div className="resume-type-container">
      <div className="module-view-wrap min-h-200">
        <div className="FBH FBJ mar-t20 mar-b20">
          <div className="module-title mar-l20">岗位类型分类</div>
          <Button
            className="btn-success mar-r20"
            onClick={()=>{
              setCurrentType('category')
              setIsAddVisible(true)
              setCheckItem({
                order: 1,
                key: '',
                name: '',
                status: 1,
              })
            }}
          >
            新增分类
          </Button>
        </div>
        <div className="table-wrap">
          <Table
            bordered
            size="small"
            rowKey={(record) => record.index}
            dataSource={categoryList}
            loading={categoryTableLoading}
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
            <Column title="名字" dataIndex="name" key="name" width={120} align="center" />
            <Column title="key" dataIndex="key" key="key" width={120} align="center" />
            <Column title="序号" dataIndex="order" key="order" width={120} align="center" />
            <Column
              title="状态"
              width={120}
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
              title="操作"
              width={200}
              fixed="right"
              align="center"
              render={(status)=> {
                return (
                  <div>
                    {
                      status.status === 1 ? (
                        <Button
                          className="btn-danger mar-10"
                          onClick={()=>{
                            updateStatus(status._id, 0, 'category')
                          }}
                        >
                          下线
                        </Button>
                      ) : (
                        <Button
                          className="btn-success mar-10"
                          onClick={()=>{
                            updateStatus(status._id, 1, 'category')
                          }}
                        >
                          上线
                        </Button>
                      )
                    }
                    <Button
                      className="btn-tag mar-10"
                      onClick={()=>{
                        setCurrentType('category')
                        setCheckItem(status)
                        setSortNumber(status.order)
                        setSortVisible(true)
                      }}
                    >
                      排序
                    </Button>
                    <Button className="btn-delete mar-10" onClick={()=>{deleteItem(status._id, 'category')}}>删除</Button>
                  </div>
                ) }}
            />
          </Table>
        </div>
      </div>

      <div className="module-view-wrap min-h-200">
        <div className="FBH FBJ mar-t20 mar-b20">
          <div className="module-title mar-l20">岗位地区分类</div>
          <Button
            className="btn-success mar-r20"
            onClick={()=>{
              setCurrentType('place')
              setIsAddVisible(true)
              setCheckItem({
                order: 1,
                key: '',
                name: '',
                status: 1,
              })
            }}
          >
            新增分类
          </Button>
        </div>
        <div className="table-wrap">
          <Table
            bordered
            size="small"
            rowKey={(record) => record.index}
            dataSource={placeList}
            loading={placeTableLoading}
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
            <Column title="名字" dataIndex="name" key="name" width={120} align="center" />
            <Column title="key" dataIndex="key" key="key" width={120} align="center" />
            <Column title="序号" dataIndex="order" key="order" width={120} align="center" />
            <Column
              title="状态"
              width={120}
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
              title="操作"
              width={200}
              fixed="right"
              align="center"
              render={(status)=> {
                return (
                  <div>
                    {
                      status.status === 1 ? (
                        <Button
                          className="btn-danger mar-10"
                          onClick={()=>{
                            updateStatus(status._id, 0, 'place')
                          }}
                        >
                          下线
                        </Button>
                      ) : (
                        <Button
                          className="btn-success mar-10"
                          onClick={()=>{
                            updateStatus(status._id, 1, 'place')
                          }}
                        >
                          上线
                        </Button>
                      )
                    }
                    <Button
                      className="btn-tag mar-10"
                      onClick={()=>{
                        setCurrentType('place')
                        setCheckItem(status)
                        setSortNumber(status.order)
                        setSortVisible(true)
                      }}
                    >
                      排序
                    </Button>
                    <Button className="btn-delete mar-10" onClick={()=>{deleteItem(status._id, 'place')}}>删除</Button>
                  </div>
                ) }}
            />
          </Table>
        </div>
      </div>

      <Modal
        visible={sortVisible}
        centered
        width={300}
        className="sort-module-view-wrap"
        title="排序（序号越大，越靠前）"
        okText="保存"
        cancelText="取消"
        onOk={saveOrder}
        onCancel={()=>{
          setCheckItem({})
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

      <Modal
        visible={isAddVisible}
        title="新增分类"
        width={400}
        cancelText="取消"
        className="modal-view-wrap"
        okText="确定"
        onOk={()=>{
          saveInfo(checkItem)
        }}
        onCancel={()=>{
          setCheckItem({})
          setIsAddVisible(false)
        }}
      >
        <div>
          <div className="item-cell FBH FBAC">
            <div className="item-title">名字：</div>
            <Input
              placeholder="请输入名字"
              value={checkItem.name}
              onChange={e=>{
                setCheckItem({...checkItem, name: e.target.value})
              }}
            />
          </div>
          <div className="item-cell FBH FBAC">
            <div className="item-title">key：</div>
            <Input
              placeholder="请输入key"
              value={checkItem.key}
              onChange={e=>{
                setCheckItem({...checkItem, key: e.target.value})
              }}
            />
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default IndexModule

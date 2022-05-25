import React, {useState, useEffect} from "react";
import "./index.styl";
import apiNews from '@api/news'
import {message, Table, Button, Modal, Input} from 'antd';

const {Column} = Table;

const IndexModule = () => {

  const [list, setList] = useState([])  // table 数据源
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中
  const [keyMap, setKeyMap] = useState({})

  const [editVisible, setEditVisible] = useState(false) // 编辑弹窗显示
  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [handleId, setHandleId] = useState(null)
  const [sortNumber, setSortNumber] = useState(null)    //  排序的序号绑定值
  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗显示

  const [isAdd, setIsAdd] = useState(false)
  const getList = () => {
    setTableLoading(true)
    apiNews.getNewsCategory().then(data=>{
      if(!data){
        return
      }
      const map = {}
      data.forEach(item=>{
        map[item.key] = item
      })
      setKeyMap(map)
      setList(data)
      setTableLoading(false)
    })
  }

  useEffect(()=>{
    getList()
  },[])

  const handleModal = (state) => {
    setCheckItem(state)
    setIsAdd(false)
    setEditVisible(true)
  }

  const confirmPre = () => {
    const {key} = checkItem
    if(!checkItem.name || checkItem.name === ''){
      message.warning('名字不能为空！')
      return
    }

    if((!checkItem.key || checkItem.key === '') && isAdd){
      message.warning('key不能为空！')
      return
    }

    if(keyMap[key] && isAdd){
      message.warning('key 已存在！')
      return
    }

    const content = {
      name: checkItem.name,
      key: checkItem.key,
    }
    if(isAdd){
      content.status = 1
      content.order = 1
      saveInfo(content)
      return;
    }
    updateItem(checkItem._id, content)
  }

  const updateStatus = (id, status) => {
    updateItem(id,{status})
  }

  const updateItem = (id, content) => {
    apiNews.updateCategory({id, content}).then(()=>{
      message.success('修改成功！')
      getList()
      setCheckItem({})
      setEditVisible(false)
      setSortNumber(null)
      setSortVisible(false)
      setIsAdd(false)
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
    apiNews.deleteCategory({id}).then(()=>{
      message.success('修改成功！')
      getList()
      setDeleteVisible(false)
      setCheckItem({})
    })
  }

  const saveInfo = () => {
    apiNews.saveCategory({content:{...checkItem}}).then(()=>{
      message.success('修改成功！')
      getList()
      setIsAdd(false)
      setCheckItem({})
      setEditVisible(false)
    })
  }

  return (
    <div className="news-category-container">
      <div className="module-view-wrap">
        <div className="FBH mar-t20 mar-b20">
          <Button
            className="btn-success mar-l20"
            onClick={()=>{
              setIsAdd(true)
              setEditVisible(true)
              setCheckItem({
                mainKey: 'resume_tag',
                key: '',
                name: '',
                status: 1,
                remark: '',
              })
            }}
          >
            新增
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
              render={(status, value,index)=>{
                return (
                  <span>{index + 1}</span>
                )
              }}
            />
            <Column title="名字" dataIndex="name" key="name" width={100} align="center" />
            <Column title="key" dataIndex="key" key="key" width={100} align="center" />
            <Column title="排序" dataIndex="order" key="order" width={80} align="center" />
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
              title="操作"
              width={200}
              fixed="right"
              align="center"
              render={(state)=> {
                return (
                  <div>
                    <Button
                      className={state.key === 'all' ? 'btn-disabled mar-10' : 'btn-primary mar-10'}
                      disabled={state.key === 'all'}
                      onClick={()=>{
                        handleModal(state)
                      }}
                    >
                      编辑
                    </Button>
                    {
                      state.status === 1 ? (
                        <Button
                          className={state.key === 'all' ? 'btn-disabled mar-10' : 'btn-warning mar-10'}
                          disabled={state.key === 'all'}
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
                          className={state.key === 'all' ? 'btn-disabled mar-10' : 'btn-success mar-10'}
                          disabled={state.key === 'all'}
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
                      className={state.key === 'all' ? 'btn-disabled mar-10' : 'btn-tag mar-10'}
                      disabled={state.key === 'all'}
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
                      className={state.key === 'all' ? 'btn-disabled mar-10' : 'btn-delete mar-10'}
                      disabled={state.key === 'all'}
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
        title="编辑"
        centered
        className="modal-view-wrap"
        maskClosable={false}
        maskStyle={{
          backgroundColor: 'rgba(0,0,0,0.1)',
        }}
        visible={editVisible}
        onOk={confirmPre}
        okText="保存"
        cancelText="取消"
        onCancel={() => {
          setEditVisible(false)
        }}
        width={500}
      >
        <div>
          <div className="item-cell FBH FBAC">
            <div className="item-title">key：</div>
            <Input
              placeholder="请输入key"
              value={checkItem.key}
              onChange={e=>{
                setCheckItem({...checkItem, key: e.target.value})
              }}
              disabled={!isAdd}
            />
          </div>
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
        </div>
      </Modal>

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
          setSortNumber(null)
          setHandleId(null)
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

export default IndexModule

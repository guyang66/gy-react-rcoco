import React, {useState, useEffect} from "react";
import "./index.styl";
import apiWeb from '@api/web'
import apiConfig from '@api/config'
import utils from '@utils'

import {message, Table, Button, Modal, Input, Switch} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const {TextArea} = Input;
const {Column} = Table;

const ViewModule = () => {

  const [list, setList] = useState([])  // table 数据源
  const [tableLoading, setTableLoading] = useState(true) // table是否数据加载中

  const [editVisible, setEditVisible] = useState(false) // 编辑弹窗显示
  const [confirmVisible, setConfirmVisible] = useState(false) // 二次确认弹窗显示
  const [sortVisible, setSortVisible] = useState(false) // 排序弹窗显示

  const [checkItem, setCheckItem] = useState({})        // 当前操作的行数据源
  const [itemExpand, setItemExpand] = useState(false)   // (跳转链接)列是否展开
  const [handleIndex, setHandleIndex] = useState(null)  // 当前正在操作的行（下标）
  const [sortNumber, setSortNumber] = useState(null)    //  排序的序号绑定值

  const getList = () => {
    setTableLoading(true)
    apiWeb.getIndexColumn().then(data=>{
      if(!data){
        return
      }
      let listTmp = JSON.parse(data)
      listTmp = listTmp.sort((v1,v2)=>{
        if(v1.order < v2.order ){
          return 1
        }
        return -1
      })
      console.log(listTmp)
      setList(listTmp)
      setTableLoading(false)
    })
  }

  useEffect(()=>{
    getList()
  },[])

  const handleModal = (state, type, index) => {
    setHandleIndex(index)
    if(type === 'edit'){
      setCheckItem({...state, openInNewWindow: state.target === '_blank'})
      setEditVisible(true)
    } else if(type === 'sort'){
      setCheckItem({...state, openInNewWindow: state.target === '_blank'})
      setSortNumber(state.order)
      setSortVisible(true)
    }
  }

  const confirmPre = () => {
    const target = checkItem
    if(!target.title || target.title === ''){
      message.warning('标题不能为空！')
      return
    }
    if(!target.text || target.text === ''){
      message.warning('买哦书不能为空！')
      return
    }
    if(!target.href || target.href === ''){
      message.warning('链接不能为空！')
      return
    }
    setConfirmVisible(true)
  }

  const saveInfo = (key) => {
    setConfirmVisible(false)
    const target = checkItem
    const tmp = []
    list.forEach((item,index)=>{
      if(handleIndex === index) {
        const obj = key === 'item' ? {
          title: target.title,
          text: target.text,
          href: target.href,
          order: target.order,
          status: target.status,
          nofollow: target.nofollow,
          target: target.openInNewWindow ? '_blank' : null,
        } : {...item, order: sortNumber}
        tmp.push(obj)
      } else {
        // 其他的不用变
        tmp.push(JSON.parse(JSON.stringify(item)))
      }
    })
    apiWeb.updateIndexColumn({
      content: JSON.stringify(tmp),
    }).then(()=>{
      // 把状态清空
      setEditVisible(false)
      setSortVisible(false)
      setCheckItem({})
      setHandleIndex(null)
      setSortNumber(null)
      getList()
      message.success('保存成功！');
    })
  }

  const refresh = () => {
    apiConfig.refreshCache({key: 'page_index_columns'}).then(()=>{
      message.success('刷新成功！')
    })
  }

  return (
    <div className="index-column-container">
      <div className="module-view-wrap">
        <div className="FBH">
          <Button
            className="btn-danger mar-t20 mar-l20"
            onClick={()=>{
              refresh()
            }}
          >
            清除官网首页栏目缓存
          </Button>
        </div>
        <div className="table-wrap">
          <Table
            bordered
            dataSource={list}
            loading={tableLoading}
            scroll={{x: '100%'}}
            size="small"
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
            <Column title="标题" dataIndex="title" key="title" width={200} align="center" />
            <Column title="描述" dataIndex="text" key="text" width={200} align="center" />
            <Column
              width={200}
              align="center"
              title={()=>{
                return (
                  <span>
                    跳转链接
                    {
                      itemExpand ? (
                        <MenuFoldOutlined
                          onClick={()=>{setItemExpand(false)}}
                          style={{marginLeft: '4px', color: 'orange', cursor: 'pointer'}}
                        />
                      ) : (
                        <MenuUnfoldOutlined
                          onClick={()=>{setItemExpand(true)}}
                          style={{marginLeft: '4px', color: 'orange', cursor: 'pointer'}}
                        />
                      )
                    }
                  </span>
                )
              }}
              render={(status)=>{
                return (
                  <>
                    {
                      itemExpand ? <a href={utils.getFixUrl(status.href)} target="_blank" rel="noreferrer">{utils.getFixUrl(status.href)}</a> : (
                        <span>
                          {status.href.slice(0,12)}
                          ...
                        </span>
                      )
                    }
                  </>
                )
              }}
            />
            <Column title="排序号" dataIndex="order" key="order" width={80} align="center" />
            <Column
              title="操作"
              width={200}
              fixed="right"
              align="center"
              render={(state, data, index)=> {
                return (
                  <div>
                    <Button className="btn-primary mar-5" onClick={()=>{handleModal(state, 'edit', index)}}>编辑</Button>
                    <Button className="btn-warning mar-5" onClick={()=>{handleModal(state, 'sort', index)}}>排序</Button>
                  </div>
                ) }}
            />
          </Table>
        </div>
      </div>

      <Modal
        title="编辑新闻"
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
        width={600}
      >
        <div className="item-cell FBH FBAC">
          <div className="item-title">标题：</div>
          {
            checkItem.title ? <Input
              key="cus-title"
              onChange={e =>{ setCheckItem(
                {...checkItem, title: e.target.value}
              )}}
              value={checkItem.title}
            /> : null
          }
        </div>

        <div className="item-cell h-100 FBH">
          <div className="item-title">描述：</div>
          {
            checkItem.text ? <TextArea
              className="input-input"
              key="cus-summary"
              onChange={e =>{ setCheckItem({...checkItem, text: e.target.value}
              )}}
              value={checkItem.text}
            /> : null
          }
        </div>
        <div className="item-cell FBH FBAC">
          <div className="item-title">链接：</div>
          {
            checkItem.href ? <Input
              key="cus-href"
              onChange={e =>{ setCheckItem(
                {...checkItem, href: e.target.value}
              )}}
              value={checkItem.href}
            /> : null
          }
        </div>
        <div className="item-cell FBH FBAC">
          <div className="item-title">是否新页面打开：</div>
          <Switch
            checked={checkItem.openInNewWindow}
            className="mar-l10"
            onChange={e =>{ setCheckItem(
              {...checkItem, openInNewWindow: e}
            )}}
          />
        </div>
        <div className="item-cell FBH FBAC">
          <div className="item-title">是否设置nofollow：</div>
          <Switch
            checked={checkItem.nofollow}
            className="mar-l10"
            onChange={e =>{ setCheckItem(
              {...checkItem, nofollow: e}
            )}}
          />
        </div>
      </Modal>

      <Modal
        visible={confirmVisible}
        centered
        className="sample-view-modal"
        width={400}
        okText="保存"
        title="确定要提交保存的修改吗？"
        cancelText="取消"
        onOk={()=>{saveInfo('item')}}
        onCancel={()=>setConfirmVisible(false)}
      />

      <Modal
        visible={sortVisible}
        centered
        width={300}
        className="sort-module-view-wrap"
        title="排序（序号越大，越靠前）"
        okText="保存"
        cancelText="取消"
        onOk={saveInfo}
        onCancel={()=>{
          setSortVisible(false)
          setSortNumber(null)
          setCheckItem({})
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

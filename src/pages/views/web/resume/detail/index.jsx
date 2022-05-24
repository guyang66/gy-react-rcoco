import React , {useState, useEffect} from "react";
import "./index.styl";
import {Input, Button, message, Select, Switch} from 'antd'
import {withRouter} from "react-router-dom";
import apiResume from '@api/resume'
import apiConfig from '@api/config'
import FullLoading from '@components/loading'
import chooseIcon from "@assets/images/common/xuanze.svg"
import utils from '@utils'

import {PlusCircleOutlined, MinusCircleOutlined} from '@ant-design/icons'

const {Option} = Select;

const ResumeDetail = (props) => {

  const {location, history} = props

  const resumeId =  location.state && location.state.id  // resumeId
  // 是否是编辑状态
  const isEdit = location.state && location.state.edit === 'Y'
  const isNew = (resumeId === null || resumeId === undefined)
  const [loading, setLoading] = useState(true)
  const [resumeDetail, setResumeDetail] = useState({})
  // 岗位分类
  const [column, setColumn] = useState([])
  const [columnMap, setColumnMap] = useState({})
  const [placeMap, setPlaceMap] = useState({})
  const [places, setPlaces] = useState([])
  const [categoryMap, setCategoryMap] = useState({})
  const [categories, setCategories] = useState([])
  const [tagMap, setTagMap] = useState({})
  // 编辑状态detail model —— 用于维护当前编辑下的数据状态
  const [editDetail, setEditDetail] = useState(resumeDetail)
  // 当前是给那个栏目新添项目
  const [addItem, setAddItem] = useState('')
  // 新添项目的model
  const [editItem, setEditItem] = useState('')

  const [tagDataList, setTagDataList] = useState([])

  const getColumn = () => {
    apiResume.getResumeColumn().then(data=>{
      if(!data || data.length < 1){
        return
      }
      const map = {}
      data.forEach(item=>{
        map[item.key] = item
      })
      setColumn(data)
      setColumnMap(map)
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
    })
  }

  // todo: 严格来说这些请求都需要被promise.all 包裹处理，保证数据处理的时候关联的数据也存在
  // 比如处理详情的标签，如果getCommonTag还未完成，那么可能拿不到我们需要的key，处理数据就会失败
  const getData = () => {
    if(isNew){
      setEditDetail({
        title: '',
        desc: '',
        key: '',
        department: '',
        category: '',
        place: '',
        experience: '不限',
        education: '不限',
        date: utils.getDateString(),
        contact: 'xxx@hr.com',
        tag: [],
        href: 'https://www.zhipin.com',
        require: [],
        duty: [],
        pluses: [],
        isTop: 0,
        status: 1,
        order: 1,
      })
      // 新增
      apiConfig.getCommonTag({key: 'resume_tag'}).then(data=>{
        if(!data || data.length < 1){
          return
        }
        const map = {}
        data.forEach(item=>{
          map[item.key] = item
        })
        setTagMap(map)
        initTagData(editDetail.tag, data)
        setLoading(false)
      })
      return
    }

    const p1 = apiResume.getResumeDetail({id: resumeId})
    const p2 = apiConfig.getCommonTag({key: 'resume_tag'})
    Promise.all([p1,p2]).then(
      result=>{

        // 处理标签
        const tagData = result[1]
        if(!tagData || tagData.length < 1){
          return
        }
        const map = {}
        tagData.forEach(item=>{
          map[item.key] = item
        })
        setTagMap(map)

        // 处理数据
        const detailData = result[0]
        if(!detailData.tag){
          detailData.tag = []
        }
        if(detailData){
          setResumeDetail(detailData)
          setEditDetail(detailData)
          setLoading(false)
          initTagData(detailData.tag, tagData)
        }
      }
    )
  }

  const initTagData = (tagList = [], targetList) => {
    if(!targetList || targetList.length < 1){
      return
    }
    const tmp = []
    targetList.forEach(item=>{
      tmp.push({
        key: item.key,
        name: item.name,
        choose: tagList.includes(item.key),
      })
    })
    setTagDataList(tmp)
  }

  const chooseTag = (key) => {
    setTagDataList(
      tagDataList.map(item =>{
        const obj = JSON.parse(JSON.stringify(item))
        if(obj.key === key) {
          obj.choose = !obj.choose
        }
        return obj
      })
    )
  }

  // todo：因为需要加工数据，严格来说这些请求都应该Promise.all来操作

  useEffect(()=>{
    getData()
    getColumn()
    getCategory()
    getPlace()
  },[])


  const getStringByKey = (key, type) => {
    if(!key){
      return ''
    }
    if(type === 'column'){
      return columnMap[key] ? columnMap[key].name : key
    }
    if(type === 'place'){
      return placeMap[key] ? placeMap[key].name : key
    }
    if(type === 'category'){
      return categoryMap[key] ? categoryMap[key].name : key
    }
    if(type === 'tag'){
      return tagMap[key] ? tagMap[key].name : key
    }
    return '暂无'
  }

  const selectChoose = (e, key) => {
    if(key === 'column'){
      setEditDetail({...editDetail, key: e})
    } else if (key === 'category') {
      setEditDetail({...editDetail, category: e})
    } else if (key === 'place') {
      setEditDetail({...editDetail, place: e})
    }

  }

  const handleAddItem = (key) => {
    if(addItem !== ''){
      message.warning('请先确认正在编辑中的内容！')
      return
    }
    setAddItem(key)
  }

  const addItemConfirm = (key) => {
    const target = editDetail[key]
    if(!editItem || editItem === ''){
      message.warning('内容不能为空！')
      return
    }
    target.push(editItem)
    const newData = {}
    newData[key] = target
    setEditDetail({...editDetail, ...newData})
    setEditItem('')
    setAddItem('')
  }

  const handleDeleteItem = (key, index) => {
    const target = editDetail[key]
    if(index < 0){
      return
    }
    if(!target){
      return;
    }
    if(index >= target.length){
      return
    }
    target.splice(index, 1)
    const newData = {}
    newData[key] = target
    setEditDetail({...editDetail, ...newData})
  }

  const filterTag = () => {
    const tmp = []
    tagDataList.forEach(item=>{
      if(item.choose){
        tmp.push(item.key)
      }
    })
    return tmp
  }
  const saveInfo = () => {
    if(!editDetail.title || editDetail.title === ''){
      return message.warn('标题不能为空！')
    }
    if(!editDetail.key || editDetail.key === ''){
      return message.warn('所属类别不能为空！')
    }
    if(!editDetail.category || editDetail.category === ''){
      return message.warn('岗位类型不能为空！')
    }
    if(!editDetail.place || editDetail.place === ''){
      return message.warn('城市/区域不能为空！')
    }
    if(!editDetail.date || editDetail.date === ''){
      return message.warn('发布时间不能为空！')
    }
    if(!editDetail.contact || editDetail.contact === ''){
      return message.warn('联系方式不能为空！')
    }
    if(!editDetail.href || editDetail.href === ''){
      return message.warn('简历链接不能为空！')
    }
    const requestParams = {
      title: editDetail.title,
      desc: editDetail.desc,
      key: editDetail.key,
      department: editDetail.department,
      category: editDetail.category,
      place: editDetail.place,
      experience: (!editDetail.experience || editDetail.experience === '') ? '不限' : editDetail.experience,
      education: (!editDetail.education || editDetail.education === '') ? '不限' : editDetail.education,
      date: editDetail.date,
      contact: editDetail.contact,
      tag: filterTag(editDetail.tag),
      href: editDetail.href,
      require: editDetail.require,
      duty: editDetail.duty,
      pluses: editDetail.pluses,
      isTop: editDetail.isTop,
      status: editDetail.status,
      order: editDetail.order,
    }

    if(isNew) {
      apiResume.saveResume({content: requestParams}).then(()=>{
        message.success('保存成功')
        history.push({pathname: '/admin/web/resume/list'})
      })
      return true
    }

    apiResume.updateResume({id: editDetail._id, content: requestParams}).then(()=>{
      message.success('保存成功')
      history.push({pathname: '/admin/web/resume/detail', state: {id: resumeId}, search: '?id=' + resumeId})
    })
    return true
  }

  if((!resumeId || resumeId === '') && !isNew){
    message.error('id为空！')
    return <FullLoading />
  }

  if(loading){
    return <FullLoading />
  }

  return (
    <div className="resume-detail-container">
      <div className="resume-detail-wrap module-view-wrap">
        <div className="module-title mar-t20 mar-l20">{ isEdit ? '岗位编辑' : '岗位详情'}</div>
        <div className="content-wrap">
          <div className="normal-cell">
            <div className="cell-title">标题：</div>
            {
              isEdit ? (
                <Input
                  className="w-300"
                  placeholder="请输入标题"
                  onChange={e =>{
                    setEditDetail({...editDetail, title: e.target.value})
                  }}
                  value={editDetail.title}
                />
              ) : (
                <div className="cell-content">{resumeDetail.title}</div>
              )
            }
          </div>
          <div className="normal-cell">
            <div className="cell-title">描述：</div>
            {
              isEdit ? (
                <Input
                  className="w-600"
                  placeholder="请输入岗位描述"
                  onChange={e =>{
                    setEditDetail({...editDetail, desc: e.target.value})
                  }}
                  value={editDetail.desc}
                />
              ) : (
                <div className="cell-content">{resumeDetail.desc}</div>
              )
            }
          </div>

          <div className="normal-cell">
            <div className="cell-title">部门：</div>
            {
              isEdit ? (
                <Input
                  className="w-300"
                  placeholder="请输入岗位名称"
                  onChange={e =>{
                    setEditDetail({...editDetail, department: e.target.value})
                  }}
                  value={editDetail.department}
                />
              ) :  <div className="cell-content">{resumeDetail.department}</div>
            }
          </div>
          <div className="normal-cell">
            <div className="cell-title">所属类别：</div>
            {
              isEdit ? (
                <Select
                  value={editDetail.key}
                  onSelect={e=>{
                    selectChoose(e, 'column')
                  }}
                  className="normal-select"
                >
                  {
                    column.map(item=>{
                      return (
                        <Option key={item.key} value={item.key}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              ) : (
                <div className="cell-content">{getStringByKey(resumeDetail.key, 'column')}</div>
              )
            }
          </div>
          <div className="normal-cell">
            <div className="cell-title">岗位类型：</div>
            {
              isEdit ? (
                <Select
                  value={editDetail.category}
                  onSelect={e=>{
                    selectChoose(e, 'category')
                  }}
                  className="normal-select"
                >
                  {
                    categories.map(item=>{
                      return (
                        <Option key={item.key} value={item.key}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              ) :  <div className="cell-content">{getStringByKey(resumeDetail.category, 'category')}</div>
            }
          </div>
          <div className="normal-cell">
            <div className="cell-title">城市/区域：</div>
            {
              isEdit ? (
                <Select
                  value={editDetail.place}
                  onSelect={e=>{
                    selectChoose(e, 'place')
                  }}
                  className="normal-select"
                >
                  {
                    places.map(item=>{
                      return (
                        <Option key={item.key} value={item.key}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              ) :  <div className="cell-content">{getStringByKey(resumeDetail.place, 'place')}</div>
            }
          </div>
          <div className="normal-cell">
            <div className="cell-title">工作经验：</div>
            {
              isEdit ? (
                <Input
                  className="w-300"
                  placeholder="请输入工作经验"
                  onChange={e =>{
                    setEditDetail({...editDetail, experience: e.target.value})
                  }}
                  value={editDetail.experience}
                />
              ) : (
                <div className="cell-content">{resumeDetail.experience}</div>
              )
            }
          </div>
          <div className="normal-cell">
            <div className="cell-title">学历：</div>
            {
              isEdit ? (
                <Input
                  className="w-300"
                  placeholder="请输入学历要求"
                  onChange={e =>{
                    setEditDetail({...editDetail, education: e.target.value})
                  }}
                  value={editDetail.education}
                />
              ) : <div className="cell-content">{resumeDetail.education}</div>
            }
          </div>
          <div className="normal-cell">
            <div className="cell-title">发布时间：</div>
            {
              isEdit ? (
                <Input
                  className="w-300"
                  placeholder="请输入发布时间"
                  onChange={e =>{
                    setEditDetail({...editDetail, date: e.target.value})
                  }}
                  value={editDetail.date}
                />
              ) : <div className="cell-content">{resumeDetail.date}</div>
            }
          </div>
          <div className="normal-cell" style={{alignItems: 'flex-start'}}>
            <div className="cell-title">联系方式：</div>
            {
              isEdit ? (
                <Input
                  className="w-300"
                  placeholder="请输入联系方式"
                  onChange={e =>{
                    setEditDetail({...editDetail, contact: e.target.value})
                  }}
                  value={editDetail.contact}
                />
              ) : <div className="cell-content">{resumeDetail.contact}</div>
            }
          </div>

          <div className="normal-cell" style={{alignItems: 'flex-start'}}>
            <div className="cell-title">简历链接：</div>
            {
              isEdit ? (
                <Input
                  className="w-300"
                  placeholder="请输入链接"
                  onChange={e =>{
                    setEditDetail({...editDetail, href: e.target.value})
                  }}
                  value={editDetail.href}
                />
              ) : <div className="cell-content">{resumeDetail.href}</div>
            }
          </div>

          <div className="normal-cell">
            <div className="cell-title">标签：</div>
            {
              isEdit ? (
                <div className="cell-content FBH">
                  { tagDataList.map(item=>{
                    return (
                      <div className="tag-view-choose mar-r20" onClick={()=>{chooseTag(item.key)}} key={item.key}>
                        {item.name}
                        {item.choose ? <img className="tag-choose-icon" src={chooseIcon} /> : null}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="cell-content">
                  { resumeDetail.tag.map(item=>{
                    return (
                      <span className="tag-view mar-r20" key={item}>{getStringByKey(item, 'tag')}</span>
                    )
                  })}
                </div>
              )
            }
          </div>

          <div className="normal-cell" style={{height: 'auto', alignItems: 'flex-start'}}>
            <div className="cell-title">岗位职责：</div>
            <div className="cell-content">
              {
                (isNew ? editDetail.duty : resumeDetail.duty).map((item, index)=>{
                  return (
                    <div className="FBH h-40" key={`desc${  index}`}>
                      <p className="p-text">
                        {index + 1}
                        .
                        {item}
                      </p>
                      {
                        isEdit ? (
                          <div className="delete-wrap">
                            <MinusCircleOutlined
                              className="delete-btn"
                              onClick={()=>{
                                handleDeleteItem('duty', index)
                              }}
                            />
                          </div>
                        ) : null
                      }
                    </div>
                  )
                })
              }
              {
                (isEdit && addItem === 'duty') ? (
                  <div className="FBH mar-b10">
                    <Input
                      value={editItem}
                      onChange={(e)=>{
                        setEditItem(e.target.value)
                      }}
                      style={{minWidth: '600px'}}
                    />
                    <Button
                      className="btn-primary mar-l20"
                      onClick={()=>{
                        addItemConfirm('duty')
                      }}
                    >
                      确认
                    </Button>
                    <Button
                      className="btn-info mar-l20"
                      onClick={()=>{
                        setAddItem('')
                        setEditItem('')
                      }}
                    >
                      取消
                    </Button>
                  </div>
                ) : null
              }
              {
                isEdit ? (
                  <Button
                    className="btn-success"
                    onClick={()=>{handleAddItem('duty')}}
                    icon={<PlusCircleOutlined style={{fontSize: '14px'}} />}
                  >
                    添加选项
                  </Button>
                ) : null
              }
            </div>
          </div>

          <div className="normal-cell" style={{height: 'auto', alignItems: 'flex-start'}}>
            <div className="cell-title">岗位要求：</div>
            <div className="cell-content">
              {
                (isNew ? editDetail.require : resumeDetail.require).map((item, index)=>{
                  return (
                    <div className="FBH" key={`require${  index}`}>
                      <p className="p-text">
                        {index + 1}
                        .
                        {item}
                      </p>
                      {
                        isEdit ? (
                          <div className="delete-wrap">
                            <MinusCircleOutlined
                              className="delete-btn"
                              onClick={()=>{
                                handleDeleteItem('require', index)
                              }}
                            />
                          </div>
                        ) : null
                      }
                    </div>
                  )
                })
              }
              {
                (isEdit && addItem === 'require') ? (
                  <div className="FBH mar-b10">
                    <Input
                      value={editItem}
                      onChange={(e)=>{
                        setEditItem(e.target.value)
                      }}
                      style={{minWidth: '600px'}}
                    />
                    <Button
                      className="btn-primary mar-l20"
                      onClick={()=>{
                        addItemConfirm('require')
                      }}
                    >
                      确认
                    </Button>
                    <Button
                      className="btn-info mar-l20"
                      onClick={()=>{
                        setAddItem('')
                        setEditItem('')
                      }}
                    >
                      取消
                    </Button>
                  </div>
                ) : null
              }
              {
                isEdit ? (
                  <Button
                    className="btn-success"
                    onClick={()=>{handleAddItem('require')}}
                    icon={<PlusCircleOutlined style={{fontSize: '14px'}} />}
                  >
                    添加选项
                  </Button>
                ) : null
              }
            </div>
          </div>

          <div className="normal-cell" style={{height: 'auto', alignItems: 'flex-start'}}>
            <div className="cell-title mar-t20">加分项：</div>
            <div className="cell-content mar-t30">
              {
                (isNew ? editDetail.pluses : resumeDetail.pluses).map((item, index)=>{
                  return (
                    <div className="FBH" key={`pluses${  index}`}>
                      <p className="p-text">
                        {index + 1}
                        .
                        {item}
                      </p>
                      {
                        isEdit ? (
                          <div className="delete-wrap">
                            <MinusCircleOutlined
                              className="delete-btn"
                              onClick={()=>{
                                handleDeleteItem('pluses', index)
                              }}
                            />
                          </div>
                        ) : null
                      }
                    </div>
                  )
                })
              }
              {
                (isEdit && addItem === 'pluses') ? (
                  <div className="FBH mar-b10">
                    <Input
                      value={editItem}
                      onChange={(e)=>{
                        setEditItem(e.target.value)
                      }}
                      style={{minWidth: '600px'}}
                    />
                    <Button
                      className="btn-primary mar-l20"
                      onClick={()=>{
                        addItemConfirm('pluses')
                      }}
                    >
                      确认
                    </Button>
                    <Button
                      className="btn-info mar-l20"
                      onClick={()=>{
                        setAddItem('')
                        setEditItem('')
                      }}
                    >
                      取消
                    </Button>
                  </div>
                ) : null
              }
              {
                isEdit ? (
                  <Button
                    className="btn-success"
                    onClick={()=>{handleAddItem('pluses')}}
                    icon={<PlusCircleOutlined style={{fontSize: '14px'}} />}
                  >
                    添加选项
                  </Button>
                ) : null
              }
            </div>
          </div>

          <div className="normal-cell mar-t20">
            <div className="cell-title">是否置顶：</div>
            {
              isEdit ? (
                <>
                  <span className="cell-normal-text" />
                  <Switch
                    checked={editDetail.isTop === 1}
                    onChange={(e)=>{
                      setEditDetail({...editDetail, isTop: (e ? 1 : 0)})
                    }}
                    className="mar-r20"
                  />
                </>
              ) : <div className="cell-content">{resumeDetail.isTop ? '是' : '否'}</div>
            }
          </div>
          {
            isEdit ? (
              <div className="normal-cell mar-t20">
                <div className="cell-title" />
                <div className="cell-content">
                  {isNew ? null : (
                    <Button
                      className="btn-info mar-r20"
                      onClick={()=>{
                        history.push({pathname: '/admin/web/resume/detail', state: {id: resumeId}, search: '?id=' + resumeId})
                      }}
                      style={{width: '100px'}}
                    >
                      取消
                    </Button>
                  )}
                  <Button className="btn-primary" onClick={saveInfo} style={{width: '100px'}}>保存</Button>
                </div>
              </div>
            ) : (
              <div className="normal-cell mar-t20">
                <div className="cell-title" />
                <div className="cell-content">
                  <Button
                    className="btn-success"
                    onClick={()=>{
                      history.push({pathname: '/admin/web/resume/detail', state: {id: resumeId, edit: 'Y'}, search: '?id=' + resumeId + '&edit=Y'})
                    }}
                  >
                    编辑岗位
                  </Button>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default withRouter(ResumeDetail)

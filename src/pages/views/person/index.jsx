import React, {useState, useRef} from "react";
import {Row, Col, Input, Button, message, Upload, Spin, Radio, Popover, Modal} from 'antd';
import {LoadingOutlined, PlusOutlined, EyeTwoTone, EyeInvisibleOutlined} from '@ant-design/icons';
import {inject, observer} from "mobx-react";
import apiUser from '@api/user'

import helper from '@helper'
import "./index.styl";

const Person = (props) => {

  const uploadConfig = {
    header: {
      authorization: helper.getToken(),
    },
    name: 'userAvatar',
    body: {
      name: 'userAvatar',
      dir: 'img/userAvatar',
      overwrite: 'N',
    },
  }

  const {user, getUserInfo} = props.appStore
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState(user.avatar)
  const [radioCheck, setRadioCheck] = useState('N')
  const [passwordLoading] = useState(false)
  const [passVisible, setPassVisible] = useState(false)
  const [verifyCode, setVerifyCode] = useState('<div></div>')
  const [newPassword, setNewPassword] = useState({
    password: '',
    confirmPassword: '',
    verifyCode: '',
  })

  const userIdRef = useRef()
  const emailRef = useRef()
  const nameRef = useRef()
  const phoneRef = useRef()
  const departmentRef = useRef()
  const positionRef = useRef()
  const numberRef = useRef()
  const remarkRef = useRef()

  const filter = (value, defaultValue) => {
    if(!value || value === ''){
      return (defaultValue !== null && defaultValue !== undefined) ? defaultValue : '无'
    }
    return  value
  }

  const handleEdit = () => {
    setIsEdit(!isEdit)
    setRadioCheck('N')
  }

  const saveInfo = () => {
    const id = userIdRef.current.state.value
    const name = nameRef.current.state.value

    if(!name || name === ''){
      message.warning('昵称不能为空！')
      return
    }
    const email = emailRef.current.state.value
    const remark = remarkRef.current.state.value
    const phone = phoneRef.current.state.value
    const department = departmentRef.current.state.value
    const position = positionRef.current.state.value

    const p = {name, email, remark, phone, department, position}
    if(imgUrl && imgUrl !== ''){
      p.avatar = imgUrl
    }
    apiUser.updateUserInfo({id, content: p}).then( () =>{
      message.success('修改成功！');
      getUserInfo()
      setIsEdit(false)
    }).catch(err=>{
      message.error(`修改失败！${  err.message}`);
    })
  }

  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('上传的资源大小不能超过2MB!');
    }
    return isLt2M
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      if(info.file && info.file.response){
        setLoading(false)
        const result = info.file.response
        if(result.success){
          message.success('上传成功！')
          setImgUrl(result.content)
        } else {
          message.error(`上传失败：${  result.error.message}`)
        }
      }
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{marginTop: 8}}>更换头像</div>
    </div>
  );

  const overwriteContent = (
    <div>
      <p>启动禁用资源覆盖，当你上传一个已经存在的资源时，会上传失败，说明该资源已被其他用户或资源占用。</p>
      <p>如果取消设置，可能或导致别的资源被覆盖。该选项默认为开启状态，如遇到资源上传失败，可修改资源名称重新上传。</p>
    </div>
  )

  const onRadioChange = e => {
    setRadioCheck(e.target.value)
  }

  const getUploadBody = () => {
    return {
      name: uploadConfig.body.name,
      overwrite: radioCheck,
      dir: uploadConfig.body.dir,
    }
  }

  const getCaptcha = () =>{
    apiUser.getCaptcha().then(data=>{
      setVerifyCode(data)
    })
  }

  const changePassword = () => {
    if(!newPassword.password || newPassword.password === ''){
      message.warning('密码不能为空！')
      return
    }

    if(newPassword.password !== newPassword.confirmPassword){
      message.warning('密码两次输入不能为空！')
      return
    }

    if(!newPassword.verifyCode || newPassword.verifyCode === ''){
      message.warning('验证码不能为空为空！')
      return
    }

    if(newPassword.verifyCode.length !== 4){
      message.warning('验证码格式不正确！')
      return
    }

    apiUser.updatePassword({password: newPassword.password, verifyCode: newPassword.verifyCode}).then(()=>{
      message.success('修改成功！')
      setNewPassword({})
      setPassVisible(false)
    }).catch(error=>{
      message.error(error.message)
    })

  }

  return (
    <div className="person-container">
      <div className="person-wrap">

        <Row className="person-cell">
          <Input
            style={{display: 'none'}}
            value={user._id}
            ref={userIdRef}
          />
        </Row>

        <Row className="person-cell FBAC">
          <Col className="cell-title">
            <div className="FBH">
              账号：
            </div>
          </Col>
          {
            isEdit ? (
              <Col className="mar-l10">
                <Input disabled defaultValue={filter(user.username)} className="normal-input" />
              </Col>
            ) : <Col className="mar-l10">{filter(user.username)}</Col>
          }
        </Row>

        <Row className="person-cell FBAC">
          <Col className="cell-title">
            <div className="FBH">
              昵称：
            </div>
          </Col>
          {
            isEdit ? (
              <Col className="mar-l10">
                <Input
                  defaultValue={filter(user.name)}
                  ref={nameRef}
                  className="normal-input"
                />
              </Col>
            ) : <Col className="mar-l10">{filter(user.name)}</Col>
          }

        </Row>

        <Row className="person-img-cell FBAC">
          <Col className="cell-title">
            <div className="FBH">
              头像：
            </div>
          </Col>
          <Col>
            {
              isEdit ?
                <>
                  <div className="avatar-edit-wrap FBH FBAC mar-l10">
                    {
                      imgUrl ? <img src={imgUrl} className="avatar" alt="" /> : <div className="avatar-empty FBV FBAC FBJC">暂无头像</div>
                    }
                    <Upload
                      name={uploadConfig.name}
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="/admin/api/upload/auth"
                      headers={uploadConfig.header}
                      data={getUploadBody}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      { uploadButton }
                    </Upload>
                  </div>
                  <div className="help-cell mar-l10 FBH FBAC">
                    <span className="text mar-r20">禁止同名覆盖</span>
                    <Radio.Group onChange={onRadioChange} value={radioCheck}>
                      <Radio className="mar-l20" value="N">是</Radio>
                      <Radio className="mar-l10" value="Y">否</Radio>
                    </Radio.Group>
                    <Popover content={overwriteContent} title="禁用同名覆盖资源说明" placement="right">
                      <Button type="primary" className="mar-l20">查看说明</Button>
                    </Popover>
                  </div>
                </> : (
                  user.avatar ? <img src={user.avatar} className="avatar" alt="" /> : <div className="avatar-empty FBV FBAC FBJC">暂无头像</div>
                )
            }
          </Col>
        </Row>

        <Row className="person-cell FBAC">
          <Col className="cell-title">
            <div className="FBH">
              手机：
            </div>
          </Col>
          {
            isEdit ? (
              <Col className="mar-l10">
                <Input
                  defaultValue={filter(user.phone, '')}
                  ref={phoneRef}
                  className="normal-input"
                />
              </Col>
            ) : <Col className="mar-l10">{filter(user.phone)}</Col>
          }
        </Row>

        <Row className="person-cell FBAC">
          <Col className="cell-title">
            <div className="FBH">
              邮箱：
            </div>
          </Col>
          {
            isEdit ? (
              <Col className="mar-l10">
                <Input
                  defaultValue={filter(user.email, '')}
                  ref={emailRef}
                  className="normal-input"
                />
              </Col>
            ) : <Col className="mar-l10">{filter(user.email)}</Col>
          }
        </Row>

        <Row className="person-cell FBAC">
          <Col className="cell-title">
            <div className="FBH">
              部门：
            </div>
          </Col>
          {
            isEdit ? (
              <Col className="mar-l10">
                <Input
                  defaultValue={filter(user.department, '')}
                  ref={departmentRef}
                  className="normal-input"
                />
              </Col>
            ) : <Col className="mar-l10">{filter(user.department)}</Col>
          }
        </Row>

        <Row className="person-cell FBAC">
          <Col className="cell-title">
            <div className="FBH">
              职位：
            </div>
          </Col>
          {
            isEdit ? (
              <Col className="mar-l10">
                <Input
                  defaultValue={filter(user.position, '')}
                  ref={positionRef}
                  className="normal-input"
                />
              </Col>
            ) : <Col className="mar-l10">{filter(user.position)}</Col>
          }
        </Row>

        <Row className="person-cell FBAC">
          <Col className="cell-title">
            <div className="FBH">
              工号：
            </div>
          </Col>
          {
            isEdit ? (
              <Col className="mar-l10">
                <Input
                  defaultValue={filter(user.dingNumber)}
                  ref={numberRef}
                  disabled
                  className="normal-input"
                />
              </Col>
            ) : <Col className="mar-l10">{filter(user.dingNumber)}</Col>
          }
        </Row>

        <Row className="person-cell FBAC">
          <Col className="cell-title">
            <div className="FBH">
              备注：
            </div>
          </Col>
          {
            isEdit ? (
              <Col className="mar-l10">
                <Input
                  defaultValue={filter(user.remark, '')}
                  ref={remarkRef}
                  className="normal-input"
                />
              </Col>
            ) : <Col className="mar-l10">{filter(user.remark)}</Col>
          }
        </Row>

        <Row className="mar-t10">

          {
            isEdit ? (
              <Col>
                <Button
                  className="mar-l100 btn-success"
                  onClick={saveInfo}
                >
                  保存
                </Button>

                <Button
                  className="mar-l30 btn-primary"
                  onClick={handleEdit}
                >
                  取消
                </Button>
              </Col>
            ) : (
              <Col>
                <Button type="primary" className="mar-l100" onClick={handleEdit}>修改个人信息</Button>
                <Button
                  className="btn-warning mar-l30"
                  onClick={()=>{
                    getCaptcha()
                    setPassVisible(true)
                  }}
                >
                  修改密码
                </Button>
              </Col>
            )
          }

        </Row>

        <Row className="person-cell" />
      </div>

      <Modal
        visible={passVisible}
        title="修改密码"
        width={500}
        cancelText="取消"
        className="person-password-modal"
        okText="确定"
        onOk={changePassword}
        onCancel={()=>{
          setPassVisible(false)
          setNewPassword({})
        }}
      >
        <div className="FBH FBAC FBJC">
          {
            passwordLoading ? (
              <Spin />
            ) : (
              <div>
                <div className="FBH modal-cell">
                  <div className="normal-title">新密码：</div>
                  <Input.Password
                    className="normal-input"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    value={newPassword.password}
                    onChange={e=>{
                      setNewPassword({...newPassword,password: e.target.value})
                    }}
                  />
                </div>
                <div className="FBH modal-cell">
                  <div className="normal-title">确认密码：</div>
                  <Input.Password
                    className="normal-input"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    value={newPassword.confirmPassword}
                    onChange={e=>{
                      setNewPassword({...newPassword,confirmPassword: e.target.value})
                    }}
                  />
                </div>
                <div className="FBH modal-cell">
                  <div className="normal-title">验证码：</div>
                  <Input
                    className="normal-input w-150"
                    value={newPassword.verifyCode}
                    onChange={e=>{
                      setNewPassword({...newPassword,verifyCode: e.target.value})
                    }}
                  />
                  <div className="verify-code-wrap">
                    <Popover content="看不清?点击一下图片刷新" title="温馨提示" placement="right">
                      <div
                        className="verify-image"
                        onClick={getCaptcha}
                        dangerouslySetInnerHTML={{__html: verifyCode}}
                      />
                    </Popover>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </Modal>
    </div>
  )
}

export default inject('appStore')(observer(Person))


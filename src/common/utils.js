import menusIcon from "@config/menu-icon"

const getCurrentDate = (t, symbol = '-') =>{
  if(!t){
    t = new Date()
  }

  if(!(t instanceof Date)){
    t = new Date(t)
  }
  const y = t.getFullYear()
  const m = t.getMonth() + 1
  const d = t.getDate()
  return `${  y  }${symbol  }${m < 10 ? (`0${  m}`) : m  }${symbol  }${d < 10 ? (`0${  d}`) : d}`
}

const getCurrentDateYYDDMMhhmmss = (t) => {
  if(!t){
    t = new Date()
  }

  if(!(t instanceof Date)){
    t = new Date(t)
  }
  const h = t.getHours()
  const m = t.getMinutes()
  const s = t.getSeconds()
  return `${getCurrentDate(t, '-')  } ${  h < 10 ? (`0${  h}`) : h  }:${  m < 10 ? (`0${  m}`) : m  }:${  s < 10 ? (`0${  s}`) : s}`
}

const getDateDir = (t) => {
  if(!t){
    t = new Date()
  }

  if(!(t instanceof Date)){
    t = new Date(t)
  }
  const h = t.getHours()
  const m = t.getMinutes()
  const s = t.getSeconds()
  return getCurrentDate(t, '')  + (h < 10 ? (`0${  h}`) : h) + (m < 10 ? (`0${  m}`) : m ) + (s < 10 ? (`0${  s}`) : s)
}

const getMenuIconByKey = (key) => {
  return menusIcon[key] || menusIcon.default
}

const verifyEmailFormat = (email) => {
  if(!email || email === ''){
    return false
  }
  const reg = /^((?:[0-9a-zA-Z_]+.)+@[0-9a-zA-Z-]{1,13}\.[com,cn,net]{1,3})$/
  return reg.test(email)
}

const verifyPhoneFormat = (phone) => {
  if(!phone || phone === ''){
    return false
  }
  if(phone.length !== 13) {
    return false
  }
  return (/^1[3456789]\d{9}$/.test(phone))
}

export default  {
  getMenuIconByKey,
  getCurrentDate,
  getCurrentDateYYDDMMhhmmss,
  getDateDir,
  verifyEmailFormat,
  verifyPhoneFormat,
}

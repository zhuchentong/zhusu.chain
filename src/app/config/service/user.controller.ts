export const UserController = {
  /**
   * 用户登录
   */
  login: {
    controller: "",
    action: "login",
    method: "POST"
  },
  /**
   * 用户注册
   */
  register: {
    controller: "",
    action: "register",
    method: "POST"
  },
  /**
   * 获取用户列表
   */
  getUserList: {
    controller: 'users',
    method: 'GET'
  },
  /**
   * 获取用户信息
   */
  getUser: {
    controller: 'self',
    method: 'GET'
  },
  /**
   * 发送短信验证码
   */
  sendSmsCode: {
    controller: "",
    action: "sendSmsCode",
    method: "POST"
  },
  /**
   * 重置密码
   */
  resetPassowrd: {
    controller: "users",
    action: "resetPassword",
    method: "POST"
  }
};

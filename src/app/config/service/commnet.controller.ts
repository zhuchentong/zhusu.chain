export const commentController = {
  /**
   * 获取酒店评论
   */
  getCommentsByHotel: {
    controller: 'comments',
    method: 'GET',
    action: 'listByHotel'
  },
  /**
   * 获取用户评论
   */
  getCommentsByUser: {
    controller: 'comments',
    method: 'GET',
    action: 'listByUser'
  },
  /**
   * 添加评论
   */
  addComment: {
    controller: 'comments',
    method: 'POST'
  }
}

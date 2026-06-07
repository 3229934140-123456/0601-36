export default defineAppConfig({
  pages: [
    'pages/square/index',
    'pages/checkin/index',
    'pages/moments/index',
    'pages/messages/index',
    'pages/profile/index',
    'pages/matching/index',
    'pages/activity-detail/index',
    'pages/chat-detail/index',
    'pages/edit-profile/index',
    'pages/settings/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '破冰',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FAFAFA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#FF6B6B',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/square/index',
        text: '广场'
      },
      {
        pagePath: 'pages/checkin/index',
        text: '签到'
      },
      {
        pagePath: 'pages/moments/index',
        text: '动态'
      },
      {
        pagePath: 'pages/messages/index',
        text: '消息'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})

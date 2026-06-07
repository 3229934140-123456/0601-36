import { Conversation, ChatMessage } from '@/types';

export const mockConversations: Conversation[] = [
  {
    id: '1',
    userId: '1',
    userName: '张小雨',
    userAvatar: 'https://picsum.photos/id/91/200/200',
    lastMessage: '好的，那我们下午茶歇的时候见！',
    lastMessageTime: '5分钟前',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    userId: '3',
    userName: '王晓琳',
    userAvatar: 'https://picsum.photos/id/338/200/200',
    lastMessage: '我这边有几个设计方面的问题想请教你～',
    lastMessageTime: '1小时前',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    userId: '5',
    userName: '林梦瑶',
    userAvatar: 'https://picsum.photos/id/1025/200/200',
    lastMessage: '名片已交换 ✓',
    lastMessageTime: '2小时前',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: '4',
    userId: '6',
    userName: '赵明远',
    userAvatar: 'https://picsum.photos/id/1012/200/200',
    lastMessage: '那个开源项目的地址我发你了',
    lastMessageTime: '昨天',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '5',
    userId: '8',
    userName: '吴思琪',
    userAvatar: 'https://picsum.photos/id/718/200/200',
    lastMessage: '我也很喜欢读书！有机会一起呀',
    lastMessageTime: '昨天',
    unreadCount: 1,
    isOnline: false
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    content: '你好呀！我是张小雨，刚在签到的时候看到你了',
    type: 'text',
    createdAt: '14:30',
    isRead: true
  },
  {
    id: '2',
    senderId: 'me',
    content: '你好你好！我是小明，很高兴认识你～',
    type: 'text',
    createdAt: '14:31',
    isRead: true
  },
  {
    id: '3',
    senderId: '1',
    content: '我看你对产品也很感兴趣？我之前是做技术的，现在转产品了，还在学习中',
    type: 'text',
    createdAt: '14:32',
    isRead: true
  },
  {
    id: '4',
    senderId: 'me',
    content: '哈哈我也是产品经理，有机会可以多交流！你之前做什么方向的技术？',
    type: 'text',
    createdAt: '14:33',
    isRead: true
  },
  {
    id: '5',
    senderId: '1',
    content: '我来交换一下我的名片吧',
    type: 'card',
    createdAt: '14:35',
    isRead: true,
    cardData: {
      id: '1',
      name: '张小雨',
      avatar: 'https://picsum.photos/id/91/200/200',
      bio: '连续创业者，专注AI领域',
      tags: ['创业', 'AI', '技术', '投资'],
      company: '智创科技',
      position: 'CEO',
      city: '北京'
    }
  },
  {
    id: '6',
    senderId: 'me',
    content: '收到！很高兴认识你～',
    type: 'text',
    createdAt: '14:36',
    isRead: true
  },
  {
    id: '7',
    senderId: '1',
    content: '好的，那我们下午茶歇的时候见！',
    type: 'text',
    createdAt: '14:40',
    isRead: false
  }
];

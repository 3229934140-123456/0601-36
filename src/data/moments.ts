import { Moment, Comment } from '@/types';

export const mockMoments: Moment[] = [
  {
    id: '1',
    userId: '1',
    userName: '张小雨',
    userAvatar: 'https://picsum.photos/id/91/200/200',
    content: '终于来到了期待已久的创业者交流会！现场氛围超棒，已经认识了好几位有趣的朋友，期待下午的圆桌讨论 🎉',
    images: ['https://picsum.photos/id/1082/600/600'],
    activityId: '1',
    activityTitle: '2024 创业者交流会',
    likeCount: 36,
    commentCount: 8,
    isLiked: false,
    createdAt: '1小时前'
  },
  {
    id: '2',
    userId: '3',
    userName: '王晓琳',
    userAvatar: 'https://picsum.photos/id/338/200/200',
    content: '茶歇时间～会场的咖啡和甜点都很棒 ☕️ 有小伙伴想一起组队参加下午的头脑风暴吗？',
    images: [
      'https://picsum.photos/id/225/600/600',
      'https://picsum.photos/id/292/600/600',
      'https://picsum.photos/id/431/600/600'
    ],
    activityId: '1',
    activityTitle: '2024 创业者交流会',
    likeCount: 52,
    commentCount: 15,
    isLiked: true,
    createdAt: '45分钟前'
  },
  {
    id: '3',
    userId: '5',
    userName: '林梦瑶',
    userAvatar: 'https://picsum.photos/id/1025/200/200',
    content: '刚刚听完张总的分享，收获满满！创业路上最重要的是保持初心，还有找到志同道合的伙伴。今天在这里，两个都找到了 ❤️',
    images: [],
    activityId: '1',
    activityTitle: '2024 创业者交流会',
    likeCount: 78,
    commentCount: 23,
    isLiked: false,
    createdAt: '30分钟前'
  },
  {
    id: '4',
    userId: '6',
    userName: '赵明远',
    userAvatar: 'https://picsum.photos/id/1012/200/200',
    content: '现场的技术氛围太浓了！刚和旁边的哥们儿聊了半小时AI，受益匪浅。技术人的快乐就是这么简单 💻',
    images: ['https://picsum.photos/id/2/600/600'],
    activityId: '2',
    activityTitle: 'AI 技术沙龙',
    likeCount: 24,
    commentCount: 6,
    isLiked: false,
    createdAt: '2小时前'
  },
  {
    id: '5',
    userId: '8',
    userName: '吴思琪',
    userAvatar: 'https://picsum.photos/id/718/200/200',
    content: '第一次参加这种活动，有点紧张但也很兴奋！做社交产品的我终于有机会亲身体验线下社交了哈哈 👋 有人想聊聊用户增长吗？',
    images: [],
    activityId: '1',
    activityTitle: '2024 创业者交流会',
    likeCount: 45,
    commentCount: 12,
    isLiked: true,
    createdAt: '20分钟前'
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    userId: '2',
    userName: '李思远',
    userAvatar: 'https://picsum.photos/id/177/200/200',
    content: '我也觉得超棒的！等下可以聊聊呀',
    createdAt: '50分钟前',
    likeCount: 3
  },
  {
    id: '2',
    userId: '8',
    userName: '吴思琪',
    userAvatar: 'https://picsum.photos/id/718/200/200',
    content: '下午见！我坐A区第三排',
    createdAt: '40分钟前',
    likeCount: 1
  },
  {
    id: '3',
    userId: '5',
    userName: '林梦瑶',
    userAvatar: 'https://picsum.photos/id/1025/200/200',
    content: '照片拍得真好！用的什么相机呀',
    createdAt: '35分钟前',
    likeCount: 2
  }
];

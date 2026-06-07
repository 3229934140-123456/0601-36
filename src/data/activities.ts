import { Activity, AnonymousQuestion, TopicVote, Announcement } from '@/types';

export const mockActivities: Activity[] = [
  {
    id: '1',
    title: '2024 创业者交流会',
    description: '汇聚各行业创业者，分享经验，拓展人脉，寻找合作伙伴',
    cover: 'https://picsum.photos/id/1082/750/400',
    location: '北京·国贸中心会议室A',
    startTime: '2024-06-10 14:00',
    endTime: '2024-06-10 18:00',
    hostName: '创业者联盟',
    participantCount: 128,
    maxParticipants: 200,
    status: 'ongoing',
    tags: ['创业', '商业', '人脉'],
    isJoined: true
  },
  {
    id: '2',
    title: 'AI 技术沙龙',
    description: '探讨人工智能前沿技术，与行业专家面对面交流',
    cover: 'https://picsum.photos/id/1/750/400',
    location: '上海·张江科技园',
    startTime: '2024-06-15 09:00',
    endTime: '2024-06-15 17:00',
    hostName: 'AI Tech Community',
    participantCount: 86,
    status: 'upcoming',
    tags: ['AI', '技术', '前沿']
  },
  {
    id: '3',
    title: '周末读书分享会',
    description: '每月一期的读书分享，本期主题：心理学与生活',
    cover: 'https://picsum.photos/id/1074/750/400',
    location: '深圳·南山书店二楼',
    startTime: '2024-06-08 15:00',
    endTime: '2024-06-08 17:30',
    hostName: '读书会',
    participantCount: 24,
    maxParticipants: 30,
    status: 'ongoing',
    tags: ['读书', '文化', '社交'],
    isJoined: false
  },
  {
    id: '4',
    title: '产品经理成长营',
    description: '资深产品经理亲授经验，助你快速成长',
    cover: 'https://picsum.photos/id/2/750/400',
    location: '杭州·梦想小镇',
    startTime: '2024-06-20 10:00',
    endTime: '2024-06-20 16:00',
    hostName: '产品学院',
    participantCount: 56,
    status: 'upcoming',
    tags: ['产品', '职业', '成长']
  },
  {
    id: '5',
    title: '设计思维工作坊',
    description: '用设计思维解决实际问题，激发创意潜能',
    cover: 'https://picsum.photos/id/3/750/400',
    location: '广州·TIT创意园',
    startTime: '2024-06-05 09:30',
    endTime: '2024-06-05 18:00',
    hostName: '设计社',
    participantCount: 32,
    status: 'ended',
    tags: ['设计', '创意', '工作坊']
  },
  {
    id: '6',
    title: '青年职业发展论坛',
    description: '职场前辈分享经验，助力青年职业发展',
    cover: 'https://picsum.photos/id/1080/750/400',
    location: '成都·高新区天府软件园',
    startTime: '2024-06-25 14:00',
    endTime: '2024-06-25 17:00',
    hostName: '青年发展协会',
    participantCount: 150,
    maxParticipants: 300,
    status: 'upcoming',
    tags: ['职业', '发展', '论坛']
  }
];

export const mockAnonymousQuestions: AnonymousQuestion[] = [
  {
    id: '1',
    content: '第一次创业最容易踩的坑有哪些？',
    isApproved: true,
    likeCount: 23,
    createdAt: '10分钟前'
  },
  {
    id: '2',
    content: '如何在短时间内快速建立信任？',
    isApproved: true,
    likeCount: 18,
    createdAt: '15分钟前'
  },
  {
    id: '3',
    content: '创业初期如何找到第一个客户？',
    isApproved: true,
    likeCount: 35,
    createdAt: '25分钟前'
  },
  {
    id: '4',
    content: '技术出身的创业者如何提升商业思维？',
    isApproved: false,
    likeCount: 0,
    createdAt: '刚刚'
  }
];

export const mockTopicVotes: TopicVote[] = [
  {
    id: '1',
    title: '下午圆桌讨论主题投票',
    options: [
      { id: '1-1', text: '后疫情时代的创业机会', voteCount: 45, isSelected: false },
      { id: '1-2', text: '数字化转型的挑战与机遇', voteCount: 38, isSelected: false },
      { id: '1-3', text: '年轻人如何实现财务自由', voteCount: 52, isSelected: false },
      { id: '1-4', text: 'AI 对各行业的影响', voteCount: 67, isSelected: true }
    ],
    totalVotes: 202,
    isEnded: false
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '活动流程更新',
    content: '下午15:00的圆桌讨论调整到A会议室举行，请大家留意场地变化。茶歇时间延长至30分钟，欢迎大家自由交流。',
    createdAt: '30分钟前',
    type: 'host'
  },
  {
    id: '2',
    title: '配对功能已开放',
    content: '兴趣配对功能已开放，前往"配对"页面，找到志同道合的伙伴吧！',
    createdAt: '1小时前',
    type: 'system'
  }
];

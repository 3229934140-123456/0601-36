import { User, MatchResult, InterestTag } from '@/types';

export const mockCurrentUser: User = {
  id: 'me',
  name: '小明',
  avatar: 'https://picsum.photos/id/64/200/200',
  bio: '热爱生活，喜欢交朋友',
  tags: ['创业', '产品', '读书', '旅行', '咖啡'],
  company: '某科技公司',
  position: '产品经理',
  city: '北京',
  gender: 'male',
  isCheckedIn: true,
  checkInTime: '14:05'
};

export const mockParticipants: User[] = [
  {
    id: '1',
    name: '张小雨',
    avatar: 'https://picsum.photos/id/91/200/200',
    bio: '连续创业者，专注AI领域',
    tags: ['创业', 'AI', '技术', '投资'],
    company: '智创科技',
    position: 'CEO',
    city: '北京',
    isCheckedIn: true,
    checkInTime: '13:50'
  },
  {
    id: '2',
    name: '李思远',
    avatar: 'https://picsum.photos/id/177/200/200',
    bio: '产品经理 / 咖啡爱好者',
    tags: ['产品', '用户体验', '咖啡', '摄影'],
    company: '某互联网公司',
    position: '高级产品经理',
    city: '上海',
    isCheckedIn: true,
    checkInTime: '14:00'
  },
  {
    id: '3',
    name: '王晓琳',
    avatar: 'https://picsum.photos/id/338/200/200',
    bio: '设计师，热爱一切美好事物',
    tags: ['设计', 'UI/UX', '艺术', '旅行'],
    company: '设计工作室',
    position: '设计总监',
    city: '深圳',
    isCheckedIn: true,
    checkInTime: '13:45'
  },
  {
    id: '4',
    name: '陈子轩',
    avatar: 'https://picsum.photos/id/1027/200/200',
    bio: '投资人，关注早期科技项目',
    tags: ['投资', '创业', '科技', '金融'],
    company: '某VC机构',
    position: '投资总监',
    city: '北京',
    isCheckedIn: false
  },
  {
    id: '5',
    name: '林梦瑶',
    avatar: 'https://picsum.photos/id/1025/200/200',
    bio: '市场总监 / 健身达人',
    tags: ['市场营销', '品牌', '健身', '美食'],
    company: '某快消品牌',
    position: '市场总监',
    city: '广州',
    isCheckedIn: true,
    checkInTime: '14:10'
  },
  {
    id: '6',
    name: '赵明远',
    avatar: 'https://picsum.photos/id/1012/200/200',
    bio: '全栈工程师 / 开源爱好者',
    tags: ['技术', '编程', '开源', 'AI'],
    company: '某云服务商',
    position: '技术专家',
    city: '杭州',
    isCheckedIn: true,
    checkInTime: '13:55'
  },
  {
    id: '7',
    name: '周小楠',
    avatar: 'https://picsum.photos/id/659/200/200',
    bio: '心理咨询师 / 冥想练习者',
    tags: ['心理学', '冥想', '读书', '自我成长'],
    company: '心理咨询工作室',
    position: '咨询师',
    city: '成都',
    isCheckedIn: false
  },
  {
    id: '8',
    name: '吴思琪',
    avatar: 'https://picsum.photos/id/718/200/200',
    bio: '创业者，正在做社交产品',
    tags: ['创业', '社交', '产品', '用户增长'],
    company: '初创团队',
    position: '创始人',
    city: '北京',
    isCheckedIn: true,
    checkInTime: '14:02'
  }
];

export const mockMatchResults: MatchResult[] = [
  {
    user: mockParticipants[0],
    commonTags: ['创业', '技术'],
    matchScore: 85
  },
  {
    user: mockParticipants[1],
    commonTags: ['产品', '咖啡'],
    matchScore: 72
  },
  {
    user: mockParticipants[4],
    commonTags: ['美食', '旅行'],
    matchScore: 68
  }
];

export const mockInterestTags: InterestTag[] = [
  { id: '1', name: '创业', category: '职业' },
  { id: '2', name: '投资', category: '职业' },
  { id: '3', name: '产品', category: '职业' },
  { id: '4', name: '设计', category: '职业' },
  { id: '5', name: '技术', category: '职业' },
  { id: '6', name: 'AI', category: '科技' },
  { id: '7', name: '区块链', category: '科技' },
  { id: '8', name: '大数据', category: '科技' },
  { id: '9', name: '读书', category: '兴趣' },
  { id: '10', name: '旅行', category: '兴趣' },
  { id: '11', name: '摄影', category: '兴趣' },
  { id: '12', name: '健身', category: '兴趣' },
  { id: '13', name: '美食', category: '兴趣' },
  { id: '14', name: '咖啡', category: '兴趣' },
  { id: '15', name: '电影', category: '兴趣' },
  { id: '16', name: '音乐', category: '兴趣' },
  { id: '17', name: '心理学', category: '成长' },
  { id: '18', name: '自我成长', category: '成长' },
  { id: '19', name: '冥想', category: '成长' },
  { id: '20', name: '理财', category: '成长' }
];

export const mockFavorites: User[] = [
  mockParticipants[0],
  mockParticipants[2],
  mockParticipants[5]
];

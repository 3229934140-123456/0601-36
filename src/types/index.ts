// 用户信息
export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  tags: string[];
  company?: string;
  position?: string;
  city?: string;
  gender?: 'male' | 'female' | 'other';
  isCheckedIn?: boolean;
  checkInTime?: string;
}

// 活动信息
export interface Activity {
  id: string;
  title: string;
  description: string;
  cover: string;
  location: string;
  startTime: string;
  endTime: string;
  hostName: string;
  participantCount: number;
  maxParticipants?: number;
  status: 'upcoming' | 'ongoing' | 'ended';
  tags: string[];
  isJoined?: boolean;
}

// 动态
export interface Moment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  images: string[];
  activityId?: string;
  activityTitle?: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
}

// 评论
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likeCount: number;
}

// 私信会话
export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
}

// 消息
export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'card';
  createdAt: string;
  isRead: boolean;
  cardData?: User;
}

// 匿名提问
export interface AnonymousQuestion {
  id: string;
  content: string;
  isApproved: boolean;
  likeCount: number;
  createdAt: string;
}

// 话题投票
export interface TopicVote {
  id: string;
  title: string;
  options: TopicOption[];
  totalVotes: number;
  isEnded: boolean;
}

export interface TopicOption {
  id: string;
  text: string;
  voteCount: number;
  isSelected?: boolean;
}

// 配对结果
export interface MatchResult {
  user: User;
  commonTags: string[];
  matchScore: number;
}

// 公告
export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  type: 'system' | 'host';
}

// 兴趣标签
export interface InterestTag {
  id: string;
  name: string;
  category: string;
  isSelected?: boolean;
}

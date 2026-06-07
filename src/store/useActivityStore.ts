import { create } from 'zustand';
import { Activity, Moment, Comment, AnonymousQuestion, ChatMessage } from '@/types';
import { mockActivities } from '@/data/activities';

interface ScheduleItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'opening' | 'keynote' | 'panel' | 'workshop' | 'break' | 'networking' | 'closing';
  isOngoing?: boolean;
  description?: string;
}

interface ActivityState {
  joinedActivities: string[];
  joinActivity: (activityId: string) => void;
  isJoined: (activityId: string) => boolean;

  myMoments: Record<string, Moment[]>;
  addMoment: (activityId: string, moment: Moment) => void;

  myComments: Record<string, Comment[]>;
  addComment: (activityId: string, momentId: string, comment: Comment) => void;

  exchangedCards: string[];
  addExchangedCard: (userId: string) => void;
  hasExchangedCard: (userId: string) => boolean;

  topicQuestions: Record<string, AnonymousQuestion[]>;
  addTopicQuestion: (activityId: string, question: AnonymousQuestion) => void;
  likeTopicQuestion: (activityId: string, questionId: string) => void;
  isQuestionLiked: (activityId: string, questionId: string) => boolean;

  topicMessages: Record<string, ChatMessage[]>;
  addTopicMessage: (activityId: string, message: ChatMessage) => void;

  likedQuestions: Record<string, string[]>;

  getSchedule: (activityId: string) => ScheduleItem[];
}

const mockSchedules: Record<string, ScheduleItem[]> = {
  '1': [
    {
      id: 's1',
      title: '签到入场',
      startTime: '13:30',
      endTime: '14:00',
      type: 'opening',
      description: '领取胸牌、活动手册，自由交流'
    },
    {
      id: 's2',
      title: '开幕致辞',
      startTime: '14:00',
      endTime: '14:15',
      type: 'opening',
      isOngoing: false,
      description: '主办方开场介绍及活动流程说明'
    },
    {
      id: 's3',
      title: '主题演讲：AI 时代的创业机遇',
      startTime: '14:15',
      endTime: '15:00',
      type: 'keynote',
      isOngoing: true,
      description: '邀请行业大咖分享 AI 创业趋势与洞察'
    },
    {
      id: 's4',
      title: '茶歇交流',
      startTime: '15:00',
      endTime: '15:30',
      type: 'break',
      description: '享用精美茶歇，自由交流'
    },
    {
      id: 's5',
      title: '圆桌讨论：产品与技术的碰撞',
      startTime: '15:30',
      endTime: '16:30',
      type: 'panel',
      description: '产品经理 vs 技术专家，深度对话'
    },
    {
      id: 's6',
      title: '兴趣配对社交',
      startTime: '16:30',
      endTime: '17:30',
      type: 'networking',
      description: '根据兴趣标签匹配，一对一深度交流'
    },
    {
      id: 's7',
      title: '闭幕总结',
      startTime: '17:30',
      endTime: '17:45',
      type: 'closing',
      description: '活动总结与合影留念'
    }
  ]
};

const initJoined = mockActivities.filter((a) => a.isJoined).map((a) => a.id);

export const useActivityStore = create<ActivityState>((set, get) => ({
  joinedActivities: initJoined,

  joinActivity: (activityId) => {
    const { joinedActivities } = get();
    if (!joinedActivities.includes(activityId)) {
      set({ joinedActivities: [...joinedActivities, activityId] });
    }
  },

  isJoined: (activityId) => get().joinedActivities.includes(activityId),

  myMoments: {},
  addMoment: (activityId, moment) =>
    set((state) => ({
      myMoments: {
        ...state.myMoments,
        [activityId]: [moment, ...(state.myMoments[activityId] || [])]
      }
    })),

  myComments: {},
  addComment: (activityId, momentId, comment) =>
    set((state) => ({
      myComments: {
        ...state.myComments,
        [momentId]: [...(state.myComments[momentId] || []), comment]
      }
    })),

  exchangedCards: [],
  addExchangedCard: (userId) =>
    set((state) => ({
      exchangedCards: state.exchangedCards.includes(userId)
        ? state.exchangedCards
        : [...state.exchangedCards, userId]
    })),

  hasExchangedCard: (userId) => get().exchangedCards.includes(userId),

  topicQuestions: {},
  addTopicQuestion: (activityId, question) =>
    set((state) => ({
      topicQuestions: {
        ...state.topicQuestions,
        [activityId]: [question, ...(state.topicQuestions[activityId] || [])]
      }
    })),

  likedQuestions: {},
  likeTopicQuestion: (activityId, questionId) =>
    set((state) => {
      const liked = state.likedQuestions[activityId] || [];
      const isLiked = liked.includes(questionId);
      return {
        likedQuestions: {
          ...state.likedQuestions,
          [activityId]: isLiked
            ? liked.filter((id) => id !== questionId)
            : [...liked, questionId]
        },
        topicQuestions: {
          ...state.topicQuestions,
          [activityId]: (state.topicQuestions[activityId] || []).map((q) =>
            q.id === questionId
              ? { ...q, likeCount: isLiked ? q.likeCount - 1 : q.likeCount + 1 }
              : q
          )
        }
      };
    }),

  isQuestionLiked: (activityId, questionId) => {
    const liked = get().likedQuestions[activityId] || [];
    return liked.includes(questionId);
  },

  topicMessages: {},
  addTopicMessage: (activityId, message) =>
    set((state) => ({
      topicMessages: {
        ...state.topicMessages,
        [activityId]: [...(state.topicMessages[activityId] || []), message]
      }
    })),

  getSchedule: (activityId) => mockSchedules[activityId] || mockSchedules['1'] || []
}));

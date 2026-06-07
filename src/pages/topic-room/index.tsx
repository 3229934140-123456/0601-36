import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { AnonymousQuestion } from '@/types';
import { mockAnonymousQuestions } from '@/data/activities';
import { mockParticipants } from '@/data/users';
import { useActivityStore } from '@/store/useActivityStore';
import { useUserStore } from '@/store/useUserStore';
import UserAvatar from '@/components/UserAvatar';
import styles from './index.module.scss';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  isSelf: boolean;
}

const tabs = [
  { key: 'chat', label: '讨论' },
  { key: 'questions', label: '提问' },
  { key: 'hot', label: '热门' }
];

const TopicRoomPage: React.FC = () => {
  const router = useRouter();
  const activityId = router.params.activityId || '1';
  const { currentUser } = useUserStore();
  const { topicQuestions, addTopicQuestion, likeTopicQuestion, isQuestionLiked } =
    useActivityStore();

  const [activeTab, setActiveTab] = useState('chat');
  const [inputText, setInputText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const scrollRef = useRef<any>(null);

  useEffect(() => {
    console.log('[TopicRoom] 话题房加载，活动ID:', activityId);
    Taro.setNavigationBarTitle({ title: '话题讨论' });

    const mockChats: ChatMessage[] = [
      {
        id: 'c1',
        userId: mockParticipants[0].id,
        userName: mockParticipants[0].name,
        userAvatar: mockParticipants[0].avatar,
        content: '大家好！很高兴参加今天的活动～',
        isAnonymous: false,
        createdAt: '14:05',
        isSelf: false
      },
      {
        id: 'c2',
        userId: 'anon1',
        userName: '匿名用户',
        userAvatar: 'https://picsum.photos/id/100/100/100',
        content: '请问今天的主题演讲会讲哪些方向呢？',
        isAnonymous: true,
        createdAt: '14:06',
        isSelf: false
      },
      {
        id: 'c3',
        userId: mockParticipants[1].id,
        userName: mockParticipants[1].name,
        userAvatar: mockParticipants[1].avatar,
        content: '听说会重点聊 AI 创业的机会和挑战',
        isAnonymous: false,
        createdAt: '14:07',
        isSelf: false
      }
    ];
    setChatMessages(mockChats);
  }, [activityId]);

  const allQuestions = mockAnonymousQuestions.concat(topicQuestions[activityId] || []);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    console.log('[TopicRoom] 发送消息:', text, '匿名:', isAnonymous);

    if (activeTab === 'chat') {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: isAnonymous ? '匿名用户' : currentUser.name,
        userAvatar: isAnonymous
          ? 'https://picsum.photos/id/100/100/100'
          : currentUser.avatar,
        content: text,
        isAnonymous,
        createdAt: '刚刚',
        isSelf: true
      };
      setChatMessages((prev) => [...prev, newMsg]);
    } else {
      const newQ: AnonymousQuestion = {
        id: Date.now().toString(),
        content: text,
        isAnonymous: true,
        likeCount: 0,
        createdAt: '刚刚',
        status: 'pending'
      };
      addTopicQuestion(activityId, newQ);
      Taro.showToast({
        title: '提问已提交',
        icon: 'success'
      });
    }

    setInputText('');

    setTimeout(() => {
      scrollRef.current?.scrollToOffset?.({ offset: 10000, animated: true });
    }, 100);
  }, [inputText, isAnonymous, activeTab, currentUser, activityId, addTopicQuestion]);

  const handleLikeQuestion = useCallback(
    (questionId: string) => {
      console.log('[TopicRoom] 点赞问题:', questionId);
      likeTopicQuestion(activityId, questionId);
    },
    [activityId, likeTopicQuestion]
  );

  const handleUserClick = useCallback(
    (userId: string, isSelf: boolean) => {
      if (isSelf) return;
      console.log('[TopicRoom] 查看用户:', userId);
      Taro.navigateTo({
        url: `/pages/chat-detail/index?userId=${userId}`
      });
    },
    []
  );

  const displayQuestions = (() => {
    if (activeTab === 'hot') {
      return [...allQuestions].sort((a, b) => b.likeCount - a.likeCount).slice(0, 10);
    }
    return allQuestions;
  })();

  const canSend = inputText.trim().length > 0;

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.activityTitle}>话题讨论</Text>
        <View className={styles.tabBar}>
          {tabs.map((tab) => (
            <Text
              key={tab.key}
              className={classnames(
                styles.tabItem,
                activeTab === tab.key && styles.tabItemActive
              )}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView scrollY className={styles.messageList} ref={scrollRef}>
        {activeTab === 'chat' && (
          <>
            <View className={styles.messageTime}>
              <Text>今天 14:00</Text>
            </View>
            {chatMessages.map((msg) => (
              <View
                key={msg.id}
                className={classnames(styles.messageItem, msg.isSelf && styles.messageSelf)}
                onClick={() => handleUserClick(msg.userId, msg.isSelf)}
              >
                <View className={styles.messageAvatar}>
                  <UserAvatar src={msg.userAvatar} size="medium" />
                </View>
                <View className={styles.messageBubble}>
                  <View className={styles.messageHeader}>
                    <Text className={styles.messageName}>{msg.userName}</Text>
                    {msg.isAnonymous && (
                      <Text className={styles.anonymousBadge}>匿名</Text>
                    )}
                  </View>
                  <Text className={styles.messageContent}>{msg.content}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {(activeTab === 'questions' || activeTab === 'hot') && (
          <>
            {displayQuestions.length > 0 ? (
              displayQuestions.map((q) => {
                const liked = isQuestionLiked(activityId, q.id);
                return (
                  <View key={q.id} className={styles.questionCard}>
                    <View className={styles.questionHeader}>
                      <Text className={styles.questionBadge}>
                        {q.status === 'approved' ? '已通过' : '审核中'}
                      </Text>
                      <Text className={styles.questionTime}>{q.createdAt}</Text>
                    </View>
                    <Text className={styles.questionContent}>{q.content}</Text>
                    <View className={styles.questionFooter}>
                      <View
                        className={classnames(
                          styles.likeBtn,
                          liked && styles.likeBtnActive
                        )}
                        onClick={() => handleLikeQuestion(q.id)}
                      >
                        <Text className={styles.likeIcon}>
                          {liked ? '👍' : '🤍'}
                        </Text>
                        <Text
                          className={classnames(
                            styles.likeCount,
                            liked && styles.likeCountActive
                          )}
                        >
                          {q.likeCount}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>❓</Text>
                <Text className={styles.emptyText}>暂无提问，快来第一个提问吧</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View className={styles.inputBar}>
        <View
          className={classnames(
            styles.anonymousToggle,
            isAnonymous && styles.anonymousToggleActive
          )}
          onClick={() => setIsAnonymous(!isAnonymous)}
        >
          <Text
            className={classnames(
              styles.anonymousText,
              isAnonymous && styles.anonymousTextActive
            )}
          >
            {isAnonymous ? '🕶 匿名' : '实名'}
          </Text>
        </View>
        <View className={styles.inputWrapper}>
          <Input
            className={styles.input}
            placeholder={
              activeTab === 'chat'
                ? isAnonymous
                  ? '匿名说点什么...'
                  : '说点什么...'
                : isAnonymous
                ? '匿名提问...'
                : '输入你的问题...'
            }
            value={inputText}
            onInput={(e) => setInputText(e.detail.value)}
            onConfirm={handleSend}
          />
        </View>
        <View
          className={classnames(styles.sendBtn, !canSend && styles.sendBtnDisabled)}
          onClick={canSend ? handleSend : undefined}
        >
          <Text className={styles.sendBtnText}>发送</Text>
        </View>
      </View>
    </View>
  );
};

export default TopicRoomPage;

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { User, AnonymousQuestion, TopicVote, TopicOption } from '@/types';
import { mockParticipants, mockCurrentUser } from '@/data/users';
import { mockAnonymousQuestions, mockTopicVotes } from '@/data/activities';
import UserAvatar from '@/components/UserAvatar';
import styles from './index.module.scss';

const CheckinPage: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(mockCurrentUser.isCheckedIn || false);
  const [checkinTime, setCheckinTime] = useState(mockCurrentUser.checkInTime || '');
  const [participants] = useState<User[]>(mockParticipants);
  const [questions, setQuestions] = useState<AnonymousQuestion[]>(mockAnonymousQuestions);
  const [newQuestion, setNewQuestion] = useState('');
  const [voteData, setVoteData] = useState<TopicVote>(mockTopicVotes[0]);
  const [likedQuestions, setLikedQuestions] = useState<string[]>([]);

  const checkedInCount = participants.filter((p) => p.isCheckedIn).length + (isCheckedIn ? 1 : 0);
  const approvedQuestions = questions.filter((q) => q.isApproved);

  const handleCheckin = useCallback(() => {
    if (isCheckedIn) return;
    console.log('[Checkin] 执行签到');
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    setIsCheckedIn(true);
    setCheckinTime(timeStr);
    Taro.showToast({
      title: '签到成功！',
      icon: 'success'
    });
  }, [isCheckedIn]);

  const handleSubmitQuestion = useCallback(() => {
    if (!newQuestion.trim()) return;
    console.log('[Checkin] 提交匿名问题:', newQuestion);
    const newQ: AnonymousQuestion = {
      id: Date.now().toString(),
      content: newQuestion.trim(),
      isApproved: false,
      likeCount: 0,
      createdAt: '刚刚'
    };
    setQuestions((prev) => [newQ, ...prev]);
    setNewQuestion('');
    Taro.showToast({
      title: '已提交，等待审核',
      icon: 'none'
    });
  }, [newQuestion]);

  const handleLikeQuestion = useCallback(
    (questionId: string) => {
      if (!questions.find((q) => q.id === questionId)?.isApproved) return;
      console.log('[Checkin] 点赞问题:', questionId);
      const isLiked = likedQuestions.includes(questionId);
      setLikedQuestions((prev) =>
        isLiked ? prev.filter((id) => id !== questionId) : [...prev, questionId]
      );
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, likeCount: isLiked ? q.likeCount - 1 : q.likeCount + 1 }
            : q
        )
      );
    },
    [likedQuestions, questions]
  );

  const handleVote = useCallback(
    (optionId: string) => {
      if (voteData.isEnded) return;
      console.log('[Checkin] 投票选项:', optionId);
      const hasSelected = voteData.options.some((opt) => opt.isSelected);
      if (hasSelected) {
        Taro.showToast({
          title: '您已投过票',
          icon: 'none'
        });
        return;
      }
      setVoteData((prev) => ({
        ...prev,
        totalVotes: prev.totalVotes + 1,
        options: prev.options.map((opt) =>
          opt.id === optionId
            ? { ...opt, isSelected: true, voteCount: opt.voteCount + 1 }
            : opt
        )
      }));
      Taro.showToast({
        title: '投票成功！',
        icon: 'success'
      });
    },
    [voteData]
  );

  const handleUserClick = useCallback((userId: string) => {
    console.log('[Checkin] 查看用户:', userId);
    Taro.navigateTo({
      url: `/pages/chat-detail/index?userId=${userId}`
    });
  }, []);

  const handleViewAllParticipants = useCallback(() => {
    console.log('[Checkin] 查看全部到场名单');
    Taro.showToast({
      title: '到场名单',
      icon: 'none'
    });
  }, []);

  useEffect(() => {
    console.log('[Checkin] 页面加载完成，已签到人数:', checkedInCount);
  }, [checkedInCount]);

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.headerCard}>
        <Text className={styles.headerTitle}>2024 创业者交流会</Text>
        <Text className={styles.headerSubtitle}>北京·国贸中心会议室A</Text>

        <View className={styles.checkinStatus}>
          <View className={styles.statusInfo}>
            <Text className={styles.statusText}>
              {isCheckedIn ? '🎉 已签到' : '还未签到'}
            </Text>
            {isCheckedIn && (
              <Text className={styles.statusTime}>签到时间：{checkinTime}</Text>
            )}
          </View>
          <View
            className={classnames(styles.checkinBtn, isCheckedIn && styles.checkinBtnChecked)}
            onClick={handleCheckin}
          >
            <Text
              className={classnames(
                styles.checkinBtnText,
                isCheckedIn && styles.checkinBtnTextChecked
              )}
            >
              {isCheckedIn ? '已签到' : '立即签到'}
            </Text>
          </View>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{checkedInCount}</Text>
            <Text className={styles.statLabel}>已签到</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{participants.length}</Text>
            <Text className={styles.statLabel}>总参与</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{approvedQuestions.length}</Text>
            <Text className={styles.statLabel}>提问数</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👥</Text>
            到场名单
          </Text>
          <Text className={styles.sectionMore} onClick={handleViewAllParticipants}>
            查看全部 ›
          </Text>
        </View>
        <View className={styles.participantList}>
          {participants.slice(0, 5).map((user) => (
            <View
              key={user.id}
              className={styles.participantItem}
              onClick={() => handleUserClick(user.id)}
            >
              <UserAvatar src={user.avatar} size="medium" isOnline={user.isCheckedIn} />
              <View className={styles.participantInfo}>
                <View className={styles.participantName}>
                  <Text>{user.name}</Text>
                  {user.isCheckedIn && (
                    <Text className={styles.checkedBadge}>已签到</Text>
                  )}
                </View>
                <Text className={styles.participantDesc}>
                  {user.company} · {user.position}
                </Text>
              </View>
              <Text className={styles.participantTime}>
                {user.isCheckedIn ? user.checkInTime : '未签到'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>❓</Text>
            匿名提问
          </Text>
          <Text className={styles.sectionMore}>主持人审核后展示</Text>
        </View>

        <View className={styles.questionInputWrapper}>
          <Input
            className={styles.questionInput}
            placeholder="输入你的问题..."
            value={newQuestion}
            onInput={(e) => setNewQuestion(e.detail.value)}
            onConfirm={handleSubmitQuestion}
          />
          <View className={styles.submitBtn} onClick={handleSubmitQuestion}>
            <Text className={styles.submitBtnText}>提交</Text>
          </View>
        </View>

        {questions.map((q) => (
          <View key={q.id} className={styles.questionItem}>
            <Text className={styles.questionContent}>{q.content}</Text>
            <View className={styles.questionMeta}>
              <View style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
                <Text className={styles.questionTime}>{q.createdAt}</Text>
                {!q.isApproved && (
                  <Text className={styles.pendingBadge}>审核中</Text>
                )}
              </View>
              <View className={styles.questionActions}>
                <View
                  className={classnames(
                    styles.likeBtn,
                    likedQuestions.includes(q.id) && styles.likeBtnActive
                  )}
                  onClick={() => handleLikeQuestion(q.id)}
                >
                  <Text className={styles.likeIcon}>
                    {likedQuestions.includes(q.id) ? '❤️' : '🤍'}
                  </Text>
                  <Text className={styles.likeCount}>{q.likeCount}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🗳️</Text>
            话题投票
          </Text>
        </View>

        <Text className={styles.voteTitle}>{voteData.title}</Text>
        <Text className={styles.voteTotal}>共 {voteData.totalVotes} 人参与投票</Text>

        <View className={styles.voteOptions}>
          {voteData.options.map((option: TopicOption) => {
            const percentage = voteData.totalVotes
              ? Math.round((option.voteCount / voteData.totalVotes) * 100)
              : 0;
            return (
              <View
                key={option.id}
                className={classnames(
                  styles.voteOption,
                  option.isSelected && styles.voteOptionSelected
                )}
                onClick={() => handleVote(option.id)}
              >
                <View
                  className={styles.voteProgress}
                  style={{ width: `${percentage}%` }}
                />
                <View className={styles.voteOptionContent}>
                  <View
                    className={classnames(
                      styles.voteRadio,
                      option.isSelected && styles.voteRadioSelected
                    )}
                  >
                    {option.isSelected && <View className={styles.voteRadioInner} />}
                  </View>
                  <Text className={styles.voteOptionText}>{option.text}</Text>
                  <Text className={styles.voteCount}>
                    {option.voteCount}票 · {percentage}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default CheckinPage;

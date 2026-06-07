import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { mockMoments } from '@/data/moments';
import { mockAnonymousQuestions } from '@/data/activities';
import { mockParticipants } from '@/data/users';
import { useUserStore } from '@/store/useUserStore';
import { useActivityStore } from '@/store/useActivityStore';
import UserAvatar from '@/components/UserAvatar';
import styles from './index.module.scss';

const reviewPhotos = [
  'https://picsum.photos/id/237/400/400',
  'https://picsum.photos/id/238/400/400',
  'https://picsum.photos/id/239/400/400',
  'https://picsum.photos/id/240/400/400',
  'https://picsum.photos/id/241/400/400',
  'https://picsum.photos/id/242/400/400',
  'https://picsum.photos/id/243/400/400',
  'https://picsum.photos/id/244/400/400',
  'https://picsum.photos/id/245/400/400'
];

const ActivityReviewPage: React.FC = () => {
  const router = useRouter();
  const activityId = router.params.activityId || '1';
  const { toggleFavorite, isFavorite } = useUserStore();
  const { topicQuestions } = useActivityStore();

  const [activityTitle, setActivityTitle] = useState('');
  const [favStates, setFavStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log('[ActivityReview] 活动回顾页，活动ID:', activityId);
    Taro.setNavigationBarTitle({ title: '活动回顾' });
    setActivityTitle('2024 创业者交流会');

    const states: Record<string, boolean> = {};
    mockParticipants.forEach((p) => {
      states[p.id] = isFavorite(p.id);
    });
    setFavStates(states);
  }, [activityId, isFavorite]);

  const displayPhotos = useMemo(() => reviewPhotos.slice(0, 8), []);
  const hasMorePhotos = reviewPhotos.length > 8;

  const displayMoments = useMemo(() => mockMoments.slice(0, 3), []);

  const hotQuestions = useMemo(() => {
    const allQuestions = [...mockAnonymousQuestions, ...(topicQuestions[activityId] || [])];
    return allQuestions
      .filter((q) => q.status === 'approved')
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 3);
  }, [activityId, topicQuestions]);

  const metPeople = useMemo(() => mockParticipants.slice(0, 8), []);

  const handlePhotoPreview = useCallback((index: number) => {
    console.log('[ActivityReview] 预览照片', index);
    Taro.previewImage({
      urls: reviewPhotos,
      current: reviewPhotos[index]
    });
  }, []);

  const handleUserClick = useCallback((userId: string) => {
    console.log('[ActivityReview] 查看用户:', userId);
    Taro.navigateTo({
      url: `/pages/chat-detail/index?userId=${userId}`
    });
  }, []);

  const handleToggleFav = useCallback(
    (userId: string) => {
      console.log('[ActivityReview] 切换收藏:', userId);
      toggleFavorite(userId);
      setFavStates((prev) => ({
        ...prev,
        [userId]: !prev[userId]
      }));
      Taro.showToast({
        title: !favStates[userId] ? '已收藏' : '已取消',
        icon: 'none'
      });
    },
    [toggleFavorite, favStates]
  );

  const handleMoreMoments = useCallback(() => {
    Taro.switchTab({ url: '/pages/moments/index' });
  }, []);

  const handleMorePeople = useCallback(() => {
    Taro.switchTab({ url: '/pages/checkin/index' });
  }, []);

  const handleMomentClick = useCallback(
    (momentId: string) => {
      console.log('[ActivityReview] 查看动态:', momentId);
      Taro.switchTab({ url: '/pages/moments/index' });
    },
    []
  );

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.activityTitle}>{activityTitle}</Text>
        <View className={styles.activityMeta}>
          <View className={styles.metaItem}>
            <Text>📍</Text>
            <Text>北京 · 中关村创新中心</Text>
          </View>
          <View className={styles.metaItem}>
            <Text>👥</Text>
            <Text>{mockParticipants.length}人参与</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            📸 精彩照片
            <Text className={styles.sectionCount}>{reviewPhotos.length}张</Text>
          </Text>
        </View>
        <View className={styles.photoGrid}>
          {displayPhotos.map((photo, index) => (
            <View
              key={index}
              className={styles.photoItem}
              onClick={() => handlePhotoPreview(index)}
            >
              <Image className={styles.photoImg} src={photo} mode="aspectFill" />
            </View>
          ))}
          {hasMorePhotos && (
            <View
              className={styles.photoMore}
              onClick={() => handlePhotoPreview(0)}
            >
              <Text className={styles.photoMoreIcon}>📷</Text>
              <Text className={styles.photoMoreText}>
                全部{reviewPhotos.length}张
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            💬 现场动态
            <Text className={styles.sectionCount}>{mockMoments.length}条</Text>
          </Text>
          <Text className={styles.sectionMore} onClick={handleMoreMoments}>
            更多 ›
          </Text>
        </View>
        {displayMoments.map((moment) => (
          <View
            key={moment.id}
            className={styles.momentItem}
            onClick={() => handleMomentClick(moment.id)}
          >
            <View className={styles.momentHeader}>
              <View onClick={(e) => {
                e.stopPropagation?.();
                handleUserClick(moment.userId);
              }}>
                <UserAvatar src={moment.userAvatar} size="medium" />
              </View>
              <View
                className={styles.momentUserInfo}
                onClick={(e) => {
                  e.stopPropagation?.();
                  handleUserClick(moment.userId);
                }}
              >
                <Text className={styles.momentName}>{moment.userName}</Text>
                <Text className={styles.momentTime}>{moment.createdAt}</Text>
              </View>
            </View>
            <Text className={styles.momentContent}>{moment.content}</Text>
            {moment.images && moment.images.length > 0 && (
              <View className={styles.momentImages}>
                {moment.images.slice(0, 3).map((img, i) => (
                  <Image key={i} className={styles.momentImg} src={img} mode="aspectFill" />
                ))}
              </View>
            )}
            <View className={styles.momentFooter}>
              <View className={styles.momentAction}>
                <Text className={styles.actionIcon}>❤</Text>
                <Text>{moment.likeCount}</Text>
              </View>
              <View className={styles.momentAction}>
                <Text className={styles.actionIcon}>💬</Text>
                <Text>{moment.commentCount}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            ❓ 热门问题
            <Text className={styles.sectionCount}>{hotQuestions.length}个</Text>
          </Text>
        </View>
        {hotQuestions.length > 0 ? (
          hotQuestions.map((q) => (
            <View key={q.id} className={styles.questionItem}>
              <Text className={styles.questionContent}>{q.content}</Text>
              <View className={styles.questionFooter}>
                <Text className={styles.questionTime}>{q.createdAt}</Text>
                <View className={styles.questionLikes}>
                  <Text>👍</Text>
                  <Text>{q.likeCount}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>❓</Text>
            <Text className={styles.emptyText}>暂无热门问题</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            👥 结识的人
            <Text className={styles.sectionCount}>{metPeople.length}位</Text>
          </Text>
          <Text className={styles.sectionMore} onClick={handleMorePeople}>
            更多 ›
          </Text>
        </View>
        <View className={styles.peopleGrid}>
          {metPeople.map((person) => (
            <View key={person.id} className={styles.personItem}>
              <View
                className={styles.personAvatar}
                onClick={() => handleUserClick(person.id)}
              >
                <Image className={styles.avatarImg} src={person.avatar} mode="aspectFill" />
                {favStates[person.id] && (
                  <View
                    className={styles.favBadge}
                    onClick={(e) => {
                      e.stopPropagation?.();
                      handleToggleFav(person.id);
                    }}
                  >
                    <Text>⭐</Text>
                  </View>
                )}
              </View>
              <Text
                className={styles.personName}
                onClick={() => handleUserClick(person.id)}
              >
                {person.name}
              </Text>
              {!favStates[person.id] && (
                <View
                  className={classnames(
                    {
                      [styles.favoriteBtn]: true,
                      [styles.favoriteBtnActive]: favStates[person.id]
                    }
                  )}
                  onClick={() => handleToggleFav(person.id)}
                  style={{ fontSize: '12rpx' }}
                >
                  <Text>+ 收藏</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ActivityReviewPage;

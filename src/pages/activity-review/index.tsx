import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
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
  const { toggleFavorite, favorites } = useUserStore();
  const { getActivity, getActivityMoments, getActivityQuestions, topicQuestions } =
    useActivityStore();

  const activity = getActivity(activityId);

  const isFav = useCallback(
    (userId: string) => favorites.includes(userId),
    [favorites]
  );

  const reviewPhotos = useMemo(() => {
    const baseId = parseInt(activityId) * 50 + 200;
    return Array.from({ length: 9 }, (_, i) => `https://picsum.photos/id/${baseId + i}/400/400`);
  }, [activityId]);

  const metPeople = useMemo(() => {
    const start = (parseInt(activityId) - 1) * 2;
    return mockParticipants.slice(start, start + 8);
  }, [activityId]);

  useEffect(() => {
    console.log('[ActivityReview] 活动回顾页，活动ID:', activityId);
    Taro.setNavigationBarTitle({ title: '活动回顾' });
  }, [activityId]);

  const displayPhotos = useMemo(() => reviewPhotos.slice(0, 8), [reviewPhotos]);
  const hasMorePhotos = reviewPhotos.length > 8;

  const displayMoments = useMemo(() => {
    return getActivityMoments(activityId).slice(0, 3);
  }, [activityId, topicQuestions]);

  const hotQuestions = useMemo(() => {
    const questions = getActivityQuestions(activityId);
    return questions
      .filter((q) => q.isApproved)
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 3);
  }, [activityId, topicQuestions]);

  const handlePhotoPreview = useCallback(
    (index: number) => {
      console.log('[ActivityReview] 预览照片', index);
      Taro.previewImage({
        urls: reviewPhotos,
        current: reviewPhotos[index]
      });
    },
    [reviewPhotos]
  );

  const handleUserClick = useCallback((userId: string, userName?: string) => {
    console.log('[ActivityReview] 查看用户:', userId);
    const nameParam = userName ? `&userName=${encodeURIComponent(userName)}` : '';
    Taro.navigateTo({
      url: `/pages/chat-detail/index?userId=${userId}${nameParam}`
    });
  }, []);

  const handleToggleFav = useCallback(
    (userId: string) => {
      console.log('[ActivityReview] 切换收藏:', userId);
      const isCurrentlyFav = isFav(userId);
      toggleFavorite(userId);
      Taro.showToast({
        title: isCurrentlyFav ? '已取消收藏' : '已收藏',
        icon: 'none'
      });
    },
    [toggleFavorite, isFav]
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
        <Text className={styles.activityTitle}>{activity?.title || '活动回顾'}</Text>
        <View className={styles.activityMeta}>
          <View className={styles.metaItem}>
            <Text>📍</Text>
            <Text>{activity?.location || '活动地点'}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text>👥</Text>
            <Text>{activity?.participantCount || 0}人参与</Text>
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
            <Text className={styles.sectionCount}>
              {getActivityMoments(activityId).length}条
            </Text>
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
              <View
                onClick={(e) => {
                  e.stopPropagation?.();
                  handleUserClick(moment.userId, moment.userName);
                }}
              >
                <UserAvatar src={moment.userAvatar} size="medium" />
              </View>
              <View
                className={styles.momentUserInfo}
                onClick={(e) => {
                  e.stopPropagation?.();
                  handleUserClick(moment.userId, moment.userName);
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
          {metPeople.map((person) => {
            const fav = isFav(person.id);
            return (
              <View key={person.id} className={styles.personItem}>
                <View
                  className={styles.personAvatar}
                  onClick={() => handleUserClick(person.id, person.name)}
                >
                  <Image className={styles.avatarImg} src={person.avatar} mode="aspectFill" />
                  {fav && (
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
                  onClick={() => handleUserClick(person.id, person.name)}
                >
                  {person.name}
                </Text>
                {!fav && (
                  <View
                    className={classnames({
                      [styles.favoriteBtn]: true,
                      [styles.favoriteBtnActive]: fav
                    })}
                    onClick={() => handleToggleFav(person.id)}
                    style={{ fontSize: '12rpx' }}
                  >
                    <Text>+ 收藏</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default ActivityReviewPage;

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { Moment, User } from '@/types';
import { mockParticipants } from '@/data/users';
import { mockMoments } from '@/data/moments';
import { useUserStore } from '@/store/useUserStore';
import { useActivityStore } from '@/store/useActivityStore';
import UserAvatar from '@/components/UserAvatar';
import styles from './index.module.scss';

const photoTabs = [
  { key: 'all', label: '全部' },
  { key: 'mine', label: '我的' },
  { key: 'group', label: '同组' },
  { key: 'favorite', label: '收藏' }
];

const followUpTabs = [
  { key: 'favorites', label: '收藏', icon: '⭐' },
  { key: 'cards', label: '名片', icon: '💳' },
  { key: 'chats', label: '聊过', icon: '💬' }
];

interface PhotoItem {
  url: string;
  id: string;
  type: string;
  momentId?: string;
  publisherId: string;
}

interface FollowUpPerson extends User {
  followUpStatus: string;
  source: string;
}

const ActivityReviewPage: React.FC = () => {
  const router = useRouter();
  const activityId = router.params.activityId || '1';
  const {
    favorites,
    favoriteRecords,
    toggleFavorite,
    setFollowUpStatus,
    getFollowUpStatus
  } = useUserStore();
  const {
    getActivity,
    getActivityMoments,
    getActivityQuestions,
    topicQuestions,
    myMoments,
    exchangedCards,
    setTargetMoment
  } = useActivityStore();

  const activity = getActivity(activityId);
  const [activePhotoTab, setActivePhotoTab] = useState('all');
  const [activeFollowTab, setActiveFollowTab] = useState('favorites');
  const [showPhotoDetail, setShowPhotoDetail] = useState<PhotoItem | null>(null);

  const isFav = useCallback(
    (userId: string) => favorites.includes(userId),
    [favorites]
  );

  const activityMoments = useMemo(
    () => getActivityMoments(activityId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activityId, topicQuestions, myMoments]
  );

  const reviewPhotos: PhotoItem[] = useMemo(() => {
    const baseId = parseInt(activityId) * 50 + 200;
    return Array.from({ length: 12 }, (_, i) => ({
      url: `https://picsum.photos/id/${baseId + i}/400/400`,
      id: `p${baseId + i}`,
      type: i < 2 ? 'mine' : i < 5 ? 'group' : 'all',
      momentId: i % 2 === 0 ? mockMoments[i % mockMoments.length]?.id : undefined,
      publisherId: mockParticipants[i % mockParticipants.length]?.id || '1'
    }));
  }, [activityId]);

  const displayPhotos = useMemo(() => {
    switch (activePhotoTab) {
      case 'mine':
        return reviewPhotos.filter((p) => p.type === 'mine');
      case 'group':
        return reviewPhotos.filter((p) => p.type === 'group');
      case 'favorite':
        return reviewPhotos.filter((p) => isFav(p.publisherId));
      default:
        return reviewPhotos;
    }
  }, [activePhotoTab, reviewPhotos, isFav]);

  const metPeople = useMemo(() => {
    const start = (parseInt(activityId) - 1) * 2;
    return mockParticipants.slice(start, start + 8);
  }, [activityId]);

  const hotQuestions = useMemo(() => {
    const questions = getActivityQuestions(activityId);
    return questions
      .filter((q) => q.isApproved)
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 3);
  }, [activityId, topicQuestions, getActivityQuestions]);

  const displayMoments = useMemo(() => {
    return activityMoments.slice(0, 3);
  }, [activityMoments]);

  const followUpList: FollowUpPerson[] = useMemo(() => {
    switch (activeFollowTab) {
      case 'favorites':
        return favoriteRecords
          .filter((r) => r.activityId === activityId)
          .map((r) => {
            const user = mockParticipants.find((p) => p.id === r.userId);
            return { ...(user as any), followUpStatus: r.followUpStatus, source: 'favorite' };
          })
          .filter((u) => u.id);
      case 'cards':
        return exchangedCards
          .map((id) => {
            const user = mockParticipants.find((p) => p.id === id);
            const record = favoriteRecords.find((r) => r.userId === id);
            return {
              ...(user as any),
              followUpStatus: record?.followUpStatus || 'none',
              source: 'card'
            };
          })
          .filter((u) => u.id);
      case 'chats':
        return mockParticipants
          .slice(0, 4)
          .map((p) => {
            const record = favoriteRecords.find((r) => r.userId === p.id);
            return {
              ...p,
              followUpStatus: record?.followUpStatus || 'none',
              source: 'chat'
            } as FollowUpPerson;
          })
          .filter((u) => exchangedCards.includes(u.id) || favorites.includes(u.id));
      default:
        return [];
    }
  }, [activeFollowTab, favoriteRecords, activityId, exchangedCards, favorites]);

  const selectedPhotoMoment = useMemo(() => {
    if (!showPhotoDetail?.momentId) return null;
    return activityMoments.find((m) => m.id === showPhotoDetail.momentId) || mockMoments.find((m) => m.id === showPhotoDetail.momentId);
  }, [showPhotoDetail, activityMoments]);

  const selectedPublisher = useMemo(() => {
    if (!showPhotoDetail?.publisherId) return null;
    return mockParticipants.find((p) => p.id === showPhotoDetail.publisherId);
  }, [showPhotoDetail]);

  useEffect(() => {
    console.log('[ActivityReview] 活动回顾页，活动ID:', activityId);
    Taro.setNavigationBarTitle({ title: '活动回顾' });
  }, [activityId]);

  const handlePhotoClick = useCallback((photo: PhotoItem) => {
    setShowPhotoDetail(photo);
  }, []);

  const handleClosePhotoDetail = useCallback(() => {
    setShowPhotoDetail(null);
  }, []);

  const handlePhotoPreview = useCallback(
    (index: number) => {
      console.log('[ActivityReview] 预览照片', index);
      Taro.previewImage({
        urls: displayPhotos.map((p) => p.url),
        current: displayPhotos[index]?.url
      });
    },
    [displayPhotos]
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
      toggleFavorite(userId, activityId);
      Taro.showToast({
        title: isCurrentlyFav ? '已取消收藏' : '已收藏',
        icon: 'none'
      });
    },
    [toggleFavorite, isFav, activityId]
  );

  const handleSetFollowUp = useCallback(
    (userId: string, status: 'pending' | 'contacted') => {
      console.log('[ActivityReview] 设置跟进状态:', userId, status);
      setFollowUpStatus(userId, status);
      Taro.showToast({
        title: status === 'pending' ? '已设为待跟进' : '已设为已联系',
        icon: 'none'
      });
    },
    [setFollowUpStatus]
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
      setTargetMoment(momentId);
      Taro.switchTab({ url: '/pages/moments/index' });
    },
    [setTargetMoment]
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

        <View className={styles.photoTabs}>
          {photoTabs.map((tab) => (
            <Text
              key={tab.key}
              className={classnames(
                styles.photoTab,
                activePhotoTab === tab.key && styles.photoTabActive
              )}
              onClick={() => setActivePhotoTab(tab.key)}
            >
              {tab.label}
            </Text>
          ))}
        </View>

        <View className={styles.photoGrid}>
          {displayPhotos.length > 0 ? (
            displayPhotos.map((photo, index) => (
              <View
                key={photo.id}
                className={styles.photoItem}
                onClick={() => handlePhotoClick(photo)}
              >
                <Image className={styles.photoImg} src={photo.url} mode="aspectFill" />
              </View>
            ))
          ) : (
            <View className={styles.photoEmpty}>
              <Text className={styles.photoEmptyIcon}>🖼️</Text>
              <Text className={styles.photoEmptyText}>暂无此类照片</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            💬 现场动态
            <Text className={styles.sectionCount}>
              {activityMoments.length}条
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

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📋 跟进清单</Text>
        </View>

        <View className={styles.followTabs}>
          {followUpTabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(
                styles.followTab,
                activeFollowTab === tab.key && styles.followTabActive
              )}
              onClick={() => setActiveFollowTab(tab.key)}
            >
              <Text className={styles.followTabIcon}>{tab.icon}</Text>
              <Text className={styles.followTabLabel}>{tab.label}</Text>
            </View>
          ))}
        </View>

        {followUpList.length > 0 ? (
          <View className={styles.followList}>
            {followUpList.map((person) => (
              <View key={person.id} className={styles.followItem}>
                <View
                  className={styles.followAvatar}
                  onClick={() => handleUserClick(person.id, person.name)}
                >
                  <UserAvatar src={person.avatar} size="large" />
                </View>
                <View
                  className={styles.followInfo}
                  onClick={() => handleUserClick(person.id, person.name)}
                >
                  <Text className={styles.followName}>{person.name}</Text>
                  <Text className={styles.followCompany}>
                    {person.company} · {person.position}
                  </Text>
                </View>
                <View className={styles.followActions}>
                  {person.followUpStatus === 'pending' ? (
                    <View
                      className={classnames(styles.followStatus, styles.followPending)}
                      onClick={() => handleSetFollowUp(person.id, 'contacted')}
                    >
                      <Text>待跟进</Text>
                    </View>
                  ) : person.followUpStatus === 'contacted' ? (
                    <View
                      className={classnames(styles.followStatus, styles.followContacted)}
                      onClick={() => handleSetFollowUp(person.id, 'pending')}
                    >
                      <Text>✓ 已联系</Text>
                    </View>
                  ) : (
                    <View
                      className={styles.followAddBtn}
                      onClick={() => {
                        if (!isFav(person.id)) {
                          handleToggleFav(person.id);
                        }
                        handleSetFollowUp(person.id, 'pending');
                      }}
                    >
                      <Text>+ 待跟进</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>还没有跟进记录</Text>
            <Text className={styles.emptyHint}>收藏或交换名片后会出现在这里</Text>
          </View>
        )}
      </View>

      {showPhotoDetail && (
        <View className={styles.photoDetailModal} onClick={handleClosePhotoDetail}>
          <View className={styles.photoDetailContent} onClick={(e) => e.stopPropagation?.()}>
            <Image
              className={styles.photoDetailImg}
              src={showPhotoDetail.url}
              mode="aspectFill"
            />

            <View className={styles.photoDetailInfo}>
              {selectedPublisher && (
                <View
                  className={styles.photoPublisher}
                  onClick={() => {
                    handleClosePhotoDetail();
                    handleUserClick(selectedPublisher.id, selectedPublisher.name);
                  }}
                >
                  <UserAvatar src={selectedPublisher.avatar} size="small" />
                  <Text className={styles.photoPublisherName}>
                    {selectedPublisher.name}
                  </Text>
                </View>
              )}

              {selectedPhotoMoment && (
                <View
                  className={styles.photoMoment}
                  onClick={() => {
                    handleClosePhotoDetail();
                    handleMomentClick(selectedPhotoMoment.id);
                  }}
                >
                  <Text className={styles.photoMomentLabel}>关联动态</Text>
                  <Text className={styles.photoMomentContent}>
                    {selectedPhotoMoment.content.slice(0, 50)}...
                  </Text>
                  <Text className={styles.photoMomentLink}>查看详情 ›</Text>
                </View>
              )}

              <View className={styles.photoActivity}>
                <Text className={styles.photoActivityLabel}>活动</Text>
                <Text className={styles.photoActivityName}>
                  {activity?.title || '活动'}
                </Text>
              </View>
            </View>

            <View className={styles.photoDetailClose} onClick={handleClosePhotoDetail}>
              <Text>✕</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default ActivityReviewPage;

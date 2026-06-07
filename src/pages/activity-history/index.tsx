import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { mockActivities } from '@/data/activities';
import { mockMoments, mockComments } from '@/data/moments';
import { mockParticipants } from '@/data/users';
import { useUserStore } from '@/store/useUserStore';
import { useActivityStore } from '@/store/useActivityStore';
import UserAvatar from '@/components/UserAvatar';
import styles from './index.module.scss';

const tabs = [
  { key: 'activities', label: '活动' },
  { key: 'moments', label: '动态' },
  { key: 'comments', label: '评论' },
  { key: 'favorites', label: '收藏' },
  { key: 'cards', label: '名片' }
];

const ActivityHistoryPage: React.FC = () => {
  const router = useRouter();
  const initialTab = router.params.tab || 'activities';
  const { currentUser } = useUserStore();
  const { favorites, favoriteRecords, getFollowUpStatus, setFollowUpStatus } = useUserStore();
  const {
    joinedActivities,
    myMoments,
    myComments,
    exchangedCards,
    getSchedule,
    setTargetMoment
  } = useActivityStore();

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    console.log('[ActivityHistory] 互动记录页，初始tab:', initialTab);
    Taro.setNavigationBarTitle({ title: '互动记录' });
  }, [initialTab]);

  useEffect(() => {
    if (router.params.tab && tabs.some((t) => t.key === router.params.tab)) {
      setActiveTab(router.params.tab);
    }
  }, [router.params.tab]);

  const joinedActivitiesList = useMemo(() => {
    return mockActivities.filter((a) => joinedActivities.includes(a.id));
  }, [joinedActivities]);

  const myMomentList = useMemo(() => {
    const allMyMoments: Moment[] = [];
    Object.values(myMoments).forEach((list) => {
      allMyMoments.push(...list);
    });
    const mockUserMoments = mockMoments.filter((m) => m.userId === currentUser.id);
    return [...allMyMoments, ...mockUserMoments].slice(0, 20);
  }, [myMoments, currentUser.id]);

  const myCommentList = useMemo(() => {
    const comments: Array<{
      id: string;
      momentId: string;
      momentTitle: string;
      content: string;
      activityTitle: string;
      createdAt: string;
    }> = [];

    Object.entries(myComments || {}).forEach(([momentId, commentList]) => {
      const moment = mockMoments.find((m) => m.id === momentId);
      commentList.forEach((comment) => {
        comments.push({
          id: comment.id,
          momentId,
          momentTitle: moment?.content?.slice(0, 30) + '...' || '动态详情',
          content: comment.content,
          activityTitle: moment?.activityTitle || '活动',
          createdAt: comment.createdAt
        });
      });
    });

    return comments.sort((a, b) => b.id.localeCompare(a.id));
  }, [myComments]);

  const favoriteList = useMemo(() => {
    if (favorites.length === 0) return [];
    return favoriteRecords
      .map((record) => {
        const user = mockParticipants.find((p) => p.id === record.userId);
        if (!user) return null;
        return {
          ...user,
          addedAt: record.addedAt,
          followUpStatus: record.followUpStatus,
          activityId: record.activityId
        };
      })
      .filter(Boolean);
  }, [favorites, favoriteRecords]);

  const exchangedCardsList = useMemo(() => {
    if (exchangedCards.length === 0) {
      return [];
    }
    return mockParticipants
      .filter((p) => exchangedCards.includes(p.id))
      .map((p) => ({
        ...p,
        exchangedAt: '活动当天'
      }));
  }, [exchangedCards]);

  const handleActivityClick = useCallback((activityId: string) => {
    console.log('[ActivityHistory] 查看活动:', activityId);
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${activityId}`
    });
  }, []);

  const handleMomentClick = useCallback(
    (momentId: string) => {
      console.log('[ActivityHistory] 查看动态:', momentId);
      setTargetMoment(momentId);
      Taro.switchTab({ url: '/pages/moments/index' });
    },
    [setTargetMoment]
  );

  const handleCommentClick = useCallback(
    (momentId: string) => {
      console.log('[ActivityHistory] 查看评论动态:', momentId);
      setTargetMoment(momentId);
      Taro.switchTab({ url: '/pages/moments/index' });
    },
    [setTargetMoment]
  );

  const handleCardClick = useCallback((userId: string) => {
    console.log('[ActivityHistory] 查看名片用户:', userId);
    Taro.navigateTo({
      url: `/pages/chat-detail/index?userId=${userId}`
    });
  }, []);

  const handleFavoriteClick = useCallback((userId: string, userName?: string) => {
    console.log('[ActivityHistory] 查看收藏用户:', userId);
    const nameParam = userName ? `&userName=${encodeURIComponent(userName)}` : '';
    Taro.navigateTo({
      url: `/pages/chat-detail/index?userId=${userId}${nameParam}`
    });
  }, []);

  const handleSetFollowUp = useCallback(
    (userId: string, status: 'pending' | 'contacted') => {
      console.log('[ActivityHistory] 设置跟进:', userId, status);
      setFollowUpStatus(userId, status);
      Taro.showToast({
        title: status === 'pending' ? '已设为待跟进' : '已设为已联系',
        icon: 'none'
      });
    },
    [setFollowUpStatus]
  );

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleGoDiscover = useCallback(() => {
    Taro.switchTab({ url: '/pages/square/index' });
  }, []);

  const handleGoMoments = useCallback(() => {
    Taro.switchTab({ url: '/pages/moments/index' });
  }, []);

  const handleGoMatching = useCallback(() => {
    Taro.navigateTo({ url: '/pages/matching/index' });
  }, []);

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={classnames(
              styles.tabItem,
              activeTab === tab.key && styles.tabItemActive
            )}
            onClick={() => handleTabChange(tab.key)}
          >
            <Text>{tab.label}</Text>
            {activeTab === tab.key && <View className={styles.tabIndicator} />}
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.content}>
        {activeTab === 'activities' && (
          <>
            {joinedActivitiesList.length > 0 ? (
              joinedActivitiesList.map((activity) => (
                <View
                  key={activity.id}
                  className={styles.listItem}
                  onClick={() => handleActivityClick(activity.id)}
                >
                  <View className={styles.activityItem}>
                    <Image
                      className={styles.activityCover}
                      src={activity.cover}
                      mode="aspectFill"
                    />
                    <View className={styles.activityInfo}>
                      <Text className={styles.activityTitle}>{activity.title}</Text>
                      <View className={styles.activityMeta}>
                        <Text>📍 {activity.location}</Text>
                        <Text>🕐 {activity.startTime}</Text>
                      </View>
                      <Text className={styles.activityBadge} style={{ marginTop: '8rpx' }}>
                        已报名
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📅</Text>
                <Text className={styles.emptyText}>还没有参加任何活动</Text>
                <View className={styles.emptyBtn} onClick={handleGoDiscover}>
                  <Text className={styles.emptyBtnText}>去发现活动</Text>
                </View>
              </View>
            )}
          </>
        )}

        {activeTab === 'moments' && (
          <>
            {myMomentList.length > 0 ? (
              myMomentList.map((moment) => (
                <View
                  key={moment.id}
                  className={styles.listItem}
                  onClick={() => handleMomentClick(moment.id)}
                >
                  <View className={styles.momentItem}>
                    <View className={styles.momentHeader}>
                      <Image
                        className={styles.momentAvatar}
                        src={moment.userAvatar || currentUser.avatar}
                      />
                      <Text className={styles.momentUser}>
                        {moment.userName || currentUser.name}
                      </Text>
                      <Text className={styles.momentTime}>{moment.createdAt}</Text>
                    </View>
                    <Text className={styles.momentContent}>{moment.content}</Text>
                    {moment.images && moment.images.length > 0 && (
                      <View className={styles.momentImages}>
                        {moment.images.slice(0, 3).map((img, i) => (
                          <Image key={i} className={styles.momentImg} src={img} mode="aspectFill" />
                        ))}
                      </View>
                    )}
                    <View className={styles.momentStats}>
                      <Text>❤ {moment.likeCount}</Text>
                      <Text>💬 {moment.commentCount}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📝</Text>
                <Text className={styles.emptyText}>还没有发布过动态</Text>
                <View className={styles.emptyBtn} onClick={handleGoMoments}>
                  <Text className={styles.emptyBtnText}>去发一条</Text>
                </View>
              </View>
            )}
          </>
        )}

        {activeTab === 'comments' && (
          <>
            {myCommentList.length > 0 ? (
              myCommentList.map((comment) => (
                <View
                  key={comment.id}
                  className={styles.listItem}
                  onClick={() => handleCommentClick(comment.momentId)}
                >
                  <View className={styles.commentItem}>
                    <Text className={styles.commentTo}>
                      评论了动态：{comment.momentTitle}
                    </Text>
                    <Text className={styles.commentContent}>{comment.content}</Text>
                    <View className={styles.commentMeta}>
                      <Text className={styles.commentActivity}>📍 {comment.activityTitle}</Text>
                      <Text>{comment.createdAt}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>💬</Text>
                <Text className={styles.emptyText}>还没有评论过任何人</Text>
                <View className={styles.emptyBtn} onClick={handleGoMoments}>
                  <Text className={styles.emptyBtnText}>去看看</Text>
                </View>
              </View>
            )}
          </>
        )}

        {activeTab === 'favorites' && (
          <>
            {favoriteList.length > 0 ? (
              favoriteList.map((person: any) => (
                <View
                  key={person.id}
                  className={styles.listItem}
                  onClick={() => handleFavoriteClick(person.id, person.name)}
                >
                  <View className={styles.cardItem}>
                    <Image
                      className={styles.cardAvatar}
                      src={person.avatar}
                      mode="aspectFill"
                    />
                    <View className={styles.cardInfo}>
                      <Text className={styles.cardName}>
                        {person.name}
                        <Text className={styles.favStar}> ⭐</Text>
                      </Text>
                      <Text className={styles.cardCompany}>
                        {person.company} · {person.position}
                      </Text>
                      <View className={styles.cardTags}>
                        {person.tags?.slice?.(0, 2)?.map?.((tag, i) => (
                          <Text key={i} className={styles.cardTag}>
                            {tag}
                          </Text>
                        ))}
                        {person.followUpStatus === 'pending' && (
                          <Text className={styles.followBadgePending}>待跟进</Text>
                        )}
                        {person.followUpStatus === 'contacted' && (
                          <Text className={styles.followBadgeDone}>已联系</Text>
                        )}
                      </View>
                    </View>
                    <View className={styles.cardActions}>
                      {person.followUpStatus === 'pending' ? (
                        <View
                          className={styles.followBtn}
                          onClick={(e) => {
                            e.stopPropagation?.();
                            handleSetFollowUp(person.id, 'contacted');
                          }}
                        >
                          <Text>标记已联系</Text>
                        </View>
                      ) : person.followUpStatus === 'contacted' ? (
                        <View
                          className={styles.followBtnDone}
                          onClick={(e) => {
                            e.stopPropagation?.();
                            handleSetFollowUp(person.id, 'pending');
                          }}
                        >
                          <Text>✓ 已联系</Text>
                        </View>
                      ) : (
                        <View
                          className={styles.followBtn}
                          onClick={(e) => {
                            e.stopPropagation?.();
                            handleSetFollowUp(person.id, 'pending');
                          }}
                        >
                          <Text>+ 待跟进</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>⭐</Text>
                <Text className={styles.emptyText}>还没有收藏的联系人</Text>
                <View className={styles.emptyBtn} onClick={handleGoMatching}>
                  <Text className={styles.emptyBtnText}>去认识朋友</Text>
                </View>
              </View>
            )}
          </>
        )}

        {activeTab === 'cards' && (
          <>
            {exchangedCardsList.length > 0 ? (
              exchangedCardsList.map((person) => (
                <View
                  key={person.id}
                  className={styles.listItem}
                  onClick={() => handleCardClick(person.id)}
                >
                  <View className={styles.cardItem}>
                    <Image className={styles.cardAvatar} src={person.avatar} mode="aspectFill" />
                    <View className={styles.cardInfo}>
                      <Text className={styles.cardName}>{person.name}</Text>
                      <Text className={styles.cardCompany}>
                        {person.company} · {person.position}
                      </Text>
                      <View className={styles.cardTags}>
                        {person.tags.slice(0, 3).map((tag, i) => (
                          <Text key={i} className={styles.cardTag}>
                            {tag}
                          </Text>
                        ))}
                      </View>
                    </View>
                    <Text className={styles.cardTime}>{(person as any).exchangedAt}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>💳</Text>
                <Text className={styles.emptyText}>还没有交换过名片</Text>
                <View className={styles.emptyBtn} onClick={handleGoMatching}>
                  <Text className={styles.emptyBtnText}>去认识朋友</Text>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ActivityHistoryPage;

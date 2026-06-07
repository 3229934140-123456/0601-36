import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { Activity } from '@/types';
import { mockActivities } from '@/data/activities';
import { useActivityStore } from '@/store/useActivityStore';
import UserAvatar from '@/components/UserAvatar';
import TagList from '@/components/TagList';
import styles from './index.module.scss';

interface ScheduleItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: string;
  isOngoing?: boolean;
  isDone?: boolean;
  description?: string;
}

const typeIcons: Record<string, string> = {
  opening: '🎤',
  keynote: '📣',
  panel: '💬',
  workshop: '🛠️',
  break: '☕',
  networking: '🤝',
  closing: '🏁'
};

const ActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const activityId = router.params.id || '1';
  const { isJoined, joinActivity, getSchedule } = useActivityStore();
  const [activity, setActivity] = useState<Activity | null>(null);

  const schedule = useMemo<ScheduleItem[]>(() => {
    const items = getSchedule(activityId);
    const currentIdx = items.findIndex((item) => item.isOngoing);
    return items.map((item, idx) => ({
      ...item,
      isDone: currentIdx >= 0 && idx < currentIdx
    }));
  }, [activityId, getSchedule]);

  const currentItem = useMemo(() => schedule.find((s) => s.isOngoing), [schedule]);
  const nextItem = useMemo(() => {
    const currentIdx = schedule.findIndex((s) => s.isOngoing);
    if (currentIdx >= 0 && currentIdx < schedule.length - 1) {
      return schedule[currentIdx + 1];
    }
    return null;
  }, [schedule]);

  useEffect(() => {
    const found = mockActivities.find((a) => a.id === activityId);
    if (found) {
      setActivity(found);
      if (router.params.from === 'scan') {
        Taro.showToast({
          title: '扫码成功',
          icon: 'success'
        });
      }
    }
    console.log('[ActivityDetail] 活动ID:', activityId, '已加入:', isJoined(activityId));
  }, [activityId, router.params.from, isJoined]);

  const handleJoin = useCallback(() => {
    if (isJoined(activityId)) {
      Taro.showToast({
        title: '已加入活动',
        icon: 'none'
      });
      return;
    }
    console.log('[ActivityDetail] 加入活动:', activityId);
    joinActivity(activityId);
    Taro.showToast({
      title: '加入成功！',
      icon: 'success'
    });
  }, [activityId, isJoined, joinActivity]);

  const handleShare = useCallback(() => {
    console.log('[ActivityDetail] 分享活动');
    Taro.showActionSheet({
      itemList: ['分享给好友', '生成海报', '复制链接'],
      success: () => {
        Taro.showToast({
          title: '分享功能开发中',
          icon: 'none'
        });
      }
    });
  }, []);

  const handleTopicRoom = useCallback(() => {
    if (!isJoined(activityId)) {
      Taro.showToast({
        title: '请先加入活动',
        icon: 'none'
      });
      return;
    }
    console.log('[ActivityDetail] 进入话题房');
    Taro.navigateTo({
      url: `/pages/topic-room/index?activityId=${activityId}`
    });
  }, [activityId, isJoined]);

  const handleCheckin = useCallback(() => {
    Taro.switchTab({ url: '/pages/checkin/index' });
  }, []);

  const handleMatching = useCallback(() => {
    if (!isJoined(activityId)) {
      Taro.showToast({
        title: '请先加入活动',
        icon: 'none'
      });
      return;
    }
    Taro.navigateTo({ url: '/pages/matching/index' });
  }, [activityId, isJoined]);

  const handleReview = useCallback(() => {
    console.log('[ActivityDetail] 查看活动回顾');
    Taro.navigateTo({
      url: `/pages/activity-review/index?activityId=${activityId}`
    });
  }, [activityId]);

  if (!activity) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const joined = isJoined(activityId);

  return (
    <View className={styles.page}>
      <ScrollView scrollY>
        <Image
          className={styles.cover}
          src={activity.cover}
          mode="aspectFill"
          onError={(e) => console.error('[ActivityDetail] 封面图加载失败', e)}
        />

        <View className={styles.content}>
          <Text className={styles.title}>{activity.title}</Text>

          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>📍</Text>
            <Text className={styles.infoText}>{activity.location}</Text>
          </View>

          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>🕐</Text>
            <Text className={styles.infoText}>
              {activity.startTime} - {activity.endTime}
            </Text>
          </View>

          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>👥</Text>
            <Text className={styles.infoText}>
              {activity.participantCount}人已报名
              {activity.maxParticipants && ` / ${activity.maxParticipants}人`}
            </Text>
          </View>

          <View className={styles.hostRow}>
            <UserAvatar
              src={`https://picsum.photos/id/1005/200/200`}
              size="medium"
            />
            <View className={styles.hostInfo}>
              <Text className={styles.hostName}>{activity.hostName}</Text>
              <Text className={styles.hostLabel}>主办方</Text>
            </View>
          </View>
        </View>

        {joined && (
          <View className={styles.quickActions}>
            <View className={styles.actionItem} onClick={handleTopicRoom}>
              <View className={styles.actionIcon}>💬</View>
              <Text className={styles.actionLabel}>话题房</Text>
            </View>
            <View className={styles.actionItem} onClick={handleCheckin}>
              <View className={styles.actionIcon}>✅</View>
              <Text className={styles.actionLabel}>签到</Text>
            </View>
            <View className={styles.actionItem} onClick={handleMatching}>
              <View className={styles.actionIcon}>🎯</View>
              <Text className={styles.actionLabel}>配对</Text>
            </View>
            <View className={styles.actionItem} onClick={handleReview}>
              <View className={styles.actionIcon}>📸</View>
              <Text className={styles.actionLabel}>回顾</Text>
            </View>
          </View>
        )}

        <View className={styles.scheduleSection}>
          <View className={styles.scheduleHeader}>
            <Text className={styles.scheduleTitle}>现场日程</Text>
            {currentItem && <Text className={styles.currentBadge}>进行中</Text>}
          </View>

          {nextItem && (
            <View className={styles.nextReminder}>
              <Text className={styles.reminderIcon}>⏰</Text>
              <Text className={styles.reminderText}>
                下一场：<Text className={styles.reminderBold}>{nextItem.title}</Text>
                {'  '}
                {nextItem.startTime} 开始
              </Text>
            </View>
          )}

          <View className={styles.scheduleList}>
            <View className={styles.timeline} />
            {schedule.map((item) => (
              <View key={item.id} className={styles.timelineItem}>
                <View
                  className={classnames(
                    styles.timelineDot,
                    item.isOngoing && styles.timelineDotActive,
                    item.isDone && styles.timelineDotDone
                  )}
                >
                  <Text>{typeIcons[item.type] || '📌'}</Text>
                </View>
                <View className={styles.timelineContent}>
                  <Text className={styles.timelineTime}>
                    {item.startTime} - {item.endTime}
                  </Text>
                  <Text
                    className={classnames(
                      styles.timelineTitle,
                      item.isOngoing && styles.timelineTitleActive
                    )}
                  >
                    {item.title}
                  </Text>
                  {item.description && (
                    <Text className={styles.timelineDesc}>{item.description}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>活动标签</Text>
          <View className={styles.tagList}>
            {activity.tags.map((tag, index) => (
              <View key={index} className={styles.tagItem}>
                <Text className={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>活动介绍</Text>
          <Text className={styles.desc}>{activity.description}</Text>
          <Text className={styles.desc} style={{ marginTop: '24rpx' }}>
            这是一个充满活力的线下聚会，我们汇聚了各行业的优秀人才，
            通过丰富多彩的互动环节，帮助大家快速破冰，建立有价值的人脉连接。
          </Text>
          <Text className={styles.desc} style={{ marginTop: '24rpx' }}>
            活动亮点：
            {'\n'}• 趣味破冰游戏
            {'\n'}• 主题圆桌讨论
            {'\n'}• 兴趣配对社交
            {'\n'}• 精美茶歇招待
            {'\n'}• 现场照片直播
          </Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>活动回顾</Text>
          <Text className={styles.desc}>活动结束后可查看精彩瞬间</Text>
          <View
            className={styles.tagItem}
            style={{ marginTop: '24rpx', alignSelf: 'flex-start' }}
            onClick={handleReview}
          >
            <Text className={styles.tagText}>查看回顾 →</Text>
          </View>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <View className={styles.shareBtn} onClick={handleShare}>
          <Text>↗️</Text>
        </View>
        <View
          className={classnames(styles.joinBtn, joined && styles.joinedBtn)}
          onClick={handleJoin}
        >
          <Text className={styles.joinBtnText}>
            {joined ? '✓ 已加入' : '立即报名'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ActivityDetailPage;

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { Activity } from '@/types';
import { mockActivities } from '@/data/activities';
import UserAvatar from '@/components/UserAvatar';
import TagList from '@/components/TagList';
import styles from './index.module.scss';

const ActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const activityId = router.params.id || '1';
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const found = mockActivities.find((a) => a.id === activityId);
    if (found) {
      setActivity(found);
      setIsJoined(found.isJoined || false);
    }
    console.log('[ActivityDetail] 活动ID:', activityId);
  }, [activityId]);

  const handleJoin = useCallback(() => {
    if (isJoined) {
      Taro.showToast({
        title: '已加入活动',
        icon: 'none'
      });
      return;
    }
    console.log('[ActivityDetail] 加入活动');
    setIsJoined(true);
    Taro.showToast({
      title: '加入成功！',
      icon: 'success'
    });
  }, [isJoined]);

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

  if (!activity) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    );
  }

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
          <Text className={styles.desc}>
            往期活动照片与精彩瞬间将在活动结束后更新。
          </Text>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <View className={styles.shareBtn} onClick={handleShare}>
          <Text>↗️</Text>
        </View>
        <View
          className={classnames(styles.joinBtn, isJoined && styles.joinedBtn)}
          onClick={handleJoin}
        >
          <Text className={styles.joinBtnText}>
            {isJoined ? '✓ 已加入' : '立即报名'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ActivityDetailPage;

import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Activity } from '@/types';
import TagList from '@/components/TagList';
import styles from './index.module.scss';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/activity-detail/index?id=${activity.id}`
      });
    }
  };

  const getStatusText = () => {
    switch (activity.status) {
      case 'upcoming':
        return '即将开始';
      case 'ongoing':
        return '进行中';
      case 'ended':
        return '已结束';
      default:
        return '';
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.coverWrapper}>
        <Image className={styles.cover} src={activity.cover} mode="aspectFill" />
        <View className={`${styles.statusBadge} ${styles[`status-${activity.status}`]}`}>
          <Text className={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      <View className={styles.content}>
        <Text className={styles.title}>{activity.title}</Text>
        <View className={styles.metaRow}>
          <View className={styles.metaItem}>
            <Text className={styles.metaLabel}>📍</Text>
            <Text className={styles.metaText}>{activity.location}</Text>
          </View>
        </View>
        <View className={styles.metaRow}>
          <View className={styles.metaItem}>
            <Text className={styles.metaLabel}>🕐</Text>
            <Text className={styles.metaText}>{activity.startTime}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaText}>
              {activity.participantCount}人参与
              {activity.maxParticipants && ` / ${activity.maxParticipants}`}
            </Text>
          </View>
        </View>
        <View className={styles.tagRow}>
          <TagList tags={activity.tags} maxCount={3} size="small" />
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;

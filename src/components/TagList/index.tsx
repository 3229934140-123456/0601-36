import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface TagListProps {
  tags: string[];
  maxCount?: number;
  size?: 'small' | 'medium';
}

const TagList: React.FC<TagListProps> = ({ tags, maxCount, size = 'small' }) => {
  const displayTags = maxCount ? tags.slice(0, maxCount) : tags;
  const hasMore = maxCount && tags.length > maxCount;

  return (
    <View className={styles.tagList}>
      {displayTags.map((tag, index) => (
        <View key={index} className={styles[`tag-${size}`]}>
          <Text className={styles.tagText}>{tag}</Text>
        </View>
      ))}
      {hasMore && (
        <View className={styles[`tag-${size}`]}>
          <Text className={styles.tagText}>+{tags.length - maxCount}</Text>
        </View>
      )}
    </View>
  );
};

export default TagList;

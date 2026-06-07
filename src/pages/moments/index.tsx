import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Moment } from '@/types';
import { mockMoments } from '@/data/moments';
import UserAvatar from '@/components/UserAvatar';
import styles from './index.module.scss';

const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'activity', label: '本活动' },
  { key: 'following', label: '关注' }
];

const MomentsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [moments, setMoments] = useState<Moment[]>(mockMoments);
  const [likedMoments, setLikedMoments] = useState<string[]>(
    mockMoments.filter((m) => m.isLiked).map((m) => m.id)
  );

  const handlePublish = useCallback(() => {
    console.log('[Moments] 发布动态');
    Taro.showActionSheet({
      itemList: ['发布照片', '发布文字', '发布图文'],
      success: () => {
        Taro.showToast({
          title: '发布功能开发中',
          icon: 'none'
        });
      }
    });
  }, []);

  const handleLike = useCallback(
    (momentId: string) => {
      console.log('[Moments] 点赞动态:', momentId);
      const isLiked = likedMoments.includes(momentId);
      setLikedMoments((prev) =>
        isLiked ? prev.filter((id) => id !== momentId) : [...prev, momentId]
      );
      setMoments((prev) =>
        prev.map((m) =>
          m.id === momentId
            ? { ...m, isLiked: !isLiked, likeCount: isLiked ? m.likeCount - 1 : m.likeCount + 1 }
            : m
        )
      );
    },
    [likedMoments]
  );

  const handleComment = useCallback((momentId: string) => {
    console.log('[Moments] 评论动态:', momentId);
    Taro.showToast({
      title: '评论功能开发中',
      icon: 'none'
    });
  }, []);

  const handleMore = useCallback((momentId: string) => {
    console.log('[Moments] 更多操作:', momentId);
    Taro.showActionSheet({
      itemList: ['举报', '不感兴趣', '分享'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.showModal({
            title: '举报',
            content: '请选择举报原因',
            confirmText: '提交举报',
            success: (modalRes) => {
              if (modalRes.confirm) {
                Taro.showToast({
                  title: '已提交举报',
                  icon: 'success'
                });
              }
            }
          });
        }
      }
    });
  }, []);

  const handleUserClick = useCallback((userId: string) => {
    console.log('[Moments] 查看用户:', userId);
    Taro.navigateTo({
      url: `/pages/chat-detail/index?userId=${userId}`
    });
  }, []);

  const handleImagePreview = useCallback((images: string[], current: number) => {
    console.log('[Moments] 预览图片');
    Taro.previewImage({
      urls: images,
      current: images[current]
    });
  }, []);

  const filteredMoments = moments.filter((m) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'activity') return m.activityId === '1';
    if (activeFilter === 'following') return true;
    return true;
  });

  useEffect(() => {
    console.log('[Moments] 页面加载完成，动态数量:', moments.length);
  }, [moments.length]);

  const renderImages = (images: string[]) => {
    if (!images || images.length === 0) return null;

    const imageClass = images.length === 1 ? styles.singleImage : styles.multiImage;

    return (
      <View className={styles.momentImages}>
        {images.map((img, index) => (
          <View
            key={index}
            className={imageClass}
            onClick={() => handleImagePreview(images, index)}
          >
            <Image
              className={styles.momentImage}
              src={img}
              mode="aspectFill"
              onError={(e) => console.error('[Moments] 图片加载失败', e)}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>动态</Text>
        <View className={styles.publishBtn} onClick={handlePublish}>
          <Text className={styles.publishBtnText}>+ 发布</Text>
        </View>
      </View>

      <View className={styles.filterTabs}>
        {filterTabs.map((tab) => (
          <Text
            key={tab.key}
            className={classnames(
              styles.filterTab,
              activeFilter === tab.key && styles.filterTabActive
            )}
            onClick={() => setActiveFilter(tab.key)}
          >
            {tab.label}
          </Text>
        ))}
      </View>

      <ScrollView scrollY className={styles.momentList}>
        {filteredMoments.length > 0 ? (
          filteredMoments.map((moment) => (
            <View key={moment.id} className={styles.momentCard}>
              <View className={styles.momentHeader}>
                <View onClick={() => handleUserClick(moment.userId)}>
                  <UserAvatar src={moment.userAvatar} size="medium" />
                </View>
                <View className={styles.momentUserInfo} onClick={() => handleUserClick(moment.userId)}>
                  <View style={{ display: 'flex', alignItems: 'center' }}>
                    <Text className={styles.momentUserName}>{moment.userName}</Text>
                    {moment.activityTitle && (
                      <Text className={styles.activityTag}>📍 {moment.activityTitle}</Text>
                    )}
                  </View>
                  <Text className={styles.momentTime}>{moment.createdAt}</Text>
                </View>
                <Text className={styles.moreBtn} onClick={() => handleMore(moment.id)}>
                  ⋯
                </Text>
              </View>

              <Text className={styles.momentContent}>{moment.content}</Text>

              {renderImages(moment.images)}

              <View className={styles.momentFooter}>
                <View className={styles.actionGroup}>
                  <View
                    className={styles.actionItem}
                    onClick={() => handleLike(moment.id)}
                  >
                    <Text className={styles.actionIcon}>
                      {likedMoments.includes(moment.id) ? '❤️' : '🤍'}
                    </Text>
                    <Text
                      className={classnames(
                        styles.actionText,
                        likedMoments.includes(moment.id) && styles.actionActive
                      )}
                    >
                      {moment.likeCount}
                    </Text>
                  </View>
                  <View
                    className={styles.actionItem}
                    onClick={() => handleComment(moment.id)}
                  >
                    <Text className={styles.actionIcon}>💬</Text>
                    <Text className={styles.actionText}>{moment.commentCount}</Text>
                  </View>
                </View>
                <View className={styles.actionItem}>
                  <Text className={styles.actionIcon}>↗️</Text>
                  <Text className={styles.actionText}>分享</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📷</Text>
            <Text className={styles.emptyText}>还没有动态，快来发布第一条吧</Text>
            <View className={styles.emptyBtn} onClick={handlePublish}>
              <Text className={styles.emptyBtnText}>发布动态</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MomentsPage;

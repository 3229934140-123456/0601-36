import React, { useCallback, useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useUserStore } from '@/store/useUserStore';
import { mockParticipants } from '@/data/users';
import UserAvatar from '@/components/UserAvatar';
import styles from './index.module.scss';

const menuItems = [
  { icon: '⭐', title: '我的收藏', subtitle: '收藏的联系人', action: 'favorites' },
  { icon: '📅', title: '我的活动', subtitle: '已报名的活动', action: 'activities' },
  { icon: '📝', title: '我的动态', subtitle: '发布过的动态', action: 'moments' },
  { icon: '👁️', title: '可见范围', subtitle: '设置谁可以看到我', action: 'visibility' },
  { icon: '🚨', title: '举报与反馈', subtitle: '不良内容举报', action: 'report' },
  { icon: '⚙️', title: '设置', subtitle: '隐私、通知等', action: 'settings' }
];

const ProfilePage: React.FC = () => {
  const { currentUser, favorites } = useUserStore();

  const favoriteUsers = useMemo(() => {
    return mockParticipants.filter((p) => favorites.includes(p.id));
  }, [favorites]);

  const handleEditProfile = useCallback(() => {
    console.log('[Profile] 编辑资料');
    Taro.navigateTo({ url: '/pages/edit-profile/index' });
  }, []);

  const handleEditTags = useCallback(() => {
    console.log('[Profile] 编辑标签');
    Taro.navigateTo({ url: '/pages/edit-profile/index?tab=tags' });
  }, []);

  const handleMenuClick = useCallback((action: string) => {
    console.log('[Profile] 菜单点击:', action);
    switch (action) {
      case 'settings':
        Taro.navigateTo({ url: '/pages/settings/index' });
        break;
      case 'activities':
        Taro.navigateTo({ url: '/pages/activity-history/index?tab=activities' });
        break;
      case 'moments':
        Taro.navigateTo({ url: '/pages/activity-history/index?tab=moments' });
        break;
      case 'favorites':
        Taro.navigateTo({ url: '/pages/activity-history/index?tab=cards' });
        break;
      case 'visibility':
        Taro.navigateTo({ url: '/pages/settings/index' });
        break;
      case 'report':
        Taro.showToast({
          title: '反馈功能开发中',
          icon: 'none'
        });
        break;
      default:
        Taro.showToast({
          title: '功能开发中',
          icon: 'none'
        });
    }
  }, []);

  const handleFavoriteClick = useCallback((userId: string) => {
    console.log('[Profile] 查看收藏用户:', userId);
    Taro.navigateTo({
      url: `/pages/chat-detail/index?userId=${userId}`
    });
  }, []);

  useEffect(() => {
    console.log('[Profile] 页面加载完成，用户ID:', currentUser.id);
  }, [currentUser.id]);

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.profileHeader}>
        <View className={styles.profileInfo}>
          <View className={styles.avatarWrapper} onClick={handleEditProfile}>
            <UserAvatar src={currentUser.avatar} size="xlarge" />
            <View className={styles.editIcon}>
              <Text>✏️</Text>
            </View>
          </View>
          <View className={styles.userInfo}>
            <View className={styles.userName}>
              <Text>{currentUser.name}</Text>
              <Text className={styles.verifiedBadge}>✓ 已认证</Text>
            </View>
            <Text className={styles.userDesc}>{currentUser.bio}</Text>
            <Text className={styles.userMeta}>
              {currentUser.company} · {currentUser.position}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{favorites.length}</Text>
          <Text className={styles.statLabel}>收藏</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>12</Text>
          <Text className={styles.statLabel}>活动</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>28</Text>
          <Text className={styles.statLabel}>动态</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>156</Text>
          <Text className={styles.statLabel}>好友</Text>
        </View>
      </View>

      <View className={styles.tagsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>我的兴趣标签</Text>
          <Text className={styles.sectionEdit} onClick={handleEditTags}>
            编辑 ›
          </Text>
        </View>
        <View className={styles.tagList}>
          {currentUser.tags.map((tag, index) => (
            <View key={index} className={styles.tagItem}>
              <Text className={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.favoritesSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>收藏的联系人</Text>
          <Text className={styles.sectionEdit}>全部 ›</Text>
        </View>
        {favoriteUsers.length > 0 ? (
          <View className={styles.favoritesGrid}>
            {favoriteUsers.slice(0, 4).map((user) => (
              <View
                key={user.id}
                className={styles.favoriteItem}
                onClick={() => handleFavoriteClick(user.id)}
              >
                <UserAvatar src={user.avatar} size="large" />
                <Text className={styles.favoriteName}>{user.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyFavorites}>
            <Text style={{ fontSize: '48rpx', marginBottom: '16rpx' }}>🤝</Text>
            <Text style={{ fontSize: '24rpx', color: '#86909C' }}>还没有收藏的联系人</Text>
          </View>
        )}
      </View>

      <View className={styles.menuSection}>
        {menuItems.map((item) => (
          <View
            key={item.action}
            className={styles.menuItem}
            onClick={() => handleMenuClick(item.action)}
          >
            <View className={styles.menuIcon}>
              <Text>{item.icon}</Text>
            </View>
            <View className={styles.menuContent}>
              <Text className={styles.menuTitle}>{item.title}</Text>
              <Text className={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfilePage;

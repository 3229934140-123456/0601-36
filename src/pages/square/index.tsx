import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Activity } from '@/types';
import { mockActivities } from '@/data/activities';
import ActivityCard from '@/components/ActivityCard';
import styles from './index.module.scss';

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'ongoing', label: '进行中' },
  { key: 'upcoming', label: '即将开始' },
  { key: 'ended', label: '已结束' }
];

const quickActions = [
  { icon: '📷', label: '扫码加入', action: 'scan' },
  { icon: '🎯', label: '兴趣配对', action: 'match' },
  { icon: '📅', label: '我的活动', action: 'my' },
  { icon: '⭐', label: '热门活动', action: 'hot' }
];

const SquarePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [loading, setLoading] = useState(false);

  const filteredActivities = activities.filter((activity) => {
    const matchesTab = activeTab === 'all' || activity.status === activeTab;
    const matchesSearch =
      !searchText ||
      activity.title.includes(searchText) ||
      activity.tags.some((tag) => tag.includes(searchText));
    return matchesTab && matchesSearch;
  });

  const handleScan = useCallback(() => {
    console.log('[Square] 扫码加入活动');
    Taro.scanCode({
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        console.log('[Square] 扫码成功:', res.result);
        const scanResult = res.result;
        let activityId = '';

        if (scanResult.startsWith('activity:')) {
          activityId = scanResult.replace('activity:', '');
        } else if (/^\d+$/.test(scanResult)) {
          activityId = scanResult;
        } else {
          try {
            const data = JSON.parse(scanResult);
            activityId = data.activityId || data.id || '';
          } catch {
            activityId = '';
          }
        }

        if (activityId) {
          const activity = mockActivities.find((a) => a.id === activityId);
          if (activity) {
            Taro.navigateTo({
              url: `/pages/activity-detail/index?id=${activityId}&from=scan`
            });
            return;
          }
        }

        Taro.showModal({
          title: '二维码无效',
          content: '未找到对应的活动，请确认二维码是否正确',
          showCancel: false,
          confirmText: '我知道了'
        });
      },
      fail: (err) => {
        console.log('[Square] 扫码失败/取消:', err);
        const errMsg = err.errMsg || '';
        if (errMsg.includes('cancel') || errMsg.includes('取消')) {
          Taro.showToast({
            title: '已取消扫码',
            icon: 'none',
            duration: 1500
          });
        } else {
          Taro.showToast({
            title: '扫码失败，请重试',
            icon: 'none'
          });
        }
      }
    });
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    console.log('[Square] 快捷操作:', action);
    switch (action) {
      case 'scan':
        handleScan();
        break;
      case 'match':
        Taro.navigateTo({ url: '/pages/matching/index' });
        break;
      case 'my':
        Taro.switchTab({ url: '/pages/profile/index' });
        break;
      case 'hot':
        setActiveTab('ongoing');
        break;
      default:
        break;
    }
  }, [handleScan]);

  const onPullDownRefresh = useCallback(() => {
    console.log('[Square] 下拉刷新');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  }, []);

  const onReachBottom = useCallback(() => {
    console.log('[Square] 上拉加载更多');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    console.log('[Square] 页面加载完成，活动数量:', mockActivities.length);
  }, []);

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索活动、话题、标签..."
            placeholderClass={styles.searchPlaceholder}
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
          <View className={styles.scanBtn} onClick={handleScan}>
            <Text className={styles.scanBtnText}>扫码</Text>
          </View>
        </View>
      </View>

      <ScrollView
        scrollY
        className={styles.scrollContent}
        onPullDownRefresh={onPullDownRefresh}
        onReachBottom={onReachBottom}
        refresherEnabled
        refresherTriggered={loading}
      >
        <View className={styles.tabBar}>
          {tabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(styles.tabItem, activeTab === tab.key && styles.tabItemActive)}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text
                className={classnames(
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive
                )}
              >
                {tab.label}
              </Text>
            </View>
          ))}
        </View>

        <View className={styles.content}>
          <View className={styles.quickActions}>
            {quickActions.map((item) => (
              <View
                key={item.action}
                className={styles.actionItem}
                onClick={() => handleQuickAction(item.action)}
              >
                <View className={styles.actionIcon}>
                  <Text>{item.icon}</Text>
                </View>
                <Text className={styles.actionText}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View className={styles.sectionTitle}>
            <Text className={styles.sectionTitleText}>热门活动</Text>
            <Text className={styles.sectionSubText}>{filteredActivities.length} 个活动</Text>
          </View>

          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🎉</Text>
              <Text className={styles.emptyText}>暂无相关活动</Text>
            </View>
          )}

          {loading && (
            <View className={styles.emptyState}>
              <Text className={styles.emptyText}>加载中...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SquarePage;

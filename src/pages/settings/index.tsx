import React, { useState, useCallback, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

interface SettingItem {
  icon: string;
  label: string;
  desc?: string;
  value?: string;
  type: 'nav' | 'switch';
  key?: string;
}

const SettingsPage: React.FC = () => {
  const [visibility, setVisibility] = useState('all');
  const [notifications, setNotifications] = useState(true);
  const [newMsgNotice, setNewMsgNotice] = useState(true);
  const [matchNotice, setMatchNotice] = useState(true);
  const [announceNotice, setAnnounceNotice] = useState(true);

  useEffect(() => {
    console.log('[Settings] 设置页面加载');
  }, []);

  const visibilityOptions = [
    { value: 'all', label: '所有人可见', desc: '所有人都能查看你的资料' },
    { value: 'activity', label: '仅活动参与者', desc: '只有同活动参与者可查看' },
    { value: 'favorites', label: '仅我收藏的人', desc: '只有你收藏的人可查看' },
    { value: 'private', label: '完全隐私', desc: '仅昵称和头像可见' }
  ];

  const handleVisibility = useCallback(() => {
    console.log('[Settings] 设置可见范围');
    const options = visibilityOptions.map((o) => o.label);

    Taro.showActionSheet({
      itemList: options,
      success: (res) => {
        const selected = visibilityOptions[res.tapIndex];
        setVisibility(selected.value);
        Taro.showToast({
          title: `已设置为${selected.label}`,
          icon: 'none'
        });
      }
    });
  }, []);

  const toggleNotification = useCallback(() => {
    console.log('[Settings] 切换消息通知');
    setNotifications((prev) => !prev);
  }, []);

  const handleAbout = useCallback(() => {
    console.log('[Settings] 关于我们');
    Taro.showModal({
      title: '关于破冰',
      content: '破冰 v1.0.0\n\n让线下社交更轻松，让每次相遇都有意义。',
      showCancel: false
    });
  }, []);

  const handleFeedback = useCallback(() => {
    console.log('[Settings] 意见反馈');
    Taro.showToast({
      title: '感谢您的反馈',
      icon: 'none'
    });
  }, []);

  const handlePrivacy = useCallback(() => {
    console.log('[Settings] 隐私政策');
    Taro.showToast({
      title: '隐私政策',
      icon: 'none'
    });
  }, []);

  const handleClearCache = useCallback(() => {
    console.log('[Settings] 清理缓存');
    Taro.showModal({
      title: '清理缓存',
      content: '确定要清理缓存吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '缓存已清理',
            icon: 'success'
          });
        }
      }
    });
  }, []);

  const handleLogout = useCallback(() => {
    console.log('[Settings] 退出登录');
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  }, []);

  const renderItem = (item: SettingItem) => {
    if (item.type === 'switch') {
      const switchState =
        item.key === 'newMsgNotice'
          ? newMsgNotice
          : item.key === 'matchNotice'
          ? matchNotice
          : item.key === 'announceNotice'
          ? announceNotice
          : notifications;

      const toggleFn =
        item.key === 'newMsgNotice'
          ? () => setNewMsgNotice(!switchState)
          : item.key === 'matchNotice'
          ? () => setMatchNotice(!switchState)
          : item.key === 'announceNotice'
          ? () => setAnnounceNotice(!switchState)
          : toggleNotification;

      return (
        <View
          key={item.label}
          className={classnames(styles.settingItem, item.label.includes('退出') && styles.dangerItem)}
          onClick={toggleFn}
        >
          <View className={styles.settingIcon}>
            <Text>{item.icon}</Text>
          </View>
          <View className={styles.settingContent}>
            <Text className={styles.settingLabel}>{item.label}</Text>
            {item.desc && <Text className={styles.settingDesc}>{item.desc}</Text>}
          </View>
          <Text className={styles.switch}>{switchState ? '✓' : '○'}</Text>
        </View>
      );
    }

    return (
      <View
        key={item.label}
        className={classnames(styles.settingItem, item.label.includes('退出') && styles.dangerItem)}
      >
        <View className={styles.settingIcon}>
          <Text>{item.icon}</Text>
        </View>
        <View className={styles.settingContent}>
          <Text className={styles.settingLabel}>{item.label}</Text>
          {item.desc && <Text className={styles.settingDesc}>{item.desc}</Text>}
        </View>
        {item.value && <Text className={styles.settingValue}>{item.value}</Text>}
        <Text className={styles.settingArrow}>›</Text>
      </View>
    );
  };

  return (
    <View className={styles.page}>
      <View className={styles.sectionTitle}>隐私设置</View>
      <View className={styles.section}>
        <View className={styles.settingItem} onClick={handleVisibility}>
          <View className={styles.settingIcon}>
            <Text>👁️</Text>
          </View>
          <View className={styles.settingContent}>
            <Text className={styles.settingLabel}>可见范围</Text>
            <Text className={styles.settingDesc}>控制谁能看到你的详细资料</Text>
          </View>
          <Text className={styles.settingValue}>
            {visibilityOptions.find((o) => o.value === visibility)?.label}
          </Text>
          <Text className={styles.settingArrow}>›</Text>
        </View>
        <View className={styles.settingItem} onClick={handlePrivacy}>
          <View className={styles.settingIcon}>
            <Text>🔒</Text>
          </View>
          <View className={styles.settingContent}>
            <Text className={styles.settingLabel}>隐私政策</Text>
          </View>
          <Text className={styles.settingArrow}>›</Text>
        </View>
      </View>

      <View className={styles.sectionTitle}>消息通知</View>
      <View className={styles.section}>
        {renderItem({
          icon: '🔔',
          label: '消息通知',
          desc: '开启后接收新消息提醒',
          type: 'switch'
        })}
        {renderItem({
          icon: '💬',
          label: '私信提醒',
          key: 'newMsgNotice',
          type: 'switch'
        })}
        {renderItem({
          icon: '🎯',
          label: '配对通知',
          key: 'matchNotice',
          type: 'switch'
        })}
        {renderItem({
          icon: '📢',
          label: '活动公告',
          key: 'announceNotice',
          type: 'switch'
        })}
      </View>

      <View className={styles.sectionTitle}>通用</View>
      <View className={styles.section}>
        <View className={styles.settingItem} onClick={handleClearCache}>
          <View className={styles.settingIcon}>
            <Text>🗑️</Text>
          </View>
          <View className={styles.settingContent}>
            <Text className={styles.settingLabel}>清理缓存</Text>
          </View>
          <Text className={styles.settingValue}>12.5 MB</Text>
          <Text className={styles.settingArrow}>›</Text>
        </View>
        <View className={styles.settingItem} onClick={handleAbout}>
          <View className={styles.settingIcon}>
            <Text>ℹ️</Text>
          </View>
          <View className={styles.settingContent}>
            <Text className={styles.settingLabel}>关于我们</Text>
          </View>
          <Text className={styles.settingArrow}>›</Text>
        </View>
        <View className={styles.settingItem} onClick={handleFeedback}>
          <View className={styles.settingIcon}>
            <Text>💡</Text>
          </View>
          <View className={styles.settingContent}>
            <Text className={styles.settingLabel}>意见反馈</Text>
          </View>
          <Text className={styles.settingArrow}>›</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={classnames(styles.settingItem, styles.dangerItem)} onClick={handleLogout}>
          <View className={styles.settingIcon}>
            <Text>🚪</Text>
          </View>
          <View className={styles.settingContent}>
            <Text className={styles.settingLabel}>退出登录</Text>
          </View>
          <Text className={styles.settingArrow}>›</Text>
        </View>
      </View>

      <View className={styles.versionInfo}>
        <Text className={styles.versionText}>破冰 v1.0.0</Text>
        <Text className={styles.copyrightText}>© 2024 破冰科技</Text>
      </View>
    </View>
  );
};

export default SettingsPage;

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Conversation, Announcement } from '@/types';
import { mockConversations } from '@/data/messages';
import { mockAnnouncements } from '@/data/activities';
import UserAvatar from '@/components/UserAvatar';
import styles from './index.module.scss';

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'chat', label: '私信' },
  { key: 'notice', label: '通知' }
];

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [announcements] = useState<Announcement[]>(mockAnnouncements);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const handleConversationClick = useCallback((conversation: Conversation) => {
    console.log('[Messages] 打开聊天:', conversation.userId);
    Taro.navigateTo({
      url: `/pages/chat-detail/index?userId=${conversation.userId}&userName=${conversation.userName}`
    });
  }, []);

  const handleAnnouncementClick = useCallback((announcement: Announcement) => {
    console.log('[Messages] 查看公告:', announcement.id);
    Taro.showModal({
      title: announcement.title,
      content: announcement.content,
      showCancel: false,
      confirmText: '知道了'
    });
  }, []);

  useEffect(() => {
    console.log('[Messages] 页面加载完成，会话数量:', conversations.length);
  }, [conversations.length]);

  const showConversations = activeTab === 'all' || activeTab === 'chat';
  const showAnnouncements = activeTab === 'all' || activeTab === 'notice';

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>消息</Text>
      </View>

      <View className={styles.tabs}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={styles.tabItem}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text
              className={classnames(
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive
              )}
            >
              {tab.label}
              {tab.key === 'chat' && totalUnread > 0 && (
                <Text className={styles.badge}>{totalUnread > 99 ? '99+' : totalUnread}</Text>
              )}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY>
        {showAnnouncements && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>📢 公告通知</Text>
            {announcements.map((item) => (
              <View
                key={item.id}
                className={styles.announcementItem}
                onClick={() => handleAnnouncementClick(item)}
              >
                <View
                  className={classnames(
                    styles.announcementIcon,
                    item.type === 'host' && styles.announcementHost
                  )}
                >
                  <Text>{item.type === 'host' ? '🎤' : '📢'}</Text>
                </View>
                <View className={styles.announcementContent}>
                  <Text className={styles.announcementTitle}>{item.title}</Text>
                  <Text className={styles.announcementDesc}>{item.content}</Text>
                  <Text className={styles.announcementTime}>{item.createdAt}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {showConversations && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>💬 私信</Text>
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <View
                  key={conv.id}
                  className={styles.conversationItem}
                  onClick={() => handleConversationClick(conv)}
                >
                  <View className={styles.conversationAvatar}>
                    <UserAvatar src={conv.userAvatar} size="large" isOnline={conv.isOnline} />
                    {conv.unreadCount > 0 && (
                      <View className={styles.unreadBadge}>
                        <Text>{conv.unreadCount > 99 ? '99+' : conv.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                  <View className={styles.conversationInfo}>
                    <View className={styles.conversationTop}>
                      <Text className={styles.conversationName}>{conv.userName}</Text>
                      <Text className={styles.conversationTime}>{conv.lastMessageTime}</Text>
                    </View>
                    <View className={styles.conversationBottom}>
                      <Text className={styles.conversationLastMsg}>{conv.lastMessage}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>💬</Text>
                <Text className={styles.emptyText}>暂无私信</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagesPage;

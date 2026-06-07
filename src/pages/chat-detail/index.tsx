import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { ChatMessage, User } from '@/types';
import { mockChatMessages } from '@/data/messages';
import { mockParticipants } from '@/data/users';
import { useUserStore } from '@/store/useUserStore';
import UserAvatar from '@/components/UserAvatar';
import styles from './index.module.scss';

const ChatDetailPage: React.FC = () => {
  const router = useRouter();
  const { currentUser, toggleFavorite, isFavorite } = useUserStore();
  const userId = router.params.userId || '1';
  const userName = router.params.userName || '用户';

  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [inputText, setInputText] = useState('');
  const [showToolbar, setShowToolbar] = useState(false);
  const [chatUser, setChatUser] = useState<User | null>(null);
  const [isFav, setIsFav] = useState(false);

  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const user = mockParticipants.find((p) => p.id === userId);
    if (user) {
      setChatUser(user);
      Taro.setNavigationBarTitle({ title: user.name });
    }
    setIsFav(isFavorite(userId));
    console.log('[ChatDetail] 聊天用户ID:', userId, '是否收藏:', isFavorite(userId));
  }, [userId, userName, isFavorite]);

  const handleBack = useCallback(() => {
    Taro.navigateBack();
  }, []);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    console.log('[ChatDetail] 发送消息:', inputText);
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      content: inputText.trim(),
      type: 'text',
      createdAt: '刚刚',
      isRead: false
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setShowToolbar(false);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: userId,
        content: '好的，收到！下午茶歇见～',
        type: 'text',
        createdAt: '刚刚',
        isRead: false
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  }, [inputText, userId]);

  const handleSendCard = useCallback(() => {
    console.log('[ChatDetail] 发送名片');
    const cardMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      content: '我的电子名片',
      type: 'card',
      createdAt: '刚刚',
      isRead: false,
      cardData: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        bio: currentUser.bio,
        tags: currentUser.tags,
        company: currentUser.company,
        position: currentUser.position,
        city: currentUser.city
      }
    };

    setMessages((prev) => [...prev, cardMsg]);
    setShowToolbar(false);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: userId,
        content: '收到！很高兴认识你～',
        type: 'text',
        createdAt: '刚刚',
        isRead: false
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  }, [currentUser, userId]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(userId);
    const newFavState = !isFav;
    setIsFav(newFavState);
    Taro.showToast({
      title: newFavState ? '已收藏' : '已取消收藏',
      icon: 'success'
    });
  }, [userId, isFav, toggleFavorite]);

  const handleMore = useCallback(() => {
    console.log('[ChatDetail] 更多操作');
    Taro.showActionSheet({
      itemList: [isFav ? '取消收藏' : '收藏联系人', '举报用户', '设置免打扰'],
      success: (res) => {
        if (res.tapIndex === 0) {
          handleToggleFavorite();
        } else if (res.tapIndex === 1) {
          Taro.showModal({
            title: '举报用户',
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
        } else if (res.tapIndex === 2) {
          Taro.showToast({
            title: '设置成功',
            icon: 'none'
          });
        }
      }
    });
  }, [isFav, handleToggleFavorite]);

  const renderMessage = (msg: ChatMessage, index: number) => {
    const isSelf = msg.senderId === 'me';
    const avatar = isSelf ? currentUser.avatar : chatUser?.avatar || '';

    if (msg.type === 'card' && msg.cardData) {
      return (
        <View
          key={msg.id}
          className={classnames(styles.messageItem, isSelf && styles.messageSelf)}
        >
          <View className={styles.messageAvatar}>
            <UserAvatar src={avatar} size="medium" />
          </View>
          <View className={styles.cardMessage}>
            <View className={styles.cardHeader}>
              <UserAvatar src={msg.cardData.avatar} size="large" />
              <View className={styles.cardUserInfo}>
                <Text className={styles.cardName}>{msg.cardData.name}</Text>
                <Text className={styles.cardPosition}>
                  {msg.cardData.company} · {msg.cardData.position}
                </Text>
              </View>
            </View>
            <View className={styles.cardTags}>
              {msg.cardData.tags.slice(0, 4).map((tag, i) => (
                <Text key={i} className={styles.cardTag}>
                  {tag}
                </Text>
              ))}
            </View>
            <Text className={styles.cardBio}>{msg.cardData.bio}</Text>
            <View className={styles.cardAction}>
              <Text>交换名片 ✓</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View
        key={msg.id}
        className={classnames(styles.messageItem, isSelf && styles.messageSelf)}
      >
        <View className={styles.messageAvatar}>
          <UserAvatar src={avatar} size="medium" />
        </View>
        <View className={styles.messageBubble}>
          <Text className={styles.messageText}>{msg.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text>‹</Text>
        </View>
        <View className={styles.userInfo}>
          {chatUser && <UserAvatar src={chatUser.avatar} size="medium" />}
          <Text className={styles.userName}>{chatUser?.name || userName}</Text>
        </View>
        <View className={styles.moreBtn} onClick={handleMore}>
          <Text>⋯</Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.messageList} ref={scrollRef}>
        <View className={styles.messageTime}>
          <Text>今天 14:30</Text>
        </View>
        {messages.map((msg, index) => renderMessage(msg, index))}
      </ScrollView>

      {showToolbar && (
        <View className={styles.toolbar}>
          <View className={styles.toolItem} onClick={handleSendCard}>
            <View className={styles.toolIcon}>
              <Text>💳</Text>
            </View>
            <Text className={styles.toolLabel}>名片</Text>
          </View>
          <View className={styles.toolItem}>
            <View className={styles.toolIcon}>
              <Text>📷</Text>
            </View>
            <Text className={styles.toolLabel}>照片</Text>
          </View>
          <View className={styles.toolItem}>
            <View className={styles.toolIcon}>
              <Text>🎤</Text>
            </View>
            <Text className={styles.toolLabel}>语音</Text>
          </View>
          <View className={styles.toolItem}>
            <View className={styles.toolIcon}>
              <Text>📍</Text>
            </View>
            <Text className={styles.toolLabel}>位置</Text>
          </View>
        </View>
      )}

      <View className={styles.inputBar}>
        <View className={styles.actionBtn} onClick={() => setShowToolbar(!showToolbar)}>
          <Text>{showToolbar ? '⌨️' : '➕'}</Text>
        </View>
        <View className={styles.inputWrapper}>
          <Input
            className={styles.input}
            placeholder="输入消息..."
            value={inputText}
            onInput={(e) => setInputText(e.detail.value)}
            onConfirm={handleSend}
            adjustPosition
          />
        </View>
        <View className={styles.sendBtn} onClick={handleSend}>
          <Text className={styles.sendBtnText}>发送</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatDetailPage;

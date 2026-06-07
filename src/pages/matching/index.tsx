import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { MatchResult, InterestTag } from '@/types';
import { mockMatchResults, mockInterestTags } from '@/data/users';
import { useUserStore } from '@/store/useUserStore';
import UserAvatar from '@/components/UserAvatar';
import styles from './index.module.scss';

const MatchingPage: React.FC = () => {
  const { currentUser } = useUserStore();
  const [selectedTags, setSelectedTags] = useState<string[]>(currentUser.tags.slice(0, 3));
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [hasMatched, setHasMatched] = useState(false);

  const tagCategories = Array.from(
    new Set(mockInterestTags.map((t) => t.category))
  ).map((category) => ({
    category,
    tags: mockInterestTags.filter((t) => t.category === category)
  }));

  const toggleTag = useCallback((tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : prev.length >= 5
        ? prev
        : [...prev, tagName]
    );
  }, []);

  const handleMatch = useCallback(() => {
    if (selectedTags.length === 0) {
      Taro.showToast({
        title: '请至少选择一个兴趣标签',
        icon: 'none'
      });
      return;
    }

    console.log('[Matching] 开始配对，选中标签:', selectedTags);
    setIsMatching(true);
    setHasMatched(false);

    setTimeout(() => {
      const results = mockMatchResults.map((result) => ({
        ...result,
        matchScore: Math.floor(Math.random() * 30) + 70
      }));
      setMatchResults(results.sort((a, b) => b.matchScore - a.matchScore));
      setIsMatching(false);
      setHasMatched(true);
      console.log('[Matching] 配对完成，找到', results.length, '位匹配者');
    }, 1500);
  }, [selectedTags]);

  const handleChat = useCallback((userId: string, userName: string) => {
    console.log('[Matching] 发起聊天:', userId);
    Taro.navigateTo({
      url: `/pages/chat-detail/index?userId=${userId}&userName=${userName}`
    });
  }, []);

  const handleViewProfile = useCallback((userId: string) => {
    console.log('[Matching] 查看资料:', userId);
    Taro.showToast({
      title: '查看资料',
      icon: 'none'
    });
  }, []);

  useEffect(() => {
    console.log('[Matching] 页面加载完成');
  }, []);

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.headerCard}>
        <Text className={styles.headerTitle}>🎯 兴趣配对</Text>
        <Text className={styles.headerDesc}>
          选择你感兴趣的标签，我们会为你匹配志同道合的伙伴
        </Text>
        <View className={styles.matchBtn} onClick={handleMatch}>
          <Text className={styles.matchBtnIcon}>✨</Text>
          <Text className={styles.matchBtnText}>
            {isMatching ? '配对中...' : hasMatched ? '重新配对' : '开始配对'}
          </Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>选择兴趣标签</Text>
          <Text className={styles.sectionSubtitle}>
            已选 {selectedTags.length}/5
          </Text>
        </View>
        <View className={styles.selectedTags}>
          {selectedTags.length === 0 ? (
            <Text style={{ color: '#86909C', fontSize: '24rpx' }}>请从下方选择标签</Text>
          ) : (
            selectedTags.map((tag) => (
              <View
                key={tag}
                className={classnames(styles.tagItem, styles.tagItemSelected)}
                onClick={() => toggleTag(tag)}
              >
                <Text className={styles.tagTextSelected}>{tag}</Text>
                <Text className={styles.tagClose}>×</Text>
              </View>
            ))
          )}
        </View>
        <View className={styles.tagCategories}>
          {tagCategories.map((cat) => (
            <View key={cat.category}>
              <Text className={styles.categoryTitle}>{cat.category}</Text>
              <View className={styles.tagsRow}>
                {cat.tags.map((tag: InterestTag) => {
                  const isSelected = selectedTags.includes(tag.name);
                  return (
                    <View
                      key={tag.id}
                      className={classnames(
                        styles.tagItem,
                        isSelected && styles.tagItemSelected
                      )}
                      onClick={() => toggleTag(tag.name)}
                    >
                      <Text
                        className={classnames(
                          styles.tagText,
                          isSelected && styles.tagTextSelected
                        )}
                      >
                        {tag.name}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </View>

      {hasMatched && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>配对结果</Text>
            <Text className={styles.sectionSubtitle}>
              共 {matchResults.length} 位匹配
            </Text>
          </View>
          <View className={styles.matchList}>
            {matchResults.map((result) => (
              <View
                key={result.user.id}
                className={styles.matchCard}
                onClick={() => handleViewProfile(result.user.id)}
              >
                <UserAvatar src={result.user.avatar} size="large" />
                <View className={styles.matchInfo}>
                  <View className={styles.matchName}>
                    <Text>{result.user.name}</Text>
                    <Text className={styles.matchScore}>
                      匹配度 {result.matchScore}%
                    </Text>
                  </View>
                  <Text className={styles.matchDesc}>
                    {result.user.company} · {result.user.position}
                  </Text>
                  <View className={styles.matchTags}>
                    {result.commonTags.map((tag, index) => (
                      <Text key={index} className={styles.commonTag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                </View>
                <View className={styles.matchActions}>
                  <View
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChat(result.user.id, result.user.name);
                    }}
                  >
                    <Text>打招呼</Text>
                  </View>
                  <View
                    className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProfile(result.user.id);
                    }}
                  >
                    <Text>名片</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {isMatching && (
        <View className={styles.section}>
          <View className={styles.loadingState}>
            <Text className={styles.loadingIcon}>🔄</Text>
            <Text className={styles.loadingText}>正在为你寻找志同道合的伙伴...</Text>
          </View>
        </View>
      )}

      {!hasMatched && !isMatching && (
        <View className={styles.section}>
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>💫</Text>
            <Text className={styles.emptyText}>
              选择兴趣标签，点击开始配对
              {'\n'}
              发现与你志同道合的人
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default MatchingPage;

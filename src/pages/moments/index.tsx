import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { Moment, Comment } from '@/types';
import { mockMoments } from '@/data/moments';
import { mockComments } from '@/data/moments';
import { useUserStore } from '@/store/useUserStore';
import { useActivityStore } from '@/store/useActivityStore';
import UserAvatar from '@/components/UserAvatar';
import styles from './index.module.scss';

const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'activity', label: '本活动' },
  { key: 'following', label: '关注' }
];

const MomentsPage: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const {
    addMoment,
    addComment,
    getActivityMoments,
    targetMomentId,
    setTargetMoment,
    myMoments,
    myComments
  } = useActivityStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [moments, setMoments] = useState<Moment[]>([]);
  const [likedMoments, setLikedMoments] = useState<string[]>(
    mockMoments.filter((m) => m.isLiked).map((m) => m.id)
  );

  const [showPublish, setShowPublish] = useState(false);
  const [publishType, setPublishType] = useState<'text' | 'image' | 'mixed'>('text');
  const [publishContent, setPublishContent] = useState('');
  const [publishImages, setPublishImages] = useState<string[]>([]);

  const [commentMomentId, setCommentMomentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const scrollRef = useRef<any>(null);
  const momentRefs = useRef<Record<string, any>>({});

  const loadMoments = useCallback(() => {
    const storeMoments = getActivityMoments('1');
    const allMoments = [...storeMoments, ...mockMoments];
    const seen = new Set<string>();
    const unique = allMoments.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
    setMoments(unique);

    const map: Record<string, Comment[]> = {};
    unique.forEach((m) => {
      const storeComments = myComments[m.id] || [];
      map[m.id] = [...storeComments, ...mockComments];
    });
    setCommentsMap(map);
  }, [getActivityMoments, myComments]);

  useEffect(() => {
    loadMoments();
  }, [loadMoments]);

  useDidShow(() => {
    loadMoments();

    if (targetMomentId) {
      const targetId = targetMomentId;
      setTargetMoment(null);

      setTimeout(() => {
        const targetEl = momentRefs.current[targetId];
        if (targetEl) {
          targetEl.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
        } else {
          const idx = moments.findIndex((m) => m.id === targetId);
          if (idx >= 0 && scrollRef.current) {
            scrollRef.current.scrollToOffset?.({
              offset: idx * 350,
              animated: true
            });
          }
        }
        setShowComments((prev) => ({ ...prev, [targetId]: true }));
      }, 500);
    }
  });

  const handlePublishClick = useCallback(() => {
    console.log('[Moments] 打开发布');
    setPublishContent('');
    setPublishImages([]);
    setPublishType('text');
    setShowPublish(true);
  }, []);

  const handleChooseImage = useCallback(() => {
    console.log('[Moments] 选择图片');
    Taro.chooseImage({
      count: 9 - publishImages.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFilePaths || res.tempFiles?.map((f) => f.path) || [];
        setPublishImages((prev) => [...prev, ...newImages].slice(0, 9));
      },
      fail: (err) => {
        if (!err.errMsg?.includes('cancel')) {
          const mockImages = [
            'https://picsum.photos/id/237/400/400',
            'https://picsum.photos/id/238/400/400'
          ];
          setPublishImages((prev) => [...prev, ...mockImages].slice(0, 9));
        }
      }
    });
  }, [publishImages.length]);

  const handleSubmitPublish = useCallback(() => {
    const content = publishContent.trim();
    if (publishType === 'text' && !content) {
      Taro.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }
    if (publishType === 'image' && publishImages.length === 0) {
      Taro.showToast({
        title: '请选择图片',
        icon: 'none'
      });
      return;
    }
    if (publishType === 'mixed' && !content && publishImages.length === 0) {
      Taro.showToast({
        title: '请输入内容或选择图片',
        icon: 'none'
      });
      return;
    }

    console.log('[Moments] 发布动态:', { type: publishType, content, images: publishImages });

    const newMoment: Moment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: content || '分享图片',
      images: publishImages,
      activityId: '1',
      activityTitle: '2024 创业者交流会',
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      createdAt: '刚刚'
    };

    setMoments((prev) => [newMoment, ...prev]);
    setCommentsMap((prev) => ({ ...prev, [newMoment.id]: [] }));
    addMoment('1', newMoment);
    setShowPublish(false);
    setPublishContent('');
    setPublishImages([]);

    Taro.showToast({
      title: '发布成功',
      icon: 'success'
    });

    setTimeout(() => {
      scrollRef.current?.scrollToOffset?.({ offset: 0, animated: true });
    }, 300);
  }, [publishContent, publishImages, publishType, currentUser, addMoment]);

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

  const handleToggleComments = useCallback((momentId: string) => {
    console.log('[Moments] 切换评论区:', momentId);
    setShowComments((prev) => ({ ...prev, [momentId]: !prev[momentId] }));
    if (!showComments[momentId]) {
      setCommentMomentId(momentId);
      setCommentText('');
    }
  }, [showComments]);

  const handleSubmitComment = useCallback(() => {
    if (!commentMomentId || !commentText.trim()) return;

    console.log('[Moments] 提交评论:', commentMomentId, commentText);

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: commentText.trim(),
      createdAt: '刚刚',
      likeCount: 0
    };

    setCommentsMap((prev) => ({
      ...prev,
      [commentMomentId]: [...(prev[commentMomentId] || []), newComment]
    }));

    setMoments((prev) =>
      prev.map((m) =>
        m.id === commentMomentId ? { ...m, commentCount: m.commentCount + 1 } : m
      )
    );

    addComment('1', commentMomentId, newComment);

    setCommentText('');
    Taro.showToast({
      title: '评论成功',
      icon: 'success'
    });
  }, [commentMomentId, commentText, currentUser, addComment]);

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
        } else if (res.tapIndex === 2) {
          Taro.showToast({
            title: '分享成功',
            icon: 'success'
          });
        }
      }
    });
  }, []);

  const handleUserClick = useCallback((userId: string) => {
    console.log('[Moments] 查看用户:', userId);
    if (userId === currentUser.id) {
      Taro.switchTab({ url: '/pages/profile/index' });
    } else {
      Taro.navigateTo({
        url: `/pages/chat-detail/index?userId=${userId}`
      });
    }
  }, [currentUser.id]);

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
        <View className={styles.publishBtn} onClick={handlePublishClick}>
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

      <ScrollView scrollY className={styles.momentList} ref={scrollRef}>
        {filteredMoments.length > 0 ? (
          filteredMoments.map((moment) => (
            <View
              key={moment.id}
              className={styles.momentCard}
              ref={(el) => {
                if (el) momentRefs.current[moment.id] = el;
              }}
            >
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
                    onClick={() => handleToggleComments(moment.id)}
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

              {showComments[moment.id] && (
                <View className={styles.commentSection}>
                  {commentsMap[moment.id]?.length > 0 && (
                    <View className={styles.commentList}>
                      {commentsMap[moment.id].map((comment) => (
                        <View key={comment.id} className={styles.commentItem}>
                          <UserAvatar src={comment.userAvatar} size="small" />
                          <View className={styles.commentContent}>
                            <Text className={styles.commentName}>{comment.userName}</Text>
                            <Text className={styles.commentText}>{comment.content}</Text>
                            <Text className={styles.commentTime}>{comment.createdAt}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  <View className={styles.commentInputBar}>
                    <UserAvatar src={currentUser.avatar} size="small" />
                    <View className={styles.commentInputWrapper}>
                      <Input
                        className={styles.commentInput}
                        placeholder="说点什么..."
                        value={commentMomentId === moment.id ? commentText : ''}
                        onInput={(e) => setCommentText(e.detail.value)}
                        onConfirm={handleSubmitComment}
                        onFocus={() => {
                          setCommentMomentId(moment.id);
                        }}
                      />
                    </View>
                    <View
                      className={classnames(
                        styles.commentSendBtn,
                        commentMomentId === moment.id && commentText.trim() && styles.commentSendBtnActive
                      )}
                      onClick={handleSubmitComment}
                    >
                      <Text className={styles.commentSendText}>发送</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📷</Text>
            <Text className={styles.emptyText}>还没有动态，快来发布第一条吧</Text>
            <View className={styles.emptyBtn} onClick={handlePublishClick}>
              <Text className={styles.emptyBtnText}>发布动态</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {showPublish && (
        <View className={styles.publishModal}>
          <View className={styles.publishContent}>
            <View className={styles.publishHeader}>
              <Text
                className={styles.publishCancel}
                onClick={() => setShowPublish(false)}
              >
                取消
              </Text>
              <Text className={styles.publishTitle}>发布动态</Text>
              <Text
                className={classnames(
                  styles.publishSubmit,
                  (publishContent.trim() || publishImages.length > 0) && styles.publishSubmitActive
                )}
                onClick={handleSubmitPublish}
              >
                发布
              </Text>
            </View>

            <View className={styles.publishTabs}>
              {[
                { key: 'text', label: '文字' },
                { key: 'image', label: '照片' },
                { key: 'mixed', label: '图文' }
              ].map((tab) => (
                <Text
                  key={tab.key}
                  className={classnames(
                    styles.publishTab,
                    publishType === tab.key && styles.publishTabActive
                  )}
                  onClick={() => setPublishType(tab.key as any)}
                >
                  {tab.label}
                </Text>
              ))}
            </View>

            {(publishType === 'text' || publishType === 'mixed') && (
              <Textarea
                className={styles.publishTextarea}
                placeholder="分享你的想法..."
                value={publishContent}
                onInput={(e) => setPublishContent(e.detail.value)}
                maxLength={500}
                autoHeight
              />
            )}

            {(publishType === 'image' || publishType === 'mixed') && (
              <View className={styles.publishImageGrid}>
                {publishImages.map((img, idx) => (
                  <View key={idx} className={styles.publishImageItem}>
                    <Image className={styles.publishImage} src={img} mode="aspectFill" />
                    <View
                      className={styles.publishImageRemove}
                      onClick={() =>
                        setPublishImages((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      <Text>×</Text>
                    </View>
                  </View>
                ))}
                {publishImages.length < 9 && (
                  <View className={styles.publishAddImage} onClick={handleChooseImage}>
                    <Text className={styles.publishAddIcon}>+</Text>
                    <Text className={styles.publishAddText}>添加图片</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default MomentsPage;

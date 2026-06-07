import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Input, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useUserStore } from '@/store/useUserStore';
import { mockInterestTags } from '@/data/users';
import styles from './index.module.scss';

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  const { currentUser, updateUser } = useUserStore();
  const scrollRef = useRef<any>(null);
  const tagsRef = useRef<any>(null);

  const [name, setName] = useState(currentUser.name);
  const [company, setCompany] = useState(currentUser.company || '');
  const [position, setPosition] = useState(currentUser.position || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [selectedTags, setSelectedTags] = useState<string[]>([...currentUser.tags]);

  useEffect(() => {
    console.log('[EditProfile] 页面加载，当前用户:', currentUser.name, 'tab:', router.params.tab);
    if (router.params.tab === 'tags') {
      setTimeout(() => {
        tagsRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [currentUser.name, router.params.tab]);

  const handleSave = useCallback(() => {
    console.log('[EditProfile] 保存资料:', { name, company, position, bio, selectedTags });
    updateUser({
      name,
      company,
      position,
      bio,
      tags: selectedTags
    });
    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  }, [name, company, position, bio, selectedTags, updateUser]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        if (prev.length >= 10) {
          Taro.showToast({
            title: '最多选择10个标签',
            icon: 'none'
          });
          return prev;
        }
        return [...prev, tag];
      }
    });
  }, []);

  const handleChangeAvatar = useCallback(() => {
    console.log('[EditProfile] 更换头像');
    Taro.showActionSheet({
      itemList: ['从相册选择', '拍照'],
      success: (res) => {
        Taro.showToast({
          title: '头像已更新',
          icon: 'success'
        });
      }
    });
  }, []);

  const tagCategories = [
    { title: '职业方向', tags: mockInterestTags.filter((t) => t.category === '职业').map((t) => t.name) },
    { title: '科技前沿', tags: mockInterestTags.filter((t) => t.category === '科技').map((t) => t.name) },
    { title: '兴趣爱好', tags: mockInterestTags.filter((t) => t.category === '兴趣').map((t) => t.name) },
    { title: '自我成长', tags: mockInterestTags.filter((t) => t.category === '成长').map((t) => t.name) }
  ];

  return (
    <ScrollView scrollY className={styles.page} ref={scrollRef}>
      <View className={styles.avatarSection}>
        <View className={styles.avatarWrapper} onClick={handleChangeAvatar}>
          <Image className={styles.avatar} src={currentUser.avatar} mode="aspectFill" />
          <View className={styles.changeIcon}>
            <Text>📷</Text>
          </View>
        </View>
        <Text className={styles.tipText}>点击更换头像</Text>
      </View>

      <View className={styles.formSection}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>昵称</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入昵称"
            value={name}
            onInput={(e) => setName(e.detail.value)}
            maxLength={20}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>公司</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入公司名称"
            value={company}
            onInput={(e) => setCompany(e.detail.value)}
            maxLength={30}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>职位</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入职位"
            value={position}
            onInput={(e) => setPosition(e.detail.value)}
            maxLength={20}
          />
        </View>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>个人简介</Text>
          <Input
            className={styles.formInput}
            placeholder="介绍一下自己吧"
            value={bio}
            onInput={(e) => setBio(e.detail.value)}
            maxLength={50}
          />
        </View>
      </View>

      <View className={styles.tagsSection} ref={tagsRef}>
        <View className={styles.sectionTitle}>
          <Text>兴趣标签</Text>
          <Text className={styles.sectionSubtitle}>{selectedTags.length}/10</Text>
        </View>

        {tagCategories.map((category) => (
          <View key={category.title}>
            <Text className={styles.categoryTitle}>{category.title}</Text>
            <View className={styles.tagsContainer}>
              {category.tags.map((tag) => (
                <View
                  key={tag}
                  className={classnames(
                    styles.tagItem,
                    selectedTags.includes(tag) && styles.tagItemSelected
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  <Text
                    className={classnames(
                      styles.tagText,
                      selectedTags.includes(tag) && styles.tagTextSelected
                    )}
                  >
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View className={styles.saveBtn} onClick={handleSave}>
        <Text className={styles.saveBtnText}>保存修改</Text>
      </View>
    </ScrollView>
  );
};

export default EditProfilePage;

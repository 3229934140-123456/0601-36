import React from 'react';
import { View, Image } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface UserAvatarProps {
  src: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  isOnline?: boolean;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  size = 'medium',
  isOnline = false,
  className = ''
}) => {
  return (
    <View className={classnames(styles.avatarWrapper, styles[size], className)}>
      <Image
        className={styles.avatar}
        src={src}
        mode="aspectFill"
        onError={(e) => console.error('[UserAvatar] 图片加载失败', e)}
      />
      {isOnline && <View className={styles.onlineDot} />}
    </View>
  );
};

export default UserAvatar;

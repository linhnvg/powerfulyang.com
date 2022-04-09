import classNames from 'classnames';
import React, { memo } from 'react';
import { LazyImage } from '@/components/LazyImage';
import { DateTimeFormat } from '@/utils/lib';
import { ImagePreview } from '@/components/ImagePreview';
import { AssetImageThumbnail } from '@/components/ImagePreview/AssetImageThumbnail';
import type { Feed } from '@/type/Feed';
import styles from './index.module.scss';

export const TimeLineItem = memo<{ feed: Feed }>(({ feed }) => {
  return (
    <div key={feed.id} className={styles.container}>
      <div className={styles.author}>
        <div className={styles.avatar}>
          <LazyImage
            draggable={false}
            className="rounded select-none"
            src={feed.createBy.avatar}
            alt="用户头像"
          />
        </div>
        <div>
          <div className={classNames('text-lg', styles.nickname)}>{feed.createBy.nickname}</div>
          <div className="text-gray-600 text-xs cursor-text">{DateTimeFormat(feed.createAt)}</div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.text}>{feed.content}</div>
        {!!feed.assets?.length && (
          <div className={classNames(styles.assets)}>
            <ImagePreview images={feed.assets}>
              {feed.assets?.map((asset) => (
                <AssetImageThumbnail
                  containerClassName="rounded"
                  key={asset.id}
                  className={styles.img}
                  asset={asset}
                />
              ))}
            </ImagePreview>
          </div>
        )}
      </div>
    </div>
  );
});

TimeLineItem.displayName = 'TimeLineItem';
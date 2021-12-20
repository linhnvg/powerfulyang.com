import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import type { MotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import { assets } from '@powerfulyang/components';
import { useMountedRef } from '@powerfulyang/hooks';
import styles from './index.module.scss';

export type LazyImageExtendProps = {
  inViewAction?: (id?: number) => void;
  assetId?: number;
  blurSrc?: string;
  containerClassName?: string;
};

export const LazyImage: FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> &
    LazyImageExtendProps &
    MotionProps
> = ({ src, className, alt, inViewAction, assetId, blurSrc, containerClassName, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState('/transparent.png');
  const isMount = useMountedRef();
  useEffect(() => {
    if (blurSrc) {
      const image = new Image();
      image.src = blurSrc;
      image.onload = () => {
        if (isMount.current) {
          setImgUrl((prevState) => {
            if (prevState === '/transparent.png') {
              return blurSrc;
            }
            return prevState;
          });
        }
      };
    }
  }, [blurSrc, isMount]);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (src && ref.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const { target, intersectionRatio } = entry;

          if (intersectionRatio > 0) {
            const img = new Image();
            const source = src;
            inViewAction?.(assetId);
            img.onload = () => {
              if (isMount.current) {
                setImgUrl(source);
                setLoading(false);
              }
            };
            img.onerror = () => {
              if (isMount.current) {
                setLoading(false);
                setImgUrl(assets.brokenImg);
              }
            };
            img.src = source;
            observer.unobserve(target);
          }
        });
      });
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
    return () => {};
  }, [assetId, inViewAction, isMount, src]);

  return (
    <div className={classNames(containerClassName, 'w-full h-full overflow-hidden')}>
      <motion.img
        {...props}
        variants={{
          loading: {
            scale: 1.3,
            filter: 'blur(32px)',
            willChange: 'filter, scale',
          },
          loaded: {
            scale: 1,
            filter: 'blur(0px)',
            transition: {
              duration: 0.77,
            },
            willChange: 'scroll-position',
          },
        }}
        initial="loading"
        animate={!loading && 'loaded'}
        className={classNames(
          {
            [styles.loadedImg]: !loading,
            [styles.loadingImg]: loading,
          },
          'w-full h-full object-cover pointer',
          className,
        )}
        src={imgUrl}
        alt={alt}
        ref={ref}
      />
    </div>
  );
};

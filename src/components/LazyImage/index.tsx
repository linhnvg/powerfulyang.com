import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import type { HTMLMotionProps } from 'framer-motion';
import { motion, useIsomorphicLayoutEffect } from 'framer-motion';
import { Assets } from '@powerfulyang/components';
import { useMountedRef } from '@powerfulyang/hooks';
import styles from './index.module.scss';

export type LazyImageExtendProps = {
  blurSrc?: string;
  containerClassName?: string;
  /**
   * 是否需要加载动画
   */
  blur?: boolean;
  inViewCallback?: () => void;
};

export type LazyImageProps = HTMLMotionProps<'img'> & LazyImageExtendProps;

export const LazyImage: FC<LazyImageProps> = ({
  src,
  className = 'object-cover w-full',
  alt,
  blurSrc,
  containerClassName,
  blur = true,
  inViewCallback,
  ...props
}) => {
  const [loading, setLoading] = useState(() => {
    return !!blur;
  });
  const [imgUrl, setImgUrl] = useState(() => {
    if (blur) {
      return Assets.transparentImg;
    }
    return src;
  });
  const isMount = useMountedRef();
  useEffect(() => {
    if (blurSrc && blur) {
      const image = new Image();
      image.src = blurSrc;
      image.onload = () => {
        if (isMount.current) {
          setImgUrl((prevState) => {
            if (prevState === Assets.transparentImg) {
              return blurSrc;
            }
            return prevState;
          });
        }
      };
    }
  }, [blur, blurSrc, isMount]);
  const ref = useRef<HTMLImageElement>(null);
  useIsomorphicLayoutEffect(() => {
    if (src && ref.current && blur) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const { target, intersectionRatio } = entry;

          if (intersectionRatio > 0) {
            const img = new Image();
            const source = src;
            inViewCallback?.();
            img.onload = () => {
              if (isMount.current) {
                setImgUrl(source);
                setLoading(false);
              }
            };
            img.onerror = () => {
              if (isMount.current) {
                setLoading(false);
                setImgUrl(Assets.brokenImg);
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
  }, [blur, inViewCallback, isMount, src]);

  return (
    <span
      className={classNames(
        containerClassName,
        'pointer isolate block select-none overflow-hidden',
      )}
    >
      <motion.img
        {...props}
        draggable={false}
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
        initial={blur ? 'loading' : 'loaded'}
        animate={!loading && 'loaded'}
        className={classNames(
          {
            [styles.loadedImg]: !loading,
            [styles.loadingImg]: loading,
          },
          className,
        )}
        src={imgUrl}
        alt={alt}
        ref={ref}
      />
    </span>
  );
};

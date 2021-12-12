import { Icon } from '@powerfulyang/components';
import type { FC } from 'react';
import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type FooterProps = {
  pathViewCount?: number;
};
export const Footer: FC<FooterProps> = ({ pathViewCount }) => (
  <footer className={classNames(styles.footer)}>
    <div className="text-gray-400 text-sm hidden-xs">
      <span className="mr-1">备案号:</span>
      <a
        className="text-pink-400"
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noreferrer"
      >
        粤ICP备19128686号
      </a>
    </div>
    <div className="text-sm">
      <span>
        {`© ${new Date().getFullYear()} Power by `}
        <a
          href="https://github.com/powerfulyang/powerfulyang.com"
          target="_blank"
          rel="noreferrer"
          className="text-pink-400"
        >
          powerfulyang
        </a>
      </span>
    </div>
    <div className="text-sm flex items-baseline">
      <div className="hidden-xs text-pink-400 contents space-x-1">
        <Icon type="icon-view" className="self-center" />
        <span>{pathViewCount}人临幸</span>
      </div>
      <div className="text-gray-400 text-lg space-x-1 contents">
        <a className="ml-4" href="https://twitter.com/hutyxxx" target="_blank" rel="noreferrer">
          <Icon className={styles.twitter} type="icon-twitter" />
        </a>
        <a href="https://github.com/powerfulyang" target="_blank" rel="noreferrer">
          <Icon className={styles.github} type="icon-github" />
        </a>
        <a href="https://instagram.com/powerfulyang" target="_blank" rel="noreferrer">
          <Icon className={styles.instagram} type="icon-instagram" />
        </a>
      </div>
    </div>
  </footer>
);

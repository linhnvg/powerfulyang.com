import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Post } from '@/types/Post';
import { Link } from '@/components/Link';
import classNames from 'classnames';
import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { DateFormat } from '@/utils/lib';
import { Clock } from '@/components/Clock';
import { constants } from 'http2';
import styles from './index.module.scss';

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
};

const Index: LayoutFC<IndexProps> = ({ posts, years, year }) => {
  return (
    <div className={styles.body}>
      <Clock />
      <main className={styles.main}>
        <div className={styles.years}>
          {years.map((x) => (
            <Link key={x} to={`?year=${x}`}>
              <span className={classNames(styles.year)}>
                <span
                  className={classNames('pr-1', {
                    [`text-lg ${styles.active}`]: x === year,
                  })}
                >
                  #{x}
                </span>
              </span>
            </Link>
          ))}
        </div>
        <section className={classNames(styles.titles, 'mt-4')}>
          {posts.map((post) => {
            return (
              <div key={post.id} className="flex items-center">
                <span className="inline-block text-pink-400 whitespace-nowrap w-28 text-right">
                  {DateFormat(post.createAt)}
                </span>
                <Link className={classNames(styles.article_title)} to={`/post/${post.id}`}>
                  {post.title}
                </Link>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

Index.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  let isPublic = true;
  const t = await request('/user/current', { ctx });
  if (t.status === constants.HTTP_STATUS_OK) {
    isPublic = false;
  }
  const tmp = await request(isPublic ? '/public/post/years' : '/post/years', {
    ctx,
  });
  let { data: years } = await tmp.json();
  years = years.reverse();
  const year = query.year || years[0];
  const res = await request(isPublic ? '/public/post' : '/post', {
    ctx,
    query: { publishYear: year },
  });
  const { data, pathViewCount } = await res.json();

  return {
    props: {
      pathViewCount,
      years,
      posts: data,
      year,
    },
  };
};

export default Index;

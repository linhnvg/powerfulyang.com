import type { FC, ReactElement } from 'react';
import React, {
  Children,
  cloneElement,
  Fragment,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react';
import classNames from 'classnames';
import { useImmer } from '@powerfulyang/hooks';
import type { Asset } from '@/type/Asset';
import { ImagePreviewContext, ImagePreviewContextActionType } from '@/context/ImagePreviewContext';
import { InView } from 'react-intersection-observer';
import { fromEvent } from 'rxjs';
import { flushSync } from 'react-dom';

type MasonryItem = ReactElement<{ asset: Asset; tabIndex: number; onClick: () => void }>;

const getMapValueMinKey = (items: Map<number, number>): number => {
  const minValue = Math.min(...items.values());
  for (const [key, value] of items) {
    if (value <= minValue) {
      return key;
    }
  }
  return 0;
};

export type MasonryProps = {
  children: MasonryItem[];
  onLoadMore: () => void;
};

const Masonry: FC<MasonryProps> = ({ children, onLoadMore }) => {
  const id = useId();
  const rowHeight = useRef(new Map<number, number>());
  const handled = useRef(new Set<number>());
  const [masonry, setMasonry] = useImmer(() => new Map<number, Array<MasonryItem>>());

  const init = useCallback(() => {
    const clientColNum = Math.ceil(window.innerWidth / 420 + 2);
    flushSync(() => {
      rowHeight.current.clear();
      handled.current.clear();
      setMasonry((draft) => {
        draft.clear();
      });
    });
    setTimeout(() => {
      setMasonry((draft) => {
        for (let i = 0; i < clientColNum; i++) {
          draft.set(i, []);
          rowHeight.current.set(i, 0);
        }
      });
    });
  }, [setMasonry]);

  useEffect(() => {
    const subscribe = fromEvent(window, 'resize').subscribe(() => {
      init();
    });
    return () => {
      subscribe.unsubscribe();
    };
  }, [init, setMasonry]);

  useEffect(() => {
    handled.current.clear();
    rowHeight.current.clear();
    const clientColNum = Math.ceil(window.innerWidth / 420 + 2);
    setMasonry((draft) => {
      draft.clear();
      for (let i = 0; i < clientColNum; i++) {
        draft.set(i, []);
        rowHeight.current.set(i, 0);
      }
    });
  }, [setMasonry]);

  useEffect(() => {
    const container = document.getElementById(id);

    if (masonry.size && container) {
      const computedStyle = window.getComputedStyle(container);
      const padding = parseFloat(computedStyle.getPropertyValue('grid-gap'));
      const masonryWidth = parseFloat(computedStyle.getPropertyValue('width'));
      const handle = (draft: Map<number, MasonryItem[]>, child: MasonryItem) => {
        const has = handled.current.has(child.props.asset.id);
        if (!has) {
          handled.current.add(child.props.asset.id);
          const { size } = draft;
          const width = (masonryWidth - padding * (size + 1)) / size;
          const minHeightKey = getMapValueMinKey(rowHeight.current);
          const prev = rowHeight.current.get(minHeightKey) || 0;
          const height =
            (child.props.asset.size.height / child.props.asset.size.width) * width + padding;
          rowHeight.current.set(minHeightKey, prev + height);
          draft.get(minHeightKey)?.push(child);
        }
      };
      if (children.length - handled.current.size > 20) {
        const head = children.slice(0, 20);
        setMasonry((draft) => {
          head.forEach((child) => handle(draft, child));
        });
        // 缓一缓加载
        startTransition(() => {
          const tail = children.slice(20);
          setMasonry((draft) => {
            tail.forEach((child) => handle(draft, child));
          });
        });
      } else {
        setMasonry((draft) => {
          children.forEach((child) => handle(draft, child));
        });
      }
    }
  }, [children, setMasonry, masonry.size, id]);

  const { dispatch } = useContext(ImagePreviewContext);

  return (
    <div
      id={id}
      className={classNames('grid gap-2 px-2 sm:gap-4 sm:px-4')}
      style={{
        gridTemplateColumns: `repeat(${masonry.size}, 1fr)`,
      }}
    >
      {Array.from(masonry.keys()).map((mItem, index) => (
        <div className="my-4 flex flex-col space-y-2 sm:space-y-4" key={mItem}>
          {Children.map(masonry.get(mItem), (node, i) => {
            const isNeedLoadMore =
              index === getMapValueMinKey(rowHeight.current) &&
              i + 1 === masonry.get(mItem)?.length; // 可能出现超长图片的情况，所以监听能看到的最短一列最好
            const onClick = () => {
              dispatch({
                type: ImagePreviewContextActionType.open,
                payload: {
                  selectIndex: node?.props.tabIndex,
                },
              });
            };
            return (
              node && (
                <Fragment key={node.props.asset.id}>
                  {cloneElement(node, {
                    onClick,
                  })}
                  {isNeedLoadMore && (
                    <InView
                      as="span"
                      triggerOnce
                      onChange={(inView) => {
                        inView && onLoadMore();
                      }}
                      rootMargin="400px"
                    />
                  )}
                </Fragment>
              )
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Masonry;

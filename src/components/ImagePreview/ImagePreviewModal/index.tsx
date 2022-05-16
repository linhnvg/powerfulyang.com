import type { FC } from 'react';
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useLockScroll, usePortal } from '@powerfulyang/hooks';
import { isDefined, scrollIntoView } from '@powerfulyang/utils';
import { useIsomorphicLayoutEffect } from 'framer-motion';
import { ImageViewContent } from '@/components/ImagePreview/ImagePreviewModal/ImageViewContent';
import { ImagePreviewContext } from '@/context/ImagePreviewContext';
import { useHiddenHtmlOverflow } from '@/hooks/useHiddenHtmlOverflow';

type ImagePreviewModalProps = {
  parentNode?: HTMLElement;
};

const ImagePreviewModal: FC<ImagePreviewModalProps> = ({ parentNode }) => {
  const dialogNode = useRef<HTMLElement>();
  const createPortal = useCallback(() => {
    dialogNode.current = document.createElement('section');
    return dialogNode.current;
  }, []);
  const Portal = usePortal(createPortal);
  const {
    state: { selectIndex, images },
  } = useContext(ImagePreviewContext);
  const showModal = useMemo(() => isDefined(selectIndex), [selectIndex]);
  useLockScroll(showModal);
  useHiddenHtmlOverflow(showModal);
  useIsomorphicLayoutEffect(() => {
    if (showModal && dialogNode.current) {
      const dialog = dialogNode.current;
      const parent = parentNode || document.body;
      parent.appendChild(dialog);
      return () => {
        parent.removeChild(dialog);
      };
    }
    return () => {};
  }, [parentNode, showModal]);

  useEffect(() => {
    if (isDefined(images) && isDefined(selectIndex)) {
      const { id } = images[selectIndex];
      if (id) {
        scrollIntoView(document.getElementById(id), {
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [images, selectIndex]);

  return (
    <Portal>
      <ImageViewContent />
    </Portal>
  );
};

export default ImagePreviewModal;

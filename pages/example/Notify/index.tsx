import { useEffect } from 'react';
import { notification } from '@/components/Notification';

const Notify = () => {
  useEffect(() => {
    notification.success({ title: '你好好!' });
    notification.error({ title: '你坏坏!' });
    notification.warn({ title: '你注意!' });
  });
  return <></>;
};

export default Notify;
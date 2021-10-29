import type { User } from '@/type/User';
import type { Asset } from '@/type/Asset';

type PathViewCount = {
  pathViewCount: number;
};

export interface Post extends PathViewCount {
  id: number;
  title: string;
  content: string;
  createBy: User;
  tags: string[];
  createAt: Date;
  updateAt: Date;
  poster: Asset;
}

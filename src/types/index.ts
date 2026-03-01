import type { InferSelectModel } from 'drizzle-orm';
import type {
  users,
  tenants,
  menus,
  categories,
  items,
  translations,
} from '@/lib/db/schema';

export type User = InferSelectModel<typeof users>;
export type Tenant = InferSelectModel<typeof tenants>;
export type Menu = InferSelectModel<typeof menus>;
export type Category = InferSelectModel<typeof categories>;
export type Item = InferSelectModel<typeof items>;
export type Translation = InferSelectModel<typeof translations>;

export type MenuWithCategories = Menu & {
  categories: CategoryWithItems[];
};

export type CategoryWithItems = Category & {
  items: Item[];
};

import type { Metadata } from 'next';
import PageFrame from '@/components/layout/PageFrame';
import AdminNews from '@/features/admin/AdminNews';
import { pageMeta } from '@/lib/seo';
import '@/styles/site.css';
import '@/styles/admin.css';

export const metadata: Metadata = pageMeta({
  title: 'Admin | Averix Games',
  description: 'Private area for managing Averix Games news, events, games, music, team, characters and site settings.',
  path: '/admin',
  noindex: true,
});

export default function AdminPage() {
  return (
    <PageFrame page="site">
      <AdminNews />
    </PageFrame>
  );
}

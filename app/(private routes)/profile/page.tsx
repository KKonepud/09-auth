import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getMe } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'Your NoteHub profile',
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <span>Username:</span>
            <span>{user.username}</span>
          </div>

          <div>
            <span>Email: </span>
            <span>{user.email}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

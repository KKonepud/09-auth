'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
  const router = useRouter();

  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  const [username, setUsername] = useState(user?.username ?? '');

  if (!user) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const updatedUser = await updateMe(username);

      setUser(updatedUser);
      router.push('/profile');
    } catch {
      console.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit profile</h1>

        <Image
          src={user.avatar}
          alt="User avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form onSubmit={handleSubmit}>
          <div className={css.profileInfo}>
            <div className={css.usernameWrapper}>
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={event => setUsername(event.target.value)}
                className={css.input}
                required
              />
            </div>

            <p>Email: {user.email}</p>
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={handleCancel}>
              Cancel
            </button>

            <button type="submit" className={css.saveButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

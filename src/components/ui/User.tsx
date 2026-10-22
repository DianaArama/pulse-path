'use client';

import { getProfileSummaries } from '@/data/profile';
import { useActiveProfile } from '@/lib/store/use-active-profile';
import type { ProfileSummary } from '@/types/profile';
import { useRouter } from 'next/navigation';
import {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { createPortal } from 'react-dom';

const User = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const activeUser = useActiveProfile((state) => state.activeProfile);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const profiles = getProfileSummaries();
  const setUser = useActiveProfile((state) => state.setActiveProfile);
  const resolvedProfileId = activeUser?.id ?? '';

  const handleChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const profileId = event.target.value;
    setUser(profileId);
    try {
      if (activeUser) {
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) {
      return;
    }

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      setMenuPosition({
        top: rect.bottom + 10,
        left: Math.min(rect.right - 224, window.innerWidth - 240),
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (!target) {
        return;
      }

      const isInsideWrapper = wrapperRef.current?.contains(target);
      const isInsidePortal = portalRef.current?.contains(target);

      if (!isInsideWrapper && !isInsidePortal) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const initials = activeUser
    ? activeUser?.profile?.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'PP';

  return (
    <div ref={wrapperRef} className='relative z-100'>
      <button
        ref={buttonRef}
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className='flex h-11 items-center gap-3 rounded-full border border-[rgba(79,111,53,0.22)] bg-[rgba(79,111,53,0.08)] px-3 pr-4 shadow-sm transition hover:border-[rgba(79,111,53,0.35)] hover:bg-[rgba(79,111,53,0.14)] hover:shadow-md'
      >
        <span className='flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(79,111,53,0.88)] text-xs font-bold text-white'>
          {initials}
        </span>
        <span className='hidden text-left sm:block'>
          <span className='block text-xs font-semibold leading-4 text-[#6d665f]'>
            Active user
          </span>
          <span className='block text-sm font-semibold leading-4 text-[#1e1a17]'>
            {activeUser?.profile?.name ?? 'Loading'}
          </span>
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={portalRef}
            onPointerDown={(event) => event.stopPropagation()}
            className='fixed z-10000 w-56 rounded-[22px] border border-[#e6d8ca] bg-white p-4 shadow-[0_18px_40px_rgba(126,74,35,0.10)]'
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#4f6f35]'>
              Current profile
            </p>
            <div className='relative mt-3'>
              <select
                value={resolvedProfileId}
                onChange={handleChange}
                disabled={isPending}
                name='profile'
                className='w-full appearance-none rounded-xl border border-[#e6d8ca] bg-white px-3 py-2 pr-10 text-sm font-medium text-[#1e1a17] outline-none transition focus:border-[#4f6f35] focus:bg-white focus:ring-2 focus:ring-[rgba(79,111,53,0.18)] disabled:cursor-not-allowed disabled:opacity-70'
              >
                {profiles.map((profile: ProfileSummary) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
              <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#4f6f35]'>
                <svg
                  viewBox='0 0 20 20'
                  className='h-4 w-4 fill-current'
                  aria-hidden='true'
                >
                  <path d='M5.5 7.5 10 12l4.5-4.5 1.4 1.4L10 14.8 4.1 8.9z' />
                </svg>
              </span>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default User;

import { UserRound } from 'lucide-react'
import { profile } from '../../data/profile'

export function ProfileAvatar({ large = false }: { large?: boolean }) {
  return (
    <span className={`profile-avatar${large ? ' large' : ''}${profile.photo ? ' has-photo' : ''}`}>
      {profile.photo ? (
        <img
          src={profile.photo}
          alt={profile.name ? `${profile.name} 프로필 사진` : '프로필 사진'}
          width={419}
          height={537}
        />
      ) : (
        <UserRound size={large ? 34 : 27} strokeWidth={1.5} aria-hidden="true" />
      )}
    </span>
  )
}

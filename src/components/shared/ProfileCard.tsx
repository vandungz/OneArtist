interface ProfileCardProps {
    /**
     * Avatar URL from Supabase Storage
     * Example: getStorageUrl('artist_assets', 'avatars/profile.jpg')
     */
    avatarUrl?: string
    name: string
    role?: string
    bio?: string
}

export function ProfileCard({
    avatarUrl,
    name,
    role = 'Artist',
    bio
}: ProfileCardProps) {
    return (
        <div className="home-card-info">
            <div className="home-card-info_profile">
                {/* Avatar */}
                {avatarUrl ? (
                    <img className="home-card-info_ava" src={avatarUrl} alt={name} />
                ) : (
                    <div
                        className="home-card-info_ava"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {name.charAt(0)}
                    </div>
                )}

                <div className="home-card-info_name">
                    <h5>{name}</h5>
                    <p className="meta">{role}</p>
                </div>
            </div>

            {bio && (
                <div className="home-card-info_bio">
                    <p>{bio}</p>
                </div>
            )}
        </div>
    )
}

import Link from 'next/link'
import type { AwardData } from '@/services/awards'

// Arrow icon pointing up-right (rotated)
const ArrowIcon = () => (
    <svg className="arrow-up-right" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21L17 16M12 21L7 16M12 21V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

interface AwardItemProps {
    award: AwardData
}

function AwardItem({ award }: AwardItemProps) {
    const content = (
        <div className="work-items--container">
            <div className="work-items--title">
                <h5>{award.title}</h5>
            </div>
            <div className="work-items--description">
                <p className="meta">{award.type}</p>
                <p className="meta">{award.year}</p>
            </div>
            <ArrowIcon />
        </div>
    )

    return (
        <li className="work-items">
            {award.url ? (
                <Link href={award.url} target="_blank" rel="noopener noreferrer">
                    {content}
                </Link>
            ) : (
                content
            )}
        </li>
    )
}

interface AwardsSectionProps {
    awards: AwardData[]
    title?: string
    description?: string
}

export function AwardsSection({ 
    awards, 
    title = "Awards & Recognitions",
    description = "Honored to receive multiple awards for excellence, recognizing creative vision and commitment to the craft."
}: AwardsSectionProps) {
    return (
        <div className="award-section">
            <div className="award-section--header">
                <div className="award-header--title">
                    <h2>{title.split(' & ').map((part, index) => (
                        <span key={index}>
                            {part}
                            {index === 0 && <br />}
                            {index === 0 && '& '}
                        </span>
                    ))}</h2>
                </div>
                <div className="award-header--text">
                    <p>{description}</p>
                </div>
            </div>
            <div className="work-wrapper">
                <ul className="work-section">
                    {awards.map((award) => (
                        <AwardItem key={award.id} award={award} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

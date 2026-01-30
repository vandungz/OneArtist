interface AboutDetailProps {
    title?: string
    paragraphs: string[]
}

export function AboutDetail({ 
    title = "About",
    paragraphs 
}: AboutDetailProps) {
    return (
        <div className="about-card--detail">
            <div className="about-card--title">
                <h2>{title}</h2>
            </div>
            <div className="about-card--text">
                {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </div>
    )
}

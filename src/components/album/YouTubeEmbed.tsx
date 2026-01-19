interface YouTubeEmbedProps {
    videoId: string
    title: string
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
    return (
        <div className="youtube-embed">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </div>
    )
}

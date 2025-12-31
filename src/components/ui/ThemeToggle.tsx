'use client'

import { useTheme } from '@/providers/ThemeProvider'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Render a placeholder during SSR and initial hydration
    if (!mounted) {
        return (
            <label className="switch">
                <input type="checkbox" disabled aria-label="Toggle theme" />
                <span className="slider round"></span>
            </label>
        )
    }

    return <ThemeToggleInner />
}

// Separate component that uses the theme context
function ThemeToggleInner() {
    const { theme, toggleTheme } = useTheme()

    return (
        <label className="switch">
            <input
                type="checkbox"
                checked={theme === 'light'}
                onChange={toggleTheme}
                aria-label="Toggle theme"
            />
            <span className="slider round"></span>
        </label>
    )
}

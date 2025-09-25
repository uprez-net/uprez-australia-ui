"use client"

import { useEffect, useState } from "react"

interface ScrollSpyOptions {
  offset?: number
  rootMargin?: string
  container?: string
}

export function useScrollSpy(sectionIds: string[], options: ScrollSpyOptions = {}) {
  const [activeSection, setActiveSection] = useState<string>("")
  const { offset = 100, rootMargin = "0px 0px -80% 0px", container = "document-container" } = options

  useEffect(() => {
    const scrollContainer = document.getElementById(container)
    if (!scrollContainer) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        root: scrollContainer, // Use custom container as root
        rootMargin,
        threshold: 0.1,
      },
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [sectionIds, rootMargin, container])

  return activeSection
}

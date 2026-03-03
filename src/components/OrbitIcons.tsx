'use client';

import { useEffect, useRef } from 'react';
import { usePreferences } from '@/contexts/PreferencesContext';

const ICONS = [
    'fa-user-plus',
    'fa-heart',
    'fa-comment',
    'fa-share-nodes',
    'fa-eye',
    'fa-thumbs-up',
];

// Elliptical orbit: radiusX wide, radiusY shorter → looks like a tilted ring
const RADIUS_X = 190; // half of container width
const RADIUS_Y = 65;  // flattened vertically for depth
const SPEED = 0.0004; // radians per ms (~15s per full orbit)

export default function OrbitIcons() {
    const containerRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number>(0);
    const { theme } = usePreferences();

    useEffect(() => {
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const baseAngle = elapsed * SPEED;

            const icons = containerRef.current?.children;
            if (!icons) return;

            for (let i = 0; i < icons.length; i++) {
                const angle = baseAngle + (i * (2 * Math.PI)) / ICONS.length;
                // Elliptical position
                const ex = Math.cos(angle) * RADIUS_X;
                const ey = Math.sin(angle) * RADIUS_Y;

                // Rotate the ellipse 45 degrees
                const rot = Math.PI / 4; // 45°
                const x = ex * Math.cos(rot) - ey * Math.sin(rot);
                const y = ex * Math.sin(rot) + ey * Math.cos(rot);

                // z-ordering: icons at bottom of ellipse are "in front" (larger, brighter)
                const depth = Math.sin(angle); // -1 to 1
                const scale = 0.75 + 0.25 * (depth + 1) / 2; // 0.75 to 1.0
                const opacity = 0.6 + 0.4 * (depth + 1) / 2; // 0.6 to 1.0
                const zIndex = depth > 0 ? 30 : 5; // in front or behind planet

                const el = icons[i] as HTMLElement;
                el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
                el.style.opacity = `${opacity}`;
                el.style.zIndex = `${zIndex}`;
            }

            animRef.current = requestAnimationFrame(animate);
        };

        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute"
            style={{ top: '50%', left: '50%', width: 0, height: 0 }}
        >
            {ICONS.map((icon, index) => (
                <div
                    key={index}
                    className={`absolute w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-brand-accent/70 flex items-center justify-center transition-opacity duration-300 ${theme === 'dark'
                            ? 'bg-[#111]/90 shadow-[0_0_25px_rgba(236,57,44,0.4),0_4px_12px_rgba(0,0,0,0.8)]'
                            : 'bg-gradient-to-br from-orange-100 to-orange-200 shadow-[0_0_20px_rgba(236,57,44,0.25),0_4px_12px_rgba(236,57,44,0.15)]'
                        }`}
                    style={{ marginLeft: '-24px', marginTop: '-24px' }}
                >
                    <i className={`fa-solid ${icon} text-base md:text-lg ${theme === 'dark' ? 'text-white' : 'text-brand-accent'}`}></i>
                </div>
            ))}
        </div>
    );
}

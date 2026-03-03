"use client";

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ViewCounter({ postId, initialCount }: { postId: string, initialCount: number }) {
    useEffect(() => {
        const incrementView = async () => {
            const supabase = createClient();
            await supabase.from('blog_posts').update({ view_count: initialCount + 1 }).eq('id', postId);
        };
        incrementView();
    }, [postId, initialCount]);

    return null;
}

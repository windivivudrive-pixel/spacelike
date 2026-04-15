-- Add SEO fields to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS focus_keyword TEXT;

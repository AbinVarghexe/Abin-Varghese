-- Migration: Achievements and LinkedIn Sync Schema

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  date timestamp with time zone,
  category text,
  image_url text,
  external_link text,
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup RLS for achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to achievements
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.achievements FOR SELECT
  USING (true);

-- Allow authenticated users to manage achievements
CREATE POLICY "Users can insert their own achievements."
  ON public.achievements FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own achievements."
  ON public.achievements FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own achievements."
  ON public.achievements FOR DELETE
  USING (auth.role() = 'authenticated');

-- LinkedIn Data will be stored in the existing site_content table
-- Key: linkedin_sync_data (JSON text)

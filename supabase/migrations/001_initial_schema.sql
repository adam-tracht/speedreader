-- SpeedReader Phase 3: Library & Persistence Schema
-- This migration creates the tables for saving texts and tracking reading history

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create saved_texts table
CREATE TABLE IF NOT EXISTS saved_texts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_url TEXT,
    word_count INTEGER NOT NULL,
    current_position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reading_history table
CREATE TABLE IF NOT EXISTS reading_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    saved_text_id UUID REFERENCES saved_texts(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    words_read INTEGER NOT NULL,
    wpm INTEGER,
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_texts_user_id ON saved_texts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_texts_created_at ON saved_texts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_history_user_id ON reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_created_at ON reading_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_history_saved_text_id ON reading_history(saved_text_id);

-- Enable Row Level Security (RLS)
ALTER TABLE saved_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved_texts
-- Users can view only their own saved texts
CREATE POLICY "Users can view own saved texts"
    ON saved_texts FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own saved texts
CREATE POLICY "Users can insert own saved texts"
    ON saved_texts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved texts
CREATE POLICY "Users can update own saved texts"
    ON saved_texts FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own saved texts
CREATE POLICY "Users can delete own saved texts"
    ON saved_texts FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for reading_history
-- Users can view only their own reading history
CREATE POLICY "Users can view own reading history"
    ON reading_history FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own reading history
CREATE POLICY "Users can insert own reading history"
    ON reading_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own reading history
CREATE POLICY "Users can update own reading history"
    ON reading_history FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own reading history
CREATE POLICY "Users can delete own reading history"
    ON reading_history FOR DELETE
    USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_saved_texts_updated_at ON saved_texts;
CREATE TRIGGER update_saved_texts_updated_at
    BEFORE UPDATE ON saved_texts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a helper function to get total words read for a user
CREATE OR REPLACE FUNCTION get_total_words_read(p_user_id UUID)
RETURNS INTEGER AS $$
    SELECT COALESCE(SUM(words_read), 0)
    FROM reading_history
    WHERE user_id = p_user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Create a view for reading statistics
CREATE OR REPLACE VIEW user_reading_stats AS
SELECT
    user_id,
    COUNT(*) as total_sessions,
    SUM(words_read) as total_words_read,
    AVG(wpm) as avg_wpm,
    SUM(duration_seconds) as total_duration_seconds
FROM reading_history
GROUP BY user_id;

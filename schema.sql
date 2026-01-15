-- 0. 确保 UUID 扩展和权限
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 创建设置表 (Settings)
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    salary_per_hour NUMERIC NOT NULL DEFAULT 45.0,
    is_dark_mode BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认设置
INSERT INTO settings (id, salary_per_hour, is_dark_mode)
VALUES ('default', 45.0, false)
ON CONFLICT (id) DO NOTHING;

-- 2. 创建摸鱼记录表 (Records)
CREATE TABLE IF NOT EXISTS records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    date DATE NOT NULL,
    duration TEXT NOT NULL,
    earnings NUMERIC NOT NULL,
    activity_icon TEXT,
    activity_color TEXT,
    mood TEXT
);

-- 2.1 迁移：如果 mood 列不存在则添加
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='records' AND column_name='mood') THEN
        ALTER TABLE records ADD COLUMN mood TEXT;
    END IF;
END $$;

-- 关闭 RLS (如果是本地开发或测试)
ALTER TABLE records DISABLE ROW LEVEL SECURITY;
ALTER TABLE badges DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- 3. 创建勋章表 (Badges)
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT,
    unlocked BOOLEAN DEFAULT false,
    unlock_date TIMESTAMPTZ,
    is_new BOOLEAN DEFAULT false
);

-- 3.1 迁移：清理重复数据并强制添加唯一约束
DO $$ 
BEGIN 
    -- 尝试清理重复数据 (保留 ID 最小的一个)
    DELETE FROM badges a USING badges b
    WHERE a.name = b.name AND a.id > b.id;

    -- 检查并添加唯一约束
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='badges' AND constraint_name='badges_name_key') THEN
        ALTER TABLE badges ADD CONSTRAINT badges_name_key UNIQUE (name);
    END IF;
END $$;

-- 插入初始勋章数据 (使用 ON CONFLICT 更新防止重复)
INSERT INTO badges (name, description, icon, color, unlocked) VALUES
('带薪拉屎王', '单次摸鱼超过 20 分钟', 'soap', 'text-blue-400', false),
('摸鱼全勤奖', '连续 7 天记录摸鱼时长', 'verified', 'text-orange-400', false),
('太空漫游', '累计摸鱼时间达到 10 小时', 'rocket_launch', 'text-purple-400', false),
('咖啡因崩溃', '单次摸鱼时长超过 2 小时', 'coffee', 'text-brown-400', false)
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color;

INSERT INTO admin_users (id, email, role, is_active)
VALUES
  ('admin_1', 'carmen@hypervision-led.com', 'admin', 1),
  ('admin_1', 'jiyeyuran@gmail.com', 'admin', 1),
  ('editor_1', 'info@hypervision-led.com', 'editor', 1)
ON CONFLICT(email) DO UPDATE SET role = excluded.role, is_active = excluded.is_active;

INSERT INTO products (
  id, slug, title_en, title_zh, excerpt_en, excerpt_zh, content_en, content_zh, cover_image, brochure_key, sort_order
)
VALUES
  (
    'prod_1',
    'indoor-fine-pitch-series',
    'Indoor Fine Pitch Series',
    '室内小间距系列',
    'Ultra high refresh indoor LED panel for boardroom and command center.',
    '适用于会议室与指挥中心的高刷新室内 LED 屏。',
    '<p>Pixel pitch: P1.2/P1.5/P1.8. Die-cast aluminum cabinet with front maintenance design.</p>',
    '<p>点间距：P1.2/P1.5/P1.8。压铸铝箱体，支持前维护。</p>',
    '/images/products/indoor-fine-pitch.jpg',
    'brochures/indoor-fine-pitch.pdf',
    10
  ),
  (
    'prod_2',
    'outdoor-energy-saving-series',
    'Outdoor Energy Saving Series',
    '户外节能系列',
    'High brightness and low power consumption for DOOH projects.',
    '高亮低功耗，适用于户外广告项目。',
    '<p>Common anode design, IP65 protection, 6500 nits optional.</p>',
    '<p>共阳设计，IP65 防护，最高亮度可达 6500nits。</p>',
    '/images/products/outdoor-energy-saving.jpg',
    'brochures/outdoor-energy-saving.pdf',
    20
  )
ON CONFLICT(slug) DO UPDATE SET
  title_en = excluded.title_en,
  title_zh = excluded.title_zh,
  excerpt_en = excluded.excerpt_en,
  excerpt_zh = excluded.excerpt_zh,
  content_en = excluded.content_en,
  content_zh = excluded.content_zh,
  cover_image = excluded.cover_image,
  brochure_key = excluded.brochure_key,
  sort_order = excluded.sort_order;

INSERT INTO blog_posts (
  id, slug, title_en, title_zh, excerpt_en, excerpt_zh, content_en, content_zh, cover_image, published_at
)
VALUES
  (
    'blog_1',
    'how-to-select-led-display-for-retail',
    'How to Select LED Display for Retail Stores',
    '零售场景如何选择 LED 显示屏',
    'A practical guide for brightness, pixel pitch, and maintenance strategy.',
    '从亮度、点间距到维护策略的实用选择指南。',
    '<p>Retail display should balance viewing distance, ambient light, and maintenance cost.</p>',
    '<p>零售屏选型应平衡观看距离、环境光和维护成本。</p>',
    '/images/blog/retail-selection.jpg',
    '2026-03-01 10:00:00'
  ),
  (
    'blog_2',
    'led-display-maintenance-checklist',
    'LED Display Preventive Maintenance Checklist',
    'LED 屏预防性维护清单',
    'Monthly maintenance workflow to reduce downtime in projects.',
    '通过月度维护流程降低项目停机时间。',
    '<p>Build a monthly SOP including cabinet inspection, power supply checks, and color calibration.</p>',
    '<p>建立月度 SOP，包含箱体检查、电源检查与色彩校准。</p>',
    '/images/blog/maintenance-checklist.jpg',
    '2026-03-05 10:00:00'
  )
ON CONFLICT(slug) DO UPDATE SET
  title_en = excluded.title_en,
  title_zh = excluded.title_zh,
  excerpt_en = excluded.excerpt_en,
  excerpt_zh = excluded.excerpt_zh,
  content_en = excluded.content_en,
  content_zh = excluded.content_zh,
  cover_image = excluded.cover_image,
  published_at = excluded.published_at;

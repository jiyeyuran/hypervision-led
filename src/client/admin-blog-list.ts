export interface AdminBlogRow {
  id: string;
  slug: string;
  title_en: string;
  title_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  cover_image: string | null;
  is_published: number;
  published_at: string;
  updated_at: string;
}

export function initAdminBlogList() {
  const tableEl = document.getElementById('blog-table');
  if (!tableEl) return;

  async function load() {
    tableEl!.innerHTML = '<p class="p-4 text-sm text-[var(--text-subtle)]">Loading...</p>';
    const resp = await fetch('/api/admin/blog');
    const payload = (await resp.json()) as {
      message?: string;
      data?: { rows: AdminBlogRow[] };
    };
    if (!resp.ok || !payload.data) {
      tableEl!.innerHTML = `<p class="p-4 text-sm text-red-600">${payload.message ?? 'Failed to load'}</p>`;
      return;
    }
    const rows = payload.data.rows;
    if (rows.length === 0) {
      tableEl!.innerHTML =
        '<p class="p-4 text-sm text-[var(--text-subtle)]">No blog posts yet. Click "New Post" to create one.</p>';
      return;
    }
    let tbody = '';
    for (const row of rows) {
      const statusBadge =
        row.is_published === 1
          ? '<span class="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Published</span>'
          : '<span class="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Draft</span>';
      const cover = row.cover_image
        ? `<img src="${row.cover_image}" alt="" class="h-10 w-16 rounded object-cover" />`
        : '<span class="text-xs text-[var(--text-subtle)]">—</span>';
      tbody += `
        <tr class="border-b border-[var(--border)]">
          <td class="p-3">${cover}</td>
          <td class="p-3">
            <div class="font-medium">${escapeHtml(row.title_en)}</div>
            <div class="text-xs text-[var(--text-subtle)]">${escapeHtml(row.title_zh)}</div>
            <div class="mt-1 text-xs text-[var(--text-subtle)]">/${escapeHtml(row.slug)}</div>
          </td>
          <td class="p-3">${statusBadge}</td>
          <td class="p-3 text-xs text-[var(--text-subtle)]">${row.published_at.slice(0, 16)}</td>
          <td class="p-3 text-right">
            <a class="mr-3 text-sm font-medium text-[var(--brand)]" href="/admin/blog/${row.id}">Edit</a>
            <a class="mr-3 text-sm text-[var(--text-subtle)]" href="/blog/${row.slug}" target="_blank" rel="noreferrer">View</a>
            <button data-action="delete" data-id="${row.id}" class="text-sm text-red-600">Delete</button>
          </td>
        </tr>`;
    }
    tableEl!.innerHTML = `
      <table class="w-full text-left text-sm">
        <thead class="bg-[var(--bg-soft)] text-xs uppercase tracking-wide text-[var(--text-subtle)]">
          <tr>
            <th class="p-3">Cover</th>
            <th class="p-3">Title / Slug</th>
            <th class="p-3">Status</th>
            <th class="p-3">Published</th>
            <th class="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>${tbody}</tbody>
      </table>`;
  }

  tableEl.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action !== 'delete') return;
    const id = target.dataset.id;
    if (!id) return;
    if (!confirm('Delete this blog post? This cannot be undone.')) return;
    const resp = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    if (!resp.ok) {
      const payload = (await resp.json().catch(() => ({}))) as { message?: string };
      alert(payload.message ?? 'Delete failed');
      return;
    }
    load();
  });

  load();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

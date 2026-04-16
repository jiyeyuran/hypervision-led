export function initAdminInquiryList() {
  const table = document.getElementById('table');
  const form = document.getElementById('filter-form');

  async function fetchList(params = new URLSearchParams()) {
    if (!table) return;
    const response = await fetch(`/api/admin/inquiries?${params.toString()}`);
    const payload = (await response.json()) as {
      message?: string;
      data: { rows: Array<Record<string, string>> };
    };
    if (!response.ok) {
      table.innerHTML = `<p class="p-4 text-red-600">${payload.message ?? 'Failed to load'}</p>`;
      return;
    }

    let rows = '';
    for (const row of payload.data.rows) {
      rows += `
        <tr class="border-b border-[var(--border)]">
          <td class="p-3">${row.id}</td>
          <td class="p-3">${row.company}</td>
          <td class="p-3">${row.name}</td>
          <td class="p-3">${row.email}</td>
          <td class="p-3">${row.status}</td>
          <td class="p-3">${row.created_at.slice(0, 19)}</td>
          <td class="p-3"><a class="text-[var(--brand)]" href="/admin/inquiries/${row.id}">Detail</a></td>
        </tr>
      `;
    }

    table.innerHTML = `
      <table class="w-full text-left text-sm">
        <thead class="bg-[var(--bg-soft)]">
          <tr>
            <th class="p-3">ID</th>
            <th class="p-3">Company</th>
            <th class="p-3">Name</th>
            <th class="p-3">Email</th>
            <th class="p-3">Status</th>
            <th class="p-3">Created</th>
            <th class="p-3">Action</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const target = event.currentTarget;
    if (!(target instanceof HTMLFormElement)) return;
    const data = new FormData(target);
    const params = new URLSearchParams();
    data.forEach((value, key) => {
      params.append(key, String(value));
    });
    fetchList(params);
  });

  fetchList();
}

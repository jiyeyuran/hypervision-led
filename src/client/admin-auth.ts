import { CF_ACCESS_TEAM_DOMAIN } from '../lib/access-config';

interface AdminMeResponse {
  success?: boolean;
  data?: { email: string; role: 'admin' | 'editor' | 'viewer' };
  message?: string;
}

function buildAccessLoginUrl(): string {
  const redirect = encodeURIComponent(window.location.href);
  return `https://${CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/login/${window.location.hostname}?redirect_url=${redirect}`;
}

function buildAccessLogoutUrl(): string {
  const redirect = encodeURIComponent(window.location.href);
  return `/cdn-cgi/access/logout?returnTo=${redirect}`;
}

export interface AdminAuthGateOptions {
  bannerId: string;
  protectedSelectors?: string[];
}

/**
 * 在 admin 页面加载时调用。
 *
 * - 未登录（/api/admin/me 返回 401/403）：在 `bannerId` 区域展示登录卡片，同时隐藏 `protectedSelectors` 匹配的元素；
 * - 已登录：展示用户邮箱 + 角色 + "Sign out" 链接；
 * - 其它错误：展示重试提示，仍然隐藏受保护内容。
 */
export function initAdminAuthGate(options: AdminAuthGateOptions) {
  const banner = document.getElementById(options.bannerId);
  if (!banner) return;

  const protectedEls = (options.protectedSelectors ?? []).flatMap((selector) =>
    Array.from(document.querySelectorAll<HTMLElement>(selector)),
  );

  function hideProtected() {
    for (const el of protectedEls) el.classList.add('hidden');
  }

  function showProtected() {
    for (const el of protectedEls) el.classList.remove('hidden');
  }

  function renderSignedIn(email: string, role: string) {
    if (!banner) return;
    banner.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm">
        <span>
          Signed in as <strong>${email}</strong>
          <span class="ml-1 rounded bg-[var(--bg)] px-2 py-0.5 text-xs uppercase tracking-wide text-[var(--text-subtle)]">${role}</span>
        </span>
        <a class="text-[var(--brand)] hover:underline" href="${buildAccessLogoutUrl()}">Sign out</a>
      </div>
    `;
    showProtected();
  }

  function renderSignInPrompt(message?: string) {
    if (!banner) return;
    hideProtected();
    banner.innerHTML = `
      <div class="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
        <h2 class="text-base font-semibold">You are not signed in</h2>
        <p class="mt-1">
          ${message ?? 'This console is protected by Cloudflare Access. Please sign in with an authorized email.'}
        </p>
        <div class="mt-3 flex flex-wrap gap-2">
          <a
            class="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-2 font-semibold text-white hover:opacity-90"
            href="${buildAccessLoginUrl()}"
          >Sign in with Cloudflare Access</a>
          <a
            class="inline-flex items-center gap-2 rounded-lg border border-amber-300 px-4 py-2 font-semibold hover:bg-white"
            href="${buildAccessLogoutUrl()}"
          >Reset session</a>
        </div>
      </div>
    `;
  }

  hideProtected();
  banner.innerHTML =
    '<p class="text-sm text-[var(--text-subtle)]">Checking Cloudflare Access session…</p>';

  fetch('/api/admin/me', { credentials: 'include' })
    .then(async (response) => {
      if (response.status === 401 || response.status === 403) {
        let payload: AdminMeResponse | null = null;
        try {
          payload = (await response.json()) as AdminMeResponse;
        } catch {
          /* ignore */
        }
        renderSignInPrompt(payload?.message);
        return;
      }
      if (!response.ok) {
        renderSignInPrompt(`Failed to verify session (HTTP ${response.status}).`);
        return;
      }
      const payload = (await response.json()) as AdminMeResponse;
      if (!payload.data) {
        renderSignInPrompt(payload.message);
        return;
      }
      renderSignedIn(payload.data.email, payload.data.role);
    })
    .catch(() => {
      renderSignInPrompt('Network error while checking Cloudflare Access session.');
    });
}

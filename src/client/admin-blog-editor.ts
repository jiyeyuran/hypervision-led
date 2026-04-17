import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/regular.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';

export interface BlogFormData {
  slug: string;
  title_en: string;
  title_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  content_en: string;
  content_zh: string;
  cover_image: string | null;
  is_published: boolean;
  published_at: string | null;
}

interface InitOptions {
  mode: 'create' | 'edit';
  blogId?: string;
}

function imageUploadFunction(
  file: File,
  onSuccess: (url: string) => void,
  onError: (error: string) => void,
) {
  const form = new FormData();
  form.set('file', file);
  form.set('folder', 'blog');
  fetch('/api/admin/upload', { method: 'POST', body: form })
    .then(async (resp) => {
      const payload = (await resp.json().catch(() => ({}))) as {
        message?: string;
        data?: { url: string };
      };
      if (!resp.ok || !payload.data) {
        onError(payload.message ?? 'Upload failed');
        return;
      }
      onSuccess(payload.data.url);
    })
    .catch((err) => {
      onError(err instanceof Error ? err.message : 'Upload failed');
    });
}

function createEditor(textarea: HTMLTextAreaElement, placeholder: string): EasyMDE {
  return new EasyMDE({
    element: textarea,
    placeholder,
    spellChecker: false,
    autoDownloadFontAwesome: false,
    status: ['lines', 'words'],
    minHeight: '320px',
    uploadImage: true,
    imageUploadFunction,
    imageMaxSize: 8 * 1024 * 1024,
    imageAccept: 'image/png, image/jpeg, image/webp, image/gif',
    toolbar: [
      'bold',
      'italic',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      '|',
      'link',
      'image',
      'upload-image',
      'table',
      'code',
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
      '|',
      'guide',
    ],
  });
}

export function initAdminBlogEditor(options: InitOptions) {
  const form = document.getElementById('blog-form');
  const enTextarea = document.getElementById('content-en') as HTMLTextAreaElement | null;
  const zhTextarea = document.getElementById('content-zh') as HTMLTextAreaElement | null;
  const slugInput = document.getElementById('slug') as HTMLInputElement | null;
  const titleEnInput = document.getElementById('title-en') as HTMLInputElement | null;
  const titleZhInput = document.getElementById('title-zh') as HTMLInputElement | null;
  const excerptEnInput = document.getElementById('excerpt-en') as HTMLTextAreaElement | null;
  const excerptZhInput = document.getElementById('excerpt-zh') as HTMLTextAreaElement | null;
  const coverInput = document.getElementById('cover-image') as HTMLInputElement | null;
  const coverFile = document.getElementById('cover-file') as HTMLInputElement | null;
  const coverPreview = document.getElementById('cover-preview') as HTMLImageElement | null;
  const publishedCheckbox = document.getElementById('is-published') as HTMLInputElement | null;
  const publishedAtInput = document.getElementById('published-at') as HTMLInputElement | null;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement | null;
  const statusEl = document.getElementById('form-status');

  if (
    !form ||
    !enTextarea ||
    !zhTextarea ||
    !slugInput ||
    !titleEnInput ||
    !titleZhInput ||
    !excerptEnInput ||
    !excerptZhInput ||
    !coverInput ||
    !publishedCheckbox ||
    !submitBtn
  ) {
    return;
  }

  const enEditor = createEditor(enTextarea, 'Write English content in Markdown...');
  const zhEditor = createEditor(zhTextarea, '用 Markdown 书写中文正文...');

  function setStatus(msg: string, kind: 'info' | 'success' | 'error' = 'info') {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = `text-sm ${
      kind === 'error'
        ? 'text-red-600'
        : kind === 'success'
          ? 'text-emerald-600'
          : 'text-[var(--text-subtle)]'
    }`;
  }

  function slugify(source: string): string {
    return source
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100);
  }

  titleEnInput.addEventListener('blur', () => {
    if (!slugInput.value && titleEnInput.value) {
      slugInput.value = slugify(titleEnInput.value);
    }
  });

  coverFile?.addEventListener('change', async () => {
    const file = coverFile.files?.[0];
    if (!file) return;
    setStatus('Uploading cover image...');
    const fd = new FormData();
    fd.set('file', file);
    fd.set('folder', 'blog-cover');
    const resp = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const payload = (await resp.json().catch(() => ({}))) as {
      message?: string;
      data?: { url: string };
    };
    if (!resp.ok || !payload.data) {
      setStatus(payload.message ?? 'Upload failed', 'error');
      return;
    }
    coverInput.value = payload.data.url;
    if (coverPreview) {
      coverPreview.src = payload.data.url;
      coverPreview.classList.remove('hidden');
    }
    setStatus('Cover uploaded', 'success');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    setStatus('Saving...');

    const payload: BlogFormData = {
      slug: slugInput.value.trim(),
      title_en: titleEnInput.value.trim(),
      title_zh: titleZhInput.value.trim(),
      excerpt_en: excerptEnInput.value.trim(),
      excerpt_zh: excerptZhInput.value.trim(),
      content_en: enEditor.value(),
      content_zh: zhEditor.value(),
      cover_image: coverInput.value.trim() || null,
      is_published: publishedCheckbox.checked,
      published_at: publishedAtInput?.value || null,
    };

    const url = options.mode === 'create' ? '/api/admin/blog' : `/api/admin/blog/${options.blogId}`;
    const method = options.mode === 'create' ? 'POST' : 'PUT';

    try {
      const resp = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await resp.json().catch(() => ({}))) as {
        message?: string;
        data?: { id: string };
      };
      if (!resp.ok) {
        setStatus(result.message ?? 'Save failed', 'error');
        submitBtn.disabled = false;
        return;
      }
      setStatus('Saved successfully. Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/admin/blog';
      }, 600);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Save failed', 'error');
      submitBtn.disabled = false;
    }
  });
}

interface ApiErrorPayload {
  message?: string;
  details?: { fieldErrors?: Record<string, string[]> };
}

interface TurnstileApi {
  reset: (widget?: Element | string) => void;
  getResponse: (widget?: Element | string) => string | undefined;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const FIELD_LABELS: Record<string, string> = {
  company: 'Company',
  name: 'Name',
  email: 'Email',
  country: 'Country',
  message: 'Message',
  phone: 'Phone',
  productInterest: 'Product Interest',
  budget: 'Budget',
  quantity: 'Quantity',
  attachment: 'Attachment',
  turnstileToken: 'Verification',
};

function formatFieldErrors(payload: ApiErrorPayload): string | undefined {
  const fieldErrors = payload.details?.fieldErrors;
  if (!fieldErrors) return payload.message;
  const lines: string[] = [];
  for (const [field, errors] of Object.entries(fieldErrors)) {
    const label = FIELD_LABELS[field] ?? field;
    for (const err of errors) {
      lines.push(`${label}: ${err}`);
    }
  }
  return lines.length > 0 ? lines.join('\n') : payload.message;
}

function clearFieldErrors(form: HTMLFormElement) {
  for (const el of form.querySelectorAll('.field-error')) {
    el.remove();
  }
  for (const el of form.querySelectorAll('.border-red-500')) {
    el.classList.remove('border-red-500');
  }
}

function showFieldErrors(form: HTMLFormElement, payload: ApiErrorPayload) {
  const fieldErrors = payload.details?.fieldErrors;
  if (!fieldErrors) return;
  for (const [field, errors] of Object.entries(fieldErrors)) {
    const input = form.querySelector<HTMLElement>(`[name="${field}"]`);
    if (!input) continue;
    input.classList.add('border-red-500');
    const errEl = document.createElement('span');
    errEl.className = 'field-error text-xs text-red-500 mt-0.5';
    errEl.textContent = errors[0];
    input.parentElement?.appendChild(errEl);
  }
}

function resetTurnstile(form: HTMLFormElement) {
  const widget = form.querySelector<HTMLElement>('.cf-turnstile');
  if (widget && window.turnstile) {
    try {
      window.turnstile.reset(widget);
    } catch {
      /* ignore */
    }
  }
}

export interface InquiryFormOptions {
  formId: string;
  resultId: string;
  successMessage: string;
  failFallback: string;
  captchaMessage?: string;
  webviewHintId?: string;
}

const IN_APP_BROWSER_RE =
  /MicroMessenger|WeChat|QQ\/|Weibo|DingTalk|Feishu|Lark|Alipay|Instagram|FBAN|FBAV|Line\//i;

function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  return IN_APP_BROWSER_RE.test(navigator.userAgent);
}

export function initInquiryForm(options: InquiryFormOptions) {
  const { formId, resultId, successMessage, failFallback } = options;
  const captchaMessage =
    options.captchaMessage ?? 'Please complete the verification challenge before submitting.';
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const result = document.getElementById(resultId);
  const webviewHint = options.webviewHintId ? document.getElementById(options.webviewHintId) : null;

  if (webviewHint && isInAppBrowser()) {
    webviewHint.classList.remove('hidden');
  }

  if (form) {
    const widget = form.querySelector<HTMLElement>('.cf-turnstile');
    if (widget && webviewHint) {
      window.setTimeout(() => {
        const token = window.turnstile?.getResponse(widget) ?? '';
        if (!token) webviewHint.classList.remove('hidden');
      }, 12000);
    }
  }
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const target = event.currentTarget;
    if (!(target instanceof HTMLFormElement)) return;

    clearFieldErrors(target);
    if (result) {
      result.textContent = '';
      result.className = 'text-sm';
    }

    const formData = new FormData(target);
    const turnstileWidget = target.querySelector<HTMLElement>('.cf-turnstile');
    if (turnstileWidget) {
      const responseField = formData.get('cf-turnstile-response');
      const token =
        typeof responseField === 'string' && responseField.length > 0
          ? responseField
          : (window.turnstile?.getResponse(turnstileWidget) ?? '');
      formData.delete('cf-turnstile-response');
      if (!token) {
        if (result) {
          result.textContent = captchaMessage;
          result.classList.add('text-red-500');
        }
        return;
      }
      formData.set('turnstileToken', token);
    }

    const response = await fetch('/api/inquiries', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMsg = failFallback;
      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        try {
          const payload = (await response.json()) as ApiErrorPayload;
          showFieldErrors(target, payload);
          errorMsg = formatFieldErrors(payload) ?? failFallback;
        } catch {
          /* use fallback */
        }
      } else {
        const text = await response.text();
        if (text.trim()) errorMsg = text.trim();
      }
      if (result) {
        result.textContent = errorMsg;
        result.classList.add('text-red-500');
      }
      resetTurnstile(target);
      return;
    }

    if (result) {
      result.textContent = successMessage;
      result.classList.add('text-green-600');
    }
    target.reset();
    resetTurnstile(target);
  });
}

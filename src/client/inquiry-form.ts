interface ApiErrorPayload {
  message?: string;
  details?: { fieldErrors?: Record<string, string[]> };
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

async function readErrorInfo(response: Response): Promise<string | undefined> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      const payload = (await response.json()) as ApiErrorPayload;
      return formatFieldErrors(payload);
    } catch {
      return undefined;
    }
  }
  const text = await response.text();
  return text.trim() || undefined;
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

export function initInquiryForm(formId: string, resultId: string, successMessage: string, failFallback: string) {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const result = document.getElementById(resultId);
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const target = event.currentTarget;
    if (!(target instanceof HTMLFormElement)) return;

    clearFieldErrors(target);
    if (result) {
      result.textContent = '';
      result.className = 'text-sm';
    }

    const response = await fetch('/api/inquiries', {
      method: 'POST',
      body: new FormData(target),
    });

    if (!response.ok) {
      let errorMsg = failFallback;
      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        try {
          const payload = (await response.json()) as ApiErrorPayload;
          showFieldErrors(target, payload);
          errorMsg = formatFieldErrors(payload) ?? failFallback;
        } catch { /* use fallback */ }
      } else {
        const text = await response.text();
        if (text.trim()) errorMsg = text.trim();
      }
      if (result) {
        result.textContent = errorMsg;
        result.classList.add('text-red-500');
      }
      return;
    }

    if (result) {
      result.textContent = successMessage;
      result.classList.add('text-green-600');
    }
    target.reset();
  });
}

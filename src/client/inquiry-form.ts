export function initInquiryForm(formId: string, resultId: string, successMessage: string, failFallback: string) {
  const form = document.getElementById(formId);
  const result = document.getElementById(resultId);
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const target = event.currentTarget;
    if (!(target instanceof HTMLFormElement)) return;
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      body: new FormData(target),
    });
    const payload = (await response.json()) as { message?: string };
    if (!response.ok) {
      if (result) result.textContent = payload.message ?? failFallback;
      return;
    }
    if (result) result.textContent = successMessage;
    target.reset();
  });
}

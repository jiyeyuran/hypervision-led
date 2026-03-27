export interface InquiryQueueEvent {
  type: 'inquiry.created';
  inquiryId: string;
  language: 'en' | 'zh';
  email: string;
  company: string;
}

export function buildCrmPayload(event: InquiryQueueEvent) {
  return {
    event: 'lead.created',
    id: event.inquiryId,
    email: event.email,
    company: event.company,
    source: 'website',
    language: event.language,
  };
}

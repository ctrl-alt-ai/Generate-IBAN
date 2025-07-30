const MAX_ERROR_MESSAGE_LENGTH = 200;

export function sanitizeErrorMessage(message: string): string {
  return message
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .slice(0, MAX_ERROR_MESSAGE_LENGTH);
}


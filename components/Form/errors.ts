export function normalizeErrorMessages(error: unknown): string[] {
  const messages: string[] = [];

  const visit = (value: unknown) => {
    if (!value) return;
    if (typeof value === "string") {
      messages.push(value);
      return;
    }
    if (value instanceof Error) {
      messages.push(value.message);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value !== "object") return;

    const record = value as Record<string, unknown>;
    if (typeof record.message === "string" && record.message) {
      messages.push(record.message);
      return;
    }
    if (Array.isArray(record.issues)) {
      record.issues.forEach(visit);
      return;
    }
    if (record.form) {
      visit(record.form);
      return;
    }
    if (record.fields) {
      visit(record.fields);
      return;
    }
  };

  visit(error);
  return [...new Set(messages)];
}

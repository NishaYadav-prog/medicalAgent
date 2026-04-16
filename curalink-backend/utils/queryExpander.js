export const expandQuery = (disease, query) => {
  if (!disease || !query) {
    return [];
  }

  const base = `${query} ${disease}`;

  const variations = [
    base,
    `${query} treatment for ${disease}`,
    `${query} clinical trials ${disease}`,
    `${query} effect on ${disease} patients`,
    `${disease} ${query} research study`,
    `${query} therapy ${disease}`,
  ];

  return variations;
};

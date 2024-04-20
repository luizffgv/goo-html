/*
 * This module contains no-op tag functions to mark strings as a specific
 * language, so they can be formatted and highlighted in the IDE.
 */

/**
 * No-op tag function to mark a string as HTML code.
 *
 * Some IDEs and extensions will properly format and highlight code inside this
 * tag.
 * @param strings - Input strings.
 * @param values - Input values.
 * @returns The full string with values inserted.
 */
export function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  const valueStrings = values.map(String);
  // valStrings count could be one less than strings count, so we add a dummy
  // string
  valueStrings.push("");

  return strings
    .map((string, index) => string + valueStrings[index])
    .reduce((prev, cur) => prev + cur);
}

/**
 * No-op tag function to mark a string as a CSS style sheet.
 *
 * Some IDEs and extensions will properly format and highlight code inside this
 * tag.
 * @param strings - Input strings.
 * @param values - Input values.
 * @returns The full string with values inserted.
 */
export function css(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  return html(strings, ...values);
}

// Flag image URLs, bundled from the flag-icons package (MIT) so the game works fully offline.

const flagFiles = import.meta.glob('/node_modules/flag-icons/flags/4x3/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function flagUrlFor(code: string): string {
  return flagFiles[`/node_modules/flag-icons/flags/4x3/${code.toLowerCase()}.svg`] ?? '';
}

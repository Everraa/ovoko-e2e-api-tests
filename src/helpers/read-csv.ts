import fs from 'node:fs';

export function readCsv<T extends Record<string, string>>(filePath: string): T[] {
  const [headerLine, ...rows] = fs.readFileSync(filePath, 'utf-8').trim().split(/\r?\n/);
  const headers = headerLine.split(',').map((header) => header.trim());

  return rows.map((row) => {
    const values = row.split(',').map((value) => value.trim());
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])) as T;
  });
}

export function isValidWeight(value: number, min = 0, max = 9999): boolean {
  return !isNaN(value) && value >= min && value <= max;
}

export function isValidReps(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 999;
}

export function isValidRpe(value: number | undefined): boolean {
  if (value === undefined) return true;
  return value >= 1 && value <= 10;
}

export function isNonEmptyString(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidHeightCm(value: number): boolean {
  return !isNaN(value) && value >= 100 && value <= 250;
}

export function hashObject(obj: unknown): string {
  return JSON.stringify(obj);
}

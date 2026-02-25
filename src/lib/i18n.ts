import ru from '@/locales/ru.json';

type Primitive = string | number | boolean;
type Params = Record<string, Primitive>;

const dictionary = ru as Record<string, unknown>;

function getByPath(path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[key];
  }, dictionary);
}

function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(params[key] ?? `{{${key}}}`));
}

export function t(key: string, params?: Params): string {
  const value = getByPath(key);
  if (typeof value !== 'string') {
    return key;
  }
  return interpolate(value, params);
}

export function tm<T>(key: string): T {
  return getByPath(key) as T;
}

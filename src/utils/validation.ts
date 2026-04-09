import type { ValidationRule } from '../types';

export function validateField(
  value: unknown,
  rules: ValidationRule[] = []
): string | null {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '' || value === false) {
          return rule.message;
        }
        break;
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(String(value))) return rule.message;
        break;
      }
      case 'min':
        if (value !== '' && value !== undefined && Number(value) < Number(rule.value)) {
          return rule.message;
        }
        break;
      case 'max':
        if (value !== '' && value !== undefined && Number(value) > Number(rule.value)) {
          return rule.message;
        }
        break;
      case 'minLength':
        if (value && String(value).length < Number(rule.value)) return rule.message;
        break;
      case 'maxLength':
        if (value && String(value).length > Number(rule.value)) return rule.message;
        break;
      case 'regex':
        if (value && rule.value && !new RegExp(String(rule.value)).test(String(value))) {
          return rule.message;
        }
        break;
    }
  }
  return null;
}

export function evaluateConditional(
  fieldValues: Record<string, unknown>,
  conditional: { fieldId: string; operator: string; value: string; action: string }
): boolean {
  const targetValue = fieldValues[conditional.fieldId];
  let conditionMet = false;

  switch (conditional.operator) {
    case 'equals':
      conditionMet = String(targetValue) === conditional.value;
      break;
    case 'not_equals':
      conditionMet = String(targetValue) !== conditional.value;
      break;
    case 'contains':
      conditionMet = String(targetValue ?? '').includes(conditional.value);
      break;
    case 'is_empty':
      conditionMet = !targetValue || targetValue === '';
      break;
    case 'is_not_empty':
      conditionMet = !!targetValue && targetValue !== '';
      break;
  }

  if (conditional.action === 'show') return conditionMet;
  if (conditional.action === 'hide') return !conditionMet;
  return true;
}

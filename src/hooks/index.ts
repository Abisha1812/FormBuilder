import { useFormBuilderStore } from '../store/formBuilderStore';
import { evaluateConditional } from '../utils/validation';
import type { FormField } from '../types';

export function useVisibleFields(fields: FormField[], values: Record<string, unknown>) {
  return fields.filter((field) => {
    if (!field.conditional) return true;
    return evaluateConditional(values, field.conditional);
  });
}

export function useSelectedField() {
  const { form, selectedFieldId, updateField, selectField } = useFormBuilderStore();
  const field = form.fields.find((f) => f.id === selectedFieldId) ?? null;
  return { field, updateField, selectField };
}

export function useFormMeta() {
  const { form, setFormName, setFormDescription, updateTheme, toggleMultiStep } =
    useFormBuilderStore();
  return { form, setFormName, setFormDescription, updateTheme, toggleMultiStep };
}

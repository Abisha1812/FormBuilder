import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { FormSchema, FormField, FormStep, FormTheme, EditorMode, FormVersion } from '../types';

const DEFAULT_THEME: FormTheme = {
  primaryColor: '#6366f1',
  borderRadius: 8,
  fontFamily: 'DM Sans',
  labelPosition: 'top',
};

const DEFAULT_FORM: FormSchema = {
  id: uuidv4(),
  name: 'Untitled Form',
  description: '',
  fields: [
    {
      id: uuidv4(),
      type: 'input',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      helpText: '',
      validation: [{ type: 'required', message: 'Full name is required' }],
      width: 'full',
    },
    {
      id: uuidv4(),
      type: 'input',
      label: 'Email Address',
      placeholder: 'you@example.com',
      helpText: 'We will never share your email.',
      validation: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Enter a valid email' },
      ],
      width: 'half',
    },
    {
      id: uuidv4(),
      type: 'select',
      label: 'Department',
      placeholder: 'Select department',
      options: [
        { label: 'Engineering', value: 'engineering' },
        { label: 'Design', value: 'design' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Sales', value: 'sales' },
      ],
      width: 'half',
    },
    {
      id: uuidv4(),
      type: 'textarea',
      label: 'Message',
      placeholder: 'Tell us more...',
      validation: [{ type: 'minLength', value: 20, message: 'At least 20 characters required' }],
      width: 'full',
    },
  ],
  steps: [{ id: uuidv4(), title: 'Step 1', description: 'Basic Information' }],
  isMultiStep: false,
  theme: DEFAULT_THEME,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  versions: [],
};

interface FormBuilderState {
  form: FormSchema;
  selectedFieldId: string | null;
  mode: EditorMode;
  activeStep: number;
  previewValues: Record<string, unknown>;

  // Form actions
  setFormName: (name: string) => void;
  setFormDescription: (desc: string) => void;
  toggleMultiStep: () => void;

  // Field actions
  addField: (field: Omit<FormField, 'id'>) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  reorderFields: (fields: FormField[]) => void;
  selectField: (id: string | null) => void;
  duplicateField: (id: string) => void;

  // Step actions
  addStep: () => void;
  removeStep: (id: string) => void;
  updateStep: (id: string, updates: Partial<FormStep>) => void;
  setActiveStep: (index: number) => void;

  // Theme
  updateTheme: (updates: Partial<FormTheme>) => void;

  // Mode
  setMode: (mode: EditorMode) => void;

  // Versioning
  saveVersion: (label: string) => void;
  restoreVersion: (version: number) => void;

  // Preview
  setPreviewValue: (fieldId: string, value: unknown) => void;
  resetPreview: () => void;
}

export const useFormBuilderStore = create<FormBuilderState>()(
  persist(
    (set, get) => ({
      form: DEFAULT_FORM,
      selectedFieldId: null,
      mode: 'edit',
      activeStep: 0,
      previewValues: {},

      setFormName: (name) =>
        set((s) => ({ form: { ...s.form, name, updatedAt: new Date().toISOString() } })),

      setFormDescription: (description) =>
        set((s) => ({ form: { ...s.form, description, updatedAt: new Date().toISOString() } })),

      toggleMultiStep: () =>
        set((s) => ({
          form: { ...s.form, isMultiStep: !s.form.isMultiStep, updatedAt: new Date().toISOString() },
        })),

      addField: (field) => {
        const newField: FormField = { ...field, id: uuidv4() };
        set((s) => ({
          form: {
            ...s.form,
            fields: [...s.form.fields, newField],
            updatedAt: new Date().toISOString(),
          },
          selectedFieldId: newField.id,
        }));
      },

      removeField: (id) =>
        set((s) => ({
          form: {
            ...s.form,
            fields: s.form.fields.filter((f) => f.id !== id),
            updatedAt: new Date().toISOString(),
          },
          selectedFieldId: s.selectedFieldId === id ? null : s.selectedFieldId,
        })),

      updateField: (id, updates) =>
        set((s) => ({
          form: {
            ...s.form,
            fields: s.form.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
            updatedAt: new Date().toISOString(),
          },
        })),

      reorderFields: (fields) =>
        set((s) => ({
          form: { ...s.form, fields, updatedAt: new Date().toISOString() },
        })),

      selectField: (id) => set({ selectedFieldId: id }),

      duplicateField: (id) => {
        const { form } = get();
        const field = form.fields.find((f) => f.id === id);
        if (!field) return;
        const newField = { ...field, id: uuidv4(), label: `${field.label} (Copy)` };
        const idx = form.fields.findIndex((f) => f.id === id);
        const newFields = [...form.fields];
        newFields.splice(idx + 1, 0, newField);
        set((s) => ({
          form: { ...s.form, fields: newFields, updatedAt: new Date().toISOString() },
          selectedFieldId: newField.id,
        }));
      },

      addStep: () => {
        const newStep: FormStep = {
          id: uuidv4(),
          title: `Step ${get().form.steps.length + 1}`,
          description: '',
        };
        set((s) => ({
          form: {
            ...s.form,
            steps: [...s.form.steps, newStep],
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      removeStep: (id) =>
        set((s) => ({
          form: {
            ...s.form,
            steps: s.form.steps.filter((st) => st.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      updateStep: (id, updates) =>
        set((s) => ({
          form: {
            ...s.form,
            steps: s.form.steps.map((st) => (st.id === id ? { ...st, ...updates } : st)),
            updatedAt: new Date().toISOString(),
          },
        })),

      setActiveStep: (index) => set({ activeStep: index }),

      updateTheme: (updates) =>
        set((s) => ({
          form: {
            ...s.form,
            theme: { ...s.form.theme, ...updates },
            updatedAt: new Date().toISOString(),
          },
        })),

      setMode: (mode) => set({ mode }),

      saveVersion: (label) => {
        const { form } = get();
        const version: FormVersion = {
          version: form.versions.length + 1,
          timestamp: new Date().toISOString(),
          fields: JSON.parse(JSON.stringify(form.fields)),
          steps: JSON.parse(JSON.stringify(form.steps)),
          label,
        };
        set((s) => ({
          form: {
            ...s.form,
            versions: [...s.form.versions, version],
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      restoreVersion: (version) => {
        const { form } = get();
        const v = form.versions.find((ver) => ver.version === version);
        if (!v) return;
        set((s) => ({
          form: {
            ...s.form,
            fields: JSON.parse(JSON.stringify(v.fields)),
            steps: JSON.parse(JSON.stringify(v.steps)),
            updatedAt: new Date().toISOString(),
          },
          selectedFieldId: null,
        }));
      },

      setPreviewValue: (fieldId, value) =>
        set((s) => ({ previewValues: { ...s.previewValues, [fieldId]: value } })),

      resetPreview: () => set({ previewValues: {} }),
    }),
    { name: 'formforge-storage' }
  )
);

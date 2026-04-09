import type { FieldType, FormField } from '../../types';

export interface FieldDefinition {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
  defaultField: Omit<FormField, 'id'>;
}

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    type: 'input',
    label: 'Text Input',
    icon: '✏️',
    description: 'Single-line text field',
    defaultField: {
      type: 'input',
      label: 'Text Field',
      placeholder: 'Enter text...',
      helpText: '',
      validation: [],
      width: 'full',
    },
  },
  {
    type: 'number',
    label: 'Number',
    icon: '🔢',
    description: 'Numeric input field',
    defaultField: {
      type: 'number',
      label: 'Number Field',
      placeholder: '0',
      helpText: '',
      validation: [],
      width: 'full',
    },
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: '📋',
    description: 'Single-select dropdown',
    defaultField: {
      type: 'select',
      label: 'Select Field',
      placeholder: 'Choose an option',
      helpText: '',
      options: [
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
      ],
      validation: [],
      width: 'full',
    },
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: '☑️',
    description: 'Boolean toggle field',
    defaultField: {
      type: 'checkbox',
      label: 'Agree to terms',
      helpText: '',
      defaultValue: false,
      validation: [],
      width: 'full',
    },
  },
  {
    type: 'date',
    label: 'Date Picker',
    icon: '📅',
    description: 'Date selection field',
    defaultField: {
      type: 'date',
      label: 'Date Field',
      placeholder: 'Select date',
      helpText: '',
      validation: [],
      width: 'full',
    },
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: '📝',
    description: 'Multi-line text input',
    defaultField: {
      type: 'textarea',
      label: 'Message',
      placeholder: 'Enter your message...',
      helpText: '',
      validation: [],
      width: 'full',
    },
  },
];

export const FIELD_TYPE_COLORS: Record<FieldType, string> = {
  input: '#6366f1',
  number: '#f59e0b',
  select: '#10b981',
  checkbox: '#ec4899',
  date: '#3b82f6',
  textarea: '#8b5cf6',
};

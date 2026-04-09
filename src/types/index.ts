export type FieldType = 'input' | 'number' | 'select' | 'checkbox' | 'date' | 'textarea';

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'regex' | 'email';
  value?: string | number;
  message: string;
}

export interface ConditionalLogic {
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'is_empty' | 'is_not_empty';
  value: string;
  action: 'show' | 'hide';
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string | number | boolean;
  options?: SelectOption[];
  validation?: ValidationRule[];
  conditional?: ConditionalLogic;
  width?: 'full' | 'half';
  stepIndex?: number;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
}

export interface FormTheme {
  primaryColor: string;
  borderRadius: number;
  fontFamily: string;
  labelPosition: 'top' | 'left';
}

export interface FormVersion {
  version: number;
  timestamp: string;
  fields: FormField[];
  steps: FormStep[];
  label: string;
}

export interface FormSchema {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  steps: FormStep[];
  isMultiStep: boolean;
  theme: FormTheme;
  createdAt: string;
  updatedAt: string;
  versions: FormVersion[];
}

export type EditorMode = 'edit' | 'preview';
export type ActiveTab = 'fields' | 'settings';

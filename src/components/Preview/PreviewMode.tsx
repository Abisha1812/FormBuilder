import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  DatePicker,
  Button,
  Typography,
  Steps,
  Alert,
  message,
} from 'antd';
import { useFormBuilderStore } from '../../store/formBuilderStore';
import { validateField, evaluateConditional } from '../../utils/validation';
import type { FormField } from '../../types';

const { Text, Title } = Typography;

function FieldRenderer({ field, value, onChange }: {
  field: FormField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const error = validateField(value, field.validation);

  const inputStyle: React.CSSProperties = {
    borderRadius: 8,
    fontFamily: 'DM Sans',
  };

  const renderInput = () => {
    switch (field.type) {
      case 'input':
        return (
          <Input
            placeholder={field.placeholder}
            value={value as string ?? ''}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          />
        );
      case 'number':
        return (
          <InputNumber
            placeholder={field.placeholder}
            value={value as number}
            onChange={onChange}
            style={{ ...inputStyle, width: '100%' }}
          />
        );
      case 'select':
        return (
          <Select
            placeholder={field.placeholder}
            value={value as string}
            onChange={onChange}
            style={{ width: '100%' }}
            options={field.options}
          />
        );
      case 'checkbox':
        return (
          <Checkbox checked={!!value} onChange={(e) => onChange(e.target.checked)}>
            {field.label}
          </Checkbox>
        );
      case 'date':
        return (
          <DatePicker
            placeholder={field.placeholder}
            style={{ ...inputStyle, width: '100%' }}
            onChange={(_, dateStr) => onChange(dateStr)}
          />
        );
      case 'textarea':
        return (
          <Input.TextArea
            placeholder={field.placeholder}
            value={value as string ?? ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            style={inputStyle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: field.width === 'half' ? 'calc(50% - 8px)' : '100%',
        marginBottom: 0,
      }}
    >
      <Form.Item
        label={
          field.type !== 'checkbox' ? (
            <span style={{ fontFamily: 'DM Sans', fontWeight: 500, color: '#2d2d2d' }}>
              {field.label}
              {field.validation?.some((v) => v.type === 'required') && (
                <span style={{ color: '#f5222d', marginLeft: 2 }}>*</span>
              )}
            </span>
          ) : null
        }
        extra={field.helpText ? <span style={{ fontSize: 12, color: '#aaa' }}>{field.helpText}</span> : null}
        validateStatus={error ? 'error' : ''}
        help={error}
      >
        {renderInput()}
      </Form.Item>
    </div>
  );
}

export function PreviewMode() {
  const { form, previewValues, setPreviewValue, resetPreview } = useFormBuilderStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const visibleFields = (stepIndex?: number) =>
    form.fields
      .filter((f) => {
        if (form.isMultiStep && stepIndex !== undefined && (f.stepIndex ?? 0) !== stepIndex) return false;
        if (!f.conditional) return true;
        return evaluateConditional(previewValues, f.conditional);
      });

  const handleSubmit = () => {
    const allFields = form.isMultiStep
      ? form.fields
      : visibleFields();

    let hasError = false;
    for (const field of allFields) {
      const err = validateField(previewValues[field.id], field.validation);
      if (err) { hasError = true; break; }
    }
    if (hasError) {
      message.error('Please fix validation errors before submitting');
      return;
    }
    setSubmitted(true);
    message.success('Form submitted successfully!');
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
          <Title level={3} style={{ fontFamily: 'Syne', color: '#1a1a2e' }}>Form Submitted!</Title>
          <Text style={{ color: '#888', fontFamily: 'DM Sans' }}>
            Thank you. Your response has been recorded.
          </Text>
          <br /><br />
          <Button
            onClick={() => { setSubmitted(false); resetPreview(); setCurrentStep(0); }}
            style={{ borderRadius: 8 }}
          >
            Reset & Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        background: '#f8f9fc',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 640,
          background: '#fff',
          borderRadius: 20,
          padding: '32px 36px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          border: '1px solid #f0f0f0',
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <Title level={3} style={{ fontFamily: 'Syne', color: '#1a1a2e', marginBottom: 4 }}>
            {form.name}
          </Title>
          {form.description && (
            <Text style={{ color: '#888', fontFamily: 'DM Sans' }}>{form.description}</Text>
          )}
        </div>

        {form.isMultiStep && form.steps.length > 1 && (
          <Steps
            current={currentStep}
            size="small"
            style={{ marginBottom: 28 }}
            items={form.steps.map((s) => ({ title: s.title, description: s.description }))}
          />
        )}

        <Form layout="vertical">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {visibleFields(form.isMultiStep ? currentStep : undefined).map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={previewValues[field.id]}
                onChange={(v) => setPreviewValue(field.id, v)}
              />
            ))}
          </div>
        </Form>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          {form.isMultiStep && currentStep > 0 && (
            <Button onClick={() => setCurrentStep((s) => s - 1)} style={{ borderRadius: 8 }}>
              ← Back
            </Button>
          )}
          <div style={{ marginLeft: 'auto' }}>
            {form.isMultiStep && currentStep < form.steps.length - 1 ? (
              <Button
                type="primary"
                onClick={() => setCurrentStep((s) => s + 1)}
                style={{ borderRadius: 8, background: form.theme.primaryColor, borderColor: form.theme.primaryColor }}
              >
                Next →
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleSubmit}
                style={{ borderRadius: 8, background: form.theme.primaryColor, borderColor: form.theme.primaryColor, minWidth: 120 }}
              >
                Submit Form
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

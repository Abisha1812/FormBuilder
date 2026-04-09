import React, { useState } from 'react';
import {
  Typography,
  Input,
  Select,
  Switch,
  Button,
  Divider,
  Space,
  Tabs,
  Form,
  InputNumber,
  Tag,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useFormBuilderStore } from '../../store/formBuilderStore';
import { useSelectedField } from '../../hooks';
import type { ValidationRule, SelectOption, ConditionalLogic } from '../../types';

const { Text } = Typography;

function EmptyConfig() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
      <Text style={{ color: '#aaa', fontSize: 13, fontFamily: 'DM Sans' }}>
        Select a field to configure it
      </Text>
    </div>
  );
}

function ValidationBuilder({ rules, onChange }: { rules: ValidationRule[]; onChange: (r: ValidationRule[]) => void }) {
  const addRule = () => {
    onChange([...rules, { type: 'required', message: 'This field is required' }]);
  };

  const updateRule = (index: number, updates: Partial<ValidationRule>) => {
    onChange(rules.map((r, i) => (i === index ? { ...r, ...updates } : r)));
  };

  const removeRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  return (
    <div>
      {rules.map((rule, index) => (
        <div
          key={index}
          style={{
            background: '#fafafa',
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
          }}
        >
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <Select
              size="small"
              value={rule.type}
              onChange={(val) => updateRule(index, { type: val })}
              style={{ flex: 1 }}
              options={[
                { label: 'Required', value: 'required' },
                { label: 'Email', value: 'email' },
                { label: 'Min Value', value: 'min' },
                { label: 'Max Value', value: 'max' },
                { label: 'Min Length', value: 'minLength' },
                { label: 'Max Length', value: 'maxLength' },
                { label: 'Regex', value: 'regex' },
              ]}
            />
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeRule(index)}
            />
          </div>
          {['min', 'max', 'minLength', 'maxLength'].includes(rule.type) && (
            <InputNumber
              size="small"
              placeholder="Value"
              value={rule.value as number}
              onChange={(v) => updateRule(index, { value: v ?? undefined })}
              style={{ width: '100%', marginBottom: 6 }}
            />
          )}
          {rule.type === 'regex' && (
            <Input
              size="small"
              placeholder="Pattern (e.g. ^[A-Z]+$)"
              value={rule.value as string}
              onChange={(e) => updateRule(index, { value: e.target.value })}
              style={{ marginBottom: 6 }}
            />
          )}
          <Input
            size="small"
            placeholder="Error message"
            value={rule.message}
            onChange={(e) => updateRule(index, { message: e.target.value })}
          />
        </div>
      ))}
      <Button
        size="small"
        icon={<PlusOutlined />}
        onClick={addRule}
        style={{ width: '100%', borderStyle: 'dashed' }}
      >
        Add Rule
      </Button>
    </div>
  );
}

function OptionsEditor({ options, onChange }: { options: SelectOption[]; onChange: (o: SelectOption[]) => void }) {
  const addOption = () => {
    const n = options.length + 1;
    onChange([...options, { label: `Option ${n}`, value: `option_${n}` }]);
  };

  return (
    <div>
      {options.map((opt, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <Input
            size="small"
            placeholder="Label"
            value={opt.label}
            onChange={(e) => {
              const next = [...options];
              next[i] = { ...opt, label: e.target.value };
              onChange(next);
            }}
          />
          <Input
            size="small"
            placeholder="Value"
            value={opt.value}
            onChange={(e) => {
              const next = [...options];
              next[i] = { ...opt, value: e.target.value };
              onChange(next);
            }}
          />
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onChange(options.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <Button size="small" icon={<PlusOutlined />} onClick={addOption} style={{ borderStyle: 'dashed', width: '100%' }}>
        Add Option
      </Button>
    </div>
  );
}

function ConditionalEditor({
  conditional,
  onChange,
  currentFieldId,
}: {
  conditional?: ConditionalLogic;
  onChange: (c: ConditionalLogic | undefined) => void;
  currentFieldId: string;
}) {
  const { form } = useFormBuilderStore();
  const otherFields = form.fields.filter((f) => f.id !== currentFieldId);

  const enabled = !!conditional;
  const c = conditional ?? { fieldId: '', operator: 'equals' as const, value: '', action: 'show' as const };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 12, color: '#555' }}>Enable conditional logic</Text>
        <Switch
          size="small"
          checked={enabled}
          onChange={(checked) => {
            if (checked) {
              onChange({ fieldId: otherFields[0]?.id ?? '', operator: 'equals', value: '', action: 'show' });
            } else {
              onChange(undefined);
            }
          }}
        />
      </div>
      {enabled && (
        <div style={{ background: '#fafafa', borderRadius: 8, padding: 12, border: '1px solid #f0f0f0' }}>
          <Form.Item label="When field" style={{ marginBottom: 8 }}>
            <Select
              size="small"
              value={c.fieldId}
              onChange={(val) => onChange({ ...c, fieldId: val })}
              options={otherFields.map((f) => ({ label: f.label, value: f.id }))}
              placeholder="Select a field"
            />
          </Form.Item>
          <Form.Item label="Operator" style={{ marginBottom: 8 }}>
            <Select
              size="small"
              value={c.operator}
              onChange={(val) => onChange({ ...c, operator: val })}
              options={[
                { label: 'Equals', value: 'equals' },
                { label: 'Not equals', value: 'not_equals' },
                { label: 'Contains', value: 'contains' },
                { label: 'Is empty', value: 'is_empty' },
                { label: 'Is not empty', value: 'is_not_empty' },
              ]}
            />
          </Form.Item>
          {!['is_empty', 'is_not_empty'].includes(c.operator) && (
            <Form.Item label="Value" style={{ marginBottom: 8 }}>
              <Input size="small" value={c.value} onChange={(e) => onChange({ ...c, value: e.target.value })} />
            </Form.Item>
          )}
          <Form.Item label="Then" style={{ marginBottom: 0 }}>
            <Select
              size="small"
              value={c.action}
              onChange={(val) => onChange({ ...c, action: val })}
              options={[
                { label: 'Show this field', value: 'show' },
                { label: 'Hide this field', value: 'hide' },
              ]}
            />
          </Form.Item>
        </div>
      )}
    </div>
  );
}

export function ConfigPanel() {
  const { field, updateField } = useSelectedField();

  if (!field) return (
    <div style={{ width: 260, background: '#fff', borderLeft: '1px solid #f0f0f0', flexShrink: 0 }}>
      <EmptyConfig />
    </div>
  );

  const labelStyle: React.CSSProperties = { fontSize: 12, color: '#555', fontWeight: 500, marginBottom: 4, display: 'block', fontFamily: 'DM Sans' };
  const sectionStyle: React.CSSProperties = { marginBottom: 16 };

  return (
    <div
      style={{
        width: 260,
        background: '#fff',
        borderLeft: '1px solid #f0f0f0',
        flexShrink: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '16px 16px 10px',
          borderBottom: '1px solid #f5f5f5',
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 1,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#aaa', textTransform: 'uppercase', fontFamily: 'Syne' }}>
          Field Config
        </Text>
        <Tag
          style={{
            marginLeft: 8,
            background: '#f0f0ff',
            color: '#6366f1',
            border: 'none',
            fontSize: 10,
            borderRadius: 4,
          }}
        >
          {field.type}
        </Tag>
      </div>

      <div style={{ padding: '14px 16px', flex: 1 }}>
        <Tabs
          size="small"
          items={[
            {
              key: 'basic',
              label: 'Basic',
              children: (
                <div>
                  <div style={sectionStyle}>
                    <Text style={labelStyle}>Label</Text>
                    <Input
                      size="small"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                    />
                  </div>
                  {field.type !== 'checkbox' && (
                    <div style={sectionStyle}>
                      <Text style={labelStyle}>Placeholder</Text>
                      <Input
                        size="small"
                        value={field.placeholder ?? ''}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      />
                    </div>
                  )}
                  <div style={sectionStyle}>
                    <Text style={labelStyle}>Help text</Text>
                    <Input
                      size="small"
                      value={field.helpText ?? ''}
                      onChange={(e) => updateField(field.id, { helpText: e.target.value })}
                    />
                  </div>
                  <div style={sectionStyle}>
                    <Text style={labelStyle}>Width</Text>
                    <Select
                      size="small"
                      value={field.width ?? 'full'}
                      onChange={(val) => updateField(field.id, { width: val })}
                      style={{ width: '100%' }}
                      options={[
                        { label: 'Full width', value: 'full' },
                        { label: 'Half width', value: 'half' },
                      ]}
                    />
                  </div>
                  {field.type === 'select' && (
                    <div style={sectionStyle}>
                      <Text style={labelStyle}>Options</Text>
                      <OptionsEditor
                        options={field.options ?? []}
                        onChange={(options) => updateField(field.id, { options })}
                      />
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'validation',
              label: 'Validation',
              children: (
                <ValidationBuilder
                  rules={field.validation ?? []}
                  onChange={(validation) => updateField(field.id, { validation })}
                />
              ),
            },
            {
              key: 'conditional',
              label: 'Logic',
              children: (
                <ConditionalEditor
                  conditional={field.conditional}
                  onChange={(conditional) => updateField(field.id, { conditional })}
                  currentFieldId={field.id}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

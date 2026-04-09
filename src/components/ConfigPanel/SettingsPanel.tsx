import React, { useState } from 'react';
import {
  Typography,
  Input,
  Switch,
  Button,
  Divider,
  ColorPicker,
  Select,
  Slider,
  Modal,
  List,
  Tag,
  Popconfirm,
  message,
  Steps,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  HistoryOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { useFormBuilderStore } from '../../store/formBuilderStore';
import dayjs from 'dayjs';

const { Text } = Typography;

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  fontWeight: 500,
  marginBottom: 4,
  display: 'block',
  fontFamily: 'DM Sans',
};

const sectionStyle: React.CSSProperties = { marginBottom: 16 };

export function SettingsPanel() {
  const {
    form,
    setFormName,
    setFormDescription,
    toggleMultiStep,
    updateTheme,
    addStep,
    removeStep,
    updateStep,
    saveVersion,
    restoreVersion,
  } = useFormBuilderStore();

  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [versionLabel, setVersionLabel] = useState('');

  const handleSaveVersion = () => {
    if (!versionLabel.trim()) {
      message.warning('Please enter a version label');
      return;
    }
    saveVersion(versionLabel.trim());
    setVersionLabel('');
    message.success('Version saved!');
  };

  return (
    <div style={{ padding: '14px 16px' }}>
      {/* Form Meta */}
      <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#aaa', textTransform: 'uppercase', fontFamily: 'Syne', display: 'block', marginBottom: 12 }}>
        Form Settings
      </Text>

      <div style={sectionStyle}>
        <Text style={labelStyle}>Form Name</Text>
        <Input
          size="small"
          value={form.name}
          onChange={(e) => setFormName(e.target.value)}
        />
      </div>

      <div style={sectionStyle}>
        <Text style={labelStyle}>Description</Text>
        <Input.TextArea
          size="small"
          rows={2}
          value={form.description ?? ''}
          onChange={(e) => setFormDescription(e.target.value)}
        />
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {/* Theme */}
      <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#aaa', textTransform: 'uppercase', fontFamily: 'Syne', display: 'block', marginBottom: 12 }}>
        Theme
      </Text>

      <div style={sectionStyle}>
        <Text style={labelStyle}>Primary Color</Text>
        <ColorPicker
          value={form.theme.primaryColor}
          onChange={(_, hex) => updateTheme({ primaryColor: hex })}
          size="small"
          showText
        />
      </div>

      <div style={sectionStyle}>
        <Text style={labelStyle}>Border Radius: {form.theme.borderRadius}px</Text>
        <Slider
          min={0}
          max={20}
          value={form.theme.borderRadius}
          onChange={(v) => updateTheme({ borderRadius: v })}
        />
      </div>

      <div style={sectionStyle}>
        <Text style={labelStyle}>Label Position</Text>
        <Select
          size="small"
          value={form.theme.labelPosition}
          onChange={(v) => updateTheme({ labelPosition: v })}
          style={{ width: '100%' }}
          options={[
            { label: 'Top', value: 'top' },
            { label: 'Left (inline)', value: 'left' },
          ]}
        />
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {/* Multi-step */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <Text style={{ fontSize: 12, fontWeight: 600, color: '#333', display: 'block' }}>Multi-step Form</Text>
          <Text style={{ fontSize: 11, color: '#aaa' }}>Divide form into steps</Text>
        </div>
        <Switch
          size="small"
          checked={form.isMultiStep}
          onChange={toggleMultiStep}
        />
      </div>

      {form.isMultiStep && (
        <div style={{ background: '#fafafa', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #f0f0f0' }}>
          {form.steps.map((step, index) => (
            <div key={step.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#6366f1',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </div>
              <Input
                size="small"
                value={step.title}
                onChange={(e) => updateStep(step.id, { title: e.target.value })}
                style={{ flex: 1 }}
              />
              {form.steps.length > 1 && (
                <Button
                  size="small"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeStep(step.id)}
                />
              )}
            </div>
          ))}
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={addStep}
            style={{ width: '100%', borderStyle: 'dashed', marginTop: 4 }}
          >
            Add Step
          </Button>
        </div>
      )}

      <Divider style={{ margin: '12px 0' }} />

      {/* Versioning */}
      <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#aaa', textTransform: 'uppercase', fontFamily: 'Syne', display: 'block', marginBottom: 12 }}>
        Version History
      </Text>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <Input
          size="small"
          placeholder="Version label (e.g. v1.2)"
          value={versionLabel}
          onChange={(e) => setVersionLabel(e.target.value)}
          onPressEnter={handleSaveVersion}
        />
        <Button size="small" type="primary" onClick={handleSaveVersion} style={{ background: '#6366f1', borderColor: '#6366f1' }}>
          Save
        </Button>
      </div>

      {form.versions.length > 0 && (
        <Button
          size="small"
          icon={<HistoryOutlined />}
          onClick={() => setVersionModalOpen(true)}
          style={{ width: '100%', marginBottom: 8 }}
        >
          View {form.versions.length} version{form.versions.length !== 1 ? 's' : ''}
        </Button>
      )}

      <Modal
        title="Version History"
        open={versionModalOpen}
        onCancel={() => setVersionModalOpen(false)}
        footer={null}
        width={400}
      >
        <List
          dataSource={[...form.versions].reverse()}
          renderItem={(v) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Restore this version? Current state will be replaced."
                  onConfirm={() => {
                    restoreVersion(v.version);
                    setVersionModalOpen(false);
                    message.success(`Restored to ${v.label}`);
                  }}
                >
                  <Button size="small" icon={<RollbackOutlined />} type="link">
                    Restore
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span style={{ fontFamily: 'Syne', fontSize: 13 }}>
                    <Tag color="purple">v{v.version}</Tag> {v.label}
                  </span>
                }
                description={
                  <span style={{ fontSize: 11, color: '#aaa' }}>
                    {dayjs(v.timestamp).format('MMM D, YYYY HH:mm')} · {v.fields.length} fields
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}

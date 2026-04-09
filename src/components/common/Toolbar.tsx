import React from 'react';
import { Button, Typography, Tag, Tooltip, Space, message } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DownloadOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { useFormBuilderStore } from '../../store/formBuilderStore';

const { Text } = Typography;

interface ToolbarProps {
  activeTab: 'fields' | 'settings';
  onTabChange: (tab: 'fields' | 'settings') => void;
}

export function Toolbar({ activeTab, onTabChange }: ToolbarProps) {
  const { form, mode, setMode } = useFormBuilderStore();

  const exportSchema = () => {
    const json = JSON.stringify(form, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.name.replace(/\s+/g, '_').toLowerCase()}_schema.json`;
    a.click();
    URL.revokeObjectURL(url);
    message.success('Schema exported!');
  };

  return (
    <div
      style={{
        height: 56,
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 12,
        flexShrink: 0,
        boxShadow: '0 1px 0 #f0f0f0',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}
        >
          ⚡
        </div>
        <Text
          style={{
            fontFamily: 'Syne',
            fontWeight: 800,
            fontSize: 17,
            color: '#1a1a2e',
            letterSpacing: -0.5,
          }}
        >
          FormForge
        </Text>
      </div>

      <div style={{ width: 1, height: 24, background: '#f0f0f0', margin: '0 4px' }} />

      {/* Left tab switcher */}
      <div
        style={{
          display: 'flex',
          background: '#f5f5f5',
          borderRadius: 8,
          padding: 3,
          gap: 2,
        }}
      >
        {(['fields', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              padding: '4px 14px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'DM Sans',
              fontSize: 12,
              fontWeight: activeTab === tab ? 600 : 400,
              background: activeTab === tab ? '#fff' : 'transparent',
              color: activeTab === tab ? '#1a1a2e' : '#888',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {tab === 'fields' ? '🧱 Fields' : '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* Center: form name + field count */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        <Text
          style={{
            fontFamily: 'Syne',
            fontWeight: 600,
            fontSize: 14,
            color: '#333',
          }}
        >
          {form.name}
        </Text>
        <Tag
          style={{
            background: '#f0f0ff',
            color: '#6366f1',
            border: 'none',
            borderRadius: 5,
            fontSize: 11,
          }}
        >
          {form.fields.length} fields
        </Tag>
        {form.isMultiStep && (
          <Tag
            style={{
              background: '#fff7e6',
              color: '#fa8c16',
              border: 'none',
              borderRadius: 5,
              fontSize: 11,
            }}
          >
            {form.steps.length} steps
          </Tag>
        )}
        <Text style={{ fontSize: 11, color: '#ccc' }}>
          Saved {new Date(form.updatedAt).toLocaleTimeString()}
        </Text>
      </div>

      {/* Actions */}
      <Space size={6}>
        <Tooltip title="Export JSON Schema">
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={exportSchema}
            style={{ borderRadius: 7, fontFamily: 'DM Sans', fontSize: 12 }}
          >
            Export
          </Button>
        </Tooltip>

        {/* Mode toggle */}
        <div
          style={{
            display: 'flex',
            background: '#f5f5f5',
            borderRadius: 8,
            padding: 3,
            gap: 2,
          }}
        >
          <button
            onClick={() => setMode('edit')}
            style={{
              padding: '4px 14px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'DM Sans',
              fontSize: 12,
              fontWeight: mode === 'edit' ? 600 : 400,
              background: mode === 'edit' ? '#fff' : 'transparent',
              color: mode === 'edit' ? '#6366f1' : '#888',
              boxShadow: mode === 'edit' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <EditOutlined /> Edit
          </button>
          <button
            onClick={() => setMode('preview')}
            style={{
              padding: '4px 14px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'DM Sans',
              fontSize: 12,
              fontWeight: mode === 'preview' ? 600 : 400,
              background: mode === 'preview' ? '#fff' : 'transparent',
              color: mode === 'preview' ? '#6366f1' : '#888',
              boxShadow: mode === 'preview' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <EyeOutlined /> Preview
          </button>
        </div>
      </Space>
    </div>
  );
}

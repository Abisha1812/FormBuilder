import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Typography, Tag, Tooltip } from 'antd';
import { DeleteOutlined, CopyOutlined, HolderOutlined } from '@ant-design/icons';
import { useFormBuilderStore } from '../../store/formBuilderStore';
import { FIELD_TYPE_COLORS } from '../../features/fields/fieldDefinitions';
import type { FormField } from '../../types';

const { Text } = Typography;

interface FieldCardProps {
  field: FormField;
  isSelected: boolean;
}

export function FieldCard({ field, isSelected }: FieldCardProps) {
  const { selectField, removeField, duplicateField } = useFormBuilderStore();
  const color = FIELD_TYPE_COLORS[field.type];

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    data: { fromCanvas: true },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectField(field.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'relative',
        borderRadius: 12,
        border: `2px solid ${isSelected ? color : '#eee'}`,
        background: isSelected ? `${color}06` : '#fff',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'border 0.15s, background 0.15s',
        boxShadow: isSelected ? `0 0 0 3px ${color}22` : '0 1px 4px rgba(0,0,0,0.05)',
        width: field.width === 'half' ? 'calc(50% - 6px)' : '100%',
      }}
      onClick={handleClick}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        style={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#ccc',
          cursor: 'grab',
          fontSize: 14,
          padding: '4px 2px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <HolderOutlined />
      </div>

      {/* Actions */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 10,
            display: 'flex',
            gap: 6,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Duplicate">
            <div
              onClick={() => duplicateField(field.id)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 12,
                color: '#666',
              }}
            >
              <CopyOutlined />
            </div>
          </Tooltip>
          <Tooltip title="Remove">
            <div
              onClick={() => removeField(field.id)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: '#fff0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 12,
                color: '#f5222d',
              }}
            >
              <DeleteOutlined />
            </div>
          </Tooltip>
        </div>
      )}

      <div style={{ paddingLeft: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Text
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: '#1a1a2e',
              fontFamily: 'Syne',
            }}
          >
            {field.label}
          </Text>
          {field.validation?.some((v) => v.type === 'required') && (
            <span style={{ color: '#f5222d', fontSize: 12 }}>*</span>
          )}
          <Tag
            style={{
              background: `${color}18`,
              color,
              border: 'none',
              borderRadius: 4,
              fontSize: 10,
              padding: '0 6px',
              fontFamily: 'DM Sans',
              marginLeft: 'auto',
              marginRight: isSelected ? 56 : 0,
            }}
          >
            {field.type}
          </Tag>
        </div>
        {field.helpText && (
          <Text style={{ fontSize: 11, color: '#aaa', display: 'block' }}>{field.helpText}</Text>
        )}
        {field.conditional && (
          <Tag
            style={{
              background: '#fff7e6',
              color: '#fa8c16',
              border: 'none',
              borderRadius: 4,
              fontSize: 10,
              padding: '0 6px',
              marginTop: 4,
            }}
          >
            ⚡ Conditional
          </Tag>
        )}
      </div>
    </div>
  );
}

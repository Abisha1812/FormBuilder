import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Typography, Divider } from 'antd';
import { FIELD_DEFINITIONS, FIELD_TYPE_COLORS } from '../../features/fields/fieldDefinitions';
import type { FieldDefinition } from '../../features/fields/fieldDefinitions';

const { Text } = Typography;

interface DraggableFieldTileProps {
  definition: FieldDefinition;
}

function DraggableFieldTile({ definition }: DraggableFieldTileProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${definition.type}`,
    data: { fromPalette: true, fieldType: definition.type },
  });

  const color = FIELD_TYPE_COLORS[definition.type];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 10,
        background: isDragging ? '#f0f0ff' : '#fafafa',
        border: `1.5px solid ${isDragging ? color : '#e8e8e8'}`,
        cursor: 'grab',
        transition: 'all 0.15s ease',
        opacity: isDragging ? 0.5 : 1,
        userSelect: 'none',
        marginBottom: 6,
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          (e.currentTarget as HTMLElement).style.background = '#f5f5ff';
          (e.currentTarget as HTMLElement).style.borderColor = color;
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          (e.currentTarget as HTMLElement).style.background = '#fafafa';
          (e.currentTarget as HTMLElement).style.borderColor = '#e8e8e8';
        }
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: `${color}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {definition.icon}
      </div>
      <div>
        <Text style={{ fontSize: 13, fontWeight: 600, display: 'block', color: '#1a1a2e', fontFamily: 'Syne' }}>
          {definition.label}
        </Text>
        <Text style={{ fontSize: 11, color: '#888', fontFamily: 'DM Sans' }}>
          {definition.description}
        </Text>
      </div>
    </div>
  );
}

export function FieldPanel() {
  return (
    <div
      style={{
        width: 220,
        height: '100%',
        background: '#ffffff',
        borderRight: '1px solid #f0f0f0',
        padding: '20px 14px',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          color: '#aaa',
          display: 'block',
          marginBottom: 12,
          fontFamily: 'Syne',
        }}
      >
        Field Types
      </Text>
      <Text style={{ fontSize: 12, color: '#bbb', display: 'block', marginBottom: 14 }}>
        Drag onto canvas →
      </Text>
      <Divider style={{ margin: '0 0 14px' }} />
      {FIELD_DEFINITIONS.map((def) => (
        <DraggableFieldTile key={def.type} definition={def} />
      ))}
    </div>
  );
}

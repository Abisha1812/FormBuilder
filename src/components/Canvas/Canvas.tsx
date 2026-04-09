import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Typography, Empty } from 'antd';
import { useFormBuilderStore } from '../../store/formBuilderStore';
import { FieldCard } from './FieldCard';

const { Text } = Typography;

interface CanvasProps {
  stepIndex?: number;
}

export function Canvas({ stepIndex }: CanvasProps) {
  const { form, selectedFieldId, selectField } = useFormBuilderStore();

  const fieldsToShow =
    form.isMultiStep && stepIndex !== undefined
      ? form.fields.filter((f) => (f.stepIndex ?? 0) === stepIndex)
      : form.fields;

  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-droppable' });

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        padding: '24px 28px',
        background: '#f8f9fc',
      }}
      onClick={() => selectField(null)}
    >
      {/* Form header card */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 20,
          border: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#1a1a2e',
            fontFamily: 'Syne',
            display: 'block',
          }}
        >
          {form.name}
        </Text>
        {form.description && (
          <Text style={{ color: '#888', fontSize: 13, marginTop: 4, display: 'block' }}>
            {form.description}
          </Text>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        style={{
          minHeight: 300,
          background: isOver ? '#f0f0ff' : 'transparent',
          borderRadius: 16,
          border: isOver ? '2px dashed #6366f1' : '2px dashed transparent',
          transition: 'all 0.2s ease',
          padding: isOver ? 12 : 0,
        }}
      >
        <SortableContext
          items={fieldsToShow.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {fieldsToShow.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                isSelected={selectedFieldId === field.id}
              />
            ))}
          </div>
        </SortableContext>

        {fieldsToShow.length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: '#bbb', fontFamily: 'DM Sans', fontSize: 13 }}>
                {isOver ? 'Drop field here' : 'Drag fields from the left panel'}
              </span>
            }
            style={{
              marginTop: 60,
              padding: 40,
            }}
          />
        )}
      </div>
    </div>
  );
}

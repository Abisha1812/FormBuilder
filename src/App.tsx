import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { ConfigProvider, App as AntApp, Tabs } from 'antd';
import { useFormBuilderStore } from './store/formBuilderStore';
import { FIELD_DEFINITIONS } from './features/fields/fieldDefinitions';
import { FieldPanel } from './components/FieldPanel/FieldPanel';
import { Canvas } from './components/Canvas/Canvas';
import { ConfigPanel } from './components/ConfigPanel/ConfigPanel';
import { SettingsPanel } from './components/ConfigPanel/SettingsPanel';
import { PreviewMode } from './components/Preview/PreviewMode';
import { Toolbar } from './components/common/Toolbar';
import type { ActiveTab } from './types';

function App() {
  const { form, mode, addField, reorderFields, activeStep } = useFormBuilderStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('fields');
  const [draggedType, setDraggedType] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { data } = event.active;
    if (data.current?.fromPalette) {
      setDraggedType(data.current.fieldType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedType(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;

    // Drop from palette onto canvas
    if (activeData?.fromPalette) {
      const fieldType = activeData.fieldType;
      const def = FIELD_DEFINITIONS.find((d) => d.type === fieldType);
      if (def) {
        const newField: Omit<import('./types').FormField, 'id'> = {
          ...def.defaultField,
          stepIndex: form.isMultiStep ? activeStep : 0,
        };
        addField(newField);
      }
      return;
    }

    // Reorder within canvas
    if (activeData?.fromCanvas) {
      const oldIndex = form.fields.findIndex((f) => f.id === active.id);
      const newIndex = form.fields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderFields(arrayMove(form.fields, oldIndex, newIndex));
      }
    }
  };

  const draggedDef = draggedType ? FIELD_DEFINITIONS.find((d) => d.type === draggedType) : null;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: form.theme.primaryColor,
          borderRadius: form.theme.borderRadius,
          fontFamily: 'DM Sans, sans-serif',
        },
      }}
    >
      <AntApp>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
            background: '#f8f9fc',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          <Toolbar activeTab={activeTab} onTabChange={setActiveTab} />

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {mode === 'edit' ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {/* Left Panel */}
                {activeTab === 'fields' ? (
                  <FieldPanel />
                ) : (
                  <div
                    style={{
                      width: 220,
                      background: '#fff',
                      borderRight: '1px solid #f0f0f0',
                      overflowY: 'auto',
                      flexShrink: 0,
                    }}
                  >
                    <SettingsPanel />
                  </div>
                )}

                {/* Canvas */}
                <Canvas stepIndex={form.isMultiStep ? activeStep : undefined} />

                {/* Right config panel */}
                <ConfigPanel />

                {/* Drag Overlay */}
                <DragOverlay>
                  {draggedDef && (
                    <div
                      style={{
                        padding: '10px 16px',
                        background: '#fff',
                        borderRadius: 10,
                        border: '2px solid #6366f1',
                        boxShadow: '0 8px 24px rgba(99,102,241,0.25)',
                        fontFamily: 'Syne',
                        fontWeight: 600,
                        fontSize: 13,
                        color: '#6366f1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      {draggedDef.icon} {draggedDef.label}
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            ) : (
              <PreviewMode />
            )}
          </div>
        </div>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;

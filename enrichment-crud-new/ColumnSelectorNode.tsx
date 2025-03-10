import React, { useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ActionIcon, Button, Card, Group, JsonInput, Menu, Stack, TextInput, Title, Modal, Select, Tooltip } from '@mantine/core';
import { IconFileDescriptionFilled, IconHelpCircle, IconTrash } from '@tabler/icons-react';
import { useClickOutside } from '@mantine/hooks';

export default function ColumnSelectorNode({ data, isConnectable }) {
     const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [jsonExport, setJsonExport] = useState(null);
  const [nodeData, setNodeData] = useState({
    mappingId: data.mappingId || '',
    name: data.name || '',
    inColumns: data.inColumns || '',
    description: data.description || '',
  });

  const setMappingId = useCallback((value) => {
    setNodeData((prev) => ({ ...prev, mappingId: value }));
  }, []);

  const setName = useCallback((event) => {
    setNodeData((prev) => ({ ...prev, name: event.target.value }));
  }, []);

  const setInColumns = useCallback((event) => {
    setNodeData((prev) => ({ ...prev, inColumns: event.target.value }));
  }, []);

  const setDescription = useCallback((value) => {
    setNodeData((prev) => ({ ...prev, description: value }));
  }, []);

  const removeNode = useCallback(() => {
    console.log('Node removed');
  }, []);

  const exportJson = () => {
    const json = JSON.stringify(nodeData, null, 2);
    setJsonExport(json);
    console.log('Exported JSON:', json);
  };
const menuRef = useClickOutside(() => setHelpModalOpen(false));
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <Card shadow="sm" withBorder radius="md" padding="sm" miw="17.5rem">
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={5}>Column Selector</Title>
            <Group justify="end">
              <Tooltip label="Click for Help" position="top" withArrow>
                <ActionIcon variant="subtle" color="gray" style={{ marginRight: '3px' }}>
                  <IconHelpCircle />
                </ActionIcon>
              </Tooltip>

              <Menu position="bottom-end" shadow="sm">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" style={{ marginRight: '3px' }} onClick={() => setHelpModalOpen(true)}>
                    <IconFileDescriptionFilled style={{ marginRight: '3px' }} />
                  </ActionIcon>
                </Menu.Target>
                <ActionIcon variant="subtle" color="gray" style={{ marginRight: '3px' }} onClick={removeNode}>
                  <IconTrash />
                </ActionIcon>
                <Menu.Dropdown>
                  <JsonInput
                    label="Enter Description"
                    placeholder="Enter Description"
                    autosize
                    minRows={4}
                    value={nodeData.description}
                    onChange={(newValue) => setDescription(newValue)}
                  />
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>

          <Stack bg="var(--mantine-color-body)" align="stretch" justify="start" gap="md">
            <Group justify="space-between">
              <div>Mapping ID</div>
              <Select
                placeholder="Select Mapping ID"
                value={nodeData.mappingId}
                onChange={setMappingId}
                data={[
                  { value: 'col-selector-001', label: 'col-selector-001' },
                  { value: 'col-selector-002', label: 'col-selector-002' },
                  { value: 'col-selector-003', label: 'col-selector-003' },
                ]}
              />
            </Group>

            <Group justify="space-between">
              <div>Name</div>
              <TextInput
                placeholder="Enter Name"
                value={nodeData.name}
                onChange={setName}
              />
            </Group>

            <Group justify="space-between">
              <div>In Columns</div>
              <TextInput
                placeholder="Enter columns"
                value={nodeData.inColumns}
                onChange={setInColumns}
              />
            </Group>

            <Button variant="outline" color="blue" onClick={exportJson}>
              Export JSON
            </Button>
            {jsonExport && (
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  marginTop: '10px',
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                }}
              >
                {jsonExport}
              </div>
            )}
          </Stack>
        </Stack>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
      <Modal opened={helpModalOpen} onClose={() => setHelpModalOpen(false)} title="Help">
              <div>
                <p>Here you can select a mapping ID, table name, and enter a display name and filter commands. Use the "Export JSON" button to get the data in JSON format.</p>
              </div>
        </Modal>
    </>
  );
}

import React, { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ActionIcon, Card, Group, JsonInput, Menu, Select, Stack, TextInput, Title, Modal, Button } from '@mantine/core';
import { IconFileDescriptionFilled, IconHelpCircle, IconTrash } from '@tabler/icons-react';
import { useClickOutside } from '@mantine/hooks';

export const mappingSource = {
    'mapping-1': { label: "target-001", value: "target-001" },
    'mapping-2': { label: "target-002", value: "target-002" },
    'mapping-3': { label: "target-003", value: "target-003" },
  };
  
  export const tableSource = {
    'table-1': { label: "processed_customers", value: "processed_customers" },
    'table-2': { label: "processed_customers1", value: "processed_customers1" },
    'table-3': { label: "processed_customers2", value: "processed_customers2" },
  };

export default function DataTargetNode ({ data, isConnectable, set, get, nodeId }){
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const [displayName, setDisplayNameState] = useState(data.displayName ?? "");
  const [filterCommands, setFilterCommandsState] = useState(data.filterCommands ?? "");
  const [description, setDescriptionState] = useState(data.description ?? ""); // Safe initialization

  const setMappingId = useCallback((value) => {
    data.mappingId = value;
  }, [data]);

  const setTableName = useCallback((value) => {
    data.tableName = value;
  }, [data]);

  const setDisplayName = useCallback((event) => {
    const value = event.target.value;
    setDisplayNameState(value); // Update local state
    data.displayName = value.length ? value : null; // Update data directly
  }, [data]);

  const setFilterCommands = useCallback((event) => {
    const value = event.target.value;
    setFilterCommandsState(value); // Update local state
    data.filterCommands = value.length ? value : null; // Update data directly
  }, [data]);

  const setDescription = useCallback((value) => {
    setDescriptionState(value); // Update local state
    data.description = value.length ? value : null; // Update data directly
  }, [data]);

  const removeNode = useCallback(() => {
    set({
      edges: get().edges.filter(({ source, target }) => source !== nodeId && target !== nodeId),
    });
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
    });
  }, [get, nodeId, set]);

  const handleExportJson = useCallback(() => {
    const exportedData = {
      mappingId: data.mappingId,
      tableName: data.tableName,
      displayName: data.displayName,
      filterCommands: data.filterCommands,
      description: data.description,
    };
    console.log("Exported JSON:", JSON.stringify(exportedData, null, 2));
  }, [data]);

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
            <Title order={5}>Data Target</Title>
            <Group justify="end">
              <ActionIcon variant="subtle" color="gray" style={{ marginRight: '3px' }} onClick={() => setHelpModalOpen(true)}>
                <IconHelpCircle />
              </ActionIcon>

              <Menu position="bottom-end" shadow="sm">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" style={{ marginRight: '3px' }}>
                    <IconFileDescriptionFilled style={{ marginRight: '3px' }} />
                  </ActionIcon>
                </Menu.Target>
                <ActionIcon variant="subtle" color="gray" style={{ marginRight: '3px' }} onClick={removeNode}>
                  <IconTrash />
                </ActionIcon>
                <Menu.Dropdown ref={menuRef}>
                  <JsonInput
                    label="Enter Description"
                    placeholder="Enter Description"
                    autosize
                    minRows={4}
                    value={description} // Bind to the state instead of data
                    onChange={(value) => setDescription(value)} // Update the state and data
                  />
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>

          <Stack bg="var(--mantine-color-body)" align="stretch" justify="start" gap="md">
            <Group justify="space-between">
              <div>Select Mapping ID</div>
              <Select
                placeholder="Select Mapping ID"
                data={Object.values(mappingSource)}
                value={data.mappingId}
                onChange={setMappingId}
                allowDeselect={true}
              />
            </Group>

            <Group justify="space-between">
              <div>Select Table Name</div>
              <Select
                placeholder="Select Table Name"
                data={Object.values(tableSource)}
                value={data.tableName}
                onChange={setTableName}
                allowDeselect={true}
              />
            </Group>

            <Group justify="space-between">
              <div>Display Name</div>
              <TextInput
                placeholder="Enter Display Name"
                value={displayName} // Bind to the state instead of data
                onChange={setDisplayName} // Update the state on input change
              />
            </Group>

            <Group justify="space-between">
              <div>Filter Commands</div>
              <TextInput
                placeholder="Enter Filter Commands"
                value={filterCommands} // Bind to the state instead of data
                onChange={setFilterCommands} // Update the state on input change
              />
            </Group>

            <Group justify="end">
              <Button onClick={handleExportJson}>Export JSON</Button>
            </Group>
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
};

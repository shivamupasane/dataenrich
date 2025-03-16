import React, { useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ActionIcon, Button, Card, Group, JsonInput, Menu, Stack, TextInput, Title,Collapse } from '@mantine/core';
import { IconFileDescriptionFilled, IconHelpCircle, IconTrash, IconSql, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-github';

export default function FilterNode({ data = {}, isConnectable }) {
  const [nodeOpen, setNodeOpen] = useState(true);
  const [filter, setFilter] = useState({
    filterName: data.filterName || "",
    displayName: data.displayName || "",
    filterCommands: data.filterCommands || "",
    advancedFilterCommands: data.advancedFilterCommands || "", // New property
    description: data.description || ""
  });

  // ✅ Automatically open SQL editor if filterCommands is empty but advancedFilterCommands exists
  const [isSqlEditorOpen, setIsSqlEditorOpen] = useState(
    !filter.filterCommands && !!filter.advancedFilterCommands
  );

  // ✅ Handle changes properly
  const setFilterName = useCallback((event) => {
    setFilter((prev) => ({ ...prev, filterName: event.target.value }));
  }, []);

  const setDisplayName = useCallback((event) => {
    setFilter((prev) => ({ ...prev, displayName: event.target.value }));
  }, []);

  const setFilterCommands = useCallback((event) => {
    setFilter((prev) => ({ ...prev, filterCommands: event.target.value }));
  }, []);

  const setAdvancedFilterCommands = useCallback((newValue) => {
    setFilter((prev) => ({ ...prev, advancedFilterCommands: newValue }));
  }, []);

  const setFilterDescription = useCallback((event) => {
    setFilter((prev) => ({
      ...prev,
      description: event.target?.value || "" // Ensure it's always a string
    }));
  }, []);

  const removeNode = useCallback(() => {
      if (data.deleteNode) {
        data.deleteNode(); 
      } else {
        console.error("deleteNode function not found in data");
      }
    }, [data]);

  const exportJson = () => {
    const json = JSON.stringify(filter, null, 2);
    console.log("Exported JSON:", json);
  };

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
            <Title order={5}>Filter</Title>
            <Group justify="end">
              <ActionIcon variant="subtle" color="gray">
                <IconHelpCircle />
              </ActionIcon>

              <Menu position="bottom-end" shadow="sm">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconFileDescriptionFilled />
                  </ActionIcon>
                </Menu.Target>
                <ActionIcon variant="subtle" color="gray" onClick={removeNode}>
                  <IconTrash />
                </ActionIcon>
                <Menu.Dropdown>
                  <JsonInput
                    label="Enter Description"
                    placeholder="Enter Description"
                    autosize
                    minRows={4}
                    value={filter.description}
                    onChange={setFilterDescription}
                  />
                </Menu.Dropdown>
              </Menu>
              <ActionIcon
                    onClick={() => setNodeOpen(!nodeOpen)}
                    style={{ marginLeft: '10px' }}
                  >
                    {nodeOpen ? <IconChevronUp /> : <IconChevronDown />}
                  </ActionIcon>
            </Group>
          </Group>
 <Collapse in={nodeOpen}>
          <Stack bg="var(--mantine-color-body)" align="stretch" justify="start" gap="md">
            <Group justify="space-between">
              <div>Filter Name</div>
              <TextInput placeholder="Filter Name" value={filter.filterName} onChange={setFilterName} />
            </Group>

            <Group justify="space-between">
              <div>Display Name</div>
              <TextInput placeholder="Display Name" value={filter.displayName} onChange={setDisplayName} />
            </Group>

            <Group justify="space-between">
              <div>Filter Commands</div>
              <Group>
                <TextInput
                  placeholder="Filter Commands"
                  value={filter.filterCommands}
                  onChange={setFilterCommands}
                  disabled={isSqlEditorOpen} // Disable text input while SQL editor is open
                />
                {/* SQL Editor Toggle Button */}
                <ActionIcon variant="subtle" color="blue" onClick={() => setIsSqlEditorOpen(!isSqlEditorOpen)}>
                  <IconSql />
                </ActionIcon>
              </Group>
            </Group>

            {/* SQL Editor */}
            {isSqlEditorOpen && (
              <div style={{ marginTop: '10px', border: '1px solid #ddd', padding: '10px' }}>
                <AceEditor
                  mode="sql"
                  theme="github"
                  name="sql-editor"
                  value={filter.advancedFilterCommands}
                  onChange={setAdvancedFilterCommands}
                  editorProps={{ $blockScrolling: true }}
                  height="200px"
                  width="100%"
                />
              </div>
            )}

            <Button variant="outline" color="blue" onClick={exportJson}>
              Export JSON
            </Button>
          </Stack>
          </Collapse>
        </Stack>
      </Card>
      <Handle type="source" position={Position.Right} id="a" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="b" isConnectable={isConnectable} />
    </>
  );
}

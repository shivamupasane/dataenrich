import React, { useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ActionIcon, Button, Card, Group, Stack, TextInput, Title, NumberInput, Divider, Collapse, Modal, Menu, Textarea } from '@mantine/core';
import { IconTrash, IconChevronDown, IconChevronUp, IconHelpCircle, IconFileDescription } from '@tabler/icons-react';

export default function AddColumnNode({ data, isConnectable }) {
  const [nodeOpen, setNodeOpen] = useState(true);
  const [columns, setColumns] = useState([
    {
      mappingId: '',
      name: '',
      columnName: '',
      dataType: '',
      precision: '',
      scale: '',
      columnOrder: '',
      columnType: '',
      columnExpression: '',
      isOpen: false // state for collapsible sections
    }
  ]);

  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [descriptionMenuOpen, setDescriptionMenuOpen] = useState(false);
  const [descriptionContent, setDescriptionContent] = useState('');

  const handleInputChange = (index, field, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index][field] = value;
    setColumns(updatedColumns);
  };

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        mappingId: '',
        name: '',
        columnName: '',
        dataType: '',
        precision: '',
        scale: '',
        columnOrder: '',
        columnType: '',
        columnExpression: '',
        isOpen: false // start closed
      }
    ]);
  };

  const removeColumn = (index) => {
    const updatedColumns = columns.filter((_, i) => i !== index);
    setColumns(updatedColumns);
  };

  const toggleCollapse = (index) => {
    const updatedColumns = [...columns];
    updatedColumns[index].isOpen = !updatedColumns[index].isOpen;
    setColumns(updatedColumns);
  };

  const exportToJson = () => {
    const jsonData = JSON.stringify(columns, null, 2); // Convert columns to formatted JSON

    // Create a Blob and trigger a download
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'columns.json'; // Name of the file to be downloaded
    link.click(); // Trigger the download
  };

  const handleDeleteNode = useCallback(() => {
         if (data.deleteNode) {
           data.deleteNode(); 
         } else {
           console.error("deleteNode function not found in data");
         }
       }, [data]);

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
          <Group position="apart">
            <Title order={5}>Add Column</Title>
            <Group>
              {/* Help Icon - Opens Modal */}
              <ActionIcon onClick={() => setHelpModalOpen(true)} style={{ marginLeft: '10px' }}>
                <IconHelpCircle />
              </ActionIcon>

              {/* Description Icon - Opens Menu */}
              <Menu
                width={200}
                position="bottom-end"
                onOpen={() => setDescriptionMenuOpen(true)}
                onClose={() => setDescriptionMenuOpen(false)}
              >
                <Menu.Target>
                  <ActionIcon style={{ marginLeft: '10px' }}>
                    <IconFileDescription />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Textarea
                    label="Description"
                    placeholder="Enter description in JSON format"
                    value={descriptionContent}
                    onChange={(e) => setDescriptionContent(e.target.value)}
                    minRows={4}
                  />
                </Menu.Dropdown>
              </Menu>

              {/* Delete Node Icon - Deletes the node */}
              <ActionIcon
                color="red"
                onClick={handleDeleteNode}
                style={{ marginLeft: '10px' }}
              >
                <IconTrash />
              </ActionIcon>
               <ActionIcon
                                  onClick={() => setNodeOpen(!nodeOpen)}
                                  style={{ marginLeft: '10px' }}
                                >
                                  {nodeOpen ? <IconChevronUp /> : <IconChevronDown />}
                                </ActionIcon>
            </Group>
          </Group>

          <Collapse in={nodeOpen}>
          {columns.map((column, index) => (
            <Card key={index} shadow="sm" withBorder radius="md" padding="sm">
              <Group position="apart">
                <Title order={6}>
                  {column.columnName || `Column ${index + 1}`}
                </Title>
                <Group>
                  <ActionIcon
                    color="red"
                    onClick={() => removeColumn(index)}
                    style={{ marginLeft: '10px' }}
                  >
                    <IconTrash />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => toggleCollapse(index)}
                    style={{ marginLeft: '10px' }}
                  >
                    {column.isOpen ? <IconChevronUp /> : <IconChevronDown />}
                  </ActionIcon>
                </Group>
              </Group>
              <Divider style={{ marginBottom: '10px' }} />

              <Collapse in={column.isOpen}>
                <Stack gap="md">
                  <Group>
                    <TextInput
                      label="Mapping ID"
                      placeholder="Enter Mapping ID"
                      value={column.mappingId}
                      onChange={(e) => handleInputChange(index, 'mappingId', e.target.value)}
                    />
                  </Group>

                  <Group>
                    <TextInput
                      label="Name"
                      placeholder="Enter Name"
                      value={column.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    />
                  </Group>

                  <Group>
                    <TextInput
                      label="Column Name"
                      placeholder="Enter Column Name"
                      value={column.columnName}
                      onChange={(e) => handleInputChange(index, 'columnName', e.target.value)}
                    />
                  </Group>

                  <Group>
                    <TextInput
                      label="Data Type"
                      placeholder="Enter Data Type"
                      value={column.dataType}
                      onChange={(e) => handleInputChange(index, 'dataType', e.target.value)}
                    />
                  </Group>

                  <Group>
                    <NumberInput
                      label="Precision"
                      placeholder="Enter Precision"
                      value={column.precision}
                      onChange={(value) => handleInputChange(index, 'precision', value)}
                    />
                  </Group>

                  <Group>
                    <NumberInput
                      label="Scale"
                      placeholder="Enter Scale"
                      value={column.scale}
                      onChange={(value) => handleInputChange(index, 'scale', value)}
                    />
                  </Group>

                  <Group>
                    <NumberInput
                      label="Column Order"
                      placeholder="Enter Column Order"
                      value={column.columnOrder}
                      onChange={(value) => handleInputChange(index, 'columnOrder', value)}
                    />
                  </Group>

                  <Group>
                    <TextInput
                      label="Column Type"
                      placeholder="Enter Column Type"
                      value={column.columnType}
                      onChange={(e) => handleInputChange(index, 'columnType', e.target.value)}
                    />
                  </Group>

                  <Group>
                    <TextInput
                      label="Column Expression"
                      placeholder="Enter Column Expression"
                      value={column.columnExpression}
                      onChange={(e) => handleInputChange(index, 'columnExpression', e.target.value)}
                    />
                  </Group>
                </Stack>
              </Collapse>
            </Card>
          ))}

          <Button onClick={addColumn} variant="outline" color="blue">
            Add Column
          </Button>

          {/* Export JSON Button */}
          <Button onClick={exportToJson} variant="outline" color="green" style={{ marginTop: '20px' }}>
            Export JSON
          </Button>
          </Collapse>
        </Stack>
      </Card>

      {/* Help Modal */}
      <Modal
        opened={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="Help"
        size="lg"
      >
        <p>Here you can add, remove, and configure columns for your data table.</p>
        <p>Each column has options for mapping, data type, precision, and more.</p>
      </Modal>

      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
    </>
  );
}

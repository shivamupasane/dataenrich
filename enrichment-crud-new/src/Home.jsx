import { useState } from "react";
import {
  Table,
  Button,
  TextInput,
  Group,
  ActionIcon,
  Modal,
} from "@mantine/core";
import {
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const initialData = [
  {
    id: 1,
    mappingId: "MAP001",
    regionKey: "US",
    createdAt: "2024-02-25 12:30",
    updatedAt: "2024-02-26 10:15",
    createdBy: "Admin",
    updatedBy: "User1",
  },
  {
    id: 2,
    mappingId: "MAP002",
    regionKey: "EU",
    createdAt: "2024-02-24 14:50",
    updatedAt: "2024-02-26 08:45",
    createdBy: "Admin",
    updatedBy: "User2",
  },
];

export default function Home() {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(false);
  const [newMapping, setNewMapping] = useState({
    mappingId: "",
    regionKey: "",
    createdBy: "Admin",
  });

  const navigate = useNavigate();

  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddMapping = () => {
    setData((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        mappingId: newMapping.mappingId,
        regionKey: newMapping.regionKey,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: newMapping.createdBy,
        updatedBy: newMapping.createdBy,
      },
    ]);
    setNewMapping({ mappingId: "", regionKey: "", createdBy: "Admin" });
    setOpened(false);
  };

  const filteredData = data.filter((item) =>
    item.mappingId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <Group mb="md" position="apart">
        <TextInput
          placeholder="Search by Mapping ID..."
          icon={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Button onClick={() => setOpened(true)}>
  <IconPlus size={16} style={{ marginRight: 8 }} /> Add Mapping
</Button>
      </Group>

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Mapping ID</th>
            <th>Region Key</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Created By</th>
            <th>Updated By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.mappingId}</td>
              <td>{item.regionKey}</td>
              <td>{item.createdAt}</td>
              <td>{item.updatedAt}</td>
              <td>{item.createdBy}</td>
              <td>{item.updatedBy}</td>
              <td>
                <Group>
                  <ActionIcon
                    color="blue"
                    onClick={() => navigate(`/edit/${item.id}`)}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="green"
                    onClick={() => navigate(`/edit/${item.id}`)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon color="red" onClick={() => handleDelete(item.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Add New Mapping">
        <TextInput
          label="Mapping ID"
          value={newMapping.mappingId}
          onChange={(e) => setNewMapping({ ...newMapping, mappingId: e.target.value })}
        />
        <TextInput
          label="Region Key"
          value={newMapping.regionKey}
          onChange={(e) => setNewMapping({ ...newMapping, regionKey: e.target.value })}
        />
        <Button fullWidth mt="md" onClick={handleAddMapping}>
          Add Mapping
        </Button>
      </Modal>
    </div>
  );
}

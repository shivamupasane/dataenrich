import React, { useRef, useCallback, useEffect, useState } from "react";
import { ReactFlow, addEdge, useNodesState, useEdgesState, Controls, useReactFlow, Background } from "@xyflow/react";
import { Button, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { DnDProvider, useDnD } from "../DnDContext";
import Sidebar from "../Sidebar";
import DataSourceNode from "../DataSource";
import DataTargetNode from "../DataTarget";
import ColumnSelectorNode from "../ColumnSelectorNode";
import AddColumnNode from "../AddColumn";
import FilterNode from "../FilterNode";
import "@mantine/code-highlight/styles.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@xyflow/react/dist/style.css";

// Sample JSON with preloaded nodes and edges
const jsonData = {
  nodes: [
    { id: "1", type: "dataSource", data: { mappingId: "src-001", tableName: "customers" }, position: { x: 100, y: 100 } },
    { id: "2", type: "filter", data: { filterName: "age-filter" }, position: { x: 500, y: 100 } },
    { id: "3", type: "columnSelector", data: { mappingId: "col-selector-001" }, position: { x: 900, y: 100 } },
    { id: "4", type: "addColumn", data: { mappingId: "add-col-001" }, position: { x: 1300, y: 100 } },
    { id: "5", type: "dataTarget", data: { mappingId: "target-001" }, position: { x: 1700, y: 100 } },
  ],
  edges: [
    { id: "e1", source: "1", target: "2", animated: true },
    { id: "e2", source: "2", target: "3", animated: true },
    { id: "e3", source: "3", target: "4", animated: true },
    { id: "e4", source: "4", target: "5", animated: true },
  ],
};

export default function MappingEditor() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(jsonData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(jsonData.edges);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  // ✅ Ensure correct nodeTypes match JSON
  const nodeTypes = {
    dataSource: DataSourceNode,
    filter: FilterNode,
    columnSelector: ColumnSelectorNode,
    addColumn: AddColumnNode,
    dataTarget: DataTargetNode,
  };

  const handleDeleteNode = useCallback(
    (nodeId) => {
      // Remove the node
      const updatedNodes = nodes.filter((node) => node.id !== nodeId);
      setNodes(updatedNodes);
      jsonData.nodes = updatedNodes;
  
      // Remove edges connected to this node
      const updatedEdges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
      setEdges(updatedEdges);
      jsonData.edges = updatedEdges;
    },
    [nodes, edges]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!type) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      const newNode = {
        id: `node_${nodes.length + 1}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => [...nds, newNode]);
      jsonData.nodes.push(newNode);
    },
    [screenToFlowPosition, type, nodes]
  );

  // ✅ Export function to download updated JSON
  const exportToJson = () => {
    const jsonString = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "flow_data.json";
    link.click();
  };

  return (
    <div
      className="dndflow"
      style={{
        width: "100vw",
        height: "100vh",
        padding: 20,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ width: "80vw", height: "80vh" }}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              deleteNode: () => handleDeleteNode(node.id), // ✅ Pass delete function to nodes
            },
          }))}
          edges={edges}
          minZoom={0.2}
          maxZoom={4}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          style={{ backgroundColor: "#F7F9FB" }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {/* Export JSON Button */}
      <div style={{ padding: "10px", textAlign: "center" }}>
        <Button onClick={exportToJson} variant="outline" color="blue">
          Export JSON
        </Button>
      </div>

      <Sidebar />
    </div>
  );
}

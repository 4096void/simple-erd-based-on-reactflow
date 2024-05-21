import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  getIncomers,
  getOutgoers,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TableNode from './components/TableNode.jsx';
const nodeTypes = { table: TableNode };
import { tables } from './data/tables.js';
import {
  calculateSourcePosition,
  calculateTargetPosition,
  getLayoutedElements,
} from './data/utils';

const databaseNames = Object.keys(tables);
const initialNodes = databaseNames.map((db, idx) => ({
  id: tables[db].name,
  type: 'table',
  position: { x: 20 + idx * 300, y: 40},
  data: {
    name: tables[db].name,
    columns: tables[db].columns,
  }
}));

const initialEdges = [];
databaseNames.forEach(db => {
  let { columns } = tables[db];
  columns.forEach(clmn => {
    if (clmn.fk) {
      let {
        name,
        foreignKeyTable,
        foreignKeyColumn,
      } = clmn;
      
      initialEdges.push({
        id: `${foreignKeyTable}@${foreignKeyColumn}$$${db}@${name}`,
        source: foreignKeyTable,
        sourceHandle: `${foreignKeyTable}@${foreignKeyColumn}-left`,
        target: db,
        targetHandle: `${db}@${name}-left`,
        animated: true,
      });
      clmn.target = true;

      let nodeIdx = initialNodes.findIndex(node => node.id === foreignKeyTable);
      let clmIdx = initialNodes[nodeIdx].data.columns.findIndex(clm => clm.name === foreignKeyColumn);
      initialNodes[nodeIdx].data.columns[clmIdx].source = true;
    }
  });
});

const {
  nodes: layoutedNodes,
  edges: layoutedEdges,
} = getLayoutedElements(initialNodes, initialEdges);

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNodesChange = useCallback(
    (nodeChanges) => {
      nodeChanges.forEach(nodeChange => {
        if (nodeChange.type === 'position' && nodeChange.positionAbsolute) {
          const node = nodes.find(node => node.id === nodeChange.id);

          const incomingNodes = getIncomers(node, nodes, edges);
          incomingNodes.forEach(incomingNode => {
            const edgeList = edges.filter(edge => {
              const [start, end] = edge.id.split('$$');
              return start.split('@')[0] === incomingNode.id && end.split('@')[0] === node.id;
            });

            if (nodeChange.positionAbsolute.x) {
              setEdges(eds => eds.map(ed => {
                if (edgeList.length > 0 && edgeList.find(edge => edge.id === ed.id)) {
                  const sourcePosition = calculateSourcePosition(incomingNode.width, incomingNode.position.x, node.width, nodeChange.positionAbsolute.x);
                  const targetPosition = calculateTargetPosition(incomingNode.width, incomingNode.position.x, node.width, nodeChange.positionAbsolute.x);

                  const sourceHandle = `${ed.sourceHandle.split('-')[0]}-${sourcePosition}`;
                  const targetHandle = `${ed.targetHandle.split('-')[0]}-${targetPosition}`;

                  ed.sourceHandle = sourceHandle;
                  ed.targetHandle = targetHandle;
                }
                return ed;
              }));
            }
          });
          
          const outgoingNodes = getOutgoers(node, nodes, edges);
          outgoingNodes.forEach(targetNode => {
            const edgeList = edges.filter(edge => {
              const [start, end] = edge.id.split('$$');
              return end.split('@')[0] === targetNode.id && start.split('@')[0] === node.id;
            });

            if (nodeChange.positionAbsolute.x) {
              setEdges(eds => eds.map(ed => {
                if (edgeList.length > 0 && edgeList.find(edge => edge.id === ed.id)) {
                  const sourcePosition = calculateSourcePosition(node.width, nodeChange.positionAbsolute.x, targetNode.width, targetNode.position.x);
                  const targetPosition = calculateTargetPosition(node.width, nodeChange.positionAbsolute.x, targetNode.width, targetNode.position.x);

                  const sourceHandle = `${ed.sourceHandle.split('-')[0]}-${sourcePosition}`;
                  const targetHandle = `${ed.targetHandle.split('-')[0]}-${targetPosition}`;

                  ed.sourceHandle = sourceHandle;
                  ed.targetHandle = targetHandle;
                }
                return ed;
              }));
            }
          });
        }
      });
      
      onNodesChange(nodeChanges);
    },
    [onNodesChange, setEdges, nodes, edges]
  );
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={handleNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <MiniMap />
      <Controls />
      <Background
        variant="dots"
        gap={12}
        size={1}
      />
    </ReactFlow>
  );
}
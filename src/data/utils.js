import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 300;
const nodeHeight = 283;

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const calculateSourcePosition = (
  sourceNodeWidth,
  sourceNodeX,
  targetNodeWidth,
  targetNodeX
) => {
  if(sourceNodeX > (targetNodeX + targetNodeWidth)) {
    return "left";
  } else if (sourceNodeX > targetNodeX && sourceNodeX < (targetNodeX + targetNodeWidth)) {
    return "right";
  } else if ((sourceNodeX + sourceNodeWidth) > targetNodeX) {
    return "left";
  } else {
    return "right";
  }
};

const calculateTargetPosition = (
  sourceNodeWidth,
  sourceNodeX,
  targetNodeWidth,
  targetNodeX
) => {
  if(sourceNodeX > (targetNodeX + targetNodeWidth)) {
    return "right";
  } else if (sourceNodeX > targetNodeX && sourceNodeX < (targetNodeX + targetNodeWidth)) {
    return "right";
  } else if ((sourceNodeX + sourceNodeWidth) > targetNodeX) {
    return "left";
  } else {
    return "left";
  }
};

export {
  getLayoutedElements,
  calculateSourcePosition,
  calculateTargetPosition,
}
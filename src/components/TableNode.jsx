import React from 'react';
import PropTypes from 'prop-types';

import {
  Handle,
  Position,
} from 'reactflow';
import './TableNode.css';

/*
  - edge writing fails
*/

TableNode.propTypes = {
  data: PropTypes.any
}

export default function TableNode({ data }) {
  let {
    name: dbName,
    columns,
  } = data;
  
  return (
    <div className="table">
      <div className="table__name">{ dbName }</div>
      <div className="table__columns">
        {columns.map((column, index) => (
          <div
            key={index}
            className="column-name"
          >
            {column.source && <Handle
              type="source"
              position={Position.Left}
              id={`${dbName}@${column.name}-left`}
            />}            
            {column.source && <Handle
              type="source"
              position={Position.Right}
              id={`${dbName}@${column.name}-right`}
            />}
            {column.target && <Handle
              type="target"
              position={Position.Left}
              id={`${dbName}@${column.name}-left`}
            />}
            {column.target && <Handle
              type="target"
              position={Position.Right}
              id={`${dbName}@${column.name}-right`}
            />}
            <span>{column.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
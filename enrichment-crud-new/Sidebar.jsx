import React from 'react';
import { useDnD } from './DnDContext';

export default () => {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode custom" onDragStart={(event) => onDragStart(event, 'dataSource')} draggable>
        Data Source
      </div>
      <div className="dndnode custom" onDragStart={(event) => onDragStart(event, 'filter')} draggable>
        Filter
      </div>
      <div className="dndnode custom" onDragStart={(event) => onDragStart(event, 'columnSelector')} draggable>
        Column Selector
      </div>
      <div className="dndnode custom" onDragStart={(event) => onDragStart(event, 'addColumn')} draggable>
        Add Column
      </div>
      <div className="dndnode custom" onDragStart={(event) => onDragStart(event, 'dataTarget')} draggable>
        Data Target
      </div>
    </aside>
  );
};

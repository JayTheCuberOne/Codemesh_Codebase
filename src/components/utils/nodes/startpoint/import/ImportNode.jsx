import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

function ImportNode() {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="import-node">
      <div>
        <label htmlFor="text" className="import-node_label">IMPORT</label>
        <input className="import-node_input" placeholder='Search Python Library'/>
      </div>
      <Handle type="source" position={Position.Right} id="b"/>
    </div>
  );
}

export default ImportNode;

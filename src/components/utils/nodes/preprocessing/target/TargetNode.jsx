import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

function TargetNode() {
//   const onChange = useCallback((evt) => {
//     console.log(evt.target.value);
//   }, []);

  return (
    <div className="target-node">
      <div>
        <label htmlFor="text">TARGETING</label>
        <input className="target-node_input" placeholder='target column'/>
        <input className="target-node_input" placeholder='predict column'/>
      </div>
      <Handle type="target" position={Position.Left} id="b"/>
      <Handle type="source" position={Position.Right} id="b"/>
    </div>
  );
}

export default TargetNode;

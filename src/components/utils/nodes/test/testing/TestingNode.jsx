import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

function TestingNode() {
    return (
        <div className="training-node">
            <div>
                <label htmlFor="text" className="training-node_label">TESTING</label>
            </div>
            <Handle type="target" position={Position.Left} />
            {/* <Handle type="source" position={Position.Right} /> */}
        </div>
    );
}

export default TestingNode;

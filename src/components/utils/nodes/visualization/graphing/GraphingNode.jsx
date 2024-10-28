import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import Form from 'react-bootstrap/Form';

function GraphingNode() {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    return (
        <div className="graphing-node">
            <div>
                <label htmlFor="text" className="graphing-node_label">GRAPHING</label>
                <Form.Select size='sm' aria-label="Default select example" className='graphing-node_select'>
                    <option value="jack">Jack</option>
                    <option value="lucy">Lucy</option>
                    <option value="yiminghe">Yiminghe</option>
                </Form.Select>
            </div>
            <Handle type="target" position={Position.Left} />
        </div>
    );
}

export default GraphingNode;
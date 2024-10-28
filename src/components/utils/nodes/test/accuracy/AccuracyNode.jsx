import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import {
    useRecoilState,
} from 'recoil';
import { accuracyTypeState, accuracyContentState } from '../../../RecoilRoots'

function AccuracyNode() {
    const [accuracytype, setAccuracyType] = useRecoilState(accuracyTypeState);
    const [accuracycontent, setAccuracyContent] = useRecoilState(accuracyContentState);

    return (
        <div className="accuracy-node">
            <div>
                <label htmlFor="text" className="accuracy-node_label">{accuracytype && accuracytype.toUpperCase()}</label><br/>
                <label htmlFor="text" className="accuracy-node_sublabel">{accuracycontent}</label>
            </div>
            <Handle type="target" position={Position.Left} />
        </div>
    );
}

export default AccuracyNode;

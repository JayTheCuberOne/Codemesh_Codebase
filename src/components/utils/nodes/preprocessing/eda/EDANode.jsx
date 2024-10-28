import { useCallback, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { NaNvalueconversionState, targetColumnState } from '../../../RecoilRoots'

function EDANode() {
  const [NaNvalueconversion, setNaNvalueconversion] = useRecoilState(NaNvalueconversionState);
  const [targetColumn, setTargetColumn] = useRecoilState(targetColumnState);

  // for debugging
  // useEffect(() => {
  //   console.log("NaN,Target@EDANode",NaNvalueconversion,targetColumn)
  // }, []);


  return (
    <div className="eda-node">
      <div>
        <label htmlFor="text" className="eda-node_label">EDA</label>
        <label htmlFor="text" className="eda-node_sublabel">Change NaN into</label>
        <input 
          className="eda-node_input" 
          placeholder="Swapping values" 
          value={NaNvalueconversion}
          onChange={e => { setNaNvalueconversion(e.target.value)}}
        ></input>
        <label htmlFor="text" className="eda-node_sublabel">Target</label>
        <input 
          className="eda-node_input" 
          placeholder="Target Column"
          value={targetColumn}
          onChange={e => { setTargetColumn(e.target.value)}}
        ></input>
      </div>
      <Handle type="target" position={Position.Left} id="b" />
      <Handle type="source" position={Position.Right} id="b" />
    </div>
  );
}

export default EDANode;

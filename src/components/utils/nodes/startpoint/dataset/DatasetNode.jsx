import { useCallback, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { selectableDataState, selectedDataState } from '../../../RecoilRoots'
import { uploadFile } from '../../../Fetcher';

function DatasetNode() {

  const [selectableData, setSelectableData] = useRecoilState(selectableDataState);
  const [selectedData, setSelectedData] = useRecoilState(selectedDataState);

  const handleAddOption = (data) => {
    if (!selectableData.includes(data)) {
      setSelectableData([...selectableData, data]);
      console.log(selectableData)
    }
  };

  const loadCSV = async (evt) => {
    if (evt.target.files.length != 0) {
      var temp = '';
      const res = await uploadFile(evt.target.files[0]);
      temp = evt.target.files[0].name
      handleAddOption(temp);
      temp = '';
    }
  }

  // for debugging
  // useEffect(() => {
  //     console.log("selectedData@DatasetNode",selectedData)
  // }, []);

  return (
    <div className="dataset-node">
      <div>
        <label htmlFor="text" className="dataset-node_label">DATASET</label>
        <center>
          <label className='dataset-node_sublabel'>Choose a Dataset to Use</label>
          <Form.Select size='sm' aria-label="Default select example" className='dataset-node_select'
            onChange={e => { setSelectedData(e.target.value) }}
            value={selectedData}
          >
            {selectableData.map((option, index) => (
              <option key={index} value={option}>{option == 'iris' ? 'Iris Species' : option == 'wine' ? 'Wine Quality' : option == 'boston' ? 'Boston Housing' : option}</option>
            ))}
          </Form.Select>
          <label className='dataset-node_sublabel'>Or Upload Your Own!</label>
          <label htmlFor="file">
            <input type="file" name="file" id="file" accept=".csv" onChange={loadCSV} />
            <div className="dataset-node_upload">Upload CSV File</div>
          </label>
        </center>
      </div>
      {/* <Handle type="source" position={Position.Right} className="dataset-node_tablesource" />
      <br />
      <br /> */}
      <Handle type="source" position={Position.Right} className="dataset-node_modelsource" />
    </div>
  );
}

export default DatasetNode;

import { useCallback } from 'react';
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
import { regressionModelState, regressionModelOptionState } from '../../../RecoilRoots'

function RegressionNode() {
    const [regressionmodel, setRegressionModel] = useRecoilState(regressionModelState);
    const [regressionmodeloption, setRegressionModelOption] = useRecoilState(regressionModelOptionState);

    return (
        <div className="regression-node">
            <div>
                <label htmlFor="text" className="regression-node_label">REGRESSION</label>
                <center>
                    <Form.Select size='sm' aria-label="Default select example" className='regression-node_select'
                        onChange={e => { setRegressionModel(e.target.value) }}
                        value={regressionmodel}
                    >
                        <option value="linearregression">Linear Regression</option>
                        <option value="knn">K Nearest Neighbors</option>
                        <option value="svm">Support Vector Machine</option>
                        <option value="decisiontree">Decision Tree</option>
                        <option value="randomforest">Random Forest</option>
                    </Form.Select>
                </center>
                <label htmlFor="text" className="regression-node_sublabel">Hyperparameters</label>
                {
                    regressionmodel == "knn" ?
                        <>
                            <InputGroup>
                                <InputGroup.Text className='regression-node_hyperparameter_label'>Neighbors</InputGroup.Text>
                                {' '}
                                <Form.Control
                                    className='regression-node_hyperparameter_input'
                                    placeholder="Number of Neighbors"
                                    aria-label="n_neighbors"
                                    type='number'
                                    onChange={e => { setRegressionModelOption(e.target.value) }}
                                    value={regressionmodeloption}
                                />
                            </InputGroup>
                        </> : regressionmodel == "svm" ?
                        <>
                            <InputGroup>
                                <InputGroup.Text className='regression-node_hyperparameter_label'>Max Iteration</InputGroup.Text>
                                {' '}
                                <Form.Control
                                    className='regression-node_hyperparameter_input'
                                    placeholder="Maximum Iteration"
                                    aria-label="max_it"
                                    type='number'
                                    onChange={e => { setRegressionModelOption(e.target.value) }}
                                    value={regressionmodeloption}
                                />
                            </InputGroup>
                        </> : regressionmodel == "randomforest" ?
                        <>
                            <InputGroup>
                                <InputGroup.Text className='regression-node_hyperparameter_label'>Estimators</InputGroup.Text>
                                {' '}
                                <Form.Control
                                    className='regression-node_hyperparameter_input'
                                    placeholder="Number of Estimators"
                                    aria-label="n_estimators"
                                    type='number'
                                    onChange={e => { setRegressionModelOption(e.target.value) }}
                                    value={regressionmodeloption}
                                />
                            </InputGroup>
                        </> :
                            <label className='regression-node_sublabel'>No Hyperparameters</label>
                }
            </div>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default RegressionNode;

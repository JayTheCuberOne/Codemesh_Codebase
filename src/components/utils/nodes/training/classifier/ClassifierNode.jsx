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
import { classifierModelState, classifierModelOptionState } from '../../../RecoilRoots'

function ClassifierNode() {
    const [classifiermodel, setClassifierModel] = useRecoilState(classifierModelState);
    const [classifiermodeloption, setClassifierModelOption] = useRecoilState(classifierModelOptionState);

    return (
        <div className="classifier-node">
            <div>
                <label htmlFor="text" className="classifier-node_label">CLASSIFIER</label>
                <center>
                    <Form.Select size='sm' aria-label="Default select example" className='classifier-node_select'
                        onChange={e => { setClassifierModel(e.target.value) }}
                        value={classifiermodel}
                    >
                        <option value="gaussiannb">Gaussian NB</option>
                        <option value="logisticregression">Logistic Classification</option>
                        <option value="knn">K Nearest Neighbors</option>
                        <option value="svm">Support Vector Machine</option>
                        <option value="decisiontree">Decision Tree</option>
                        <option value="randomforest">Random Forest</option>
                    </Form.Select>
                </center>
                <label htmlFor="text" className="classifier-node_sublabel">Hyperparameters</label>
                {
                        classifiermodel == "gaussiannb" ?
                        <>
                            <InputGroup>
                                <InputGroup.Text className='classifier-node_hyperparameter_label'>Alpha</InputGroup.Text>
                                {' '}
                                <Form.Control
                                    className='classifier-node_hyperparameter_input'
                                    placeholder="Force Alpha?"
                                    aria-label="force_alpha"
                                    type='number'
                                    onChange={e => { setClassifierModelOption(e.target.value) }}
                                    value={classifiermodeloption}
                                />
                            </InputGroup>
                        </> : classifiermodel == "knn" ?
                        <>
                            <InputGroup>
                                <InputGroup.Text className='classifier-node_hyperparameter_label'>Neighbors</InputGroup.Text>
                                {' '}
                                <Form.Control
                                    className='classifier-node_hyperparameter_input'
                                    placeholder="Number of Neighbors"
                                    aria-label="n_neighbors"
                                    type='number'
                                    onChange={e => { setClassifierModelOption(e.target.value) }}
                                    value={classifiermodeloption}
                                />
                            </InputGroup>
                        </> : classifiermodel == "svm" ?
                        <>
                            <InputGroup>
                                <InputGroup.Text className='classifier-node_hyperparameter_label'>Max Iteration</InputGroup.Text>
                                {' '}
                                <Form.Control
                                    className='classifier-node_hyperparameter_input'
                                    placeholder="Maximum Iteration"
                                    aria-label="max_it"
                                    type='number'
                                    onChange={e => { setClassifierModelOption(e.target.value) }}
                                    value={classifiermodeloption}
                                />
                            </InputGroup>
                        </> : classifiermodel == "randomforest" ?
                        <>
                            <InputGroup>
                                <InputGroup.Text className='classifier-node_hyperparameter_label'>Estimators</InputGroup.Text>
                                {' '}
                                <Form.Control
                                    className='classifier-node_hyperparameter_input'
                                    placeholder="Number of Estimators"
                                    aria-label="n_estimators"
                                    type='number'
                                    onChange={e => { setClassifierModelOption(e.target.value) }}
                                    value={classifiermodeloption}
                                />
                            </InputGroup>
                        </> :
                            <label className='classifier-node_sublabel'>No Hyperparameters</label>
                }
            </div>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    );
}

export default ClassifierNode;

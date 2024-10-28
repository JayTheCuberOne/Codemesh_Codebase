import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { GrAdd, GrSubtract } from "react-icons/gr";
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';
import Badge from '@mui/joy/Badge';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Checkbox from '@mui/joy/Checkbox';
import { trainingPortionState } from '../../../RecoilRoots'

function TrainingNode() {

    const [trainingPortion, setTrainingPortion] = useRecoilState(trainingPortionState);

    const onAdd = () => {
        if (trainingPortion + 5 > 80) {
            setTrainingPortion(80);
        } else {
            setTrainingPortion(trainingPortion + 5);
        }
    }

    const onSubtract = () => {
        if (trainingPortion - 5 < 20) {
            setTrainingPortion(20);
        } else {
            setTrainingPortion(trainingPortion - 5);
        }
    }

    return (
        <div className="training-node">
            <div>
                <label htmlFor="text" className="training-node_label">TRAINING</label>
                <div>
                    <p className='training-node_text'>Training Portion</p>
                    <button className="training-node_subtract" onClick={() => onSubtract()}><GrSubtract /></button>
                    <Form.Control disabled className="training-node_input" value={trainingPortion + "%"} />
                    <Button className="training-node_add" onClick={() => onAdd()}><GrAdd /></Button>
                </div>
                {/* <IconButton
                    size="sm"
                    variant="outlined"
                    onClick={() => setCount((c) => c - 1)}
                >
                    <Remove />
                </IconButton>
                <Typography fontWeight="md" textColor="text.secondary">
                    {count}
                </Typography>
                <IconButton
                    size="sm"
                    variant="outlined"
                    onClick={() => setCount((c) => c + 1)}
                >
                    <Add />
                </IconButton> */}
            </div>
            <Handle type="target" position={Position.Left} />
            {/* <Handle type="source" position={Position.Right} id="testinghandle" style={{top:"50px"}}/> */}
            {/*
            <Handle
                type="source"
                position={Position.Right}
                id="accuracyhandle"
            // style={{top:"70px"}}
            />
            */}
        </div>
    );
}

export default TrainingNode;
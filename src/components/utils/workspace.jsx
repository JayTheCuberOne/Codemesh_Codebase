import { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useViewport
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from 'recoil';

import {
  currentWorkspaceState,
  selectableDataState,
  selectedDataState,
  trainingPortionState,
  regressionModelState,
  regressionModelOptionState,
  classifierModelState,
  classifierModelOptionState,
  jwtTokenState,
  NaNvalueconversionState,
  targetColumnState,
  accuracyTypeState,
  accuracyContentState
} from './RecoilRoots.jsx';

import { PiFastForwardFill, PiExportBold } from "react-icons/pi";

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import DatasetNode from './nodes/startpoint/dataset/DatasetNode.jsx';
import TargetNode from './nodes/preprocessing/target/TargetNode.jsx';
import ImportNode from './nodes/startpoint/import/ImportNode.jsx';
import EDANode from './nodes/preprocessing/eda/EDANode.jsx';
import RegressionNode from './nodes/training/regression/RegressionNode.jsx';
import ClassifierNode from './nodes/training/classifier/ClassifierNode.jsx';
import TrainingNode from './nodes/training/training/TrainingNode.jsx';
import TestingNode from './nodes/test/testing/TestingNode.jsx';
import AccuracyNode from './nodes/test/accuracy/AccuracyNode.jsx';
import GraphNode from './nodes/visualization/graphing/GraphingNode.jsx';

import '../../index.css';
import './nodes/startpoint/dataset/dataset-node.css';
import './nodes/preprocessing/target/target-node.css';
import './nodes/startpoint/import/import-node.css';
import './nodes/preprocessing/eda/eda-node.css';
import './nodes/training/regression/regression-node.css';
import './nodes/training/classifier/classifier-node.css';
import './nodes/training/training/training-node.css';
// import './nodes/visualization/graphing/graphing-node.css';
// import './nodes/test/testing/testing-node.css';
import './nodes/test/accuracy/accuracy-node.css';

import { createWorkspace, getMe, prepareWorkingDirectory, runCode, exportCode, readWorkspace, readWorkspaceWithID } from './Fetcher.js';

import Toast from 'react-bootstrap/Toast';
import { ToastContainer } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// cookie

// const initialNodes = [
//   {
//     id: 'node-1',
//     type: 'datasetnode',
//     position: { x: 0, y: 0 }
//   },
//   {
//     id: 'node-2',
//     type: 'edanode',
//     targetPosition: 'top',
//     position: { x: 300, y: 0 }
//   },
//   {
//     id: 'node-3',
//     type: 'trainingnode',
//     targetPosition: 'top',
//     position: { x: 600, y: 0 }
//   },
//   // {
//   //   id: 'node-4',
//   //   type: 'testingnode',
//   //   position: { x: 900, y: -100 }
//   // },
//   {
//     id: 'node-5',
//     type: 'accuracynode',
//     position: { x: 900, y: 0 }
//   },
//   {
//     id: 'node-6',
//     type: 'graphnode',
//     position: { x: 900, y: 200 }
//   },
//   {
//     id: 'node-7',
//     type: 'classifiernode',
//     targetPosition: 'top',
//     position: { x: 400, y: 100 }
//   },
// ];

// const initialEdges = [
//   { id: 'edge-1', source: 'node-1', target: 'node-2' },
//   { id: 'edge-2', source: 'node-2', target: 'node-7' },
//   { id: 'edge-3', source: 'node-7', target: 'node-3' },
//   { id: 'edge-4', source: 'node-3', target: 'node-6', sourceHandle: 'accuracyhandle' }, //edge configure
//   { id: 'edge-5', source: 'node-3', target: 'node-5', sourceHandle: 'testinghandle' },
// ];

const nodeTypes = {
  datasetnode: DatasetNode,
  // targetnode: TargetNode,
  // importnode: ImportNode,
  edanode: EDANode,
  regressionnode: RegressionNode,
  trainingnode: TrainingNode,
  // testingnode: TestingNode,
  accuracynode: AccuracyNode,
  // graphnode: GraphNode,
  classifiernode: ClassifierNode
};

const proOptions = { hideAttribution: true };

function Flow() {
  const workSpaceId = useRecoilValue(currentWorkspaceState);
  const reactFlowWrapper = useRef(null);

  // let { workspaceId } = useParams();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  //const { viewport_x, viewport_y, viewport_zoom } = useViewport(); // added
  const [rfInstance, setRfInstance] = useState({ nodes: [], edges: [], viewport: { x:0, y:0, zoom:1 } });
  // const reactFlow = useReactFlow();

  // const [currentWorkspace, setCurrentWorkspace] = useState(-1);

  // result
  const [resultOfOuput, setResultOfOutput] = useState("");

  const [trainingPortion, setTrainingPortion] = useRecoilState(trainingPortionState);
  const [regressionModel, setRegressionModel] = useRecoilState(regressionModelState);
  const [regressionModelOption, setRegressionModelOption] = useRecoilState(regressionModelOptionState);
  const [classifierModel, setClassifierModel] = useRecoilState(classifierModelState);
  const [classifierModelOption, setClassifierModelOption] = useRecoilState(classifierModelOptionState);
  const [selectableData, setSelectableData] = useRecoilState(selectableDataState);
  const [selectedData, setSelectedData] = useRecoilState(selectedDataState);
  const [NaNvalueconversion, setNaNvalueconversion] = useRecoilState(NaNvalueconversionState);
  const [targetColumn, setTargetColumn] = useRecoilState(targetColumnState);
  const [accuracytype, setAccuracyType] = useRecoilState(accuracyTypeState);
  const [accuracycontent, setAccuracyContent] = useRecoilState(accuracyContentState);

  // const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [nodes]);
  // const onNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
  // const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [edges]);
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds))
    // reset result of output
    setResultOfOutput("");
  }, [edges]);

  const [isAddDatasetButtonEnabled, setIsAddDatasetButtonEnabled] = useState(true);
  const [isAddTrainingButtonEnabled, setIsAddTrainingButtonEnabled] = useState(true);
  const [isAddRegressionButtonEnabled, setIsAddRegressionButtonEnabled] = useState(true);
  const [isAddClassifierButtonEnabled, setIsAddClassifierButtonEnabled] = useState(true);
  const [isAddEDAButtonEnabled, setIsAddEDAButtonEnabled] = useState(true);
  const [isAddAccuracyButtonEnabled, setIsAddAccuracyButtonEnabled] = useState(true);

  const datasetImage = document.getElementById('datasetImage');
  const edaImage = document.getElementById('edaImage');
  const trainingImage = document.getElementById('trainingImage');
  const regressionImage = document.getElementById('regressionImage');
  const classifierImage = document.getElementById('classifierImage');

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toggleToast = () => setShowToast(!showToast);

  // called once when Flow component is mounted
  useEffect(() => {
    const preventScrolling = (event) => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollLeft = document.documentElement.scrollLeft;
      const scrollWidth = document.documentElement.scrollHeight;
      const clientWidth = document.documentElement.clientWidth;

      if (scrollTop === 0 && event.deltaY < 0) {
        event.preventDefault();
      }

      if (scrollTop + clientHeight >= scrollHeight && event.deltaY > 0) {
        event.preventDefault();
      }

      if (scrollLeft === 0 && event.deltaX < 0) {
        event.preventDefault();
      }

      if (scrollLeft + clientWidth >= scrollWidth && event.deltaX > 0) {
        event.preventDefault();
      }
    };

    document.addEventListener('wheel', preventScrolling, { passive: false });

    // let server prepare working directory
    prepareWorkingDirectory();

    // if workSpaceId is -1, back to Home
    if (workSpaceId === -1) {
      // something wrong in Home, it must have the value except -1
      navigate('/home');
    }

    // read workspace with workspaceId
    readWorkspaceWithID(workSpaceId).then((data) => {
      const json = data["setting"];
      const obj = JSON.parse(json);

      // if obj is empty, it means new workspace
      if (Object.keys(obj).length === 0) {
        console.log('new workspace');
        return;
      }

      console.log("----- obj from DB in useEfect -------")
      console.log(obj)

      // setNodes(obj.nodes);  // db to nodes
      // setEdges(obj.edges);  // db to edges

      // copy nodes and edges
      setNodes(JSON.parse(JSON.stringify(obj.nodes)));
      setEdges(JSON.parse(JSON.stringify(obj.edges)));

      // Data of each node is managed by Recoil, set them with data from db
      for (var j = 0; j < obj.nodes.length; j++) {
        if (obj.nodes[j].type == "datasetnode") {
          console.log("from DB", obj.nodes[j].data.selectabledata, obj.nodes[j].data.selectedData); // was selecteddata
          setSelectableData(obj.nodes[j].data.selectabledata);
          setSelectedData(obj.nodes[j].data.selectedData);  // was selecteddata
          // disable add dataset button
          setIsAddDatasetButtonEnabled(false);
          // set brightness of dataset image
          const datasetImage = document.getElementById("datasetImage")
          datasetImage.classList.remove('max-brightness');
          datasetImage.classList.add('half-brightness');
        }
        if (obj.nodes[j].type == "trainingnode") {
          setTrainingPortion(obj.nodes[j].data.trainingportion);
          // disable add training button
          setIsAddTrainingButtonEnabled(false);
          // set brightness of training image
          const trainingImage = document.getElementById("trainingImage")
          trainingImage.classList.remove('max-brightness');
          trainingImage.classList.add('half-brightness');
        }
        if (obj.nodes[j].type == "regressionnode") {
          setRegressionModel(obj.nodes[j].data.regressiontype);
          setRegressionModelOption(obj.nodes[j].data.regressionoption);
          // disable add regression andc classifier button
          setIsAddRegressionButtonEnabled(false);
          setIsAddClassifierButtonEnabled(false);
          // set brightness of regression image
          const regressionImage = document.getElementById("regressionImage")
          regressionImage.classList.remove('max-brightness');
          regressionImage.classList.add('half-brightness');
          
          // set brightness of classifier image
          const classifierImage = document.getElementById("classifierImage")
          classifierImage.classList.remove('max-brightness');
          classifierImage.classList.add('half-brightness');
        }
        if (obj.nodes[j].type == "classifiernode") {
          setClassifierModel(obj.nodes[j].data.classifiertype);
          setClassifierModelOption(obj.nodes[j].data.classifieroption);

          // disable add regression andc classifier button
          setIsAddRegressionButtonEnabled(false);
          setIsAddClassifierButtonEnabled(false);
          // set brightness of regression image
          const regressionImage = document.getElementById("regressionImage")
          regressionImage.classList.remove('max-brightness');
          regressionImage.classList.add('half-brightness');
          
          // set brightness of classifier image
          const classifierImage = document.getElementById("classifierImage")
          classifierImage.classList.remove('max-brightness');
          classifierImage.classList.add('half-brightness');
        }
        if (obj.nodes[j].type == "edanode") {
          setNaNvalueconversion(obj.nodes[j].data.nanvalueconversion);
          setTargetColumn(obj.nodes[j].data.targetcolumn);
          // disable add EDA button
          setIsAddEDAButtonEnabled(false);
          // set brightness of EDA image
          const edaImage = document.getElementById("edaImage")
          edaImage.classList.remove('max-brightness');
          edaImage.classList.add('half-brightness');
        }
      }

      setRfInstance(obj);  //?
    });

    // open workspace or create new workspace
    // assume open workspace #1
    // setCurrentWorkspace(workspaceId);

    console.log(`Current Workspace ID: ${workSpaceId}`);

    return () => {
      document.removeEventListener('wheel', preventScrolling);
    };
  }, []);

  // for monitoring nodes
  useEffect(() => {
    if (nodes.length > 0) {
      console.log(selectedData, NaNvalueconversion, targetColumn, classifierModel, classifierModelOption, regressionModel, regressionModelOption, trainingPortion);
    }

  }, [selectedData, NaNvalueconversion, targetColumn, classifierModel, classifierModelOption, regressionModel, regressionModelOption, trainingPortion]);


  const generateRandomSequence = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  // useEffect(() => {
  //   console.log(`Current Workspace ID: ${workSpaceId}`);
  // }, []);

  const onNodesDelete = (e) => {

    // console.log("--- e in onNodesDelete ---", e);
    // reset result of output
    setResultOfOutput("");

    // if (rfInstance) {
    if (nodes.length > 0) {

      // update GUI and Recoil
      // for (let i = 0; i < e.length; i++) {
      for (let i = 0; i < nodes.length; i++) {
        if (e[0]["type"] == nodes[i]["type"]) {
          if (e[0]["type"] == "datasetnode") {
            setIsAddDatasetButtonEnabled(true);
            datasetImage.classList.remove('half-brightness');
            datasetImage.classList.add('max-brightness');
            // flow.nodes[i].data.selecteddata = 'iris'; // useState
            setSelectedData('iris');
            // temp = i;
            break;
          }
          if (e[0]["type"] == "trainingnode") {
            setIsAddTrainingButtonEnabled(true);
            trainingImage.classList.remove('half-brightness');
            trainingImage.classList.add('max-brightness');
            // flow.nodes[i].data.trainingportion = 30;
            setTrainingPortion(30);
            // temp = i;
            break;
          }
          if (e[0]["type"] == "regressionnode") {
            setIsAddRegressionButtonEnabled(true);
            setIsAddClassifierButtonEnabled(true);
            regressionImage.classList.remove('half-brightness');
            classifierImage.classList.remove('half-brightness');
            regressionImage.classList.add('max-brightness');
            classifierImage.classList.add('max-brightness');
            // flow.nodes[i].data.regressiontype = 'linearregression';
            // flow.nodes[i].data.regressionoption = null;
            setRegressionModel('linearregression');
            setRegressionModelOption(null);
            // temp = i;
            break;
          }
          if (e[0]["type"] == "classifiernode") {
            setIsAddRegressionButtonEnabled(true);
            setIsAddClassifierButtonEnabled(true);
            regressionImage.classList.remove('half-brightness');
            classifierImage.classList.remove('half-brightness');
            regressionImage.classList.add('max-brightness');
            classifierImage.classList.add('max-brightness');
            // flow.nodes[i].data.classifiertype = 'gaussiannb';
            // flow.nodes[i].data.classifieroption = null;
            setClassifierModel('gaussiannb');
            setClassifierModelOption(null);
            // temp = i;
            break;
          }
          if (e[0]["type"] == "edanode") {
            // console.log("--- edanode in sidemenu is enabled---");
            setIsAddEDAButtonEnabled(true);
            edaImage.classList.remove('half-brightness');
            edaImage.classList.add('max-brightness');
            // flow.nodes[i].data.nanvalueconversion = null;
            // flow.nodes[i].data.targetcolumn = null;
            setNaNvalueconversion(null);
            setTargetColumn(null);
            // temp = i;
            break;
          }
          if (e[0]["type"] == "accuracynode") {
            setIsAddAccuracyButtonEnabled(true);
            accuracyImage.classList.remove('half-brightness');
            accuracyImage.classList.add('max-brightness');
            // flow.nodes[i].data.nanvalueconversion = null;
            // flow.nodes[i].data.targetcolumn = null;
            setAccuracyType('accuracy');
            setAccuracyContent(null);
            // temp = i;
            break;
          }
        }
      }

      // exclude deleted node from nodes and rfInstance and set them 
      let new_nodes = nodes.filter((node) => node['type'] !== e[0]['type']);

      //setNodes((nds) => nds.filter((node) => node['type'] !== e[0]['type']));
      console.log("--- new_nodes in onNodesDelete ---", new_nodes);
      setNodes(JSON.parse(JSON.stringify(new_nodes)));
      // setRfInstance((rfi) => ({ ...rfi, nodes: rfi.nodes.filter((node) => node['type'] !== e[0]['type']) }));
      let new_rfInstance = { ...rfInstance, nodes: new_nodes };
      console.log("--- new_rfInstance in onNodesDelete ---", new_rfInstance);
      setRfInstance(new_rfInstance);

    }
  }

  const exportFlow = useCallback(() => {

    // (workspace id, flow data)
    exportCode(workSpaceId).then((data) => {
      console.log(data);

      let strData = JSON.stringify(data);
      console.log(`string data = ${strData}`);
      // save received data to file
      let blob = new Blob([strData], { type: 'text/plain;charset=utf-8' });
      let url = window.URL.createObjectURL(blob);
      //window.open(url, '_blank');
      let a = document.createElement('a');
      a.href = url;
      a.download = 'model.ipynb';
      document.body.appendChild(a);
      a.click();

    });

  });

  // parse flow data, save it, and run code
  // categorialnb --> gaussiannb
  const runFlow = useCallback(() => { // Check if all nodes are there
    let datExists = false;
    let edaExists = false;
    let regExists = false;
    // let claExists = false;
    let traExists = false;
    
    let dataEDAExists = false;
    let EDARegExists = false;
    let RegTrainingExists = false;

    // let flow = { ...rfInstance };

    console.log("--- nodes in runFlow ---", nodes);
    console.log("edges", edges);
    console.log("rfInstance", rfInstance);

    // reset result of output
    setResultOfOutput("processing...");

    // check if all nodes are there
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i]["id"].includes("datasetnode_")) {
        datExists = true;
      }
      if (nodes[i]["id"].includes("edanode_")) {
        edaExists = true;
      }
      if (nodes[i]["id"].includes("regressionnode_")) {
        regExists = true;
      }
      if (nodes[i]["id"].includes("classifiernode_")) {
        // claExists = true;
        regExists = true;
      }
      if (nodes[i]["id"].includes("trainingnode_")) {
        traExists = true;
      }
    }

    // check if all edges are there
    for (let i = 0; i < edges.length; i++) {
      if (edges[i]["source"].includes("datasetnode_") && edges[i]["target"].includes("edanode_")) {
        dataEDAExists = true;
      }
      if (edges[i]["source"].includes("edanode_") && edges[i]["target"].includes("regressionnode_")) {
        EDARegExists = true;
      }
      if (edges[i]["source"].includes("edanode_") && edges[i]["target"].includes("classifiernode_")) {
        EDARegExists = true;
      }
      if (edges[i]["source"].includes("regressionnode_") && edges[i]["target"].includes("trainingnode_")) {
        RegTrainingExists = true;
      }
      if (edges[i]["source"].includes("classifiernode_") && edges[i]["target"].includes("trainingnode_")) {
        RegTrainingExists = true;
      }      
    }

    // assert rfInstance is not null and workSpaceId is not -1
    // if (!rfInstance || workSpaceId === -1) {
    //   console.log('rfInstance is null or workSpaceId is -1');
    //   return;
    // }

    if (!datExists || !edaExists || !regExists || !traExists) {
      console.log('All nodes are not there!!!');
      // setToastMessage("All nodes are not there");
      // setShowToast(true);
      setResultOfOutput("All nodes are not there");
      return;
    }

    if (!dataEDAExists || !EDARegExists || !RegTrainingExists) {
      console.log('All edges are not there!!!');
      // setToastMessage("All edges are not there");
      // setShowToast(true);
      setResultOfOutput("All edges are not there");
      return;
    }


    // get flow data

    // console.log("--- rfInstance in runFlow ---", rfInstance);
    // console.log("--- nodes in runFlow ---", nodes);

    // setRfInstance(flow) // why here???

    // get recoils(which means the current values in screen) just before sending to server
    let data2server = JSON.parse(JSON.stringify(rfInstance));

    // copy edge data to data2server
    data2server.edges = JSON.parse(JSON.stringify(edges));

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].type == "datasetnode") {
        data2server.nodes[i].data.selectabledata = selectableData;
        data2server.nodes[i].data.selectedData = selectedData;
      }
      if (nodes[i].type == "trainingnode") {
        data2server.nodes[i].data.trainingportion = trainingPortion;
      }
      if (nodes[i].type == "regressionnode") {
        data2server.nodes[i].data.regressiontype = regressionModel;
        data2server.nodes[i].data.regressionoption = regressionModelOption;
      }
      if (nodes[i].type == "classifiernode") {
        data2server.nodes[i].data.classifiertype = classifierModel;
        data2server.nodes[i].data.classifieroption = classifierModelOption;
      }
      if (nodes[i].type == "edanode") {
        data2server.nodes[i].data.nanvalueconversion = NaNvalueconversion;
        data2server.nodes[i].data.targetcolumn = targetColumn;
      }
    }

    console.log("--- data2server in runFlow ---", data2server);

    runCode(workSpaceId, data2server).then((data) => {
      // let accExists = false;

      // for (let i = 0; i < nodes.length; i++) {
      //   if (nodes[i]["id"].includes("accuracynode_")) {
      //     accExists = true;
      //   }
      // }

      let res; // = ["Exception", "Error in running code"];
      let restype; // = res[0];
      let rescont; // = res[1];      
      // if data includes "Exception", it means error happened
      const chkError = JSON.stringify(data);
      if (!chkError.includes("Exception")) {
        res = data['text'].split(': ');

        console.log(res[0])
        console.log(res[1])

        restype = res[0];
        rescont = res[1];
      } else {
        res = chkError.split(';');

        console.log(res[0])
        console.log(res[1])

        restype = res[0].substring(1); // remove first "
        rescont = `"` + res[1];
      }

      // setAccuracyType(restype);
      // setAccuracyContent(rescont);

      //
      setResultOfOutput(restype + " : " + rescont);

      //   if (accExists == false) {
      //     const flow = rfInstance;
      //     let targetname = "accuracynode_" + generateRandomSequence(30)
      //     let sourcename = ""
      //     let Xcoord = 0
      //     let Ycoord = 0

      //     for (let i = 0; i < flow["nodes"].length; i++) {
      //       if (flow["nodes"][i]["id"].includes("trainingnode_")) {
      //         sourcename = flow["nodes"][i]["id"];
      //         Xcoord = flow["nodes"][i]["position"]["x"] + 300;
      //         Ycoord = flow["nodes"][i]["position"]["y"];
      //       }
      //     }

      //     const newNode = {
      //       id: targetname,
      //       data: { accuracytype: restype, accuracycontent: rescont },
      //       position: {
      //         x: Xcoord,
      //         y: Ycoord,
      //       },
      //       type: 'accuracynode'
      //     };
      //     setNodes((nds) => nds.concat(newNode));

      //     const newEdge = {
      //       id: "edge-" + generateRandomSequence(30),
      //       source: sourcename,
      //       target: targetname
      //     };
      //     setEdges((eds) => eds.concat(newEdge));
      //   }
    });

  });


  // const getEmail = useCallback(() => {
  //   getMe().then((data) => {
  //     console.log(data);
  //   });
  // });

  // const isValidConnection = (connection) => (connection.source.includes('datasetnode_') && connection.target.includes('edanode_'));

  const isValidConnection = (connection) => (
    (connection.source.includes('datasetnode_') && connection.target.includes('edanode_')) ||
    (connection.source.includes('edanode_') && connection.target.includes('regressionnode_')) ||
    (connection.source.includes('edanode_') && connection.target.includes('classifiernode_')) ||
    (connection.source.includes('regressionnode_') && connection.target.includes('trainingnode_')) ||
    (connection.source.includes('classifiernode_') && connection.target.includes('trainingnode_')) ||
    (connection.source.includes('trainingnode_') && connection.target.includes('accuracynode_'))
  );

  const onDragStart = (event, nodeType, permit) => {
    if (permit) {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // const updateNodeRfInstance = (event) => {

  // }

  // called inside ReactFlow, so it can't access nodes and rfInstance directly.
  const onDrop = (event) => {

    // console.log("--- onDrop ---", event);
    // console.log(event)
    // reset result of output
    setResultOfOutput("");

    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');

    if (typeof type === 'undefined' || !type) {
      return;
    }


    // const position = rfInstance.screenToFlowPosition({   // rfInstance --> reactFlow
    //   x: event.clientX,
    //   y: event.clientY,
    // });
    // const DRect = reactFlowWrapper.current.getBoundingClientRect();
    const relativeX = event.clientX - reactFlowWrapper.current.getBoundingClientRect().left;
    const relativeY = event.clientY - reactFlowWrapper.current.getBoundingClientRect().top;

    console.log("--- Viewport and event x, y in onDrop ---")
    console.log(relativeX, relativeY)
    console.log(event.clientX, event.clientY)
    // const position = { x: event.clientX, y: event.clientY };
    const position = { x: relativeX, y: relativeY };



    let newNode = {};  // var -> let

    if (type === 'datasetnode') {
      newNode = {
        id: "datasetnode_" + generateRandomSequence(30),
        type,
        position,
        data: { selectabledata: ['iris', 'wine', 'boston'], selectedData: 'iris' } // selectedData added
      }
      setIsAddDatasetButtonEnabled(false)

      const datasetImage = document.getElementById("datasetImage")

      datasetImage.classList.remove('max-brightness');
      datasetImage.classList.add('half-brightness');
    } else if (type === 'edanode') {
      newNode = {
        id: "edanode_" + generateRandomSequence(30),
        type,
        position,
        data: { nanvalueconversion: null, targetcolumn: null }
      }
      setIsAddEDAButtonEnabled(false)

      const edaImage = document.getElementById("edaImage")

      edaImage.classList.remove('max-brightness');
      edaImage.classList.add('half-brightness');
    } else if (type === 'trainingnode') {
      newNode = {
        id: "trainingnode_" + generateRandomSequence(30),
        type,
        position,
        data: { trainingportion: 70 }
      }
      setIsAddTrainingButtonEnabled(false)

      const trainingImage = document.getElementById("trainingImage")

      trainingImage.classList.remove('max-brightness');
      trainingImage.classList.add('half-brightness');
    } else if (type === 'regressionnode') {
      newNode = {
        id: "regressionnode_" + generateRandomSequence(30),
        type,
        position,
        data: { regressiontype: 'linearregression', regressionoption: null }
      }
      setIsAddRegressionButtonEnabled(false)
      setIsAddClassifierButtonEnabled(false)

      // TypeError classList without the below
      const regressionImage = document.getElementById('regressionImage');
      const classifierImage = document.getElementById('classifierImage');
      // console.assert(regressionImage, "regressionImage is null");
      // console.assert(classifierImage, "classifierImage is null");

      regressionImage.classList.remove('max-brightness');
      classifierImage.classList.remove('max-brightness');
      regressionImage.classList.add('half-brightness');
      classifierImage.classList.add('half-brightness');
    } else if (type === 'classifiernode') {
      newNode = {
        id: "classifiernode_" + generateRandomSequence(30),
        type,
        position,
        data: { classifiertype: 'gaussiannb', classifieroption: null }
      }
      setIsAddClassifierButtonEnabled(false)
      setIsAddRegressionButtonEnabled(false)

      // TypeError classList without the below
      const regressionImage = document.getElementById('regressionImage');
      const classifierImage = document.getElementById('classifierImage');
      // console.assert(regressionImage, "regressionImage is null");
      // console.assert(classifierImage, "classifierImage is null");

      regressionImage.classList.remove('max-brightness');
      classifierImage.classList.remove('max-brightness');
      regressionImage.classList.add('half-brightness');
      classifierImage.classList.add('half-brightness');
    } else if (type === 'accuracynode') {
      newNode = {
        id: "accuracynode_" + generateRandomSequence(30),
        type,
        position,
        data: { accuracytype: 'accuracy', accuracycontent: null }
      }
      setIsAddAccuracyButtonEnabled(false)

      const accuracyImage = document.getElementById("accuracyImage")

      accuracyImage.classList.remove('max-brightness');
      accuracyImage.classList.add('half-brightness');
    }

    let newNodes = nodes.concat(newNode);
    // setNodes((nds) => nds.concat(newNode));
    setNodes(newNodes);

    let new_rfInstance = { ...rfInstance, nodes: newNodes };
    setRfInstance(new_rfInstance);

  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%'}}> 
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=JetBrains+Mono" />
      <div style={{ backgroundColor: '#1C1C1C', height: '100vh', width: '20%', marginLeft: 0, marginRight: 'auto', float: 'left', display: 'flex', flexDirection: 'column', gap: '30px', padding: '10px' }}>
        <div
          onDragStart={(event) => onDragStart(event, 'datasetnode', isAddDatasetButtonEnabled)}
          draggable
        >
          <center>
            <img id='datasetImage' src='./../img/dataset_node.png' width='60%' />
          </center>
        </div>
        <div
          onDragStart={(event) => onDragStart(event, 'edanode', isAddEDAButtonEnabled)}
          draggable
        >
          <center>
            <img id='edaImage' src='./../img/eda_node.png' width='60%' />
          </center>
        </div>
        <div
          onDragStart={(event) => onDragStart(event, 'regressionnode', isAddRegressionButtonEnabled)}
          draggable
        >
          <center>
            <img id='regressionImage' src='./../img/regression_node.png' width='60%' />
          </center>
        </div>
        <div
          onDragStart={(event) => onDragStart(event, 'classifiernode', isAddClassifierButtonEnabled)}
          draggable
        >
          <center>
            <img id='classifierImage' src='./../img/classifier_node.png' width='60%' />
          </center>
        </div>
        <div
          onDragStart={(event) => onDragStart(event, 'trainingnode', isAddTrainingButtonEnabled)}
          draggable
        >
          <center>
            <img id='trainingImage' src='./../img/training_node.png' width='60%' />
          </center>
        </div>
        {/* <div
          onDragStart={(event) => onDragStart(event, 'accuracynode', isAddAccuracyButtonEnabled)}
          draggable
        >
          <br />
          <center>
            <img id='accuracyImage' src='./../img/accuracy_node.png' width='60%' />
          </center>
        </div> */}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* <div ref={reactFlowWrapper} style={{ flex: 9, height: '100vh', width: '80%', marginLeft: 'auto', marginRight: 0, float: 'right', overflow: 'hidden' }}> */}
        <div ref={reactFlowWrapper} style={{ flex: 9, height: '100vh', width: '100vw', marginLeft: 0, marginRight: 0, float: 'right', overflow: 'hidden' }}>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesDelete={onNodesDelete}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            //onInit={setRfInstance}
            proOptions={proOptions}
            isValidConnection={isValidConnection}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            style={{
              backgroundColor: '#000000',
            }}
            className='mainflow'
          >
            <Background />
            {/* <div style={{ position: "absolute", left: "10px", top: "10px", zIndex: "4", fontSize: "12px" }}>
              <button onClick={addDatasetNode} disabled={isAddDatasetButtonDisabled} style={{ backgroundColor: '#03FCF8' }}>
                Add Dataset Node
              </button>
              <br />
              <br />
              <button onClick={addEDANode} disabled={isAddEDAButtonDisabled} style={{ backgroundColor: '#03FCF8' }}>
                Add EDA Node
              </button>
              <br />
              <br />
              <button onClick={addTrainingNode} disabled={isAddTrainingButtonDisabled} style={{ backgroundColor: '#03FCF8' }}>
                Add Training Node
              </button>
              <br />
              <br />
              <button onClick={addRegressionNode} disabled={isAddRegressionButtonDisabled} style={{ backgroundColor: '#03FCF8' }}>
                Add Regression Node
              </button>
              <br />
              <br />
              <button onClick={addClassifierNode} disabled={isAddClassifierButtonDisabled} style={{ backgroundColor: '#03FCF8' }}>
                Add Classifier Node
              </button>

              <br />
              <br />
              <button onClick={getEmail} style={{ backgroundColor: '#03FCF8' }}>
                Who am I?
              </button>

            </div> */}
            {/* <div style={{ position: "absolute", right: "1rem", top: "1rem", zIndex: "4" }}>
              <button
                onClick={exportFlow}
                style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: '#00a2ff',
                  borderRadius: '50%',
                  borderStyle: 'solid',
                  borderColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <PiExportBold
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    color: '#000',
                  }}
                />
              </button>
              <br />
              <br />
              <button
                onClick={runFlow}
                style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: '#00e031',
                  borderRadius: '50%',
                  borderStyle: 'solid',
                  borderColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <PiFastForwardFill
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    color: '#000',
                  }}
                />
              </button>
            </div> */}   
          </ReactFlow>
          {/* <ToastContainer className='dataset-node_select' position='top-center' style={{zIndex:1}}>
              <Toast onClose={toggleToast} show={showToast} animation={false} className='dataset-node_select'>
                  <Toast.Header className='dataset-node_select'>
                    <strong className="me-auto">Warning</strong>
                  </Toast.Header>
                  <Toast.Body className='dataset-node_select'>{toastMessage}</Toast.Body>
              </Toast>      
          </ToastContainer>    */}
          <div style={{ position: "absolute", right: "1rem", top: "1rem", zIndex: "4" }}>
              <button
                onClick={exportFlow}
                style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: '#00a2ff',
                  borderRadius: '50%',
                  borderStyle: 'solid',
                  borderColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <PiExportBold
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    color: '#000',
                  }}
                />
              </button>
              <br />
              <br />
              <button
                onClick={runFlow}
                style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: '#00e031',
                  borderRadius: '50%',
                  borderStyle: 'solid',
                  borderColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <PiFastForwardFill
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    color: '#000',
                  }}
                />
              </button>
            </div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#1C1C1C', border: '2px solid black', color: 'white'}}>        
          <div style={{margin:'10px'}}>
          {/* Here will be the output */}
          {resultOfOuput}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function () {
  // <RecoilRoot> should not be here, it should be in App.jsx
  return (
    // <RecoilRoot>
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
    // </RecoilRoot>
  );
}
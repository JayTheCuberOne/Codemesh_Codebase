import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "@fontsource/poppins"
import {
  FiArrowRight,
  FiPlus,
  FiBook,
  FiImage
} from "react-icons/fi"

import { RecoilRoot, useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { currentWorkspaceState } from '../utils/RecoilRoots.jsx';

import { readWorkspace, createWorkspace } from '../utils/Fetcher.js';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import '../home/styles.css';

export default function Home() {

  // const [workspaceId, setWorkspaceId] = useRecoilState(currentWorkspaceState);
  const setWorkspaceId = useSetRecoilState(currentWorkspaceState);
  const [userWorkspaces, setUserWorkspace] = useState([]);  // Array

  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  // choose workspace
  const onMoveToExiting = (id) => {
    console.log(`move to workspace ${id}`);
    setWorkspaceId(id);
    navigate(`/workspace`);
  }

  const prepareModal = () => {
    setShow(true);
  }

  // new workspace with given name but empty setting
  const onNewWorkspace = (val) => {
    // name is supposed to be provided by user
    const new_workspace = { name: val, setting: "{}" };  // "" --> "{}" which means empty json object
    createWorkspace(new_workspace).then((data) => {
      setWorkspaceId(data.id);
      navigate(`/workspace`);
    });

    // console.log('current workspace id:', workspaceId);

  };

  // read workspaces in DB
  useEffect(() => {
    readWorkspace().then((data) => {
      if (data != null) {
        setUserWorkspace(data)
        console.log(data)
      } else {
        navigate('/')
      }
    });
  }, []);

  const newWorkspaceModal = document.getElementById('newworkspace-modal');
  const [modalInputValue, setModalInputValue] = useState('');
  const handleModalInputValue = (event) => setModalInputValue(event.target.value);

  const [cursorOnDiv, setCursorOnDiv] = useState(false);

  const handleMouseEnter = () => {
    setCursorOnDiv(true);
  };

  const handleMouseLeave = () => {
    setCursorOnDiv(false);
  };

  function modalOn() {
    newWorkspaceModal.style.display = "block";
  }

  function modalOff() {
    if (!cursorOnDiv) {
      newWorkspaceModal.style.display = "none";
    }
  }

  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=SUSE:wght@100..800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <h1>Your Workspaces</h1>
        <center>
          <div>
            <button className='new-workspace-button' onClick={modalOn}>New Workspace{' '}<FiPlus /></button>
            <button className='go-to-docs-button' onClick={() => navigate('/404')}>Go to Docs{' '}<FiBook /></button>
            {/* <button className='go-to-docs-button' style={{ "width": "170px" }} onClick={() => navigate('/recognition')}>Image Recognition{' '}<FiImage /></button> */}
          </div>
          {userWorkspaces.map(function (workspace) {
            return (
              <div className='list-component' key={workspace.id}>
                <p className='list-component-text'>{workspace.name}</p>
                <button className='list-component-button' onClick={() => onMoveToExiting(workspace.id)}>Move to Workspace{' '}<FiArrowRight /></button>
              </div>
            );
          })}
          {/* Change to <div></div> */}
          <div id="newworkspace-modal" onClick={modalOff}>
            <div id='modal' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <label style={{fontFamily: '"SUSE", sans-serif', fontWeight:"bold"}}>Give your workspace a name:</label><br />
              <input className='modal-input' onChange={handleModalInputValue}></input><br />
              <button className='modal-button' onClick={() => onNewWorkspace(modalInputValue)}>Create Workspace{' '}<FiArrowRight /></button>
            </div>
          </div>
        </center>
      </body>
    </>
  );
}
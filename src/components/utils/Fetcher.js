import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies();

// const BASE_URL = 'http://localhost:8000';
// Java spring boot server
//const BASE_URL = 'http://localhost:8090';
// single fastapi server
// const BASE_URL = 'http://localhost:8100';
const BASE_URL = 'https://codemesh.xyz';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

// default headers
api.defaults.headers.common['Content-Type'] = 'application/json';

export const postCode = async (code) => {
  //const response = await api.get<QueryResponse>('query');
  try {
    //const response = await api.get('/auth/google_login' + '?code=' + code);
    const response = await api.post('/auth/google_login', { idToken: code });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const reissue = async () => {
  //const response = await api.get<QueryResponse>('query');
  try {
    const response = await api.post('/auth/reissue', { accessToken: cookies.get('accessToken'), refreshToken: cookies.get('refreshToken') });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/api/v1/me', {
      headers: {
        Authorization: 'Bearer ' + cookies.get('accessToken'),
      },
    });
    // const response = await api.get('/api/v1/me');
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const readWorkspace = async () => {
  try {

    const response = await api.get('/api/v1/workspace', {
      headers: {
        Authorization: 'Bearer ' + cookies.get('accessToken'),
      },
    });
    // const response = await api.get('/api/v1/me');
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// read specific workspace with workspaceID
export const readWorkspaceWithID = async (workspaceID) => {
  try {
    const response = await api.get(`/api/v1/workspace/${workspaceID}`, {
      headers: {
        Authorization: 'Bearer ' + cookies.get('accessToken'),
      },
    });
    
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const prepareWorkingDirectory = async () => {
  try {
    const response = await api.get('/api/v1/prepare', {
      headers: {
        Authorization: 'Bearer ' + cookies.get('accessToken'),
      },
    });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    window.location.replace('/');
    return null;
  }
}

// create empty workspace with instance = {name:"title", setting : ""}
// when calling this function, save the workspace id somewhere and use it in calling exportCode, runCode, and so on.
export const createWorkspace = async (instance) => {

  // console.log(instance.nodes[4].data.trainingportion)
  // const res = await api.post('/api/instance', instance);
  // console.log(res.data)
  // return res.data

  try {

    const response = await api.post(`/api/v1/workspace`, instance, {
      headers: {
        Authorization: 'Bearer ' + cookies.get('accessToken'),
      },
    });
    // const response = await api.get('/api/v1/me');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// delete workspace with workspaceID
export const deleteWorkspace = async (workspaceID) => {
  try {
    const response = await api.delete(`/api/v1/workspace/${workspaceID}`, {
      headers: {
        Authorization: 'Bearer ' + cookies.get('accessToken'),
      },
    });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}



export const exportCode = async (workspaceID) => {
  try {
    const response = await api.get(`/api/v1/export/${workspaceID}`, {
      headers: {
        Authorization: 'Bearer ' + cookies.get('accessToken'),
      },
    });
    //console.log(response.data);
    return response.data; // change it to file download later

  }
  catch (error) {
    console.log(error);
    return null;
  }
}



export const runCode = async (workspaceID, flowData) => {
  try {
    const response = await api.post(`/api/v1/run/${workspaceID}`, flowData, {
      headers: {
        Authorization: 'Bearer ' + cookies.get('accessToken'),
      },
    });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}


export const uploadFile = async (data) => {
  const frm = new FormData();
  frm.append('file', data);

  // const config = {
  //     headers: {
  //         "content-type": "multipart/form-data",
  //         "Authorization": 'Bearer ' + cookies.get('accessToken'),
  //     },
  // };    
  const response = await api.post('/api/v1/dataset', frm, {
    headers: {
      Authorization: 'Bearer ' + cookies.get('accessToken'),
      "Content-Type": "multipart/form-data",
    },
  }); //change 3 to workspace ID later
  return response.data;
}

// can use w/o token
export const askRecognition = async (file) => {

  let frm = new FormData();
  frm.append('image', file);
  try {
      // curl -F "image=@samples/dog.jpg" -X POST http://172.233.67.162:8500/model/predict
      const response = await api.post('/api/v1/image-recog', frm, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      //console.log(response.data);
      return response.data;

  } catch (error) {
      console.log(error);
      return null;
  }
}

// can use w/o token
export const askDetection = async (file) => {

  let frm = new FormData();
  frm.append('image', file);
  try {
      // curl -F "image=@samples/dog.jpg" -X POST http://172.233.67.162:8500/model/predict
      const response = await api.post('/api/v1/object-detect', frm, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
      });
      //console.log(response.data);
      return response.data;

  } catch (error) {
      console.log(error);
      return null;
  }
}


export const getJwt = async (token) => {
  try {
    const res = await api.get('/auth/google/token?access_token=' + token);
    return res.data
  }
  catch (err) {
    console.log(err)
    return null
  }
}



// for testing
export const getUnprotected = async () => {
  try {
    const response = await api.get('/api/test/unprotected');
    //console.log(response.data);
    return response.data;

  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getProtected = async (jwt) => {
  try {
    const response = await api.get('/api/test/protected', {
      headers: {
        Authorization: 'Bearer ' + jwt,
      },
    });
    //console.log(response.data);
    return response.data;

  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getProtectedWithoutJwt = async () => {
  try {
    const response = await api.get('/api/test/protected');
    //console.log(response.data);
    return response.data;

  } catch (error) {
    console.log(error);
    return null;
  }
}

// redundant, use readWorkspaces instead
// export const getWorkspaces = async () => {
//   try {
//     const response = await api.get(`/api/v1/workspace`, {
//       headers: {
//         Authorization: 'Bearer ' + cookies.get('accessToken'),
//       },
//     });
//     //console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }


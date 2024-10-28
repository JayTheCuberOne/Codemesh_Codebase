import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Input, Box } from '@mui/material';
import { styled } from '@mui/system';
import { askRecognition, askDetection } from '../utils/Fetcher';
import '../home/styles.css';
import {
  FiHome
} from "react-icons/fi"

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  margin: '20px auto',
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: '#8f8d8d',
  border: '4px solid #0073ff'
}));

const ImageContainer = styled('div')({
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center',
});

export default function Recognition() {
  const [file, setFile] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [result, setResult] = useState("");

  return (
    <>
      <Typography variant="h2" gutterBottom align="center" color="#00bfff" style={{ "fontFamily": "Ubuntu" }}>
        Recognition Test
      </Typography>
      <Typography variant="h6" gutterBottom align="center" color="#00bfff" style={{ "fontFamily": "Ubuntu" }}>
        Powered by ResNet & YOLO
      </Typography>
      <StyledCard>
        <CardContent>
          <Typography variant="body1" color='#f5f5f5'>
            Click on the "Choose File" button to upload a file:
          </Typography>
          <Input type="file" onChange={(e) => {
            if (e.target.files && e.target.files.length === 0) {
              return;
            }
            setRawData(URL.createObjectURL(e.target.files[0]));
            setFile(e.target.files[0]);
            setResult("");
          }} />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                askRecognition(file).then((response) => {
                  let res = [];
                  response['predictions'].map((item) => {
                    item['probability'] = Math.round(item['probability'] * 10000) / 100 + '%';
                    res.push(item['label'] + ' : ' + item['probability']);
                  });
                  setResult(res.join(', '));
                });
              }}
              style={{ marginRight: '10px' }}
            >
              Image Recognition
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                askDetection(file).then((response) => {
                  setRawData(URL.createObjectURL(response));
                });
              }}
            >
              Object Detection
            </Button>
          </Box>
          <Box mt={2}>
            <Typography variant="body2" color="#f5f5f5" fontWeight="bold">
              {result}
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>
      {rawData && (
        <ImageContainer>
          <img src={rawData} alt="file" style={{ maxWidth: '70%' }} />
        </ImageContainer>
      )}
    </>
  );
}

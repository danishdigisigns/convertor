

AWS_REGION = "ap-south-1"
YOUR_S3_BUCKET_NAME = "digi-board"
YOUR_ACCESS_KEY_ID = "AKIA37KSH3DKKLOATF55"
YOUR_SECRET_ACCESS_KEY = "9WXPKoH5Xz84Ce64mAO94eBCUcRho+NyQGqjqnfA"




// const express = require('express');
// const app = express();
// const AWS = require('aws-sdk');
// const stream = require('stream');
// const videoshow = require('videoshow');
// const fs = require('fs');

// const port = 8000;



// // Configure AWS credentials
// AWS.config.update({
//   accessKeyId: YOUR_ACCESS_KEY_ID,
//   secretAccessKey: YOUR_SECRET_ACCESS_KEY
// });

// // Create an S3 instance
// const s3 = new AWS.S3();
// app.use(express.json());

// // Convert image to video using videoshow
// function convertImageToVideo(inputPath) {
//   return new Promise((resolve, reject) => {
//     const videoOptions = {
//       fps: 30,
//       loop: 10,
//       transition: false,
//       videoBitrate: 1024,
//       videoCodec: 'libx264',
//       size: '640x480',
//       format: 'mp4',
//       disableAudio: true,
//       outputOptions: ['-pix_fmt', 'yuv420p']
//     };

//     const outputPath = 'hjgff.mp4';

//     const videoProcess = videoshow([inputPath], videoOptions);
//     videoProcess.save(outputPath).on('error', reject).on('end', () => resolve(outputPath));
//   });
// }

// // Handle POST request for video upload
// app.post('/upload', async (req, res) => {
//   const inputPath = req.body.path;

//   try {
//     const outputPath = await convertImageToVideo(inputPath);

//     const uploadParams = {
//       Bucket: YOUR_S3_BUCKET_NAME,
//       Key: 'hjgff.mp4',
//       Body: fs.createReadStream(outputPath)
//     };

//     const uploadResult = await s3.upload(uploadParams).promise();
//     console.log('Video uploaded to S3 successfully:', uploadResult.Location);
//     res.send('Video uploaded to S3 successfully');
//   } catch (error) {
//     console.log('Error converting image to video:', error);
//     res.status(500).send('Error converting image to video');
//   }
// });

// app.get('/', (req, res) => {
//   console.log('Hello Danish');
//   res.send('Hello Danish');
// });

// app.listen(port, () => {
//   console.log(`Now listening on port ${port}`);
// });
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const stream = require('stream');
const videoshow = require('videoshow');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const port = 8000;

// Configure AWS credentials
AWS.config.update({
  accessKeyId: YOUR_ACCESS_KEY_ID,
  secretAccessKey: YOUR_SECRET_ACCESS_KEY
});

// Create an S3 instance
const s3 = new AWS.S3();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Convert image to video using videoshow
function convertImageToVideo(inputPath) {
  return new Promise((resolve, reject) => {
    const videoOptions = {
      fps: 30,
      loop: 10,
      transition: false,
      videoBitrate: 1024,
      videoCodec: 'libx264',
      size: '640x480',
      format: 'mp4',
      disableAudio: true,
      outputOptions: ['-pix_fmt', 'yuv420p']
    };

    const outputPath = 'hjgff.mp4';

    const videoProcess = videoshow([inputPath], videoOptions);
    videoProcess.save(outputPath).on('error', reject).on('end', () => resolve(outputPath));
  });
}

// Handle POST request for video upload
app.post('/upload', upload.single('image'), async (req, res) => {
  const inputPath = req.file.path;

  try {
    const outputPath = await convertImageToVideo(inputPath);

    const uploadParams = {
      Bucket: YOUR_S3_BUCKET_NAME,
      Key: 'hjgff.mp4',
      Body: fs.createReadStream(outputPath)
    };

    const uploadResult = await s3.upload(uploadParams).promise();
    console.log('Video uploaded to S3 successfully:', uploadResult.Location);

    // Remove the local files
    fs.unlink(outputPath, (error) => {
      if (error) {
        console.log('Error removing converted video file:', error);
      } else {
        console.log('Converted video file removed successfully');
      }
    });

    fs.unlink(inputPath, (error) => {
      if (error) {
        console.log('Error removing original image file:', error);
      } else {
        console.log('Original image file removed successfully');
      }
    });

    res.send('Video uploaded to S3 successfully');
  } catch (error) {
    console.log('Error converting image to video:', error);
    res.status(500).send('Error converting image to video');
  }
});

// Serve the HTML form on the /home GET route
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
var images = [
    'sem5th.jpeg',
    'Photograph_Danish_Quasim.jpg',
  ]
  
  var videoOptions = {
    fps: 25,
    loop: 5, // seconds
    transition: true,
    transitionDuration: 1, // seconds
    videoBitrate: 1024,
    videoCodec: 'libx264',
    size: '640x?',
    audioBitrate: '128k',
    audioChannels: 2,
    format: 'mp4',
    pixelFormat: 'yuv420p'
  }
  
  videoshow(images, videoOptions)
    .audio('song.mp3')
    .save('video.mp4')
    .on('start', function (command) {
      console.log('ffmpeg process started:', command)
    })
    .on('error', function (err, stdout, stderr) {
      console.error('Error:', err)
      console.error('ffmpeg stderr:', stderr)
    })
    .on('end', function (output) {
      console.error('Video created in:', output)
    })




    ///// another methoddd

 
//   // The output url
//   console.log("OUTPUT URL")
//   console.log(url);


// var images = [
//     'Photograph_Danish_Quasim.jpg',
//     'sem5th.jpeg'
//   ]
   
//   var videoOptions = {
//     fps: 25,
//     loop: 5, // seconds
//     transition: true,
//     transitionDuration: 3, // seconds
//     videoBitrate: 1024,
//     videoCodec: 'libx264',
//     size: '640x?',
//     audioBitrate: '128k',
//     audioChannels: 2,
//     format: 'mp4',
//     pixelFormat: 'yuv420p'
//   }
//   videoshow(images, videoOptions)
//   .audio('')
//   .save('video.mp4')
//   .on('start', function (command) {
//     console.log('ffmpeg process started:', command)
//   })
//   .on('error', function (err, stdout, stderr) {
//     console.error('Error:', err)
//     console.error('ffmpeg stderr:', stderr)
//   })
//   .on('end', function (output) {
//     console.error('Video created in:', output)
//   })


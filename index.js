// // Node.js server (server.js)

// const express = require('express');
// const bodyParser = require('body-parser');
// const multer = require('multer');

// const fs = require('fs').promises;

// const app = express();
// const port = process.env.PORT || 5000;

// // Set up middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(express.static('uploads'));

// // Define a storage location for uploaded images
// const storage = multer.diskStorage({
//   destination: 'uploads/',
//   filename: (req, file, callback) => {
//     callback(null, file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Load your machine learning model here (e.g., TensorFlow.js)
// async function loadModel() {
//     try {
//       const model = await tf.loadLayersModel('/model.json');
//       console.log('Model loaded successfully');
//       return model;
//     } catch (error) {
//       console.error('Error loading model:', error);
//       return null;
//     }
//   }
  
//   // Usage example


// // Define a route to handle image prediction
// app.post('/api/predict', upload.single('image'), async (req, res) => {
//   try {
//     console.log(req.body);
//     const imageBuffer = await fs.readFile(`${req.body}`);
//     const prediction = async function predictImage(imageBuffer) {
//         const model = await loadModel();
//         if (model) {
//           // Make predictions
//           const predictions = model.predict(imageBuffer);
      
//           return prediction;
//         } else {
//           return null;
//         }
//       }
//     res.json({ prediction });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.listen(port, () => {
//   console.log('Server is running on port ${port}');
// });



const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require("path");
const Jimp = require("jimp")


const app = express();
const port = process.env.PORT || 5000;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('uploads'));

// Define a storage location for uploaded images
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

// Load your machine learning model here (e.g., TensorFlow.js)
async function loadModel() {
    try {
      const model = await tf.loadLayersModel('/model.json');
      console.log('Model loaded successfully');
      return model;
    } catch (error) {
      console.error('Error loading model:', error);
      return null;
    }
  }

// Define a route to handle image prediction
app.post('/api/predict', upload.single('image'), async (req, res) => {
    
  try {
    const base64data = req.body.image;
    const buff = Buffer.from(base64data.split(',')[1], 'base64');
    const imagefrombuffer = await Jimp.read(buff);
    const predictdata = async function predictImage(imagefrombuffer) {
        const model = await loadModel("./model.json");
        if (model) {
          // Make predictions
          const prediction = model.predict(imagefrombuffer);
      
          return prediction;
        } else {
          return null;
        }
      }
    const prediction = await predictdata(imagefrombuffer);
    console.log(prediction);
    res.json({ predictdata });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

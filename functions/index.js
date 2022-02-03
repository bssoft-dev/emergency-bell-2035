const functions = require('firebase-functions');

const admin = require('firebase-admin');
// const { app } = require('firebase-admin');
const express = require("express");

const cors = require('cors');

const { swaggerUi, specs } = require('./docs/swagger');

admin.initializeApp();

const app = express();

exports.addMessage = functions.https.onRequest((req, res) => {

 
    // Grab the text parameter.
    const event = req.query.event;
    const deviceid = req.query.deviceid;
    const datetime = new Date();
    datetime.setHours(datetime.getHours()+9)
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    let log = {
      deviceid: deviceid,
      event: event,
      datetime: datetime.toLocaleString()
    }

    
    if(event != "HEARTBEAT"){
     
      admin.database().ref('/logs/'+deviceid).push(log).then((snapshot) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.status(200).send(snapshot);
      });

    } 

    admin.database().ref('/devices').orderByChild("id").equalTo(deviceid).once('value').then((val) => {
      
      var key = Object.keys(val.val())[0];
      var device = val.val()[key];

      admin.database().ref('/devices/'+deviceid).update({
        'id': deviceid,
        'status': admin.database.ServerValue.increment(1),
        'lastUpdated': datetime.toLocaleString(),
      }).then((snapshot) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.status(200).send(snapshot);
      });

    }).catch((error) => {
      functions.logger.log(error);
      functions.logger.log(req.params.deviceid);
      admin.database().ref('/devices/'+deviceid).update({
        'id': deviceid,
        'status': 1,
        'createdDate': datetime.toLocaleString(),
      })
    });

    

    setTimeout(function(){
      admin.database().ref('/devices/'+deviceid).update({
        'id': deviceid,
        'status': admin.database.ServerValue.increment(-1),
        'lastUpdated': datetime.toLocaleString(),
      })
    }, 1000 * 10);

    
});

/**
 * @swagger
 *  /devices:
 *    get:
 *      tags:
 *      - devices
 *      summary: "장치목록조회"
 *      description: 등록된 장치의 모든 정보를 조회함
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: 장치 목록 조회 성공
 */
 app.get('/devices',(req, res) => {
  res.set({
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json'
  });
  const devicesRef = admin.database().ref('/devices');
  deviceList = [];
  devicesRef.on('value', (snapshot) => {
      const devices = snapshot.val();
      if (devices == null){
          res.json(devices)
      } else {
          const keys = Object.keys(devices);
          for (var id in keys){
              deviceList.push(devices[keys[id]])
          }
          res.json(deviceList);
      }
  })
});

/**
 * @swagger
 *  /devices/{deviceId}:
 *    get:
 *      tags:
 *      - devices
 *      summary: "장치정보조회 by 디바이스Id"
 *      description: 디바이스 ID에 따른 장치의 정보를 조회함
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: deviceId
 *          required: true
 *          schema:
 *            type: string
 *            description: 장치ID
 *      responses:
 *       200:
 *        description: 장치 정보 조회 성공
 */
 app.get('/devices/:deviceId',(req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const deviceId = req.params.deviceId;
  const deviceRef = admin.database().ref('/devices/'+deviceId);
  console.log(deviceId);
  deviceRef.on('value', (snapshot) => {
      const devices = snapshot.val();
      res.json(devices);
  })
});

/**
 * @swagger
 *  /devices/:
 *    post:
 *      tags:
 *      - devices
 *      summary: "장치 정보 추가(수정)"
 *      description: 장치 정보를 추가하거나(DeviceId가 기존에 없으면), 수정(DeviceId가 있으면) 함
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref : '#/components/schemas/Device'
 *      responses:
 *       200:
 *        description: successful operation
 *       405:
 *        description: Invalid Input
 */
// app.post('/devices/:deviceId', (req, res) => {
  app.post('/devices/', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'content-type': 'application/json'
    });
    const devicesRef = admin.database().ref('/devices/'+req.body.deviceId);
    const data = req.body
    const dataKey = devicesRef.update(data, (error) => {
        if(error) {
            const errorMessage = "[error] : " + error;
            console.log(errorMessage);
            res.send({
                code : "002", //error
                message : errorMessage
            });
        } else {
            res.send({
                code : "001",//success
                message : "device add seccess",
                body : req.body
            });
        }
    });
});

/**
 * @swagger
 *  /devices/{deviceId}:
 *    delete:
 *      tags:
 *      - devices
 *      summary: "장치 정보 삭제"
 *      description: 장치 정보를 삭제 함
 *      parameters:
 *        - in: path
 *          name: deviceId
 *          required: true
 *          schema:
 *            type: string
 *            description: 장치ID
 *      responses:
 *       200:
 *        description: successful operation
 *       405:
 *        description: Invalid Input
 */
 app.delete('/devices/:deviceId', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const deviceId = req.params.deviceId;
  var result = {
      result : "Delete success" 
  };
  admin.database().ref('/devices/'+deviceId).remove((error)=>{
      if(error) {
          const errorMessage = "[error] : " + error;
          console.log(errorMessage);
          result.result = errorMessage
      } else {
          result.result = "success"
      }
  });
  admin.database().ref('/data/'+deviceId).remove((error)=>{
      if(error) {
          const errorMessage = "[error] : " + error;
          console.log(errorMessage);
          result.result = errorMessage
      } else {
          result.result = "success"
      }
  });
  res.send(result)
})

/**
 * @swagger
 *  /devices/{deviceId}/detections?limit={limit}:
 *    get:
 *      tags:
 *      - detections
 *      summary: "단일 장비 감지 데이터 조회"
 *      description: 선택된 장치의 최근 감지 데이터 조회
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: path
 *          name: deviceId
 *          required: true
 *          type: string
 *        - in: query
 *          name: limit
 *          required: false
 *          default: 10
 *          type: number
 *      responses:
 *       200:
 *        description: 장치 감지 데이터 조회 성공
 */
 app.get('/devices/:deviceId/detections',(req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('content-type', 'application/json');
  const deviceId = req.params.deviceId;
  if(req.query.limit){
      var limit = Number(req.query.limit);
  } else {
      var limit = 10;
  }
  const dataRef = admin.database().ref('/detections/'+deviceId);
  dataRef.orderByChild('detecttime').limitToLast(limit).on('value', (snapshot) => {
      const data = snapshot.val();
      if (data == null){
          res.json(data)
      } else {
          detectionId = [];
          measureTime = [];
          value = [];
          // var obj = JSON.parse(data);
          const keys = Object.keys(data);
          for (var id in keys){
              detectionId.push(keys[id]);
              measureTime.push(data[keys[id]].detecttime);
              value.push(data[keys[id]].result.event);
          }
          const dataList = {
              deviceId : deviceId,
              detectionId: detectionId,
              time : measureTime,
              value : value
          }
          res.json(dataList);
      }
  })
});

/**
 * @swagger
 *  /devices/all/detections?limit={limit}:
 *    get:
 *      tags:
 *      - detections
 *      summary: "모든 장비 측정값 조회"
 *      description: 등록된 장치의 모든 최근 측정값 조회
 *      produces:
 *      - application/json
 *      parameters:
 *        - in: query
 *          name: limit
 *          required: false
 *          default: 10
 *          type: number
 *      responses:
 *       200:
 *        description: 장치 측정값 조회 성공
 */
 app.put('/devices/all/detections',(req, res) => {
  res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'content-type': 'application/json'
  });
  if(req.query.limit){
      var limit = Number(req.query.limit);
  } else {
      var limit = 20;
  }
  console.log(limit)
  alldata = []
  // var dataRef = admin.database().ref('/data/'+devices[i]);
  var dataRef = admin.database().ref('/data/');
  dataRef.on('value', (snapshot) => {
      // const data = snapshot.val();
      snapshot.forEach(function(childSnapshot) {
          // 001, 002, 003 docs level
          var devicedata  = {
              deviceId : childSnapshot.key,
              time : [],
              value : []
          }
          childSnapshot.forEach(function(grandChildSnapshot) {
              // strange key (like -MorEnyCd56YTWor6hlS) level
              devicedata.time.push(grandChildSnapshot.child("detecttime").val()),
              devicedata.value.push(grandChildSnapshot.child("result/event").val())
              // childData will be the actual contents of the child
              var data = childSnapshot.val();
          });
          // console.log('2:'+JSON.stringify(devicedata))
          alldata.push(devicedata);
      });
      if (alldata == null){
          console.log({
              code : "003", //error
              message : "nodata"
          })
      } else {
          res.send(alldata)
          // console.log(alldata)
      }
  })    
});


app.post('/',(req, res) => {
  res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'content-type': 'application/json'
  });
 
  const deviceid = req.body.deviceid;
  const result = req.body.result;
  const detecttime = req.body.detecttime;
  const soundurl = req.body.soundurl;
  const datetime = new Date();
  datetime.setHours(datetime.getHours()+9)
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  let log = {
    deviceid: deviceid,
    result: result,
    detecttime: detecttime,
    soundurl: soundurl,
    datetime: datetime.toLocaleString()
  }
  admin.database().ref('/detections/'+deviceid).push(log).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.status(200).send(snapshot);
  });
})
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

app.use(cors())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
exports.api = functions.https.onRequest(app);
exports.addDetection = functions.https.onRequest(app);
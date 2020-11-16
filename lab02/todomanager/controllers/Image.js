'use strict';

var utils = require('../utils/writer.js');
var imageService = require('../service/ImageService.js');

module.exports.addImage = function(req, res) {
    const taskId = req.params.taskId;
    const fileName = req.file.originalname;

    // if(!checkFormat(fileName)){
    //     fs.unlinkSync('./uploads/' + fileName);
    //     utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': "Format not allowed" }],}, 400);
        
    // }

    imageService.saveImg(taskId, fileName)
    .then( () => {
        const message = "Saved " + fileName + " for task " + taskId;
        utils.writeJson(res, { message: message }, 201);
    })
    .catch(function (response) {
        utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
    });
    
}

// function checkFormat(fileName){
//     if (fileName.includes(".jpeg") || fileName.includes(".jpg") || fileName.includes(".png") || fileName.includes(".gif"))
//         return true;
//     return false;
// }

// module.exports.deleteImg = function(req, res) {
//     var imageId = req.params.imageId;

//     imageService.getReference(imageId)
//         .then((result) => {
//             if(result){
//                 fs.unlinkSync('./uploads/' + result);
//                 console.log("File " + result + " deleted");

//                 imageService.deleteImg(imageId)
//                     .then((result) => {
//                         utils.writeJson(result, { }, 204);
//                     })
//                     .catch(function (response) {
//                         console.log('=== catch deleteImg ===')
//                         utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
//                     });
//             } else 
//                 utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': "Not Found" }],}, 404);
//         })
//         .catch(function (response) {
//             console.log('=== catch deleteImg ===')
//             utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
//         });   

// }

module.exports.deleteImg = function(req,res,next){
    const imageId = req.params.imageId;
    const taskId = req.params.taskId;
    imageService.removeImage(taskId,imageId)
    .then(function(response) {
        utils.writeJson(res, response, 204);
    })
    .catch(function(response) {
        console.log(response);
        if (response==="Not Found")
            utils.writeJson(res, {}, 404);
        else utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
    });
}
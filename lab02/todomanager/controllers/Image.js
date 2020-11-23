'use strict';

var utils = require('../utils/writer.js');
var imageService = require('../service/ImageService.js');
const { response } = require('express');
var path = require('path');

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

module.exports.getImg = function(req,res,next) {
    const imageId = req.params.imageId;
    const taskId = req.params.taskId;
    const mediaType = req.header('accept'); 

    if(mediaType === 'image/png' || mediaType === 'image/jpeg' || mediaType === 'image/gif'){
        imageService.getImage(taskId, imageId)
            .then( (response) => {
                let type = mediaType.substr(6);
                if (type === 'jpeg') type = 'jpg';
                if(response.includes(type)) {
                    res.sendFile(path.join(__dirname, '../uploads', response));
                } else {
                    // convertire
                    
                }
            })
            .catch( (response) => {
                if (response==="Not Found")
                    utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'Not Found' }] }, 404);
                else 
                    utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': response }], }, 500);
            });
    }
    else 
        utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': 'Unsupported Media Type' }] }, 415);

    
    
}
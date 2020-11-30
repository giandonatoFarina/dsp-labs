'use strict';

var utils = require('../utils/writer.js');
var Assignments = require('../service/AssignmentsService');
var to = require('await-to-js').default;

module.exports.assign = function assign (req, res, next) {
  Assignments.assignBalanced()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
    });
};

module.exports.assignTaskToUser = function assignTaskToUser (req, res, next) {
  Assignments.assignTaskToUser(req.body.id, req.params.taskId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
    });
};

module.exports.getUsersAssigned = function getUsersAssigned (req, res, next) {
  Assignments.getUsersAssigned(req.params.taskId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
    });
};

module.exports.removeUser = function removeUser (req, res, next) {
  Assignments.removeUser(req.params.taskId, req.params.userId)
    .then(function (response) {
      utils.writeJson(res, response, 204);
    })
    .catch(function (response) {
      utils.writeJson(res, {errors: [{ 'param': 'Server', 'msg': response }],}, 500);
    });
};

module.exports.updateSelection = async function (req, res) {
  let userId = req.params.userId;
  let taskId = req.body.id;

  let [err, response] = await to(Assignments.getAssignment(userId, taskId));
  if(err)
    utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': err }], }, 500);
  if(response.length == 0)
    utils.writeJson(res, { errors: [{'param': 'Server', 'msg': 'Task not assigned to user'}]}, 422);
  
  [err] = await to(Assignments.updateSelection(userId, taskId));
  if(err) 
    utils.writeJson(res, { errors: [{ 'param': 'Server', 'msg': err }], }, 500);
  else
    utils.writeJson(res, null, 204);
}
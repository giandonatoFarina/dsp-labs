'use strict';

const Task = require('../components/task');
const User = require('../components/user');
const db = require('../components/db');
const moment = require('moment');

/**
 * Reassign tasks in a balanced manner
 *
 * returns inline_response_201
 **/
exports.assignBalanced = function() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT t1.id FROM tasks t1 LEFT JOIN assignments t2 ON t2.task = t1.id WHERE t2.task IS NULL";
    db.each(sql, (err, tasks) => {
        if (err) {
            reject(err);
        } else {
            exports.assignEach(tasks.id).then(function(userid) {
                resolve(userid);
            });
        }
    });
    resolve();
  });
}


/**
 * Assign a user to the task
 *
 * body Body_1 ID of the user to assign to the task
 * taskId Long ID of the task
 * returns body_1
 **/
exports.assignTaskToUser = function(userId,taskId) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO assignments(task, user) VALUES(?,?)';
    db.run(sql, [taskId, userId], function(err) {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});
}


/**
 * Retreve the users assignted to the task
 * The users that are retrieved are the users that are assigned to the task characterized by the specified ID
 *
 * taskId Long ID of the task to retrieve
 * returns List
 **/
exports.getUsersAssigned = function(taskId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT u.id as uid, u.name, u.email FROM assignments as a, users as u WHERE  a.task = ? AND a.user = u.id";
    db.all(sql, [taskId], (err, rows) => {
        if (err) {
            reject(err);
        } else {
            let users = rows.map((row) => new User(row.uid, row.name, row.email, null));
            resolve(users);
        }
    });
  });
}


/**
 * Remove a user from the assigned task
 * The user that is remove is the user, identified by userId, that was assigned to the task identified by taskId
 *
 * taskId Long ID of the assigned task
 * userId Long ID of the user to remove
 * no response value expected for this operation
 **/
exports.removeUser = function(taskId,userId) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM assignments WHERE task = ? AND user = ?';
    db.run(sql, [taskId, userId], (err) => {
        if (err)
            reject(err);
        else
            resolve(null);
    })
  });
}


/**
 * Utility functions
 */

exports.assignEach = function(id) {
  return new Promise((resolve, reject) => {
      const sql = "SELECT user, MIN(Count) as MinVal     FROM     (SELECT user,COUNT(user) as Count     FROM assignments    GROUP BY user) T";
      var user = null;
      db.get(sql, (err, user) => {
          if (err) {
              reject(err);
          } else {
              exports.assignTaskToUser(user.user, id).then(resolve(user.user));
          }
      });
  });
}

exports.getAssignment = function (userId, taskId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM assignments WHERE task=? AND user=?";
        db.get(sql, [taskId, userId], (err, row) => {
            if(err) reject(err);
            else resolve(row);
        })
    })
}

exports.updateSelection = function (userId, taskId) {
    return new Promise((resolve, reject) => {
        const sql1 = "UPDATE assignments SET active=0 WHERE user=?";
        db.run(sql1, [userId], (err) => {
            if (err) reject(err);
            else {
                const sql2 = "UPDATE assignments SET active=1 WHERE user=? AND task=?";
                db.run(sql2, [userId, taskId], (err) => {
                    if(err) reject(err);
                    else resolve();
                })
            }
        });
    }); 
}
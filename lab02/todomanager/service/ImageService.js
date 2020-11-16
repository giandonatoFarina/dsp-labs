'use strict';

const db = require('../components/db');
var fs = require('fs');

exports.saveImg = function(taskId, fileName) {
  return new Promise((resolve, reject) => {
    // images (taskId, imageId, reference)    
    const sql = "INSERT INTO images(taskId, reference) VALUES (?, ?)";
    db.run(sql, [taskId, fileName], (err) => {
      if(err) {
        console.log(err);
        reject(err);
      }
      else resolve();
    });
  });
}

// exports.deleteImg = function(imageId) { 
//   console.log("imageId (2) = " + imageId);
//   return new Promise((resolve, reject) => {  
//     const sql = "DELETE FROM images WHERE imageId = ?";
//     db.run(sql, [imageId], (err) => {
//       if(err) {
//         console.log(err);
//         reject(err);
//       }
//       else resolve(null);
//     });
//   });
// }

// exports.getReference = function(imageId) { 
//   return new Promise((resolve, reject) => {  
//     const sql = "SELECT * FROM images WHERE imageId = ?";
//     db.get(sql, [imageId], (err, row) => {
//       if(err) {
//         console.log(err);
//         reject(err);
//       }
//       else {
//         console.log( "row = " + row);
//         if(row.reference) resolve(row.reference);
//         else resolve(null);
//       }
//     });
//   });
// }

exports.removeImage = function(taskId, imageId) {
    return new Promise((resolve, reject) => {
    const sql = "SELECT reference FROM images WHERE imageId=?";
    db.all(sql, [imageId], (err,rows) => {
        if(err) 
            reject(err,500);
        else if (rows.length===0)
            reject("Not Found",404);
        else {
            if (fs.existsSync("./uploads/"+ rows[0].reference))
                fs.unlinkSync("./uploads/"+ rows[0].reference);
            const sql1 = "DELETE FROM images WHERE imageId= ? ";
            db.all(sql1,[imageId],(err,rows)=>{
                if (err){
                    console.log(err);
                    reject(err,500);
                }
                resolve();
            })
        }        
      });
  });
}
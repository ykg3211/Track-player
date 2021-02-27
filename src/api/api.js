/* eslint-disable */
import axios from 'axios';

const path = {
  test : "/test",
  login : "/login",
  getuserName : "/getusername",
  getHomeImgs : "/getHomePicSum",
  getHomeImgInfo : "/getHomePicSumInfo",
};

const servers = {};

var http = {
  get: function (path, data, callback) {
    return new Promise((resolve) => {
      axios.get(path, {params: data}).then((resp)=> {
        resolve(resp.data);
      }).catch((err) => {
        console.log(err)
        resolve(err);
      })
    }).then(resp => callback(resp)); 
  },
  post: function (path, data, callback) {
    return new Promise((resolve) => {
      axios.post(path, data).then((resp)=> {
        resolve(resp.data);
      }).catch((err) => {
        console.log(err)
        resolve(err);
      })
    }).then(resp => callback(resp)); 
  }
}

servers.get = function(data, callback) {
  http.get(path.test, data, callback);
};
servers.post = function(data, callback) {
  http.post(path.test, data, callback);
};
servers.login = function(data, callback) {
  http.post(path.login, data, callback);
};
servers.getuserName = function(data, callback) {
  http.post(path.getuserName, data, callback);
};
servers.getHomeImgs = function(data, callback) {
  http.get(path.getHomeImgs, data, callback);
};
servers.getHomeImgInfo = function(callback) {
  http.get(path.getHomeImgInfo, {}, callback);
};

export default servers;
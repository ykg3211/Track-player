/* eslint-disable */
// 图片资源
import pathEndIcon from '../assets/track-end.svg';

import 'ol/ol.css';
import { Map, View } from 'ol';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import {Vector as VectorSource} from 'ol/source';
import {Icon, Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {FullScreen} from 'ol/control';
import Overlay from 'ol/Overlay';


var events = require("events");
var eventEmitter = new events.EventEmitter(); //用来和vue组件通信

export default class map {
  constructor(dom) {
    this.dom = null;  // 地图的dom元素
    this.map = null;  //地图实例
    this.view = null; //视角实例
    this.fullScreenControl = null; //全屏实例
    this.layers = []; //层 集合
    this.isFullScreen = false;
    
    this.configs = { //配置项
      view: { // 地图配置项，
        center: [116.397228, 39.909604],  //初始化中心
        zoom: 17,
        maxZoom: 19,
        minZoom: 0,
      },
      maxSubmit: 50,  //最大订阅的车辆数
      clusterDistance: 10,  //聚合的最小距离
      colors: {  //颜色合集
        lightGreen: '#B5F5D6',
        deepGreen: '#009800',
        orange: '#FF7100',
        lightorange: '#FFC68E',
        deeporange: '#FF7F00',
        blue: '#2ba9f3',
        Circlered: '#f82111',
        allPath: '#B5F5D6',
        green: '#0DC86E',
        red: '#FA3239'
      }
    }

    this.zIndex = {  //各个层的层级表，
      lightGreen: 1,
      allPath: 1,
      green: 2,
      red: 3,
      point: 4,
      vehicle: 7,
      endPoint: 6,
    };

    this.animation = {
      path: [], //行驶路径
      speedList: [], //速度数组
      directionList: [], //方向数组
      timesList: [], //时间数组
      timeGapCircleSource: null, //存放时间间隔的小圆圈的source 方便反复清除
      currentLocation: [], //车辆当前位置
      speed: 1, //每次跳转步长
      animationFrameTimer: -1, //requestAnimationFrame id值
      suspendTime: 0,  //用来记录上一次暂停的相对时间，实现继续播放从线段中间开始
      timeCoorIndex: 0,
      startTime: 0, //存放该次播放开始的时间，如果是线段中间开始播放的则按比例往前推
      deg: [],  // 补间动画角度值 两坐标差
      viewLock: false, //动画的时候是否要锁定镜头
      locationIndex: -1, //车辆位置在路径数组中的index
      time: 0, //时间进度条中的值  (1/100)
      rotation: 0, // 车辆方向
      vehicle: null, //车的实例
      greenLine: null, //还未行驶的路径
      overlay: null  // 车辆速度的overlay实例
    }

    this.interaction = {
      doubleClickZoom: null, //双击缩放地图
      dragPanIn: null // 鼠标拖动地图的实例
    }

    this.dom = document.getElementById(dom);
    this.view = new View({
      projection: 'EPSG:4326',
      center: this.configs.view.center,
      zoom: this.configs.view.zoom,
      maxZoom: this.configs.view.maxZoom,
      minZoom: this.configs.view.minZoom
    });
    this.map = new Map({
      target: dom,
      view: this.view
    });
    var that = this;
    that._initOffLineMap();
  }
  getMap() {
    return this.map; // 返回地图实例
  }
  getEventEmitter() {
    return eventEmitter; // 返回事件订阅实例
  }
  getLayers() {
    return this.layers; // 返回地图layers
  }
  viewMoveTo(...attrs) { // 视角移动到（）
    this._viewMoveTo(...attrs);
  }
  addLines(...attrs) {  // 添加线路  如果是 green-未行驶的则赋值到this.greenLine
    this._addLines(...attrs);
  }
  addVehicle(...attrs) {  // 添加车辆小圆点到路线上，并且渲染出绿色的未行驶的路线
    this._addVehicle(...attrs);
  }
  addPath(...attrs) { // 添加整条路
    this._addPath(...attrs);
  }
  saveTimes(...attrs) { // 保存时间数组
    this._saveTimes(...attrs);
  }
  addRedPath(...attrs) { // 添加超速的路段
    this._addRedPath(...attrs);
  }

  addVehicleInfo(...attrs) { // 添加车辆参数
    this._addVehicleInfo(...attrs);
  }
  freshRedPath(...attrs) { // 刷新超速路段
    this._freshRedPath(...attrs);
  }
  addCarStatus(...attrs) { // 添加车辆状态的icon
    this._addCarStatus(...attrs);
  }
  addPoint(...attrs) { //仅仅添加路线开始位置的小圆点
    this._addPoint(...attrs);
  }
  changeVehicleColor(...attrs) { //车辆告警更换车辆颜色
    this._changeVehicleColor(...attrs);
  }
  setViewLock(...attrs) {  // 用来设置播放的时候视角是否锁定
    this._setViewLock(...attrs);
  }
  initAnimation(...attrs) {  //初始化动画, 增加监听以及键盘事件
    this._initAnimation(...attrs);
  }
  clearAnimation(...attrs) {  //清除动画所有参数
    this._clearAnimation(...attrs);
  }
  startAnimation(...attrs) { // 开始动画
    this._startAnimation(...attrs);
  }
  stopAnimation(...attrs) { // 停止动画
    this._stopAnimation(...attrs);
  }
  timeTo(...attrs) {  // 用来绑定 手动拖进度条的方法
    this._timeTo(...attrs);
  }
  back(...attrs) { // 后退10%
    this._back(...attrs);
  }
  forward(...attrs) { // 前进10%
    this._forward(...attrs);
  }
  changeSpeed(...attrs) { // 变速
    this._changeSpeed(...attrs);
  }
  on(event, callback) {  // 监听事件
    this.map.on(event, callback);
  }
  initFullScreen(...attrs) {  // 初始化全屏功能
    this._initFullScreen(...attrs);
  }
  sizeChange(...attrs) {  // 更改尺寸
    this._sizeChange(...attrs);
  }

  _initOffLineMap() {
    // this._mapDisable();
    var tileLayer = null;
    tileLayer = new TileLayer({
      source: new TileArcGISRest({
        url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer'
      }),
      zIndex: -1 // 异步加的层级出问题，保证在最底下
    });
    this.map.addLayer(tileLayer);
  }
  // 视角移动到 location
  _viewMoveTo(location, immediate = false) {
    this.view.animate({
      center: location,
      duration: immediate ? 0 : 100
    });
  }
  _saveTimes(list) {
    this.animation.timesList = list;
  }
  // 添加整条路
  _addPath(allPath) {
    this.animation.path = allPath;  //设置动画的基本路径参数
    this._addLines('allPath', allPath);  //添加行驶过的浅绿色的线路
    this._addPoint('point', allPath[0]);  //添加起始位置的小圆圈
    this._addLines('green', allPath); //添加未行驶的绿色路径
    this._addEndPoint('endPoint', allPath[allPath.length - 1]);
  }
  _addRedPath(redPath) {
    this._removeLayer('red');
    redPath.forEach(item => {     //添加  拥堵路段
      this._addLines('red', item);
    });
  }
  _addVehicleInfo(speed, direction) {
    this.animation.speedList = speed;
    this.animation.directionList = direction;
  }
  _freshRedPath(redPath) {
    this._findLayer('red').getSource().clear();
    redPath.forEach(item => {
      this._addLines('red', item);
    });
  }
  // 添加线路  如果是 green-未行驶的则赋值到this.greenLine
  _addLines(layerName, locations) {
    if (layerName === 'green') {
      this.animation.greenLine = new LineString(locations);
    } else {
      var line = new LineString(locations);
    }
    var newFeature = new Feature({
      geometry: line ? line : this.animation.greenLine,
      name: layerName
    });
    this._judgeExistLayer(layerName, newFeature);
  }

  //仅仅添加路线开始位置的小圆点
  _addPoint(layerName, location) {
    var newFeature = new Feature({
      geometry: new Point(location),
      name: layerName
    });
    
    newFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: this.configs.colors.lightGreen,
            width: 1
          }),
          fill: new Fill({
            color: this.configs.colors.lightGreen
          })
        })
      })
    );
    this._findLayer('allPath').getSource().addFeature(newFeature);
  }
  // 添加路线最后的图标
  _addEndPoint(layerName, location) {
    var newFeature = new Feature({
      geometry: new Point(location),
      name: layerName
    });
    newFeature.setStyle(new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: pathEndIcon,
        size: [22, 30]
      }),
      zIndex: 9
    })
    );
    this._judgeExistLayer(layerName, newFeature);
  }
  // 绘制车辆的圆圈
  _createVehicleCircleCanvas(type) { //type: 1 正常蓝色 ||  2 告警红色
    var circle = document.createElement('canvas');
    circle.setAttribute('id', "vehileCircle");
    var ctx = circle.getContext("2d");

    ctx.strokeStyle = type == 1 ? 'rgba(43, 169, 243, 0.2)' : 'rgba(255, 166, 157, 0.3)'; // 最外面的大圈
    ctx.beginPath();
    ctx.arc(22, 22, 20, 0, 2 * Math.PI);
    ctx.fillStyle = type == 1 ? 'rgba(43, 169, 243, 0.2)' : 'rgba(255, 166, 157, 0.3)';
    ctx.fill();

    ctx.strokeStyle = 'white'; // 线
    ctx.beginPath();
    ctx.arc(22, 22, 7, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.strokeStyle = type == 1 ? this.configs.colors.blue : this.configs.colors.Circlered; // 小圈
    ctx.beginPath();
    ctx.arc(22, 22, 6, 0, 2 * Math.PI);
    ctx.fillStyle = type == 1 ? this.configs.colors.blue : this.configs.colors.Circlered;
    ctx.fill();

    ctx.beginPath();  // 三角箭头
    ctx.moveTo(22, 9);
    ctx.lineTo(19, 14);
    ctx.lineTo(25, 14);
    ctx.fill();

    ctx.stroke();
    return circle;
  }
  // 添加车辆小圆点到路线上，并且渲染出绿色的未行驶的路线
  _addVehicle(layerName, index) {
    var location = this.animation.path[index];
    this.animation.vehicle = new Point(location);
    this.animation.currentLocation = location;
    var newFeature = new Feature({
      geometry: this.animation.vehicle,
      name: layerName
    });
    this.animation.rotation = new Icon({
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      img: this._createVehicleCircleCanvas(1),
      imgSize: [44, 44]
    });
    newFeature.setStyle(
      new Style({
        image: this.animation.rotation
      })
    );
    this.animation.locationIndex = index;
    
    this._viewMoveTo(location);

    this._judgeExistLayer(layerName, newFeature, this.configs.colors.lightGreen);

    var overlay = document.createElement('p');
    overlay.style.display = "block";
    overlay.setAttribute('class', 'speedTip');
    overlay.innerHTML = `${this.animation.speedList[0].toFixed(1)}km/s`;
    this._addOverlay(1, overlay, location, 1);
  }
  _rotateVehicle(index) {
    if (index < this.animation.path.length - 1 && index > -1) {
      let x = this.animation.path[index];
      let y = this.animation.path[index + 1];
      this.animation.rotation.setRotation(this._getRotation(true)(index));
    }
  }
  _changeVehicleColor(type) {
    var rotationTemp = this.animation.rotation.getRotation();
    this.animation.rotation = new Icon({
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      img: this._createVehicleCircleCanvas(type),
      imgSize: [44, 44]
    });
    this.animation.rotation.setRotation(rotationTemp);
    this._findLayer('vehicle').getSource().getFeatures()[0].setStyle(new Style({
      image: this.animation.rotation
    }));
  }
  _getRotation(flag) {
    const that = this;
    if (flag) {
      return (index) => {
        return that.animation.directionList[index] / (2 * Math.PI);
      };
    }
    return (coor_1, coor_2) => {
      var PI = Math.PI;
      var C_1_0 = coor_1[0];
      var C_2_0 = coor_2[0];
      var C_1_1 = coor_1[1];
      var C_2_1 = coor_2[1];
      if (C_2_0 > C_1_0 && C_2_1 > C_1_1) { // 第一象限
        return Math.atan((C_2_0 - C_1_0) / (C_2_1 - C_1_1));
      } else if (C_2_0 < C_1_0 && C_2_1 > C_1_1) { // 第二象限
        return 2 * PI - Math.atan((C_1_0 - C_2_0) / (C_2_1 - C_1_1));
      } else if (C_2_0 < C_1_0 && C_2_1 < C_1_1) { // 第三象限
        return PI + Math.atan((C_1_0 - C_2_0) / (C_1_1 - C_2_1));
      } else if (C_2_0 > C_1_0 && C_2_1 < C_1_1) { // 第四象限
        return PI / 2 + Math.atan((C_1_1 - C_2_1) / (C_2_0 - C_1_0));
      } else if (C_2_0 === C_1_0 && C_2_1 > C_1_1) { // y轴正半轴
        return 0;
      } else if (C_2_0 < C_1_0 && C_2_1 === C_1_1) { // x轴负半轴
        return PI * 1.5;
      } else if (C_2_0 === C_1_0 && C_2_1 < C_1_1) { // y轴负半轴
        return PI;
      } else if (C_2_0 > C_1_0 && C_2_1 === C_1_1) { // x轴正半轴
        return PI / 2;
      }
    };
  }
  _removeLayer(layerName) {
    var index = -1;
    this.layers.forEach((item, i) => {
      if (item.className_ === layerName) {
        index = i;
      }
    });
    if (index === -1) {
      console.log(`This (${layerName}) layer is not exist`);
      return;
    }
    this.map.removeLayer(this.layers[index]);
    this.layers.splice(index, 1);
  }
  _clearAnimation() {
    if (this.animation.animationFrameTimer > -1) {
      cancelAnimationFrame(this.animation.animationFrameTimer);
      this.animation.animationFrameTimer = -1;
    }
    this.map.removeOverlay(this.animation.overlay);
    this._removeLayer('allPath');
    this._removeLayer('red');
    this._removeLayer('green');
    this._removeLayer('endPoint');
    this._removeLayer('timeGapPoint');
    this._removeLayer('vehicle');

    this.animation = {
      path: [],
      currentLocation: [],
      speedList: [],
      directionList: [],
      timesList: [],
      timeGapCircleSource: null,
      speed: 1,
      animationFrameTimer: -1, //requestAnimationFrame id值
      suspendTime: 0,
      timeCoorIndex: 0,
      startTime: 0,
      deg: [],  // 补间动画角度值 两坐标差
      viewLock: false,
      locationIndex: -1,
      time: 0,
      rotation: 0,
      vehicle: null,
      greenLine: null,
      overlay: null
    };

    this._setDefineProperty(); // 关键参数重新监听
  }

  // ======================================
  // 动画
  // 初始化动画参数
  _initAnimation(viewLock) {
    this._setDefineProperty(); // 将动画关键参数进行监听
    // this._keyEvent(); // 设置键盘事件绑定
    this.animation.viewLock = viewLock; //设置视角是否锁定
  }
  // 变速
  _changeSpeed(speed) {
    this.animation.speed = speed;
  }
  _setViewLock(flag) {
    this.animation.viewLock = flag;
  }
  // 将车辆移动到（坐标信息）
  _vehicleMoveTo(coordinates, isFrame = false) {
    if (this.animation.vehicle) {
      this.animation.vehicle.setCoordinates(coordinates);
      if (this.animation.overlay) {
        this.animation.overlay.setPosition(coordinates);
      }
      if (this.animation.greenLine) {
        this.animation.greenLine.setCoordinates(this._getGreenLineCoor(coordinates, this.animation.path, isFrame));
      }
      if (this.animation.viewLock) {
        this.viewMoveTo(coordinates, true);
      }
    } else {
      console.error('车辆不存在');
    }
  }
  // 将车辆移动到（index）（行驶路径中的index值）（path(index)）
  _vehicleMoveToIndex(v) {
    var index = Math.ceil(v / 100 * this.animation.path.length);
    index = index === 0 ? 1 : index;
    this.animation.locationIndex = index - 1;

    this.animation.currentLocation = this.animation.path[index - 1];

    this.animation.deg = this._calTwoCoorsDeg(this.animation.locationIndex);
    // 锁定视角
    if (this.animation.viewLock) {
      this.viewMoveTo(this.animation.currentLocation, true);
    }
  }
  // 开始动画
  _startAnimation() {
    if (this.animation.locationIndex < 0) {
      this.animation.time = this._locationToTime(this._findCoor(this.animation.currentLocation, this.animation.path), this.animation.path.length - 1);
    }
    if (this.animation.time == 100) { // 如果结束放映进度条在最后，点击播放重新开始播放
      this.animation.time = 0;
    }
    var that = this;

    const gap = 1000;
    if (this.animation.suspendTime !== 0) {  //如果是暂停情况下播放， 需要计算暂停时间点和上一次主时间线节点时间点的时间差，在基于现在时间反向推回，可以实现再次播放的时候沿着上一次停止的位置继续播放。
      this.animation.startTime = new Date().getTime() - this.animation.suspendTime + this.animation.startTime;
    } else {
      this.animation.startTime = new Date().getTime();
    }
    this.animation.deg = that._calTwoCoorsDeg(that.animation.locationIndex);  //获取第一次角度单位
    
    var _animationStep = function() {
      let current = new Date().getTime();

      if ((current - that.animation.startTime) >= gap) { // 时间主线下的主线动画逻辑
        that.animation.startTime = current;  // 碰到下一个主线节点，刷新时间，
        let tempIndex = JSON.parse(JSON.stringify(that.animation.locationIndex)); //监听了该属性值
        tempIndex += that.animation.speed; //主要的步长逻辑
  
        if (tempIndex >= that.animation.path.length) {
          that._stopAnimation();
          that.animation.time = 100;
          return;
        } // 判断倍速放映时是否超出进度条
  
        that.animation.time = that._locationToTime(tempIndex, that.animation.path.length - 1); //主要的渲染逻辑
      } else {
        that._vehicleMoveTo(that._calAnimationFrameCoor(that.animation.startTime, current, that.animation.locationIndex, that.animation.deg), true); // 补间动画时间线车辆移动一系列渲染操作
      }


      that.animation.animationFrameTimer = requestAnimationFrame(_animationStep);
    };

    that.animation.animationFrameTimer = requestAnimationFrame(_animationStep);
  }
  // 停止播放
  _stopAnimation(flag = true) {
    if (this.animation.animationFrameTimer > -1) {

      this.animation.suspendTime = new Date().getTime();  //记录暂停的时候的时间。
      if (flag) {
        eventEmitter.emit("switchPlay"); // 通知进度条暂停
      }
      cancelAnimationFrame(this.animation.animationFrameTimer);
      this.animation.animationFrameTimer = -1;
    }
  }
  //计算当前坐标下剩余的绿线的坐标， 适配不同的倍速。
  _calTwoCoorsDeg(index) {
    if (index >= this.animation.path.length) {
      return [0, 0];
    }
    let degList = [];
    for (let i = 0; i < 4; i++) {
      let coor_1 = this.animation.path[index + i];
      let coor_2 = this.animation.path[index + 1 + i];
      if (coor_2) {
        degList.push([coor_2[0] - coor_1[0], coor_2[1] - coor_1[1]]);
      }
    }
    return degList;
  }
  // 计算每一帧动画的坐标
  // 适配不同播放速度， 先计算出该locationIndex中的时间间隔相对于该播放速度中的index 比如 播放间隔为400ms，播放速度为4倍速，则当前的index为1，该小间隔的时间为150ms。  400 - 1000 / 4 = 150；
  _calAnimationFrameCoor(time_1, time_2, index, deg) {
    let gap = time_2 - time_1;
    let timePerGap = 1000 / this.animation.speed;
    this.animation.timeCoorIndex = Math.floor(gap / timePerGap);  // 倍速之后当前时间相对于1s内的坐标， 1倍速， 0； 2倍速  0，1； 四倍速  0，1，2，3；
    gap = (gap % timePerGap) / timePerGap;  // 该小间隔的时间比例，  比如四倍速下， 400ms时，  (400 % 1000 / 4) / 250 = 0.4  代表走过了当前的时间间隔下线段的0.4倍。
    let coor = [0, 0];
    let coor_1 = this.animation.path[index + this.animation.timeCoorIndex] || null;

    let speed = this.animation.speedList[index + this.animation.timeCoorIndex];
    if (this.animation.overlay && speed) {
      this.animation.overlay.getElement().innerHTML = `${speed.toFixed(1)}km/s`;
    }

    let deg_1 = deg[this.animation.timeCoorIndex];
    if (coor_1 && deg_1) {
      coor[0] = coor_1[0] + deg_1[0] * gap;  //经纬度， 找到当前在路径上的经纬度，加上角度deg乘以小间隔时间比例，得到该时间点的坐标
      coor[1] = coor_1[1] + deg_1[1] * gap;  //同上
    } else {   // 适配播放到最后倍速过快，剩余路径不够倍速，导致数组溢出的问题
      return this.animation.path[this.animation.path.length - 1];
    }
    return coor;
  }
  // 用来绑定 手动拖进度条的方法
  _timeTo(timeValue) {
    this.animation.time = timeValue;
  }
  // 后退10%
  _back() {
    if (this.animation.locationIndex < 0) {
      this.animation.locationIndex = this._findCoor(this.animation.currentLocation, this.animation.path);
    }
    let tempIndex = this.animation.locationIndex - (this.animation.speed * 1);  // 每一步步长
    tempIndex = tempIndex <= 0 ? 0 : tempIndex;
    this.animation.time = this._locationToTime(tempIndex, this.animation.path.length - 1); //主要的渲染逻辑
  }
  // 前进10%
  _forward() {
    if (this.animation.locationIndex < 0) {
      this.animation.locationIndex = this._findCoor(this.animation.currentLocation, this.animation.path);
    }
    let tempIndex = this.animation.locationIndex + (this.animation.speed * 1);  // 每一步步长
    tempIndex = tempIndex >= this.animation.path.length ? this.animation.path.length - 1 : tempIndex;
    this.animation.time = this._locationToTime(tempIndex, this.animation.path.length - 1); //主要的渲染逻辑
  }

  _judgeExistLayer(name, newFeature, color, zI, style) {
    var index = -1; // 用来判断该layer是否已经存在的值
    this.layers.forEach((item, i) => {
      if (item.className_ === name) {
        index = i;
      }
    });

    if (index === -1) {
      var source = new VectorSource();
      source.addFeature(newFeature);
      
      var newLayer = new VectorLayer({
        className: name,
        source: source
      });
      var newStyle = style || new Style({
        stroke: new Stroke({
          color: color || this.configs.colors[name] || 'white',
          lineCap: 'round',
          width: 5
        })
      });
      newLayer.setStyle(newStyle);
      newLayer.setZIndex(this.zIndex[name] || zI || 0);
      this.map.addLayer(newLayer);
      this.layers.push(newLayer);
    } else {
      var tempSource = this.layers[index].getSource();
      tempSource.addFeature(newFeature);
      this.layers[index].setSource(tempSource);
    }
  }

  // 由维基百科中地球的详情得知  地球的子午线周长为40007.86km，极半径为6356.8，赤道周长为40076.017km,赤道半径为6378.1km,
  // 根据经纬度计算两坐标之间的实际距离 （km）
  _calDistance(x, y) {
    const tNS = (x[1] + y[1]) / 2; //两坐标的中间纬度
    const R = Math.cos(Math.abs(tNS) / 180 * Math.PI) * this._calCoorsR(tNS); //中间纬度的地球半径
    const L = 2 * Math.PI * R; //中间纬度的地球周长
    const WEUnit = L / 360; //中间纬度的每一经的距离
    const NSUnit = 40007.86 / 360; //子午线周长算得的每纬度的距离
    const width = Math.abs(y[0] - x[0]) * WEUnit; //宽
    const long = Math.abs(y[1] - x[1]) * NSUnit; //高
    const distance = Math.sqrt(width * width + long * long); //距离
    return distance;
  }
  //获取该纬度的半径
  _calCoorsR(NS) {
    return (NS / 90 * 21.3) + 6356.8;
  }

  _3857TurnTo4326(coors) {
    var x = coors[0] / 20037508.34 * 180;
    var y = coors[1] / 20037508.34 * 180;
    y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2);
    return [x, y];
  }

  //找到该坐标在路径中的index
  _findCoor(coor, path) {
    var index = -1;
    for (let i = 0; i < path.length; i++) {
      index = path[i][0] === coor[0] ? path[i][1] === coor[1] ? i : -1 : -1;
      if (index > -1) {
        break;
      }
    }
    return index;
  }

  _findLayer(name) {
    var layer = null;
    this.layers.forEach(item => {
      if (item.className_ == name) {
        layer = item;
      }
    });
    return layer;
  }

  // 将this.animation.currentLocation 变为可监听的，  实现更改地址就实时将车辆图标渲染出来
  // 将this.animation.time 变为可监听的，  用来实现拖动进度条实时更改状态
  // 将this.animation.locationIndex 变为可监听的，  用来实现拖动进度条实时更改状态
  _setDefineProperty() {
    var that = this;
    
    var value = 0;
    Object.defineProperty(this.animation, 'currentLocation', {
      enumerable: true, //可否遍历
      configurable: true, //可否修改
      get: function() {
        return value;
      },
      set: function(v) {
        if (v) {
          that._vehicleMoveTo(v);  //车辆移动到  坐标 coor
          value = v;
        }
      }
    });
    var timeValue = 0;
    var timeFlag = true;
    Object.defineProperty(this.animation, 'time', {
      enumerable: true, //可否遍历
      configurable: true, //可否修改
      get: function() {
        return timeValue;
      },
      set: function(v) {
        if (timeFlag) {  //手动防抖
          timeFlag = false;
          that._vehicleMoveToIndex(v); //车辆移动到  index （行驶路径中的index值）（path(index)）
          eventEmitter.emit("freshTime", v); // 发送到vue中实现进度条的更改
          // eventEmitter.emit('changeTime', that.animation.timesList[that.animation.locationIndex]);
          timeValue = v;
          setTimeout(() => {
            timeFlag = true;
          }, 5);
        }
      }
    });
    var locationIndex = 0;
    var sameValue = -1;
    Object.defineProperty(this.animation, 'locationIndex', {
      enumerable: true, //可否遍历
      configurable: true, //可否修改
      get: function() {
        return locationIndex;
      },
      set: function(v) {
        locationIndex = v;
        if (sameValue !== v) { // 手动加一个防抖，
          that._rotateVehicle(v);
          setTimeout(() => {
            that._speedOverlayMove(v);
          }, 100);  //延迟为了在视角移动过去之后在进行车辆元素的相应更改
          sameValue = v;
        }
      }
    });
  }
  // 计算绿线的坐标
  _getGreenLineCoor(coor, path, isFrame) {
    var index = this.animation.locationIndex;
    // var index = this._findCoor(coor, path);
    if (!isFrame) {
      return path.slice(index, path.length);
    }   //如果是补间动画情况下返回一个unshift一个当前位置的坐标
    let road = path.slice(this.animation.locationIndex + this.animation.timeCoorIndex + 1, path.length);
    road.unshift(coor);
    return road;
  }
  _sizeChange() {
    setTimeout(() => {
      var dom = document.getElementsByClassName('vehicleStatusContainer')[0];
      var size = [dom.clientWidth, dom.clientHeight];
      this.map.setSize(size);
    }, 0);
  }
  // 用来将车辆坐标对于路径的比例换算到进度条上
  _locationToTime(curIndex, allLength) {
    var index = curIndex / allLength * 100;
    return parseFloat(index);
  }
  _keyEvent() {
    document.addEventListener('keydown', (e) => {
      if (e.which == 32) {
        eventEmitter.emit('switchPlay');
      } else if (e.which == 37) {
        this._back();
      } else if (e.which == 39) {
        this._forward();
      }
    });
  }

  //添加overlay的公共方法
  //type： 1-车辆移动时候的速度overlay； 2-绘制的时候的鼠标的overlay； 3-测距的时候每个点的距离的overlay； 4-测距的时候最后一个点关闭的叉叉元素； 5-绘制的时候点击出现的删除按钮的overlay
  _addOverlay(type, el, center, position = 1) {
    var positions = ['bottom-center', 'center-left', 'top-left'];
    let newOverlay = new Overlay({
      element: el,
      position: center,
      positioning: positions[position],
      stopEvent: type === 5,
      className: `overlay_${type}`,
      id: `overlay_${type === 4 ? type : new Date()}`
    });

    if (type === 1) {
      this.animation.overlay = newOverlay;
      this.map.addOverlay(this.animation.overlay);
      this._speedOverlayMove(this.animation.locationIndex);
    }
  }
  //车辆运动的速度overlay移动
  _speedOverlayMove(index) {
    if (this.animation.overlay) {
      var speed = this.animation.speedList[index];
      if (speed) {
        this.animation.overlay.getElement().innerHTML = `${speed.toFixed(1)}km/s`;
      }
      this.animation.overlay.setPosition(this.animation.path[index]);
    }
  }

  _initFullScreen(targetDom, sourceDom) {
    var fullScreen = new FullScreen({
      className: 'fullScreenBtn',
      target: targetDom,
      source: sourceDom
    });
    this.map.addControl(fullScreen);
    targetDom.children[0].children[0].innerHTML = ''; //更改全屏按钮的内容
  }
}
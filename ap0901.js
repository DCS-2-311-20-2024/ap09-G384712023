//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38471-2023 西村和真
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GUI } from "ili-gui";

const seg = 12; // 円や円柱の分割数

const key = {
  w:false,
  a:false,
  s:false,
  d:false,
};

  //プレイヤーの作成
  export function MakeMainCharacter() {
    // メタルロボットの設定
    const metalRobot = new THREE.Group //metalRobotグループを作っている
    const metalMaterial = new THREE.MeshPhongMaterial( // Phong・・・光沢のある素材　前回のとは別
      {color: 0xFEDCBD, shininess: 60, specular: 0x222222 });
    const redMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    const legRad = 0.5; // 脚の円柱の半径
    const legLen = 3; // 脚の円柱の長さ
    const legSep = 1.2; // 脚の間隔
    const bodyW = 3; // 胴体の幅
    const bodyH = 3; // 胴体の高さ
    const bodyD = 2; // 胴体の奥行
    const armRad = 0.4; // 腕の円柱の半径
    const armLen = 3.8; // 腕の円柱の長さ
    const headRad = 1.2; // 頭の半径
    const eyeRad = 0.2; // 目の半径
    const eyeSep = 0.8; // 目の間隔
    //  脚の作成
    const legGeometry
      = new THREE.CylinderGeometry(legRad, legRad, legLen, seg, seg); //Cylinder・・・円柱
    const legR = new THREE.Mesh(legGeometry, metalMaterial);
    legR.position.set(-legSep/2, legLen/2, 0); //　1/2しているのは半径だから
    metalRobot.add(legR); //metalRobotに右足を追加
  
    const legL = new THREE.Mesh(legGeometry, metalMaterial);
    legL.position.set(legSep/2, legLen/2, 0);
    metalRobot.add(legL);
    //  胴体の作成
    const bodyGeometry = new THREE.BoxGeometry(bodyW - bodyD, bodyH, bodyD);
    const body = new THREE.Group; //bodyグループ
    body.add(new THREE.Mesh(bodyGeometry, metalMaterial));
    const bodyL = new THREE.Mesh(
      new THREE.CylinderGeometry(
        bodyD/2, bodyD/2, bodyH, seg, 1, false, 0, Math.PI),
      metalMaterial);
    bodyL.position.x = (bodyW - bodyD)/2;
    body.add(bodyL);
    
    const bodyR = new THREE.Mesh(
      new THREE.CylinderGeometry(
        bodyD/2, bodyD/2, bodyH, seg, 1, false, Math.PI, Math.PI),
      metalMaterial);
    bodyR.position.x = -(bodyW - bodyD) / 2;
    body.add(bodyR);
    
    body.children.forEach((child) => { //bodyグループへの影の追加
      child.castShadow = true;
      child.receiveShadow = true;
    });
  
    body.position.y = legLen + bodyH/2;
    metalRobot.add(body);
  
    //  腕の作成
    const armGeometry 
    = new THREE.CylinderGeometry(armRad, armRad, armLen, seg, 1);
  
    const armL = new THREE.Mesh(armGeometry, metalMaterial);
    armL.position.set(bodyW/2 + armRad, legLen + bodyH - armLen/2, 0);
    metalRobot.add(armL);
  
    const armR = new THREE.Mesh(armGeometry, metalMaterial);
    armR.position.set(-(bodyW/2 + armRad), legLen + bodyH - armLen/2, 0);
    metalRobot.add(armR);
  
    //  頭の作成
    const head = new THREE.Group; //headグループ
    const headGeometry = new THREE.SphereGeometry(headRad, seg, seg);
    head.add(new THREE.Mesh(headGeometry, metalMaterial));
    //　目の追加
    const circleGeometry = new THREE.CircleGeometry(eyeRad, seg);
    const eyeL = new THREE.Mesh(circleGeometry, redMaterial);
    eyeL.position.set(eyeSep/2, headRad/3, headRad-0.04);
    head.add(eyeL);
  
    const eyeR = new THREE.Mesh(circleGeometry, redMaterial);
    eyeR.position.set(-eyeSep/2, headRad/3, headRad-0.04);
    head.add(eyeR);
  
    head.children.forEach((child) => { //headグループへの影の追加
      child.castShadow = true;
      child.receiveShadow = true;
    });
  
    head.position.y = legLen + bodyH + headRad;
    metalRobot.add(head);
  
     // 影についての設定
    metalRobot.children.forEach((child) => { //metalRobotグループへの影の追加　グループの中にある子要素：meshたちに追加される
      child.castShadow = true;
      child.receiveShadow = true;
    });
    // 作成結果を戻す
    return metalRobot;
  }
    
  

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: true, // 座標軸
    x: -10,
    y: 10,
    z: -50, 
    chara: true,
    rotation: 0,
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");
  gui.add(param, "x", -50, 50).name("x軸");
  gui.add(param, "y", 10, 50).name("y軸");
  gui.add(param, "z", -50, 50).name("z軸");
  gui.add(param, "chara").name("キャラ追尾");
  gui.add(param, "rotation", -1.5, 1.5).name("回転");


  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(-5,2,-50);
  camera.lookAt(0,2,30);
  
  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
    document.getElementById("output").appendChild(renderer.domElement);
  // レンダラに影の処理をさせる
  renderer.shadowMap.enabled = true;

  window.addEventListener('load', () => {
    renderer.domElement.focus();  // キャンバスにフォーカスを当てる
  });


  //　平面の作成
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({color: 0x008010})
  );
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  scene.add(plane);

  // 光源の作成
  const light = new THREE.DirectionalLight(0xffffff, 5);
  light.position.set(-2, 10, 10);
  light.shadowMapWidth = 2048; 
  light.shadowMapHeight = 2048; 
  light.castShadow = true;

  scene.add(light);

  // 画像の読み込み
  const textureLoader = new THREE.TextureLoader();
  const bluesky = textureLoader.load("sky.jpg");
  bluesky.wrapS = THREE.RepeatWrapping; // 水平方向に繰り返し
  bluesky.wrapT = THREE.RepeatWrapping; // 垂直方向に繰り返し
  bluesky.repeat.set(0.5, 0.5); // 繰り返しのスケール（必要に応じて調整）
  scene.background = bluesky;

  // メインキャラの追加
  const MainCharacter = MakeMainCharacter();
  MainCharacter.position.x = 3;
  scene.add(MainCharacter);

  
  // 描画処理

  // キーボードイベントの設定
  document.addEventListener('keydown', (event) => {
    if (event.key === 'w') key.w = true;
    if (event.key === 'a') key.a = true;
    if (event.key === 's') key.s = true;
    if (event.key === 'd') key.d = true;
    if (event.key === ' ') key.space = true;
    });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'w') key.w = false;
    if (event.key === 'a') key.a = false;
    if (event.key === 's') key.s = false;
    if (event.key === 'd') key.d = false;
    if (event.key === ' ') key.space = false;
  });

  // 描画関数
  function render() {
    camera.position.x = param.x;
    camera.position.y = param.y;
    camera.position.z = param.z;

    
    camera.rotation.y = param.rotation;
    // 座標軸の表示
    axes.visible = param.axes;
    
    // 次のフレームでの描画要請
    requestAnimationFrame(render);

    if (bluesky) {
      bluesky.offset.x += 0.00025; // 水平方向に少しずつ動かす
      bluesky.offset.y += 0.000125; // 垂直方向に少しずつ動かす
    }

    if(!param.chara){
      camera.position.x = param.x;
      camera.position.y = param.y;
      camera.position.z = param.z;
    }

    if(param.chara){ //キャラを追尾
      camera.position.x = MainCharacter.position.x;
      camera.position.y = MainCharacter.position.y + 10;
      camera.position.z = MainCharacter.position.z - 40;
    }

    // キャラクターの移動
    if (key.w) MainCharacter.position.z += 0.3; // 前進
    if (key.s) MainCharacter.position.z -= 0.3; // 後退
    if (key.a) MainCharacter.position.x += 0.15; // 左
    if (key.d) MainCharacter.position.x -= 0.15; // 右
    if (key.space && MainCharacter.position.y == 0){
     
      MainCharacter.position.y += 5;  
    }

    if(MainCharacter.position.y > 0){
      MainCharacter.position.y -= 0.25; 
    } 

    // 描画
    renderer.render(scene, camera);
  }

  // 描画開始
    render();
}


init();
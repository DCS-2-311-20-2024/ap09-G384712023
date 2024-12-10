//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G38471-2023 西村和真
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GUI } from "ili-gui";
const seg = 12; // 円や円柱の分割数

const canvas = document.getElementById("HP");
const can = canvas.getContext("2d");

const canvas2 = document.getElementById("Power");
const can2 = canvas2.getContext("2d");

const canvas3 = document.getElementById("Boss");
const can3 = canvas3.getContext("2d");


const maxHP = 100;
let currentHP = 100;

const maxPower = 100;
let currentPower = 100;

const maxBHP = 200;
let currentBHP = 200;


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
    const BlackMaterial = new THREE.MeshPhongMaterial({color: 0x000000});
    const RedMaterial = new THREE.MeshPhongMaterial({color: 0xFF0000});
    const legRad = 0.5; // 脚の円柱の半径
    const legLen = 2.3; // 脚の円柱の長さ
    const legSep = 1.2; // 脚の間隔
    const bodyW = 3; // 胴体の幅
    const bodyH = 2.2; // 胴体の高さ
    const bodyD = 2; // 胴体の奥行
    const armRad = 0.4; // 腕の円柱の半径
    const armLen = 2.3; // 腕の円柱の長さ
    const headRad = 1.2; // 頭の半径
    const eyeRad = 0.2; // 目の半径
    const eyeSep = 0.8; // 目の間隔
    //  脚の作成
    const legGeometry
      = new THREE.CylinderGeometry(legRad, legRad, legLen, seg, seg); //Cylinder・・・円柱
    const legR = new THREE.Mesh(legGeometry, BlackMaterial);
    legR.position.set(-legSep/2, legLen/2, 0); //　1/2しているのは半径だから
    metalRobot.add(legR); //metalRobotに右足を追加
  
    const legL = new THREE.Mesh(legGeometry, BlackMaterial);
    legL.position.set(legSep/2, legLen/2, 0);
    metalRobot.add(legL);

    //  胴体の作成
    const bodyGeometry = new THREE.BoxGeometry(bodyW - bodyD, bodyH, bodyD);
    const body = new THREE.Group; //bodyグループ
    body.add(new THREE.Mesh(bodyGeometry, RedMaterial));
    const bodyL = new THREE.Mesh(
      new THREE.CylinderGeometry(
        bodyD/2, bodyD/2, bodyH, seg, 1, false, 0, Math.PI),
        RedMaterial);
    bodyL.position.x = (bodyW - bodyD)/2;
    body.add(bodyL);
    
    const bodyR = new THREE.Mesh(
      new THREE.CylinderGeometry(
        bodyD/2, bodyD/2, bodyH, seg, 1, false, Math.PI, Math.PI),
        RedMaterial);
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
    const eyeL = new THREE.Mesh(circleGeometry, BlackMaterial);
    eyeL.position.set(eyeSep/2, headRad/3, headRad-0.04);
    head.add(eyeL);
  
    const eyeR = new THREE.Mesh(circleGeometry, BlackMaterial);
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
  };


  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");
  gui.add(param, "x", -50, 50).name("x軸");
  gui.add(param, "y", 10, 50).name("y軸");
  gui.add(param, "z", -50, 50).name("z軸");

//HPの表示
function hpgauge(){
  can.clearRect(0, 0, canvas.width, canvas.height);

  can.fillStyle = "black";
  can.fillRect(0, 0, canvas.width, canvas.height);

  can.fillStyle = "green";
  const hpWidth = (currentHP / maxHP) * canvas.width;
  can.fillRect(0, 0, hpWidth, canvas.height);

  can.strokeStyle = "gray";
  can.strokeRect(0, 0, canvas.width, canvas.height);
}

hpgauge();

  //ボスHPの表示
  function bosshp(){
    can3.clearRect(0, 0, canvas3.width, canvas3.height);

    can3.fillStyle = "black";
    can3.fillRect(0, 0, canvas3.width, canvas3.height);

    can3.fillStyle = "red";
    const PowerWidth = (currentBHP / maxBHP) * canvas3.width;
    can3.fillRect(0, 0, PowerWidth, canvas3.height);

    can3.strokeStyle = "gray";
    can3.strokeRect(0, 0, canvas3.width, canvas3.height);
  }

  //気力の表示
  function powergauge(){
    can2.clearRect(0, 0, canvas2.width, canvas2.height);

    can2.fillStyle = "black";
    can2.fillRect(0, 0, canvas2.width, canvas2.height);

    can2.fillStyle = "rgb(251, 176, 52)";
    const PowerWidth = (currentPower / maxPower) * canvas2.width;
    can2.fillRect(0, 0, PowerWidth, canvas2.height);

    can2.strokeStyle = "gray";
    can2.strokeRect(0, 0, canvas2.width, canvas2.height);
  }

  powergauge();

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

  //　画像の読み込みと平面の作成
  const textureLoader = new THREE.TextureLoader();
  const asphalt = textureLoader.load("asphalt.jpg");
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 150),
    new THREE.MeshPhongMaterial({map: asphalt})
  );
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  scene.add(plane);

  // 光源の作成
  const light = new THREE.DirectionalLight(0xffffff, 5);
  light.position.set(10, 10, -5);
  light.shadowMapWidth = 256; 
  light.shadowMapHeight = 256; 
  light.castShadow = true;

  scene.add(light);

  // 画像の読み込みと空の動き
  const bluesky = textureLoader.load("sky.jpg");
  bluesky.wrapS = THREE.RepeatWrapping; // 水平方向に繰り返し
  bluesky.wrapT = THREE.RepeatWrapping; // 垂直方向に繰り返し
  bluesky.repeat.set(0.5, 0.5); // 繰り返しのスケール（必要に応じて調整）
  scene.background = bluesky;

  const startTime = performance.now();  
  const changesky = 5000; 

  //　画像の読み込みとビルの作成
  const texture = textureLoader.load("cityTexture.png");
  
  function makeBuilding(x, z, type) {
    const height = [2, 2, 7, 4, 5];
    const bldgH = height[type] * 5;
    const geometry = new THREE.BoxGeometry(8, bldgH, 8);
    const material = new THREE.MeshPhongMaterial({map: texture});
    const sideUvS = (type*2 + 1)/11;
    const sideUvE = (type*2 + 2)/11;
    const topUvS = (type*2 + 2)/11;
    const topUvE = (type*2 + 3)/11;
    const uvs = geometry.getAttribute("uv");
    for(let i = 0; i < 48; i+=4){
        if(i < 16 || i > 22){
            uvs.array[i] = sideUvS;
            uvs.array[i + 2] = sideUvE;
        }
        else{
            uvs.array[i] = topUvS;
            uvs.array[i + 2] = topUvE;
        }
    } 
    const bldg = new THREE.Mesh(
        geometry,
        material
    )
    bldg.position.set(x + x, bldgH/2, z + z);
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    scene.add(bldg);
  }

  makeBuilding(12, -20, 1);
  makeBuilding(-20, -17, 2);
  makeBuilding(-12, -10, 4);
  makeBuilding(10, 20, 3);
  makeBuilding(12, 0, 1);
  makeBuilding(20, 4, 4);
  makeBuilding(-20, -7, 0);
  makeBuilding(-10, -20, 1);
  makeBuilding(-25, 10, 2);
  makeBuilding(-20, 0, 3);
  makeBuilding(20, 20, 2);
  makeBuilding(16, 20, 2);
  makeBuilding(-15, 10, 2);
  makeBuilding(25, -5, 2);
  makeBuilding(30, 20, 2);
  makeBuilding(25, -10, 3);

  // 描画処理

  // キーボードイベントのd設定
  document.addEventListener('keydown', (event) => {
    if (event.key === 'w') key.w = true;
    if (event.key === 'a') key.a = true;
    if (event.key === 's') key.s = true;
    if (event.key === 'd') key.d = true;
    if (event.key === ' ') key.space = true;
    if (event.key === 'j') key.j = true;
    });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'w') key.w = false;
    if (event.key === 'a') key.a = false;
    if (event.key === 's') key.s = false;
    if (event.key === 'd') key.d = false;
    if (event.key === ' ') key.space = false;
    if (event.key === 'j') key.j = false;
  });

  // メインキャラの追加
  const MainCharacter = MakeMainCharacter();
  MainCharacter.position.x = 0;
  MainCharacter.position.z = -48;
  scene.add(MainCharacter);

  const MainCharacter2 = MakeMainCharacter();
  MainCharacter2.position.z = 30;
  scene.add(MainCharacter2);


  function checkCharacterCollision() {
    const box1 = new THREE.Box3().setFromObject(MainCharacter);
    const box2 = new THREE.Box3().setFromObject(MainCharacter2);
  
    if (box1.intersectsBox(box2)) {
      currentHP -= 0.1;
      hpgauge();
  
      if (currentHP < 0) {
        currentHP = 0;
      }
    }
  }

  
  // 描画関数
  function render() {
    // 座標軸の表示
    axes.visible = param.axes;

    checkCharacterCollision();
    
    if (bluesky) {
      bluesky.offset.x += 0.00025; // 水平方向に少しずつ動かす
      bluesky.offset.y += 0.000125; // 垂直方向に少しずつ動かす
    }    

    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;

    if (elapsedTime >= changesky) {
      scene.background = new THREE.Color(0x6B0A0A); // 赤の空に変更
      light.intensity = 0.5; 
      bosshp();
      MainCharacter2.scale.set(4, 4, 4);
    }

    // キャラクターの移動
    if (key.w) MainCharacter.position.z += 0.3; // 前進
    if (key.s) MainCharacter.position.z -= 0.3; // 後退
    if (key.a) MainCharacter.position.x += 0.15; // 左
    if (key.d) MainCharacter.position.x -= 0.15; // 右

    //以下はspaceキーを押すとブラウザがスクロールされるのを防ぐために追加
    //導入前はジャンプのためにspaceキーを押すとWebページの方がスクロールされてしまった.
    document.addEventListener('keydown', (event) => {
      if (key.space) {
        event.preventDefault();  // ←←←←←←スペースキーによるスクロールを防ぐ
        if (key.space && MainCharacter.position.y == 0){
          MainCharacter.position.y += 5;  
        }
      }
    });
    
    document.addEventListener('keydown', (event) => {
      if (event.key == 'k' && currentPower == 100) {
        currentPower -= 100;
        if (currentPower < 0){
          currentPower = 0; 
        }
        powergauge();

        const box1 = new THREE.Box3().setFromObject(MainCharacter);
        const box2 = new THREE.Box3().setFromObject(MainCharacter2);

      if (box1.intersectsBox(box2)) {
        currentBHP -= 50; // 必殺技のダメージ
        if (currentBHP < 0) {
          currentBHP = 0;
        }
        bosshp(); // ボスのHPゲージを更新する関数
      }
      
    }
  });

    if(currentPower < maxPower){
      currentPower += 0.5;
      powergauge();
    }

    //ジャンプした後、地面につくため
    if(MainCharacter.position.y > 0){
      MainCharacter.position.y -= 0.25; 
    } 

    //カメラはキャラを追尾
    camera.position.x = MainCharacter.position.x;
    camera.position.y = MainCharacter.position.y + 10;
    camera.position.z = MainCharacter.position.z - 40;


    // 描画
    renderer.render(scene, camera);

    // 次のフレームでの描画要請
    requestAnimationFrame(render);

  }

  // 描画開始
    render();
}


init();
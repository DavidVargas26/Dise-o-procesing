// ===== VARIABLES GLOBALES =====
let video;
let faceMesh;
let noseX, noseY;
let smoothNoseX, smoothNoseY;
const smoothingFactor = 0.7; // 0-1: más alto = más suave
let isDetecting = false;

// ===== SETUP =====
function setup() {
  createCanvas(400, 400);
  
  // Crear captura de video (usa la cámara web)
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide(); // Ocultamos el elemento video de p5, lo dibujamos nosotros
  
  // Inicializar variables de posición
  noseX = width / 2;
  noseY = height / 2;
  smoothNoseX = noseX;
  smoothNoseY = noseY;
  
  // Inicializar FaceMesh
  initializeFaceMesh();
}

// ===== INICIALIZAR FACE MESH =====
async function initializeFaceMesh() {
  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });
  
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  
  // Callback cuando se detectan rostros
  faceMesh.onResults(onFaceMeshResults);
  
  // Procesar video continuamente
  processVideo();
}

// ===== PROCESAR VIDEO CONTINUAMENTE =====
async function processVideo() {
  if (video && video.canvas) {
    await faceMesh.send({ image: video.canvas });
  }
  requestAnimationFrame(processVideo);
}

// ===== CALLBACK DE RESULTADOS DE FACE MESH =====
function onFaceMeshResults(results) {
  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    isDetecting = true;
    
    // Obtener landmarks del primer rostro detectado
    const landmarks = results.multiFaceLandmarks[0];
    
    // Landmark #1 es la punta de la nariz
    // Las coordenadas van de 0 a 1 (normalizadas)
    const noseLandmark = landmarks[1]; // índice 1 = nose tip
    
    // Convertir coordenadas normalizadas a píxeles de video
    let rawX = noseLandmark.x * video.width;
    let rawY = noseLandmark.y * video.height;
    
    // Mapear coordenadas del video (640x480) al canvas (400x400)
    noseX = map(rawX, 0, video.width, 50, width - 50);
    noseY = map(rawY, 0, video.height, 40, height - 40);
    
    // Aplicar suavizado con promedio móvil exponencial
    smoothNoseX = lerp(smoothNoseX, noseX, 1 - smoothingFactor);
    smoothNoseY = lerp(smoothNoseY, noseY, 1 - smoothingFactor);
  } else {
    isDetecting = false;
  }
}

// ===== DRAW =====
function draw() {
  // Dibujar video de la cámara como fondo (escalado al canvas)
  image(video, 0, 0, width, height);
  
  // Si no detectamos rostro, mostrar mensaje
  if (!isDetecting) {
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Buscando rostro...", width / 2, height / 2);
    return;
  }
  
  // === POSICIÓN DINÁMICA DEL DIBUJO ===
  let x = smoothNoseX - 60; // Centrar el dibujo en la nariz (ajuste fino)
  let y = smoothNoseY - 80; // Centrar verticalmente
  let s = 120; // tamaño del cubo (reducido de 240)
  let t = 10; // grosor del efecto 3D (reducido de 20)
  
  let ps = s / 8; // 1 "píxel" de Minecraft = s/8

  // === CARA FRONTAL (piel base) ===
  fill(139, 94, 60);
  noStroke();
  rect(x, y, s, s);

  // --- OJOS ---
  fill(255); // blanco del ojo
  rect(x + ps, y + 2*ps, ps*2, ps);
  rect(x + 5*ps, y + 2*ps, ps*2, ps);

  fill(60, 35, 10); // iris café
  rect(x + ps, y + 2*ps, ps, ps);
  rect(x + 5*ps, y + 2*ps, ps, ps);

  fill(10, 10, 10); // pupila
  rect(x + ps, y + 2*ps, ps*0.5, ps*0.5);
  rect(x + 5*ps, y + 2*ps, ps*0.5, ps*0.5);

  // --- NARIZ ---
  fill(120, 78, 45);
  rect(x + 3*ps, y + 3.5*ps, ps*2, ps);

  // --- BOCA ---
  fill(90, 50, 25);
  rect(x + 2*ps, y + 5.5*ps, ps*4, ps*0.6);

  fill(220, 210, 190); // dientes
  for (let i = 0; i < 4; i++) {
    rect(x + (2+i)*ps, y + 5.5*ps, ps, ps*0.5);
  }

  // --- CABELLO FRONTAL ---
  fill(60, 40, 15);
  rect(x, y, s, ps * 1.5);
  rect(x, y + ps*1.5, ps, ps*0.5);
  rect(x + ps*7, y + ps*1.5, ps, ps*0.5);

  // === GAFAS ===
  noFill();
  stroke(30, 30, 30);
  strokeWeight(2);

  // Marco ojo izquierdo
  rect(x + ps * 0.6, y + ps * 1.8, ps * 2.8, ps * 1.5, 4);
  // Marco ojo derecho
  rect(x + ps * 4.6, y + ps * 1.8, ps * 2.8, ps * 1.5, 4);
  // Puente central
  line(x + ps * 3.4, y + ps * 2.4, x + ps * 4.6, y + ps * 2.4);
  // Patillas
  line(x + ps * 0.6, y + ps * 2.4, x, y + ps * 2.4);
  line(x + ps * 7.4, y + ps * 2.4, x + s, y + ps * 2.4);

  // === CARA LATERAL (efecto 3D isométrico) ===
  fill(100, 65, 35);
  beginShape();
  vertex(x + s,     y);
  vertex(x + s + t, y - t);
  vertex(x + s + t, y - t + s);
  vertex(x + s,     y + s);
  endShape(CLOSE);

  // Cabello en el lateral
  fill(45, 28, 8);
  beginShape();
  vertex(x + s,     y);
  vertex(x + s + t, y - t);
  vertex(x + s + t, y - t + ps*1.5);
  vertex(x + s,     y + ps*1.5);
  endShape(CLOSE);

  // === CARA SUPERIOR ===
  fill(50, 32, 10);
  beginShape();
  vertex(x,         y);
  vertex(x + t,     y - t);
  vertex(x + s + t, y - t);
  vertex(x + s,     y);
  endShape(CLOSE);

  // === BORDES DEL CUBO ===
  stroke(0);
  strokeWeight(2);
  noFill();
  rect(x, y, s, s);

  beginShape();
  vertex(x + s,     y);
  vertex(x + s + t, y - t);
  vertex(x + s + t, y - t + s);
  vertex(x + s,     y + s);
  endShape(CLOSE);

  beginShape();
  vertex(x,         y);
  vertex(x + t,     y - t);
  vertex(x + s + t, y - t);
  vertex(x + s,     y);
  endShape(CLOSE);
  
  // === DEBUG INFO ===
  fill(255, 255, 0);
  textSize(12);
  textAlign(LEFT, TOP);
  text(`Nariz: (${Math.round(smoothNoseX)}, ${Math.round(smoothNoseY)})`, 10, 10);
}
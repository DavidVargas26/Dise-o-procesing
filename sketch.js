function setup() {
  createCanvas(400, 400);
  noLoop();
}

function draw() {
  background(135, 206, 235); // fondo azul cielo

  let x = 80;   // esquina superior izquierda X
  let y = 60;   // esquina superior izquierda Y
  let s = 240;  // tamaño del cubo
  let t = 20;   // grosor del efecto 3D

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
  strokeWeight(4);

  // Marco ojo izquierdo
  rect(x + ps * 0.6, y + ps * 1.8, ps * 2.8, ps * 1.5, 4);
  // Marco ojo derecho
  rect(x + ps * 4.6, y + ps * 1.8, ps * 2.8, ps * 1.5, 4);
  // Puente central (entre los dos marcos)
  line(x + ps * 3.4, y + ps * 2.4, x + ps * 4.6, y + ps * 2.4);
  // Patilla izquierda (hacia el lateral de la cara)
  line(x + ps * 0.6, y + ps * 2.4, x, y + ps * 2.4);
  // Patilla derecha
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
}
/**
 * Simple 2D Disc Flight Physics Engine
 */

export interface FlightPoint {
  x: number; // distance
  y: number; // lateral deviation
  height: number;
}

export interface FlightParams {
  armSpeed: number; // mph
  stability: number; // turn + fade
  wind: number; // mph (positive = headwind, negative = tailwind)
  terrain: number; // degrees (positive = uphill, negative = downhill)
}

export function calculateFlightPath(params: FlightParams): FlightPoint[] {
  const points: FlightPoint[] = [];
  const dt = 0.1; // time step
  const maxTime = 10;
  
  // Effective speed accounts for wind
  const effectiveSpeed = params.armSpeed + params.wind;
  
  // Stability impact: headwind makes disc more understable
  const adjustedStability = params.stability - (params.wind * 0.1);
  
  let velocityX = params.armSpeed * 0.44704; // m/s
  let velocityY = 0;
  let posX = 0;
  let posY = 0;
  let height = 1.5; // release height in meters
  
  const gravity = 9.81;
  const liftCoeff = 0.15;
  const dragCoeff = 0.08;
  
  for (let t = 0; t < maxTime; t += dt) {
    // Basic drag
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const drag = 0.5 * dragCoeff * speed * speed;
    velocityX -= (drag / speed) * velocityX * dt;
    
    // Lift (simplified)
    const lift = 0.5 * liftCoeff * speed * speed;
    const netVerticalForce = lift - gravity;
    height += netVerticalForce * dt * dt * 0.5;
    
    // Lateral movement based on stability and speed
    // Higher speed = more turn (negative Y)
    // Lower speed = more fade (positive Y)
    const turnThreshold = 20; // m/s
    if (speed > turnThreshold) {
      velocityY -= (speed - turnThreshold) * (adjustedStability < 0 ? 0.2 : 0.05) * dt;
    } else {
      velocityY += (turnThreshold - speed) * (adjustedStability > 0 ? 0.3 : 0.1) * dt;
    }
    
    posX += velocityX * dt;
    posY += velocityY * dt;
    
    // Terrain impact on height
    const terrainHeight = posX * Math.tan((params.terrain * Math.PI) / 180);
    
    if (height <= terrainHeight) {
      points.push({ x: posX, y: posY, height: terrainHeight });
      break;
    }
    
    points.push({ x: posX, y: posY, height });
  }
  
  return points;
}

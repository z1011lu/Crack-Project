uniform sampler3D voxels;
varying vec2 vUv;

/*vec4 ShapeMarch(vec3 p0, vec3 d) {
  float t = 0;
  while (t <= maxDistToCheck) {
    vec3 p = p0 + d * t;
    uint shapeValue = textureLod(shape, p / voxelGridSize, 0).r;
    if (shapeValue == 255) {
      return textureLod(voxels, p / voxelGridSize, 0);
    }
    
    vec3 deltas = (step(0, d) - fract(p)) / d;
    t += max(mincomp(deltas) + shapeValue, epsilon);
  }

  return vec4(0);
}*/

float getDistance(vec3 point) {
	vec3 spherePosition = vec3(0.0, 2.0, -6.0);
	float sphereRadius = 1.0; 
	float sphereDistance = length(point - spherePosition) - sphereRadius;
	if(int(point.x*100.0+50.0) < 0 || int(point.x*100.0+50.0) >= 100 || int(point.y*100.0+50.0) < 0 || int(point.y*100.0+50.0) >= 100|| int(point.z*100.0+50.0) < 0 || int(point.z*100.0+50.0) >= 100){
		return (10.0);
	}
	float voxelDistance = voxels[int(point.x * 100.0 + point.y)];
	float planeDistance = point.y;

	return min(planeDistance, voxelDistance);
}


float raymarch(vec3 rayOrigin, vec3 rayDirection) {
	// implement here
	int MAX_STEPS = 100;
	float MAX_DIST = 100.0;
	float SURFACE_THRESHOLD = .01;
	float distanceFromOrigin = 0.0;
	for (int i = 0; i < MAX_STEPS; i++){
		vec3 point = rayOrigin + distanceFromOrigin * rayDirection;
		float distanceToScene = getDistance(point);
		distanceFromOrigin += distanceToScene;
		if (distanceToScene < SURFACE_THRESHOLD || distanceFromOrigin > MAX_DIST)
			break;
	}
	return distanceFromOrigin;
}

void main() {
    vec3 color = vec3(0.0);
	vec3 rayOrigin = vec3(0.0, 1.0, 3.0);
	vec3 rayDirection = normalize(vec3(vUv.x - 0.5, vUv.y - 0.5, -1.0));
	float distance = raymarch(rayOrigin, rayDirection);
	vec3 point = rayOrigin + rayDirection * distance;
	//float diffuse = getLight(point);
	//color = vec3(diffuse);
	color = vec3(distance/10.0);
	gl_FragColor = vec4(color, 1.0);

}

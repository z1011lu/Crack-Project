precision highp float;
precision highp sampler3D;

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

vec2 getClosestPoint2D(vec2 point, vec2 startLine, vec2 endLine){
	vec2 line = endLine - startLine;
	float lineSlope = line.y/line.x;
    //get the normal vector from the line
	vec2 normVector = vec2(-line.y, line.x);
	//Slope of it too
	float normSlope = normVector.y/normVector.x;
	//Get the intersection of this vector coming from the point w/ the line
	//Equation of actual line
	//y = startLine.y + lineSlope(x-startLine.x)
	//other line
	//y = point.y + normSlope(x-point.x)
	//intersect means set them equal
	//lineSlope * x - lineSlope * startLine.x +startLine.y = point.y + normSlope*x-normSlope * point.x
	//Take advantage of the inverse thing
	//lineSlope * x - lineSlope * startLine.x + startLine.y = point.y - x/lineSlope + point.x/lineSlope
	//lineSlope * lineSlope * x - lineSlope * lineSlope * startLine.x + lineSlope * startLine.y =
	//lineSlope * point.y + point.x - x
	//(lineSlope * lineSlope + 1) * x = point.x + point.y * lineSlope-lineSlope*lineSlope * startLine.x - lineSlope * startLine.y
	float xIntercept = (point.x + point.y * lineSlope-lineSlope*lineSlope * startLine.x - lineSlope * startLine.y)/(lineSlope * lineSlope + 1.0);
	float yIntercept = startLine.y + lineSlope * (xIntercept - startLine.x);
	//Make sure we didn't run off the edge of the path
	if((xIntercept < startLine.x && xIntercept < endLine.x) || (xIntercept > startLine.x && xIntercept > endLine.x) || 
			(yIntercept < startLine.y && yIntercept < endLine.y) || (yIntercept < startLine.y && yIntercept < endLine.y)){
		if (distance(point, startLine) > distance(point, endLine)){
			return (endLine);
		}
		else
			return(startLine);
	}
	return(vec2(xIntercept, yIntercept));
}

float getDistance(vec3 point) {
	vec3 spherePosition = vec3(0.0, 0.0, -6.0);
	vec3 sphereTwo = vec3(4.0, 0.0, -2.0);
	float sphereRadius = 1.0;
	float radiusTwo = 2.0;
	float sphereDistance = length(point - spherePosition)  -sphereRadius;	
	float planeDistance = point.y;
	vec2 closestFlatPoint = getClosestPoint2D(point.xz, spherePosition.xz, sphereTwo.xz);
	vec3 closestPoint = vec3(closestFlatPoint.x, 0.0, closestFlatPoint.y);
	float distFromLeft = distance(closestPoint, spherePosition)/distance(spherePosition, sphereTwo);
	float actRad = sphereRadius * (max(1.0 - distFromLeft, 0.0))+ radiusTwo * distFromLeft;
	if(planeDistance >= 0.0 && length(point-closestPoint) >=actRad){
		return(planeDistance);
	}
	if(planeDistance > 0.0 && length(point-closestPoint) < actRad){
		return max(planeDistance, actRad - distance(point, closestPoint));
	}
	
	float oppositeDistance = (actRad - abs(distance(point,closestPoint)));
	return oppositeDistance;
}


float raymarch(vec3 rayOrigin, vec3 rayDirection) {
	// implement here
	int MAX_STEPS = 100;
	float MAX_DIST = 100.0;
	float SURFACE_THRESHOLD = 0.0001;
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

vec3 getNormal(vec3 point) {
	float distance = getDistance(point);
	vec2 epsilon = vec2(.01, 0.0);
    
	vec3 normal = distance - 
					vec3(getDistance(point-epsilon.xyy),
					getDistance(point-epsilon.yxy),
        			getDistance(point-epsilon.yyx));
    normal = normal;
    return normalize(normal);
}


float getLight(vec3 point) {
	// implement
	vec3 lightPosition = vec3(2.0, 4.0, -2.0);
	vec3 lightToPoint = normalize(lightPosition - point);
	vec3 normal = getNormal(point);
	float diffuse = clamp(dot(normal, lightToPoint), 0.0, 1.0);
	float distanceToLightOffset = raymarch(point + normal * 0.02, lightToPoint);
	if(distanceToLightOffset < length(lightPosition - point))
		diffuse *= 0.1;
	
	return diffuse;

}


void main() {
	vec3 color = vec3(0.0);
	vec3 rayOrigin = vec3(0.0, 1.0, 3.0);
	vec3 rayDirection = normalize(vec3(vUv.x - 0.5, vUv.y - 0.5, -1.0));
	float distance = raymarch(rayOrigin, rayDirection);
	vec3 point = rayOrigin + rayDirection * distance;
	float diffuse = getLight(point);
	color = vec3(diffuse);
	//color = getNormal(point);
	//color = vec3(distance/10.0);// * vec3 (1.0, .4, .6)
	gl_FragColor = vec4(color, 1.0);


    //gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}


function wrapLon(lon){ return ((lon + 540) % 360) - 180; }
function sampleEdgeFlat(ring, maxDegStep){
	var out = [];
	var currentDist = 0;
	if (ring.length >= 2) out.push(wrapLon(ring[0]), ring[1]);
	for (var i=0; i<ring.length-2; i+=2){
		var lon1 = ring[i], lat1 = ring[i+1];
		var lon2 = ring[i+2], lat2 = ring[i+3];
		var dLon = lon2 - lon1, lon2n = lon2;
		if (Math.abs(dLon)>180){ lon2n += dLon>0?-360:360; dLon = lon2n - lon1; }
		var dLat = lat2 - lat1;
		var avgLat = (lat1 + lat2) * 0.5;
		var cosLat = Math.cos(avgLat * Math.PI / 180);
		var segLen = Math.sqrt((dLon * cosLat) * (dLon * cosLat) + dLat * dLat);
		var remain = segLen;
		var t = 0;
		while (currentDist + remain >= maxDegStep) {
			var move = maxDegStep - currentDist;
			t += move / segLen;
			var lon = lon1 + dLon * t;
			var lat = lat1 + dLat * t;
			out.push(wrapLon(lon), lat);
			remain -= move;
			currentDist = 0;
		}
		currentDist += remain;
	}
	return new Float32Array(out);
}
function lonLatToVec3(lon,lat,r){
	if (r === void 0) r = 1;
	var phi = (90 - lat) * Math.PI/180;
	var theta = (lon + 180) * Math.PI/180;
	return [-Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)];
}
onmessage = function(e){
	var densityDeg = e.data.densityDeg, polysIn = e.data.polysIn;
	var edgeOut = [];
	for (var p=0;p<polysIn.length;p++){
		var poly = polysIn[p];
		for (var r=0;r<poly.length;r++){
			var sampled = sampleEdgeFlat(poly[r], densityDeg * 0.7);
			for (var i=0;i<sampled.length;i+=2){
				var v = lonLatToVec3(sampled[i], sampled[i+1], 1);
				edgeOut.push(v[0],v[1],v[2]);
			}
		}
	}
	var arr = new Float32Array(edgeOut);
	postMessage({ ok:true, edge:arr }, [arr.buffer]);
};
var dampening = dampening = 0.025;
var simulationSpeed = 0.5;
var	tension = 0.025;
var spread = 0.25;
var nNodes = 300;
var nPasses = 4;
var splashImpact = 400;
var phase = 0;
var baseWaveSpeed = 0.0001;

function WaveNode(x, y0){
	this.x = x;
	this.y0 = y0;
	this.height = 0;
	this.v = 0;
	

	this.update = function(dt){	
		this.v += (-tension * this.height - this.v * dampening) * dt;
		this.height += this.v * dt;
		this.y0 = Math.sin(map(this.x,0, width, 0, 2*Math.PI) + phase)*10 + height/2;
		phase += baseWaveSpeed;
	}

	this.show = function(){
		ellipse(this.x, this.y0 + this.height, 5, 5);
	}
}

var wave = [];


function setup() {
	createCanvas(1280, 720);
	noStroke();
	for (var iNode=0; iNode<nNodes; iNode++)
		wave.push(new WaveNode(map(iNode, 0, nNodes, 0, width), height/2));
}

function draw() {
	background(0);
  
	lDeltas = [];
	rDeltas = [];

	// do some passes where wave pull on their neighbours
	for (var iPass = 0; iPass < nPasses; iPass++)
	{
		for (var iNode = 0; iNode < nNodes; iNode++)
		{
			if (iNode > 0)
			{
				lDeltas[iNode] = spread * (wave[iNode].height - wave[iNode - 1].height);
				wave[iNode - 1].v += lDeltas[iNode];
			}
			if (iNode < nNodes - 1)
			{
				rDeltas[iNode] = spread * (wave[iNode].height - wave[iNode + 1].height);
				wave[iNode + 1].v += rDeltas[iNode];
			}
		}

		for (var iNode = 0; iNode < nNodes; iNode++)
		{
			if (iNode > 0)
				wave[iNode - 1].height += lDeltas[iNode];
			if (iNode < nNodes - 1)
				wave[iNode + 1].height += rDeltas[iNode];
		}		
	}


  	if (mouseIsPressed){
  		wave[Math.floor(map(mouseX, 0, width, 0, nNodes))].v = splashImpact;
  	}


  	wave.forEach(function(node){ node.update(simulationSpeed); });
  	wave.forEach(function(node){ node.show(); });

}
"use strict";

var gl;
var points;

var vertex_shader = "attribute vec4 vPosition;"+
"void main() {"+
    "gl_PointSize = 1.0;"+
    "gl_Position = vPosition;"+
"}";  

var sValue = 1000;

//speed slider to adjust speed of wait function in ms
var sSlider = document.getElementById("speedSlider");
var speedOutput = document.getElementById("speedValue");
speedOutput.innerHTML = sSlider.value;

sSlider.oninput = function() {
    speedOutput.innerHTML = this.value;
}

var clicked = false;
function toggle() {
    if (!clicked) {
        clicked = true;
        document.getElementById("btn").innerHTML = "On";
    } else {
        clicked = false;
        document.getElementById("btn").innerHTML = "Off";
    }
}

window.onload = async function() {
    //I could use a for loop, but I want it to be infinite
    var steps = 0;
    while (true) {
        init(steps, clicked);
        await new Promise(r => setTimeout(r, sSlider.value));
        steps++;
        if (steps > 10) {
            steps = 0
        }
    };
}

function init(step, randMode)
{
    var rValue = 0.0 + step * 0.1;
    var gValue = 1.0 - step * 0.1;
    var bValue = 0.0 + step * 0.2;

    var NumPoints = 5000 - step * 500;
    var size = 1 - step * 0.1;
    
    if (randMode) {
        var rValue = Math.random();
        var gValue = Math.random();
        var bValue = Math.random();
        
        var NumPoints = Math.floor((Math.random() * 4501) + 500);
        var size = Math.floor((Math.random() * 101) + 10)/100;
    }


    var fragment_shader = "precision mediump float;"+
    "void main() {"+
        "gl_FragColor = vec4("+rValue+","+gValue+","+bValue+", 1.0 );"+
    "}";


    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    

    var vertices = [
        vec2( -size, -size ),
        vec2(  0,  size ),
        vec2(  size, -size )
    ];

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices

    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add( u, v ) );

    // And, add our initial point into our array of points

    points = [ p ];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex

    for ( var i = 0; points.length < NumPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        points.push( p );
    }

    //
    //  Configure WebGL
    //
    gl.viewport( 5, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var vertShdr = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShdr, vertex_shader);
    gl.compileShader(vertShdr);

    var fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShdr, fragment_shader);
    gl.compileShader(fragShdr);

    var program = gl.createProgram();
    gl.attachShader(program, vertShdr);
    gl.attachShader(program, fragShdr);
    gl.linkProgram(program);

    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
}

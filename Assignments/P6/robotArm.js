"use strict";
//used https://www.cs.unm.edu/~angel/WebGL/CODE/04/ for refrence on how to animate

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

// RGBA colors
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT      = 2.0;
var BASE_WIDTH       = 5.0;
var LOWER_ARM_HEIGHT = 5.0;
var LOWER_ARM_WIDTH  = 0.5;
var UPPER_ARM_HEIGHT = 5.0;
var UPPER_ARM_WIDTH  = 0.5;
var FINGER_HEIGHT    = 3.0;
var FINGER_WIDTH     = 0.25;

// Shader transformation matrices

var modelViewMatrix, projectionMatrix, modelViewMatrix_f1, modelViewMatrix_f2, modelViewMatrix_f3;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;
var finger1 = 3;
var finger2 = 4;
var finger3 = 5;

var theta = [0, 0, 0, 0, 0, 0];
var thetaX = [0, 0, 0, 0, 0, 0];
var thetaY = [0, 0, 0, 0, 0, 0];

var angleZ_B = null;
var angleX_B = null;
var angleY_B = null;
var angleZ_L = null;
var angleX_L = null;
var angleY_L = null;
var angleZ_U = null;
var angleX_U = null;
var angleY_U = null;
var angleZ_f1 = null;
var angleX_f1 = null;
var angleY_f1 = null;
var angleZ_f2 = null;
var angleX_f2 = null;
var angleY_f2 = null;
var angleZ_f3 = null;
var angleX_f3 = null;
var angleY_f3 = null;

var modelViewMatrixLoc, thetaZloc, thetaXloc, thetaYloc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(  a,  b,  c,  d, color) {
    colors.push(vertexColors[color]);
    points.push(vertices[a]);
    colors.push(vertexColors[color]);
    points.push(vertices[b]);
    colors.push(vertexColors[color]);
    points.push(vertices[c]);
    colors.push(vertexColors[color]);
    points.push(vertices[a]);
    colors.push(vertexColors[color]);
    points.push(vertices[c]);
    colors.push(vertexColors[color]);
    points.push(vertices[d]);
}


function colorCube() {
    quad( 1, 0, 3, 2, 1 );
    quad( 2, 3, 7, 6, 2 );
    quad( 3, 0, 4, 7, 3 );
    quad( 6, 5, 1, 2, 7 );
    quad( 4, 5, 6, 7, 4 );
    quad( 5, 4, 0, 1, 5 );
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------------

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    colorCube();

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    document.getElementById("b1").onclick = function() {
        angleZ_B = Base;
    }
    document.getElementById("b2").onclick = function() {
        angleX_B = Base;
    }
    document.getElementById("b3").onclick = function() {
        angleY_B = Base;
    }
    document.getElementById("b4").onclick = function() {
        angleZ_L = LowerArm;
    }
    document.getElementById("b5").onclick = function() {
        angleX_L = LowerArm;
    }
    document.getElementById("b6").onclick = function() {
        angleY_L = LowerArm;
    }
    document.getElementById("b7").onclick = function() {
        angleZ_U = UpperArm;
    }
    document.getElementById("b8").onclick = function() {
        angleX_U = UpperArm;
    }
    document.getElementById("b9").onclick = function() {
        angleY_U = UpperArm;
    }
    document.getElementById("b10").onclick = function() {
        angleZ_f1 = finger1;
    }
    document.getElementById("b11").onclick = function() {
        angleX_f1 = finger1;
    }
    document.getElementById("b12").onclick = function() {
        angleY_f1 = finger1;
    }
    document.getElementById("b13").onclick = function() {
        angleZ_f2 = finger2;
    }
    document.getElementById("b14").onclick = function() {
        angleX_f2 = finger2;
    }
    document.getElementById("b15").onclick = function() {
        angleY_f2 = finger2;
    }
    document.getElementById("b16").onclick = function() {
        angleZ_f3 = finger3;
    }
    document.getElementById("b17").onclick = function() {
        angleX_f3 = finger3;
    }
    document.getElementById("b18").onclick = function() {
        angleY_f3 = finger3;
    }
    document.getElementById("b19").onclick = function() {
        angleZ_B = null;
        angleX_B = null;
        angleY_B = null;
        angleZ_L = null;
        angleX_L = null;
        angleY_L = null;
        angleZ_U = null;
        angleX_U = null;
        angleY_U = null;
        angleZ_f1 = null;
        angleX_f1 = null;
        angleY_f1 = null;
        angleZ_f2 = null;
        angleX_f2 = null;
        angleY_f2 = null;
        angleZ_f3 = null;
        angleX_f3 = null;
        angleY_f3 = null;
    }
    document.getElementById("b20").onclick = function() {
        theta = [0, 0, 0, 0, 0, 0];
        thetaX = [0, 0, 0, 0, 0, 0];
        thetaY = [0, 0, 0, 0, 0, 0];
    }

    document.getElementById("slider1").onchange = function(event) {
        theta[0] = event.target.value;
    };
    document.getElementById("slider2").onchange = function(event) {
        thetaX[0] = event.target.value;
    };
    document.getElementById("slider3").onchange = function(event) {
        thetaY[0] = event.target.value;
    };
    document.getElementById("slider4").onchange = function(event) {
        theta[1] = event.target.value;
    };
    document.getElementById("slider5").onchange = function(event) {
        thetaX[1] = event.target.value;
    };
    document.getElementById("slider6").onchange = function(event) {
        thetaY[1] = event.target.value;
    };
    document.getElementById("slider7").onchange = function(event) {
        theta[2] =  event.target.value;
    };
    document.getElementById("slider8").onchange = function(event) {
        thetaX[2] =  event.target.value;
    };
    document.getElementById("slider9").onchange = function(event) {
        thetaY[2] =  event.target.value;
    };
    document.getElementById("slider10").onchange = function(event) {
        theta[3] =  event.target.value;
    };
    document.getElementById("slider11").onchange = function(event) {
        thetaX[3] =  event.target.value;
    };
    document.getElementById("slider12").onchange = function(event) {
        thetaY[3] =  event.target.value;
    };
    document.getElementById("slider13").onchange = function(event) {
        theta[4] =  event.target.value;
    };
    document.getElementById("slider14").onchange = function(event) {
        thetaX[4] =  event.target.value;
    };
    document.getElementById("slider15").onchange = function(event) {
        thetaY[4] =  event.target.value;
    };
    document.getElementById("slider16").onchange = function(event) {
        theta[5] =  event.target.value;
    };
    document.getElementById("slider17").onchange = function(event) {
        thetaX[5] =  event.target.value;
    };
    document.getElementById("slider18").onchange = function(event) {
        thetaY[5] =  event.target.value;
    };

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    thetaZloc = gl.getUniformLocation(program, "theta");
    thetaXloc = gl.getUniformLocation(program, "thetaX");
    thetaYloc = gl.getUniformLocation(program, "thetaY");

    projectionMatrix = ortho(-20, 20, -20, 20, -20, 20);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );
    render();
}

//----------------------------------------------------------------------------
function base() {
    var s = scale4(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//----------------------------------------------------------------------------
function upperArm() {
    var s = scale4(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//----------------------------------------------------------------------------
function lowerArm()
{
    var s = scale4(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//----------------------------------------------------------------------------
function finger_1()
{
    var s = scale4(FINGER_WIDTH, FINGER_HEIGHT, FINGER_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * FINGER_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix_f1, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
function finger_2()
{
    var s = scale4(FINGER_WIDTH, FINGER_HEIGHT, FINGER_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * FINGER_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix_f2, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
function finger_3()
{
    var s = scale4(FINGER_WIDTH, FINGER_HEIGHT, FINGER_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * FINGER_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix_f3, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    modelViewMatrix = rotate(theta[Base], 0, 1, 0 );
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaX[Base], thetaX[Base], 0, 1 ));
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaY[Base], 0, 0, 1 ));
    base();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm], 0, theta[LowerArm], 1 ));
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaX[LowerArm], thetaX[LowerArm], 0, 1 ));
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaY[LowerArm], 0, 0, 1 ));
    lowerArm();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[UpperArm], 0, theta[UpperArm], 1) );
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaX[UpperArm], thetaX[UpperArm], 0, 1 ));
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaY[UpperArm], 0, 0, 1 ));
    upperArm();

    modelViewMatrix_f1 = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT, 0.0));
    modelViewMatrix_f1 = mult(modelViewMatrix_f1, rotate(theta[finger1], 0, theta[finger1], 1) );
    modelViewMatrix_f1 = mult(modelViewMatrix_f1, rotate(thetaX[finger1], thetaX[finger1], 0, 1 ));
    modelViewMatrix_f1 = mult(modelViewMatrix_f1, rotate(thetaY[finger1], 0, 0, 1 ));
    finger_1();

    modelViewMatrix_f2 = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT, 0.0));
    modelViewMatrix_f2 = mult(modelViewMatrix_f2, rotate(theta[finger2], 0, theta[finger2], 1) );
    modelViewMatrix_f2 = mult(modelViewMatrix_f2, rotate(thetaX[finger2], thetaX[finger2], 0, 1 ));
    modelViewMatrix_f2 = mult(modelViewMatrix_f2, rotate(thetaY[finger2]+45, 0, 0, 1 ));
    finger_2();

    modelViewMatrix_f3 = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT, 0.0));
    modelViewMatrix_f3 = mult(modelViewMatrix_f3, rotate(theta[finger3], 0, theta[finger3], 1) );
    modelViewMatrix_f3 = mult(modelViewMatrix_f3, rotate(thetaX[finger3], thetaX[finger3], 0, 1 ));
    modelViewMatrix_f3 = mult(modelViewMatrix_f3, rotate(thetaY[finger3]+315, 0, 0, 1 ));
    finger_3();

    theta[angleZ_B] += 0.5;
    thetaX[angleX_B] += 0.5;
    thetaY[angleY_B] += 0.5;
    theta[angleZ_L] += 0.5;
    thetaX[angleX_L] += 0.5;
    thetaY[angleY_L] += 0.5;
    theta[angleZ_U] += 0.5;
    thetaX[angleX_U] += 0.5;
    thetaY[angleY_U] += 0.5;
    theta[angleZ_f1] += 0.5;
    thetaX[angleX_f1] += 0.5;
    thetaY[angleY_f1] += 0.5;
    theta[angleZ_f2] += 0.5;
    thetaX[angleX_f2] += 0.5;
    thetaY[angleY_f2] += 0.5;
    theta[angleZ_f3] += 0.5;
    thetaX[angleX_f3] += 0.5;
    thetaY[angleY_f3] += 0.5;
    gl.uniform3fv(thetaZloc, theta);
    gl.uniform3fv(thetaXloc, thetaX);
    gl.uniform3fv(thetaYloc, thetaY);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices);

    requestAnimFrame(render);
}
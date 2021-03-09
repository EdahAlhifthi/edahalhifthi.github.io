

function draw(p0, p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.closePath();
    ctx.stroke();
}

function sierpinski(p0, p1, p2, level ) {
    //break condition
    if(level <= 0) {
        //render
        draw(p0, p1, p2);
    }else{

        //decrease the level
        level--;
        //find the edges' centers
        var a = [ ( p0[0] + p1[0] ) / 2, (p0[1] + p1[1]) / 2 ];
        var b = [ ( p1[0] + p2[0] ) / 2, (p1[1] + p2[1]) / 2 ];
        var c = [ ( p2[0] + p0[0] ) / 2, (p2[1] + p0[1]) / 2 ];

        //calls the method on the new triangles
        sierpinski( p0, a, c, level );
        sierpinski( p1, b, a, level );
        sierpinski( p2, c, b, level );
    }
}


var canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
var w = canvas.width = window.innerWidth ;
var h = canvas.height = window.innerHeight ;
var ctx = canvas.getContext("2d");

//creates 3 points
var size = 300;
var points = [];
for(var i = 0; i < Math.PI * 2; i += Math.PI * 2 / 3 ) {
    points.push([
        w/2 + Math.cos(i - Math.PI / 2) * size,
        h/2 + Math.sin(i - Math.PI / 2) * size
    ]);
}
sierpinski( points[0], points[1], points[2], 5 );

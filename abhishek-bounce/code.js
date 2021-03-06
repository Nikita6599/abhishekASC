var database = firebase.database().ref();
var play = false;
var points = 0;
var x = 300;
var y = 20;
var vx = 10;
var vy = 10;
var xPaddle = 300;
var yPaddle = 590;
var xPaddle2 = 300;
var yPaddle2 = 10;
var canPlay = false;
var again = false;
var i = 0
var ranking = [];
var newrank = [];
function updateDB(){
    var newScore = {
        Name: name,
        Score: points
    }
    database.push(newScore)
}
$('document').ready(function(){
    $('.submit').click(function(){
        name = $('.form-control').val()
        if(name===''){
            alert("Please enter a user name");
        }else{
            canPlay = true;
        }
    })
    database.on("child_added", function (rowData) {
        var row = rowData.val();
        var name = row.Name;
        var score = row.Score;
        $(".leaderboard").append("<p>"+ name + ": " + score + "</p>" )
        ranking.push(row)
        console.log(ranking)
    })
    
    // console.log(ranking)
    // for(var i=0;i<ranking.length;i++){
    //     for(var b=1;b<ranking.length;b++){
    //         if(ranking[i-b].Score<ranking[i].Score){
    //             newrank.push(ranking[i])
                
    //         }
    //     }
    // }
    // console.log(newrank)
})
var img;
function setup(){
    createCanvas(600,600)
    background(25,50,5)
    stroke(25,50,5)
    // img = loadImage("playButton.png");
}

function collisionUser(){
    if ((xPaddle + 75) > x && (xPaddle - 75) < x) {// makes ball bounce off user paddle
        if ((yPaddle + 10) > y && (yPaddle - 3) < y) {
            vy = random(-7, -5)
        }
    }
}
function collisionComp() {
    if ((xPaddle2 + 75) > x && (xPaddle2 - 75) < x) {// makes ball bounce off computer paddle
        if ((yPaddle2 + 3) > y && (yPaddle2 - 10) < y) {
            vy = random(5, 7);
        }
    }
}
function compChance(){
    var chance = random(100);
    if(chance<40){
        moveComp();
    }
}
function moveComp(){
    if(x>(xPaddle2)){
        xPaddle2 += 10;
    }else if(x<(xPaddle2)){
        xPaddle2 -= 10;
    }
}
function checkBall(){
    if(y<50){
        collisionComp()
    }else if(y>550){
        collisionUser()
    }
}
function checkPoints(){
    if(y<0){// adds point and resets ball
        points = points + 1
        x = 300;
        y = 150;
        var randCheck = random(2)
        vy = random(5,15)
    }else if(y>600){// on loss say game over
        fill(255);
        textSize(64);
        text("Game Over", 150, 150);
        text("Points: "+ points,200,250)
        noLoop();
        updateDB();
        again = true;
        play = false;
    }
}
function pong(){
    background(25, 50, 5)
    // ellipse(x, y, 20, 20)//clears ball
    // rect(xPaddle, yPaddle, 100, 3)//clears user paddle
    // rect(xPaddle2, yPaddle2, 100, 3)//clears computer paddle
    if (0 > x) { //makes ball bounce back on left wall
        vx = random(5, 10);
    } else if (600 < x) { // makes ball bounce back on right wall
        vx = random(-10, 5);
    }
    checkPoints();
    x = x + vx//updates ball x value
    y = y + vy//updates ball y value
    if (keyIsDown(LEFT_ARROW)) {//moves paddle left on user input
        xPaddle -= 10
    }
    if (keyIsDown(RIGHT_ARROW)) {//moves paddle right on user input
        xPaddle += 10
    }
    compChance();//Makes computer paddle move
    fill(255)
    ellipse(x, y, 20, 20)//draws ball
    rect(xPaddle, yPaddle, 100, 3)//draws user paddle
    rect(xPaddle2, yPaddle2, 100, 3)//draws computer paddle
    checkBall();
}
function renderPlay(){
    fill(0)
    rect(250, 250, 100, 80, 20)
    fill(255)
    triangle(275, 265, 275, 315, 335, 290)
    if(mouseIsPressed){
        console.log('pressed')
        if (mouseX > 150 && mouseX < 350 && mouseY > 170 && mouseY < 330) {
            play = true;
            loop();
        }
    }
}
function draw(){
    if(play === true){
        fill(25, 50, 5)
        rect(250, 250, 100, 80, 20)
        pong()
    }else{
        if(canPlay===true){
            renderPlay();
        }
    }
}
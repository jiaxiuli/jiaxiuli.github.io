var btn = document.getElementById("btn");
var op_left = document.getElementById("left");
var op_right = document.getElementById("right");
var op_rotate = document.getElementById("rotate");

var TotalCount = 0;
var b_drop = true; //是否可以往下走


var border = {
    top: 0,
    bottom: 27,
    left: 0,
    right: 27
};
/*
shape数组中 
第一个索引是最左边的格子 
第三个是最下边的格子
第四个是最右边的格子 
*/
const shape = {
    one: [[12,1],[13,0],[13,1],[14,1]],
    oneR1: [[13,0],[13,1],[13,2],[14,1]],
    oneR2: [[12,1],[13,1],[13,2],[14,1]],
    oneR3: [[12,1],[13,1],[13,2],[13,0]],

    two: [[12,1],[13,1],[14,1],[15,1]],
    twoR1: [[13,0],[13,1],[13,3],[13,2]],

    three: [[12,1],[12,0],[13,1],[13,0]],

    four: [[12,1],[13,0],[13,1],[14,0]],
    fourR1: [[13,1],[13,0],[14,2],[14,1]],
};

var shapeStatus = [1,0];
var shapeArr = [[],[],[],[]];
shapeArr = ArrayCopy(shape.one, shapeArr);

var can = document.getElementById("tab");
var ctx = can.getContext('2d');
ctx.lineWidth = 0.1;
//初始化
for( var i = 0 ; i < can.clientHeight ; i = i + 20 ){
    for( var j = 0 ; j < can.clientWidth ; j = j + 20){
        ctx.strokeRect(i, j, 20, 20);
    }
}


//初始化面板
var panel = new Array();
for( var i = 0 ; i < can.clientHeight/20 ; i ++ ){
   panel[i] = new Array();
}
for( var i = 0 ; i < can.clientHeight/20 ; i ++ ){
    for( var j = 0 ; j < can.clientWidth/20 ; j ++ ){
        panel[i][j] = 0;
    }
}

function ArrayCopy(oldArr, newArr){
    for( var i = 0 ; i < oldArr.length ; i++ ){
        for( var j = 0 ; j < oldArr[i].length ; j++ ){
            newArr[i][j] = oldArr[i][j];
        }
    }
    return newArr;
}

function draw(arr){
    arr.forEach(function(a){
        ctx.fillStyle="black";
        ctx.fillRect(a[0]*20, a[1]*20, 20, 20);
        ctx.fillStyle="silver";
        ctx.fillRect(a[0]*20+1, a[1]*20+1, 18, 18);
    });
};


function drop(arr){
    
    arr.forEach(function(a){
        if(panel[a[0]][a[1]+1] == 1){
            b_drop = false;
        }
    });
    
    if(b_drop && arr[2][1] < 27 ){
    arr.forEach(function(a){ a[1]++; });}
    return arr;
}

function left(arr){
    var b = true;
    if(arr[0][0] == border.left) b = false;
    else{
    arr.forEach(function(a){
        if(panel[a[0]-1][a[1]] == 1){
            b = false;
        }
     });
    }
    if( b ){
        arr.forEach(function(a){ a[0]--; });
    }
    return arr;
}

function right(arr){
    var b = true;
    if(arr[3][0] == border.right) b = false;
    else{
    arr.forEach(function(a){
        if(panel[a[0]+1][a[1]] == 1){
            b = false;
        }
     });
    }
    if( b ){
        arr.forEach(function(a){ a[0]++; });
    }
    return arr;
}

function rotate(arr){
    switch (shapeStatus[0]){
        case 1:
            if(shapeStatus[1] == 0 ){
                //最下边的格子快到底时就不能改了 不然会超出界面
                if(arr[3][1] < 27){
                    arr.forEach(function(a, b){
                        a[0] = a[0] - shape.one[b][0] + shape.oneR1[b][0];
                        a[1] = a[1] - shape.one[b][1] + shape.oneR1[b][1];
                    });
                    shapeStatus[1] = 1;
                }
            }else if(shapeStatus[1] == 1){
                //控制变换时可能会超出左右界限
                if(arr[0][0] >= 1 && arr[3][0] <= 27 && panel[arr[1][0]-1][arr[1][1]] != 1 ){
                    arr.forEach(function(a, b){
                        a[0] = a[0] - shape.oneR1[b][0] + shape.oneR2[b][0];
                        a[1] = a[1] - shape.oneR1[b][1] + shape.oneR2[b][1];
                    });
                    shapeStatus[1] = 2;
                }
            }else if(shapeStatus[1] == 2){
                arr.forEach(function(a, b){
                    a[0] = a[0] - shape.oneR2[b][0] + shape.oneR3[b][0];
                    a[1] = a[1] - shape.oneR2[b][1] + shape.oneR3[b][1];
                });
                shapeStatus[1] = 3;
            }else if(shapeStatus[1] == 3){
                 //控制变换时可能会超出左右界限
                 if(arr[0][0] > 0 && arr[3][0] < 27 && panel[arr[3][0]+1][arr[3][1]] != 1 ){
                    arr.forEach(function(a, b){
                        a[0] = a[0] - shape.oneR3[b][0] + shape.one[b][0];
                        a[1] = a[1] - shape.oneR3[b][1] + shape.one[b][1];
                    });
                    shapeStatus[1] = 0;
                }
            }
            break;
        case 2:
            if(shapeStatus[1] == 0 ){
                if(arr[2][1] < 26 && panel[arr[2][0]][arr[2][1]+2] != 1 ){
                    arr.forEach(function(a, b){
                        a[0] = a[0] - shape.two[b][0] + shape.twoR1[b][0];
                        a[1] = a[1] - shape.two[b][1] + shape.twoR1[b][1];
                    });
                    shapeStatus[1] = 1;
                }
            }else if(shapeStatus[1] == 1){
                if(arr[0][0] > 0 && arr[3][0] < 26 && panel[arr[1][0]-1][arr[1][1]] != 1 
                    && panel[arr[0][0]+1][arr[0][1]] != 1 
                    && panel[arr[0][0]+2][arr[0][1]] != 1){
                    arr.forEach(function(a, b){
                        a[0] = a[0] - shape.twoR1[b][0] + shape.two[b][0];
                        a[1] = a[1] - shape.twoR1[b][1] + shape.two[b][1];
                    });
                    shapeStatus[1] = 0;
                }
            }
            break;
        case 3: break;
        case 4:
            if(shapeStatus[1] == 0 ){
                if(arr[2][1] < 27 ){
                    arr.forEach(function(a, b){
                        a[0] = a[0] - shape.four[b][0] + shape.fourR1[b][0];
                        a[1] = a[1] - shape.four[b][1] + shape.fourR1[b][1];
                    });
                    shapeStatus[1] = 1;
                }
            }else if(shapeStatus[1] == 1){
                if(arr[0][0] > 0 &&  panel[arr[0][0]-1][arr[0][1]] != 1 ){
                    arr.forEach(function(a, b){
                        a[0] = a[0] - shape.fourR1[b][0] + shape.four[b][0];
                        a[1] = a[1] - shape.fourR1[b][1] + shape.four[b][1];
                    });
                    shapeStatus[1] = 0;
                }
            }
            break;
    }
    return arr;
}

function refresh(fun){
    clear(shapeArr);
    fun();
    draw(shapeArr);
};

document.onkeypress = function(event){
    if(event.keyCode==97){
        refresh(function() {
            shapeArr = left(shapeArr);
        });   
       }
    if(event.keyCode==100){
        refresh(function() {
            shapeArr = right(shapeArr);
        });   
       }
    if(event.keyCode==115){
        refresh(function() {
            shapeArr = drop(shapeArr);
        });   
       }
    if(event.keyCode==32){
        refresh(function() {
            shapeArr = rotate(shapeArr);
        });   
       }
};

op_left.onclick = function(){
    refresh(function() {
        shapeArr = left(shapeArr);
    });
};
op_right.onclick = function(){
    refresh(function() {
        shapeArr = right(shapeArr);
    });
};

op_rotate.onclick = function(){
    refresh(function() {
        shapeArr = rotate(shapeArr);
    });
};

function clear(arr){
    arr.forEach(function(a){
         ctx.clearRect(a[0]*20, a[1]*20, 20, 20);
         ctx.strokeRect(a[0]*20, a[1]*20, 20, 20);
    });
};

function checkIfFull(){
    var FullLine = [];
    for(var i = 0 ; i < panel.length ; i++ ){
        var b = true;
        for( var j = 0 ; j < panel[i].length ; j++ ){
            if( panel[j][i] == 0 ){
                b = false;
                break;
            }
        }
        if(b){
            FullLine.push(i);
        }
    }
    return FullLine;
};

function clearLine(Lines){
    var bonusGet = 0;
    for( var i = 0 ; i < Lines.length ; i++ ){
       for( var j = 0 ; j < panel.length ; j++ ){
            // ctx.clearRect(j*20, Lines[i]*20, 20, 20);
            // ctx.strokeRect(j*20, Lines[i]*20, 20, 20);
            panel[j][Lines[i]] = 0;
            for( var k = Lines[i] ; k > 0 ; k-- ){
                panel[j][k] = panel[j][k-1];
            }
       }
    }
    ctx.clearRect(0, 0, 560, 560);
    for( var i = 0 ; i < can.clientHeight ; i = i + 20 ){
        for( var j = 0 ; j < can.clientWidth ; j = j + 20){
            ctx.strokeRect(i, j, 20, 20);
        }
    }

    for( var i = 0 ; i < panel.length ; i++ ){
        for( var j = 0 ; j < panel[i].length ; j++ ){
            if(panel[i][j] == 1){
                ctx.fillStyle="black";
                ctx.fillRect(i*20, j*20, 20, 20);
                ctx.fillStyle="silver";
                ctx.fillRect(i*20+1,j*20+1, 18, 18);
            }
        }
     }
     TotalCount += Lines.length*10;
     if(Lines.length >= 2 )
        bonusGet = Lines.length*Lines.length;
    TotalCount += bonusGet;
    var score = document.getElementById("score");
    score.innerHTML = TotalCount;
    var bonus = document.getElementById("bonus");
    bonus.innerHTML = bonusGet;
};

btn.onclick = function(){
    var Inv = setInterval(function(){ 
        if( shapeArr[2][1] >= border.bottom || !b_drop ){
           
            shapeArr.forEach(function(a){
               ctx.strokeRect(a[0]*20, a[1]*20, 20, 20);
               panel[a[0]][a[1]] = 1;
            });
            var FullLines = checkIfFull();
            if(FullLines.length > 0 ){
                clearLine(FullLines);
            }

            var r = Math.ceil(Math.random()*4);
            b_drop = true;
            switch(r){
                case 1:shapeArr = ArrayCopy(shape.one, shapeArr); shapeStatus[0] = 1; shapeStatus[1] = 0;break;
                case 2:shapeArr = ArrayCopy(shape.two, shapeArr);shapeStatus[0] = 2; shapeStatus[1] = 0;break;
                case 3:shapeArr = ArrayCopy(shape.three, shapeArr);shapeStatus[0] = 3; shapeStatus[1] = 0;break;
                case 4:shapeArr = ArrayCopy(shape.four, shapeArr);shapeStatus[0] = 4; shapeStatus[1] = 0;break;
            }
           
        }
        refresh(function() {
            shapeArr = drop(shapeArr);
        });
        
    }, 500);
};


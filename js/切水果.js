//获取元素
var box = document.getElementById('box');
var fruitList = document.getElementsByClassName('fruit');
var score = document.getElementById('score');//分数
var HP = document.getElementById('HP');//血量
var startGame = document.getElementById('startGame');//游戏开始界面
var interval = 3000;//水果间隔变量

var isPress = false;//判断鼠标是否按下
onmousedown = function () {
    isPress = true;
}
onmouseup = function () {
    isPress = false;
}

startGame.onmousedown = function () {//游戏开始界面
    if (HP.num != 5) {
        animationHeight(startGame, 0)//缩小高度隐藏界面
        begin();//调用开始游戏函数
    }
}


function begin() {//开始游戏函数
    setTimeout(function () { fruit(0) }, 1000)
    setTimeout(function () { fruit(1) }, 2000)
    setTimeout(function () { fruit(2) }, 3000)
    setTimeout(function () { fruit(3) }, 4000)
    setTimeout(function () { fruit(4) }, 5000)
    setTimeout(function () { fruit(5) }, 6000)
    setTimeout(function () { fruit(6) }, 7000)
    setTimeout(function () { fruit(7) }, 8000)
    for (var i = 0; i < 5; i++) {//创建HP图标
        var li = document.createElement('li');
        HP.appendChild(li);
    }
    HP.num = 5;//设置HP=5
    score.num = 0;//设置分数=0
    score.innerText = score.num;//设置分数文本
}



function fruit(index) {//循环抛水果
    fruitList[index].style.animation = '';//清除动画
    clearInterval(fruitList[index].timeID);//清除水果高度位置计时器
    clearInterval(fruitList[index].timeID2);//清除水果水平位置计时器
    clearInterval(fruitList[index].timeID3);//清除水果两半计时器

    fruitEmission(index);//调用抛水果函数

    if (score.num < 50) {//根据分数缩小间隔时间
        interval = 3000;
    } else if (score.num < 100) {
        interval = 2500;
    } else if (score.num < 150) {
        interval = 2000;
    } else if (score.num < 200) {
        interval = 1000;
    } else {
        interval = 500;
    }

    fruitList[index].start = setTimeout(function () { fruit(index) }, Math.random() * interval + 3000);//倒计时调用抛水果函数
}

function name(params) {

}

function fruitEmission(index) {//抛水果函数
    fruitList[index].str = 'url("./img/水果' + Math.ceil(Math.random() * 8) + '.png")';//保存图片路径
    fruitList[index].style.background = fruitList[index].str;//图片路径赋值
    var distance = parseInt(Math.random() * 800);//水果出现位置随机值
    fruitList[index].style.animation = Math.random() > 0.5 ? 'right 1s linear infinite' : 'left 1s linear infinite';//随机赋值水果旋转方向动画
    fruitList[index].style.left = distance + 'px';//水果水平出现位置赋值
    fruitList[index].style.top = 580 + 'px';//水果垂直出现位置赋值
    fruitList[index].style.display = 'block';//显示元素
    distance = distance > 400 ? parseInt(Math.random() * 300) : parseInt(Math.random() * 300 + 500);//水果水平落点随机值
    animationMove(fruitList[index], distance)//水果水平动画
    fruitList[index].gaodu = -(Math.random() * 3 + 8);//水果抛射高度随机值
    clearInterval(fruitList[index].timeID);//移除之前的高度动画计时器
    fruitList[index].timeID = setInterval(function () {//开始高度动画计时器
        //改变高度
        fruitList[index].gaodu += 0.1;
        fruitList[index].style.top = fruitList[index].offsetTop + fruitList[index].gaodu + 'px';

        if (fruitList[index].offsetTop > 600) {//当水果掉出游戏窗口时
            clearInterval(fruitList[index].timeID);//清除水果高度位置计时器
            clearInterval(fruitList[index].timeID2);//清除水果水平位置计时器
            if (fruitList[index].str != 'url("./img/水果8.png")') {//如果掉出的不是炸弹
                reduceScore();//调用扣HP函数
            }
        }
    }, 10);

    fruitList[index].onmouseover = function () {//鼠标移动到水果上
        if (isPress) {//判断鼠标是否按下
            clearInterval(fruitList[index].timeID);//清除水果高度位置计时器
            clearInterval(fruitList[index].timeID2);//清除水果水平位置计时器
            if (fruitList[index].str == 'url("./img/水果8.png")') {//如果切的是炸弹
                reduceScore();//调用扣HP函数
            } else {
                score.num++;//分数+1
                score.innerText = score.num;
            }

            var X = fruitList[index].offsetLeft;//获得当前水果水平位置
            var Y = fruitList[index].offsetTop;//获得当前水果垂直位置
            result(index, X, Y)//调用特效函数
            debrisResult(index, X, Y);//调用水果碎片特效函数
        }
    }
}


function debrisResult(index, X, Y) {//水果碎片特效函数
    fruitList[index].pTop = document.createElement('p');//创建水果碎片元素
    var pTop = fruitList[index].pTop;
    pTop.style.width = '80px';
    pTop.style.height = '40px';
    pTop.style.left = X + 'px';//设置元素位置为鼠标悬浮的水果位置
    pTop.style.top = Y + 'px';
    pTop.style.background = fruitList[index].str;//图片路径赋值
    box.appendChild(pTop);//添加元素到box父元素

    fruitList[index].pBot = document.createElement('p');//创建水果碎片元素
    var pBot = fruitList[index].pBot;
    pBot.style.width = '80px';
    pBot.style.height = '40px';
    pBot.style.left = X + 'px';//设置元素位置为鼠标悬浮的水果位置
    pBot.style.top = Y + 40 + 'px';
    pBot.style.background = fruitList[index].str + ' bottom';//图片路径赋值,显示图片下方部分
    box.appendChild(pBot);//添加元素到box父元素

    pTop.num = -(Math.random() * 2 + 3);//设置水果碎片高度
    pBot.num = -(Math.random() * 2 + 3);
    pTop.setp = Math.random() > 0.5 ? 0.4 : 0.6;//设置水果碎片高度每次动画距离随机范围值
    pBot.setp = Math.random() > 0.5 ? 0.4 : 0.6;
    clearInterval(fruitList[index].timeID3);//清除之前的水果碎片计时器
    setTimeout(function () {//倒计时3秒移除水果碎片元素
        box.removeChild(pTop);
        box.removeChild(pBot);
    }, 3000)
    fruitList[index].style.display = 'none';//隐藏鼠标悬浮的水果元素
    fruitList[index].timeID3 = setInterval(function () {//开启水果碎片计时器
        pTop.num += pTop.setp;
        pBot.num += pBot.setp;
        pTop.style.top = pTop.offsetTop + pTop.num + 'px';//设置高度
        pTop.style.left = pTop.offsetLeft - (4 + Math.random()) + 'px';//设置水平位置随机范围值
        pTop.style.animation = 'left 0.7s linear infinite';//添加旋转动画
        pBot.style.top = pBot.offsetTop + pBot.num + 'px';
        pBot.style.left = pBot.offsetLeft + (4 + Math.random()) + 'px';
        pBot.style.animation = 'right 0.7s linear infinite';
    }, 20);
}

function result(index, X, Y) {//特效函数
    fruitList[index].result = document.createElement('div');
    fruitList[index].result.className = 'result';
    fruitList[index].result.style.left = X - 150 + 'px';
    fruitList[index].result.style.top = Y + 35 + 'px';
    fruitList[index].result.angle = Math.random() > 0.5 ? Math.random() * 30 : -Math.random() * 30;
    fruitList[index].result.style.transform = 'rotate(' + fruitList[index].result.angle + 'deg)'
    box.appendChild(fruitList[index].result);
    del(box, fruitList[index].result)
}

function del(box, ele) {//图标渐变移除函数
    if (HP.num > 0) {
        clearInterval(ele.del);
        var step = 1;
        ele.del = setInterval(function () {
            step -= 0.1;
            ele.style.opacity = step;
            if (ele.style.opacity <= 0) {
                clearInterval(ele.del);
                box.removeChild(ele);
            }
        }, 35);
    }
}

function reduceScore() {//扣HP函数
    del(HP, HP.children[HP.num - 1]);//调用渐变移除函数移除HP图标
    if (HP.num > 0) {
        HP.num--;
        if (HP.num == 0) {//分数等于0
            animationHeight(startGame, 500)//增加高度显示开始界面
            for (var j = 0; j < fruitList.length; j++) {
                clearTimeout(fruitList[j].start);//移除倒计时调用抛水果函数计时器
            }
        }
    }
}

function animationHeight(ele, target) {//改变高度动画
    clearInterval(ele.height);
    if (target == 0) {//当目标高度为0时,改变字体大小为0
        ele.style.fontSize = 0;
    }
    var currentHeight = ele.offsetHeight;
    ele.height = setInterval(function () {
        var step = (target - currentHeight) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        currentHeight += step;
        ele.style.height = currentHeight + 'px';
        //2.3 终点检测检测
        if (currentHeight == target) {
            clearInterval(ele.height);
            if (target == 500) {//当目标高度为500时,改变字体大小为50,设置分数文本
                ele.style.fontSize = '50px'
                ele.innerText = '分数' + score.num + ',(重新开始)'
            }
        }
    }, 10);
}

function animationMove(ele, target) {//水平移动动画函数
    //1.先清除之前的定时器，以本次为准
    clearInterval(ele.timeID2);
    //获取当前位置
    var currentLeft = ele.offsetLeft;
    var step = (target - currentLeft) / 200;
    //2.开始本次移动
    ele.timeID2 = setInterval(function () {
        //2.2 开始移动
        var isLeft = currentLeft <= target ? true : false;
        currentLeft += step;
        ele.style.left = currentLeft + 'px';
    }, 10);
}

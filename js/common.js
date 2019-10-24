

/**1.匀速动画封装
 * @param: ele:元素
 * @param: target:目标位置
 */
function animationMove(ele, target) {
    //1.先清除之前的定时器，以本次为准
    clearInterval(ele.timeID);
    //2.开始本次移动
    ele.timeID = setInterval(function () {
        //2.1 获取元素当前位置
        var currentLeft = ele.offsetLeft;
        //2.2 开始移动
        var isLeft = currentLeft <= target ? true : false;
        isLeft ? currentLeft += 4 : currentLeft -= 4;
        ele.style.left = currentLeft + 'px';
        //2.3 边界检测
        if (isLeft ? currentLeft >= target : currentLeft <= target) {
            //(1)停止定时器
            clearInterval(ele.timeID);
            //(2)元素复位
            ele.style.left = target + 'px';
        };
    }, 10);
};


function animationSlow(ele, attrs, fn) {
    //1.清除之前的定时器，以本次动画为准
    clearInterval(ele.timeID);

    if (attrs.backgroundColor) {//判断是否设置有背景颜色
        var arr = [];//设置空数组保存rbg颜色字符串
        var p = document.createElement('p');//创建新元素存取颜色
        ele.appendChild(p);//添加新元素
        p.style.display = 'none';//隐藏新元素
        p.style.backgroundColor = attrs['backgroundColor'];//颜色赋值
    }

    //2.开始本次动画
    ele.timeID = setInterval(function () {
        /*开关思想：某种操作的结果只有两种情况。 可以用布尔类型来表示这两种情况  isAllOk
        1.提出假设
         */
        //一.提出假设
        var isAllOk = true;
        //二.验证假设
        for (var key in attrs) {
            var attr = key;
            var target = attrs[key];
            if (attr == 'zIndex') {//层级没有动画
                ele.style[attr] = target;
            } else if (attr == 'backgroundColor') {//判断是否设置有背景颜色
                for (var i = 0; i < 3; i++) {
                    var current = Number(getStyle(ele, 'backgroundColor').replace('rgb(', '').replace(')', '').split(',')[i]);//获取操作元素背景颜色字符串并且分割成数组
                    var target = Number(getStyle(p, 'backgroundColor').replace('rgb(', '').replace(')', '').split(',')[i]);//获取p元素背景颜色字符串并且分割成数组
                    var step = (target - current) / 10;//2.2 计算本次颜色 = (目标颜色数值-当前颜色数值)/10
                    step = current < target ? Math.ceil(step) : Math.floor(step);//取整 : 正数： 向上取整  负数：向下取整
                    current += step;//计算颜色数值
                    arr[i] = current;//添加进arr数组
                    if (current != target) {//只要有任何属性没有到达则假设被推翻
                        isAllOk = false
                    };
                }
                ele.style.backgroundColor = 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ')';//颜色赋值
            } else if (key == 'opacity') {
                //2.1 获取元素当前位置
                /* 细节：透明度是0-1小数，是用parseFloat取小数 */
                var current = parseFloat(getStyle(ele, attr)) * 100;
                target *= 100;
                //2.2 计算本次移动距离 = (目标位置-当前位置)/10
                var step = (target - current) / 70;
                //取整 : 从左往右： 向上取整  从右往左：向下取整
                step = current < target ? Math.ceil(step) : Math.floor(step);
                //2.3 开始移动
                current += step;
                ele.style[attr] = current / 100;
                //2.3 终点检测
                if (current != target) {//只要有任何属性没有到达则假设被推翻
                    isAllOk = false
                };
            } else {
                //2.1 获取元素当前位置
                var current = parseInt(getStyle(ele, attr));
                //2.2 计算本次移动距离 = (目标位置-当前位置)/10
                var step = (target - current) / 70;
                //取整 : 从左往右： 向上取整  从右往左：向下取整
                step = current < target ? Math.ceil(step) : Math.floor(step);
                //2.3 开始移动
                current += step;
                ele.style[attr] = current + 'px';
                //2.3 终点检测
                if (current != target) {//只要有任何属性没有到达则假设被推翻
                    isAllOk = false
                };
            }
        };

        //三：根据开关结果实现需求
        if (isAllOk) {
            clearInterval(ele.timeID);
            //如果fn传了代码则执行，没传则不执行
            if (typeof fn == 'function') {
                fn();
            };
            if (attrs.backgroundColor) {
                ele.removeChild(p);//移除存取颜色的p元素
            };


        };

    }, 20);
};


/**
* @description: 获取元素的样式属性 浏览器兼容性封装
* @param {type} 
* @return: 
*/
function getStyle(ele, attribute) {
    //能力检测
    if (window.getComputedStyle) {//如果getComputedStyle可以获取，谷歌火狐
        return window.getComputedStyle(ele, null)[attribute];
    } else {//IE8
        return ele.currentStyle[attribute]
    };
};
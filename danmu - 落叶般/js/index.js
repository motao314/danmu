(function(){
    var w = window.innerWidth;
    if(w > 750){
        document.documentElement.style.fontSize = 750/15 + "px";
    }
})();
function loading(){
    var loadData = [
        "img/img1.png",
        "img/img2.png",
        "img/img3.png",
        "img/img4.png",
        "img/img5.png"
    ];
    var loadingPage = document.querySelector("#loading");
    var progressBar = document.querySelector(".progress-bar");
    var loadLength = 0;
    document.body.style.height = window.innerHeight+"px";
    loadData.forEach((item)=>{
        var img = new Image();
        img.src = item;
        img.onload = function(){
            loadLength++;
            if(loadLength == loadData.length){
                progressBar.addEventListener("transitionend",hideLoading);
                progressBar.addEventListener("webkitTransitionEnd",hideLoading);
            }
            progressBar.style.width = loadLength/loadData.length*100+"%";
        };
    });
    function hideLoading(){
        loadingPage.style.webkitTransform = loadingPage.style.transform = "scale(.5) translate3d(0,-100%,0)";
        loadingPage.style.opacity = 0;
    }
}
/* 自定义事件 */
function dispatchTap(el){
    var tap = new Event("tap");
    var startPoint = {};
    el.addEventListener("touchstart",function(e){
        startPoint = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY
        };
    });
    el.addEventListener("touchend",function(e){
         var nowPoint = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY
         };   
         if(Math.abs(nowPoint.y - startPoint.y) < 5
           && Math.abs(nowPoint.x - startPoint.x) < 5 ){
                el.dispatchEvent(tap);
         }
    });
}

//图片切换
window.addEventListener("load",function(){
    var picList = document.querySelector("#picList");
    var picLists = picList.querySelectorAll("li"); 
    var now;
    var loadingPage = document.querySelector("#loading");
    var timer = 0;
    loadingPage.addEventListener("transitionend",loadEnd);
    loadingPage.addEventListener("webkitTransitionEnd",loadEnd);

    function loadEnd(){
        loadingPage.removeEventListener("transitionend",loadEnd);
        loadingPage.removeEventListener("webkitTransitionEnd",loadEnd);
        clearInterval(timer);
        timer = setTimeout(function(){
            changeNow();
        },100);
    }
    window.onscroll = changeNow;
    function changeNow(){
       var minDis = Infinity;
       var nowIndex;
       for(var i = 0; i < picLists.length; i++){
            var rect = picLists[i].getBoundingClientRect();
            var h = rect.height;
            var R = Math.abs((rect.top +h/2) - window.innerHeight/2);
            if(R < minDis){
                minDis = R;
                nowIndex = i;
            }
            picLists[i].style.opacity = .6;
       }
       picLists[nowIndex].style.opacity = 1;
       if(nowIndex != now){
            hideMarks();
            now = nowIndex;
            showMarkNub();
       }
    };

    // 消息发送
    var btn = document.querySelector("#btn");
    var text = document.querySelector("#text");
    var message = document.querySelector("#message");
    var picImg = picList.querySelectorAll("img");
    for(var i = 0; i < picImg.length; i++ ){
        dispatchTap(picImg[i]);
        picImg[i].addEventListener("tap",function(){
            message.classList.toggle("message-show");
        });
    }
    dispatchTap(btn);
    btn.addEventListener("tap",function(){
        var txt = text.value.trim();
        var txtLength = 0;
        for(var i = 0; i < txt.length; i++){
        	if(/[^\x00-\xff]/.test(txt[i])){
        		txtLength += 2;
        	} else {
        		txtLength++;
        	}
        }
        if(txtLength == 0){
            alert("请输入弹幕内容")
        } else if(txtLength > 24){
            alert("字数超了哟")
        } else {
            editMark(txt);
            message.classList.remove("message-show");
            text.value = "";
        }
    });
    var edit = document.querySelector("#edit");
    var editCancelBtn = document.querySelector("#edit-cancel-btn");
    var editSureBtn = document.querySelector("#edit-sure-btn");
    var mark = null;
    function editMark(inner){
        var newMark = document.createElement("mark");
        mark = document.createElement("div");
        mark.className = "mark";
        newMark.innerHTML = inner;
        mark.appendChild(newMark);
        drag(mark);
        edit.appendChild(mark);
        edit.style.display = "block";
        mark.style.left = mark.offsetLeft - mark.offsetWidth/2 + "px";
        mark.style.top = mark.offsetTop - mark.offsetHeight/2 + "px";
        mark.style.webkitTransform = mark.style.transform = "none";
    }
    dispatchTap(editCancelBtn);
    editCancelBtn.addEventListener("tap",function(){
        edit.removeChild(mark);
        edit.style.display = "none"; 
    });
    dispatchTap(editSureBtn);
    editSureBtn.addEventListener("tap",function(){
        var markInner = mark.children[0].innerHTML;
        var markRect = mark.getBoundingClientRect();
        hideMarkNub();
        var picRect = picLists[now].getBoundingClientRect();
        var position = {
            x: markRect.left - picRect.left,
            y: markRect.top - picRect.top
        };
        data.push({
            id: Date.now(),
            pid: now,
            text: markInner,
            position: setPosition(position) 
        });
        edit.removeChild(mark);
        edit.style.display = "none"; 
        showMarks()
    });
    var nub = 0;// 第一屏弹幕
    // 获取弹幕
    function getMarks(){
        var marks = [];
        data.forEach(function(item){
            if(item.pid == now){
                marks.push(item);
            }
        });
        return marks;
    }
    // 显示弹幕
    function showMarkNub(){
        var marks = getMarks();
        if(marks.length == 0){
            return ;
        }
        var markNub = document.createElement("div");
        clearInterval(timer);
        markNub.className = "mark-nub";
        markNub.innerHTML = "<span>"+marks.length+"</span>条弹幕";
        var position = getPosition(marks[0].position);
        markNub.style.left = position.x + "px";
        markNub.style.top = position.y + "px";
        dispatchTap(markNub);
        markNub.addEventListener("tap",function(e){
            showMarks();
            e.stopPropagation();
        });
        drag(markNub);
        picLists[now].appendChild(markNub);
        setTimeout(function(){
            markNub.style.transform = "scale(1)";
            markNub.style.webkitTransform = "scale(1)";
        },30);
    }
    function showMarks(){
        hideMarkNub();
        var marks = getMarks();
        var markLength = 5;//一屏显示5条弹幕
        var length = Math.ceil(marks.length/5);//总共有几屏弹幕
        clearInterval(timer);
        nub = 0;
        show();
        if(length > 1){
            timer = setInterval(function(){
                if(nub >= length){
                    clearInterval(timer);
                    timer = setTimeout(function(){
                        showMarkNub();
                    },3000)
                } else {
                    nub++;
                    show();
                }
            },1000);
        } else {
            timer = setTimeout(function(){
                showMarkNub();
            },3000)
        }
        function show(){
            var start = nub*markLength;
            var end = (nub+1)*markLength;
            var deley = 0;
            end = end>marks.length?marks.length:end;
            for(var i = start; i < end; i++){
                createMark(marks[i],deley);
                deley += 200;
            }
        }
    }
    function createMark(markData,delay){
        var newMark = document.createElement("mark");
        newMark.innerHTML = markData.text;
        var position = getPosition(markData.position);
        newMark.style.left = position.x + "px";
        newMark.style.top = position.y + "px";
        newMark.style.transition = ".5s "+delay+"ms cubic-bezier(.42,1.18,.5,1.14)";
        picLists[now].appendChild(newMark);
        var x = Math.ceil(Math.random()*200) + 80;
        var y = Math.ceil(Math.random()*80) + 150;
        newMark.style.webkitTransform = newMark.style.transform = "translate("+x+"px,-"+y+"px) rotateX(720deg) rotateY(90deg) scale(.2)";
        newMark.timer = setTimeout(function(){
            newMark.classList.add("show");
            newMark.timer = setTimeout(function(){
                var x = Math.ceil(Math.random()*300-150);
                var y = Math.ceil(Math.random()*100) + 50;
                var scale = (Math.round(Math.random()*120) + 60)/100;
                newMark.classList.remove("show");
                newMark.style.webkitTransform = newMark.style.transform = "translate("+x+"px,"+y+"px) rotateX(720deg) rotateY(90deg) scale("+scale+")";
                newMark.classList.add("hide");
                newMark.timer = setTimeout(function(){
                    picLists[now].removeChild(newMark);
                },1200);
            },4000);
        },delay);    
    }

    // 隐藏弹幕
    function hideMarkNub(){
        if(!picLists[now]){
            return ;
        }
        var markNub =  picLists[now].querySelector(".mark-nub");
        if(markNub){
            picLists[now].removeChild(markNub);
        }
    }
    function hideMarks(){
        hideMarkNub();
        clearInterval(timer);
        if(!picLists[now]){
            return ;
        }
        var marks =  picLists[now].querySelectorAll("mark");
        marks.forEach(function(item){
            clearInterval(item.timer);
            item.style.transition = ".2s";
            item.style.opacity = "0";
            item.timer = setTimeout(function(){
                item.remove();
            },200);
        });
    }


    // 获取样式
    function css(el,attr){
        return parseFloat(getComputedStyle(el)[attr]);
    }
    // 拖拽元素
    function drag(el){
        var startPoint = {};
        var startPosition = {};
        el.addEventListener("touchstart",function(e){
            startPoint = {
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY
            };
            startPosition = {
                x: css(el,"left"),
                y: css(el,"top")
            };
            e.preventDefault();
        });
        el.addEventListener("touchmove",function(e){
            var nowPoint = {
                x: e.changedTouches[0].pageX,
                y: e.changedTouches[0].pageY
            };
            var dis = {
                x: nowPoint.x - startPoint.x,
                y: nowPoint.y - startPoint.y
            };
            var l = startPosition.x + dis.x;
            var t = startPosition.y + dis.y;
            el.style.left = l + "px";
            el.style.top = t + "px";
            let rect = el.getBoundingClientRect();
            if(rect.top < 0){
                el.style.top = 0 + "px";
            } else if(rect.bottom > innerHeight){
                el.style.top = innerHeight - rect.height + "px";
            }
            if(rect.left < 0){
                el.style.left = 0 + "px";
            } else if(rect.right > innerWidth){
                el.style.left = innerWidth - rect.width + "px";
            }
        })
    }
    function getPosition(position){
        return {
            x: position.x*document.body.clientWidth,
            y: position.y*document.body.clientHeight 
        }
    }
    function setPosition(position){
        return {
            x: position.x/document.body.clientWidth,
            y: position.y/document.body.clientHeight 
        }
    }
});
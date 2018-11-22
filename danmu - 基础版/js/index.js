var data = [
    {
        id: 1541821454355,
        pid: 0,
        position: {x: 146, y: 70},
        text: "我们的征途是星辰大海"
    },
    {
        id: 1541821558165,
        pid: 0,
        position: {x: 57, y: 127},
        text: "路飞"
    },{
        id: 1541830344641,
        pid: 1,
        position: {x: 236, y: 308},
        text: "萌萌哒"
    },{
        id: 1541841550702,
        pid: 2,
        position: {x: 190, y: 120},
        text: "呆傻"
    },{
        id: 1541841639030, 
        pid: 3, 
        text: "酷", 
        position: {x: 56, y: 173}
    },{
        id: 1541841742304,
        pid: 3,
        position: {x: 192, y: 123},
        text: "O(∩_∩)O哈哈~"
    }
    
];
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
(function(){
    var swiperUp = new Event("swiperup");
    var swiperDown = new Event("swiperdown");
    var tap = new Event("tap");
    var startPoint = {};
    document.addEventListener("touchstart",function(e){
        startPoint = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY
        };
    });
    document.addEventListener("touchend",function(e){
         var nowPoint = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY
         };
         if(Math.abs(nowPoint.y - startPoint.y)-Math.abs(nowPoint.x - startPoint.x)>5){
            for(var i = 0; i < e.path.length;i++){
                if(nowPoint.y - startPoint.y>0){
                    e.path[i].dispatchEvent(swiperDown);
                } else {
                    e.path[i].dispatchEvent(swiperUp);
                }
            }
         }   
         if(Math.abs(nowPoint.y - startPoint.y) < 5
           && Math.abs(nowPoint.x - startPoint.x) < 5 ){
            for(var i = 0; i < e.path.length;i++){
                e.path[i].dispatchEvent(tap);
            }
         }
    });
})();

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
        picImg[i].addEventListener("tap",function(){
            message.classList.toggle("message-show");
        });
    }
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
    }
    editCancelBtn.addEventListener("tap",function(){
        edit.removeChild(mark);
        edit.style.display = "none"; 
    });
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
            position: {
                x: position.x,
                y: position.y
        }});
        edit.removeChild(mark);
        edit.style.display = "none"; 
        showMarks()
        console.log(data);
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
        var markNUb = document.createElement("div");
        clearInterval(timer);
        markNUb.className = "mark-nub";
        markNUb.innerHTML = "<span>"+marks.length+"</span>条弹幕";
        markNUb.style.left = marks[0].position.x + "px";
        markNUb.style.top = marks[0].position.y + "px";
        markNUb.addEventListener("tap",function(e){
            showMarks();
            e.stopPropagation();
        });
        drag(markNUb);
        picLists[now].appendChild(markNUb);
        setTimeout(function(){
            markNUb.style.transform = "scale(1)";
            markNUb.style.webkitTransform = "scale(1)";
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
                if(nub >= markLength){
                    clearInterval(timer);
                    timer = setTimeout(function(){
                        showMarkNub();
                    },4000)
                } else {
                    nub++;
                    show();
                }
            },1000);
        } else {
            timer = setTimeout(function(){
                showMarkNub();
            },4000)
        }
        function show(){
            var start = nub*markLength;
            var end = (nub+1)*markLength;
            end = end>marks.length?marks.length:end;
            for(var i = start; i < end; i++){
                createMark(marks[i],i*200);
            }
        }
    }
    function createMark(markData,delay){
        var newMark = document.createElement("mark");
        newMark.innerHTML = markData.text;
        newMark.style.left = markData.position.x + "px";
        newMark.style.top = markData.position.y + "px";
        newMark.style.transition = ".5s "+delay+"ms cubic-bezier(.42,1.18,.5,1.14)";
        picLists[now].appendChild(newMark);
        newMark.timer = setTimeout(function(){
            newMark.style.webkitTransform = "scale(1)";
            newMark.style.transform = "scale(1)";
            newMark.timer = setTimeout(function(){
                newMark.style.transition = ".4s";
                newMark.style.opacity = "0";
                newMark.timer = setTimeout(function(){
                    picLists[now].removeChild(newMark);
                },400);
            },2000+delay);
        },30);
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
                picLists[now].removeChild(item);
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
        })
    }
});
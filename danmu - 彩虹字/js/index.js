var data = [
    {
        id: 1541821454355,
        pid: 0,
        position: {x: 146, y: 70},
        text: "神仙下凡辛苦了",
        vip: 1
    },
    {
        id: 1541821558165,
        pid: 0,
        position: {x: 57, y: 127},
        text: "丝桐，你瘦了。。",
        vip: 2
    },{
        id: 1541830344641,
        pid: 1,
        position: {x: 236, y: 308},
        text: "萌萌哒",
        vip: 2
    },{
        id: 1541841550702,
        pid: 2,
        position: {x: 190, y: 120},
        text: "呆傻",
        vip: 0
    },{
        id: 1541841639030, 
        pid: 3, 
        text: "酷", 
        position: {x: 56, y: 173},
        vip: 2
    },{
        id: 1541841742304,
        pid: 3,
        position: {x: 192, y: 123},
        text: "O(∩_∩)O哈哈~",
        vip: 0
    },{    
        id: 1542622160657,
        pid: 0,
        position: {x: 233, y: 166},
        text: "性感漂酿",
        vip: 1
    },{
        id: 1542622204972,
        pid: 0,
        position: {x: 17, y: 444},
        text: "美艳不可方物",
        vip: 1
    },{
        id: 1542622254744,
        pid: 0,
        position: {x: 269, y: 427},
        text: "还有谁！！",
        vip: 2
    },{
        id: 1542622318086,
        pid: 0,
        position: {x: 159, y: 239},
        text: "超可爱的~",
        vip: 0
    },{
        id: 1542628367202,
        pid: 0,
        position: {x: 194.5, y: 358.5},
        text: "好看好看好看",
        vip: 1
    },{
        id: 1542628411068,
        pid: 0,
        position: {x: 109.5, y: 528.5},
        text: "哇噻~好美",
        vip: 2
    }
];
// rem 计算
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
        "img/img5.png",
        "img/vip_icon-min.png",
        "img/vip_icon_2-min.png",
        "img/vip_icon_3-min.png"
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
    var MarkVip = 0;
    var MarkVipIcons = ["mark-vip-1","mark-vip-2","mark-vip-3"];
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
    // icon 切换
    let vipList = document.querySelector("#vip-list");
    let vipMarks = vipList.querySelectorAll("li");
    let vipIcon = document.querySelector("#vip-icon");
    vipIcon.addEventListener("tap",function(){
        vipList.classList.toggle("show");
        
    });
    vipMarks.forEach(function(item,index){
        item.addEventListener("tap",function(){
            vipMarks.forEach(function(item){
                item.classList.remove("active");
            });
            item.classList.add("active");
            vipList.classList.remove("show");
            vipIcon.className = "icon icon-"+(index+1);
            MarkVip = index;
        })
    });

    // 切换
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
            if( !message.classList.contains("message-show")){
                vipList.classList.remove("show")
            }
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
            vipList.classList.remove("show");
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
        newMark.innerHTML = "<strong><em>"+inner+"</em></strong>";
        newMark.className = MarkVipIcons[MarkVip];
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
        var markInner = mark.children[0].children[0].innerHTML;
        var markRect = mark.children[0].getBoundingClientRect();
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
            vip: MarkVip,
            position: {
                x: position.x,
                y: position.y
        }});
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
                if(nub >= length){
                    console.log(1);
                    clearInterval(timer);
                     showMarkNub();
                } else {
                    nub++;
                    show();
                }
            },2200);
        } else {
            timer = setTimeout(function(){
                showMarkNub();
            },3000)
        }
        function show(){
            var start = nub*markLength;
            var end = (nub+1)*markLength;
            end = end>marks.length?marks.length:end;
            var delay = 0;
            for(var i = start; i < end; i++){
                delay += 150;
                createMark(marks[i],delay);
            }
        }
    }
    function createMark(markData,delay){
        var newMark = document.createElement("mark");
        var inner = "";
        for(var i = 0; i < markData.text.length; i++){
            inner += '<span style="background-position: '+(-i*12)+'px 0px;animation: shark 1.2s '+(i*100)+'ms linear infinite;">'+markData.text[i]+'</span>';
        }
        newMark.innerHTML = "<strong><em>"+inner+"</em></strong>";
        newMark.className = MarkVipIcons[markData.vip];
        newMark.style.left = markData.position.x + "px";
        newMark.style.top = markData.position.y + "px";
        picLists[now].appendChild(newMark);
        var marksFont = newMark.querySelectorAll("span");
        var x = 0;
        newMark.fontTimer = setInterval(function(){
            marksFont.forEach(function(item,i){
                x++;
                item.style.backgroundPosition = -i*12 + x + "px 0px"; 
            });
        },100);
        newMark.timer = setTimeout(function(){
            newMark.style.transition = ".3s cubic-bezier(.42,1.18,.5,1.14)";
            newMark.style.transform = newMark.style.webkitTransform = "scale(1)";
            newMark.timer = setTimeout(function(){
                let strong = newMark.children[0];
                let spans = strong.children[0].children;
                let spanW =  spans[0].offsetWidth;
                let emW = spanW*spans.length + strong.scrollWidth - spanW + 5;
                strong.style.width = emW + "px";
                strong.style.opacity = 1;
                newMark.classList.add("show");
                newMark.timer = setTimeout(function(){
                    newMark.style.transition = ".4s";
                    newMark.style.opacity = 0;
                    newMark.timer = setTimeout(function(){
                        newMark.remove();
                    },400);
                },3000);
            },200);
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
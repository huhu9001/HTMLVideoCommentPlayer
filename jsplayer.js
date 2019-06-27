var $v = {};

//■ player
$v.player = document.getElementById("jsplayer");


$v.player.entrypoint = function(url, width, height){
    width  = width  || 640;
    height = height || 360;
    $v.screen.style.width  = width + "px";
    $v.screen.style.height = height + "px";
    $v.controller.style.width = width + "px";
    $v.controller.timeSeek.style.width = width - 307 + "px";

    $v.comment.keyframe(width);
    $v.comment.setting(height);

    for(var i=$v.synchr.listMax-1;i>=0;i--) $v.synchr.listValid[i]=false;

    $v.user = $v.loadObject("jsplayer") || {};
    $v.user.volume = Number($v.user.volume) || 1;
    $v.controller.setSeeker($v.user.volume, $v.controller.volumeSeeker);

    $v.player.style.visibility = "visible";

    $v.screen.pos = $v.screen.getBoundingClientRect();
    $v.screen.focus();

    if (url) $v.video.src = url;

    enableInput(true);
};


$v.player.addEventListener('keydown', function(event){
    $v.controller.style.visibility = "visible";
    if(event.target.tagName.match(/input/i)){ return true; }

    if(event.which == 32){ //Space
        $v.form.input.focus();
    }
    else if(event.which == 13 && event.ctrlKey){ //Ctrl+Enter ※IE11で効かない
        $v.screen.toggleFullscreen();
    }
    else if(event.which == 13){ //Enter
        $v.video.paused ? $v.video.play() : $v.video.pause();
    }
    else if(event.which == 39 && event.ctrlKey){ //Ctrl+→
        $v.video.setTime($v.video.currentTime + 30);
    }
    else if(event.which == 39 && event.shiftKey){ //Shift+→
        $v.video.setTime($v.video.currentTime + 30);
    }
    else if(event.which == 37 && event.ctrlKey){ //Ctrl+←
        $v.video.setTime($v.video.currentTime - 30);
    }
    else if(event.which == 37 && event.shiftKey){ //Shift+←
        $v.video.setTime($v.video.currentTime - 30);
    }
    else if(event.which == 39){ //→
        $v.video.setTime($v.video.currentTime + 10);
    }
    else if(event.which == 37){ //←
        $v.video.setTime($v.video.currentTime - 10);
    }
    else if(event.which == 36){ //Home
        $v.video.setTime(0);
    }
    else if(event.which == 35){ //End
        $v.video.setTime($v.video.duration - 10);
    }
    else if(event.which == 38){ //↑
        $v.video.setVolume($v.video.volume + 0.1);
    }
    else if(event.which == 40){ //↓
        $v.video.setVolume($v.video.volume - 0.1);
    }
    else if(event.which == 107){ //num+
        $v.video.setSpeed($v.video.playbackRate + 0.1);
    }
    else if(event.which == 187 && event.shiftKey){ //+
        $v.video.setSpeed($v.video.playbackRate + 0.1);
    }
    else if(event.which == 109){ //num-
        $v.video.setSpeed($v.video.playbackRate - 0.1);
    }
    else if(event.which == 189){ //-
        $v.video.setSpeed($v.video.playbackRate - 0.1);
    }
    else{
        return true;
    }

    event.preventDefault();
});


window.addEventListener('unload', function(event){
    $v.saveObject("jsplayer", $v.user);
});



//■ video
$v.video = $v.player.querySelector(".jsplayer-video");


$v.video.fit = function(){
    if(!$v.screen.pos.width || !$v.video.videoWidth){ return; }
    var pos = $v.objectFit($v.screen.pos.width, $v.screen.pos.height, $v.video.videoWidth, $v.video.videoHeight);

    $v.video.style.width  = pos.w + "px";
    $v.video.style.height = pos.h + "px";
    $v.video.style.left   = pos.x + "px";
    $v.video.style.top    = pos.y + "px";
};


$v.video.setTime = function(sec){
    if(!$v.video.duration){ return; }
    if(sec < 1){ sec = 0; }
    if(sec > $v.video.duration){ sec = $v.video.duration; }
    $v.video.currentTime = sec;
};


$v.video.setVolume = function(volume){
    volume = volume.toFixed(1);
    if(volume >= 1){ volume = 1; }
    if(volume <= 0){ volume = 0; }
    $v.video.volume = volume;
    $v.video.muted  = false;
};


$v.video.setSpeed = function(speed){
    if(!$v.video.duration){ return; }
    speed = speed.toFixed(1);
    if(speed >= 2){ speed = 2; }
    if(speed <= 0.5){ speed = 0.5; }
    $v.video.playbackRate = speed;
};


$v.video.isSeekable = function(sec){
    for(var i = 0; i < $v.video.seekable.length; i++){
        if(sec >= $v.video.seekable.start(i) && sec <= $v.video.seekable.end(i)){ return true; }
    }
    return false;
};


$v.video.addEventListener('loadedmetadata', function () {

    $v.controller.setBuffer();
    $v.controller.setTime($v.video.duration, $v.controller.totalTime);
    $v.form.input.disabled  = false;
    $v.form.button.disabled = false;

    $v.video.volume = $v.user.volume;
    $v.video.fit();

    var reader = new FileReader();
    reader.onload = function (e)
    {
        $v.comment.textXML = e.target.result;
        $v.comment.count();
        $v.comment.get();
    }
    
    try { reader.readAsText(document.getElementById("commentFile").files[0]); }
    catch (e) { alert('reader failed.') }

    /*
    var api = document.getElementById("commentFileUrl").value;
    if (!api) {
        onErrorLoadComment();
    }
    else {
        $v.get(api, function (xhr) {
            $v.comment.textXML = xhr.responseText;
            $v.comment.count();
            $v.comment.get();
        }, function (xhr) {
            onErrorLoadComment();
        });
    }
    */
});


$v.video.addEventListener('canplaythrough', function(){
    $v.video.play();
});


$v.video.addEventListener('timeupdate', function(){//When the video arrives where a comment should appear
    var sec = Math.floor($v.video.currentTime);
    if(sec === $v.video.prevSec){ return; }
    $v.video.prevSec = sec;

    if(!$v.controller.timeSeeker.isDragging){
        $v.controller.setSeeker($v.video.currentTime/$v.video.duration, $v.controller.timeSeeker);
        $v.controller.setTime(sec, $v.controller.currentTime);
    }
    if(sec in $v.comment.list && $v.video.paused === false && $v.comment.on !== false){
        $v.comment.release($v.comment.list[sec], $v.comment.laneCheck());
    }
});


$v.video.addEventListener('play', function(){
    $v.comment.run();
    $v.controller.playButton.setAttribute("src", $v.controller.parts.pause);
});


$v.video.addEventListener('pause', function(){
    $v.comment.pause();
    $v.controller.playButton.setAttribute("src", $v.controller.parts.play);
});


$v.video.addEventListener('progress', function(){
    $v.controller.setBuffer();
});


$v.video.addEventListener('seeking', function(){
    $v.comment.clear();
});


$v.video.addEventListener('ended', function(){
    //$v.comment.clear();
});


$v.video.addEventListener('volumechange', function(){
    if(!$v.video.volume || $v.video.muted){
        $v.controller.volumeButton.setAttribute("src", $v.controller.parts.mute);
        $v.controller.setSeeker(0, $v.controller.volumeSeeker);
    }
    else{
        $v.controller.volumeButton.setAttribute("src", $v.controller.parts.volume);
        $v.controller.setSeeker($v.video.volume, $v.controller.volumeSeeker);
        $v.user.volume = $v.video.volume;
    }
});


$v.video.addEventListener('ratechange', function(){
    $v.screen.showOsd("x" + $v.video.playbackRate.toFixed(1));
});


$v.video.addEventListener('click', function(event){
    if(!$v.video.currentTime){ $v.video.play(); }
    event.preventDefault();
});


$v.video.addEventListener('dblclick', function(event){
    event.preventDefault();
});


$v.video.addEventListener('error', function(event){
    var error = event.target.error;

    switch(error.code){ // http://www.html5.jp/tag/elements/video.html
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            alert("動画ファイルが存在しません");
            break;
        case error.MEDIA_ERR_DECODE:
            alert("動画ファイルが未対応の形式です");
            break;
        case error.MEDIA_ERR_NETWORK:
            alert("動画ファイルのダウンロードが失敗しました");
            break;
        case error.MEDIA_ERR_ABORTED:
            //alert("動画の再生が中止されました");
            break;
        default:
            alert("未知のエラーが発生しました");
            break;
    }
    onErrorLoadComment();
});



//■ comment
$v.comment = {};
$v.comment.list = [];


$v.comment.release = function (comments, lane) {//A comment appears
    
    var vdom  = document.createDocumentFragment();
    var index = 0;
    var lane_proper;
    for (index = 0; index in comments; index++)
    {
        if (comments[index].pos === "naka") lane_proper = lane.naka;
        if (comments[index].pos === "ue") lane_proper = lane.ue;
        if (comments[index].pos === "shita") lane_proper = lane.shita;
        for(var i = 0; i < lane_proper.length; i++)
        {
            if(lane_proper[i])
            {
                lane_proper[i] = false;
                vdom.appendChild($v.comment.create(comments[index], i));
                break;
            }
        }
    }
    /*/
    for(var i = 0; i < lane.length; i++){
        if(!(index in comments)){ break; }
        if(lane[i] === false){ continue; }
        vdom.appendChild($v.comment.create(comments[index], i));
        index++;
    }
    //*/
    if(index){ $v.screen.insertBefore(vdom, $v.screen.firstChild); }
};


$v.comment.create = function(data, laneNumber){
    var comment = document.createElement("span");
    comment.textContent = data.content;
    comment.className = "jsplayer-comment"+data.pos;
    comment.setAttribute("data-lane", laneNumber);
    comment.style.fontFamily = data.font + ", Meiryo, sans-serif";
    comment.style.color = data.color;

    comment.style.top = (data.pos === "shita" ? $v.comment.laneCount - laneNumber : laneNumber) * $v.comment.laneHeight + $v.comment.marginTop + "px";
    comment.style.fontSize = $v.comment.fontSize + "px";
    if (data.pos === "naka") comment.style.animationName = $v.screen.isFullscreen() ? $v.player.id + "fulllane" : $v.player.id + "normallane";
    else {
        comment.style.animationName = "none";
        comment.setAttribute("timeRemain", $v.comment.timeRemain);
    }

    var delay = data.vpos - $v.video.currentTime;
    delay = (delay <= 0) ? 0 : delay.toFixed(3)*1000;
    comment.style.animationDelay = delay + "ms";

    return comment;
};


$v.comment.keyframe = function(width){
    var css = "";
    css += "@keyframes " + $v.player.id + "normallane{";
    css += "from{transform:translateX(0);}";
    css += "to{transform:translateX(-" + width*5 + "px);}}";
    document.styleSheets[0].insertRule(css, 0);

    css = "";
    css += "@keyframes " + $v.player.id + "fulllane{";
    css += "from{transform:translateX(0);}";
    css += "to{transform:translateX(-" + screen.width*5 + "px);}}";
    document.styleSheets[0].insertRule(css, 0);
};


$v.comment.setting = function(height){
    if(height >= 360){
        $v.comment.laneCount  = Math.floor((height-360)/180) + 10;
        $v.comment.laneHeight = height / $v.comment.laneCount * 0.8;
        $v.comment.fontSize   = $v.comment.laneHeight / 6 * 5; //22.5px以上必要
        $v.comment.marginTop  = $v.comment.laneHeight / 6;
    }
    else{
        $v.comment.laneCount  = Math.floor(height*0.8/30);
        $v.comment.laneHeight = 30;
        $v.comment.fontSize   = 25;
        $v.comment.marginTop  = 5;
    }
    $v.comment.timeRemain = 3;
};


$v.comment.laneCheck = function(){
    var lane = {};
    lane.naka = Array($v.comment.laneCount);
    lane.ue = Array($v.comment.laneCount);
    lane.shita = Array($v.comment.laneCount);
    for (var i = 0; i < $v.comment.laneCount; i++) {
        lane.naka[i] = true;
        lane.ue[i] = true;
        lane.shita[i] = true;
    }
 
    var comments = $v.screen.querySelectorAll(".jsplayer-commentnaka");
    for(var i = comments.length-1; i >= 0; i--){
        comments[i].pos = comments[i].getBoundingClientRect();
        if (comments[i].pos.right > $v.screen.pos.right - 4) { lane.naka[comments[i].getAttribute("data-lane")] = false; }
        if (comments[i].pos.right < $v.screen.pos.left) { $v.screen.removeChild(comments[i]); }//A comment disappears        
    }
    comments = $v.screen.querySelectorAll(".jsplayer-commentue");
    for (var i = comments.length - 1; i >= 0; i--) {
        comments[i].pos = comments[i].getBoundingClientRect();
        lane.ue[comments[i].getAttribute("data-lane")] = false;
        if (comments[i].getAttribute("timeRemain") === $v.comment.timeRemain + "") comments[i].style.left = comments[i].pos.left - comments[i].pos.right / 2 - comments[i].getAttribute("data-lane") * 20 + "px";
        if (comments[i].getAttribute("timeRemain") <= 0) { $v.screen.removeChild(comments[i]); }//A comment disappears
        else { comments[i].setAttribute("timeRemain", comments[i].getAttribute("timeRemain") - 1); }
    }
    comments = $v.screen.querySelectorAll(".jsplayer-commentshita");
    for (var i = comments.length - 1; i >= 0; i--) {
        comments[i].pos = comments[i].getBoundingClientRect();
        lane.shita[comments[i].getAttribute("data-lane")] = false;
        if (comments[i].getAttribute("timeRemain") === $v.comment.timeRemain + "") comments[i].style.left = comments[i].pos.left - comments[i].pos.right / 2 + comments[i].getAttribute("data-lane") * 20 + "px";
        if (comments[i].getAttribute("timeRemain") <= 0) { $v.screen.removeChild(comments[i]); }//A comment disappears
        else { comments[i].setAttribute("timeRemain", comments[i].getAttribute("timeRemain") - 1); }
    }
    return lane;
};


$v.comment.clear = function(){
    var comments = $v.screen.querySelectorAll(".jsplayer-commentnaka");
    for (var i = comments.length - 1; i >= 0; i--) {
        comments[i].style.opacity = 0; //firefox：フルスクリーン時に画面最上部のコメントが消えないことがある対策
        $v.screen.removeChild(comments[i]);
    }
    comments = $v.screen.querySelectorAll(".jsplayer-commentue");
    for (var i = comments.length - 1; i >= 0; i--) {
        comments[i].style.opacity = 0; //firefox：フルスクリーン時に画面最上部のコメントが消えないことがある対策
        $v.screen.removeChild(comments[i]);
    }
    comments = $v.screen.querySelectorAll(".jsplayer-commentshita");
    for(var i = comments.length-1; i >= 0; i--){
        comments[i].style.opacity = 0; //firefox：フルスクリーン時に画面最上部のコメントが消えないことがある対策
        $v.screen.removeChild(comments[i]);
    }
};


$v.comment.pause = function(){
    var comments = $v.screen.querySelectorAll(".jsplayer-commentnaka");
    for (var i = 0; i < comments.length; i++) {
        comments[i].style.animationPlayState = "paused";
    }
    comments = $v.screen.querySelectorAll(".jsplayer-commentue");
    for (var i = 0; i < comments.length; i++) {
        comments[i].style.animationPlayState = "paused";
    }
    comments = $v.screen.querySelectorAll(".jsplayer-commentshita");
    for(var i = 0; i < comments.length; i++){
        comments[i].style.animationPlayState = "paused";
    }
};


$v.comment.run = function(){
    var comments = $v.screen.querySelectorAll(".jsplayer-commentnaka");
    for (var i = 0; i < comments.length; i++) {
        comments[i].style.animationPlayState = "running";
    }
    comments = $v.screen.querySelectorAll(".jsplayer-commentue");
    for (var i = 0; i < comments.length; i++) {
        comments[i].style.animationPlayState = "running";
    }
    comments = $v.screen.querySelectorAll(".jsplayer-commentshita");
    for(var i = 0; i < comments.length; i++){
        comments[i].style.animationPlayState = "running";
    }
};

    /*/
$v.comment.get = function(){
    var sec  = Math.floor($v.video.duration);

    $v.comment.list = Array(sec+1); //動画時間+1の箱を作る [[],[],[],[]...]
    for(var i = 0; i < $v.comment.list.length; i++){ $v.comment.list[i] = []; }

    var url = "?" + $v.param({
        "action"   : "commentget",
        "id"       : $v.form.hiddenId.value,
        "登録時間" : $v.form.hiddenTime.value,
        "件数"     : sec * 4,
        "nocache"  : Date.now()
    });

    $v.get(url, function (xhr)
    {
        try{ var comments = JSON.parse(xhr.responseText); } catch(e){ return; }

        for (var i = 0; i < comments.length; i++)
        {
            if(comments[i].本文 == null){ continue; }
            var index = Math.floor(comments[i].位置/100);
            if(index in $v.comment.list){ $v.comment.list[index].push([comments[i].本文.substring(0,64), comments[i].位置/100]); }
        }
    });
};//*/

    /*/
$v.comment.post = function(){
    var sec  = $v.video.currentTime;
    var text = $v.form.input.value.trim();

    if(text == "" || text.length > 64){ return; }

    $v.comment.list[Math.floor(sec+1)].unshift([text, sec+1, Math.floor(Date.now()/1000)]);
    $v.form.input.value = "";

    var formdata = new FormData($v.form);
    formdata.append("本文", text);
    formdata.append("位置", sec.toFixed(2)*100);
    $v.post('?action=commentpost', formdata);
};//*/



//■ controller
$v.controller               = $v.player.querySelector(".jsplayer-controller");
$v.controller.timeSeek      = $v.player.querySelector(".jsplayer-controller-time-seek");
$v.controller.timeSeekbar   = $v.player.querySelector(".jsplayer-controller-time-seekbar");
$v.controller.timeSeeker    = $v.player.querySelector(".jsplayer-controller-time-seeker")
$v.controller.volumeSeek    = $v.player.querySelector(".jsplayer-controller-volume-seek")
$v.controller.volumeSeekbar = $v.player.querySelector(".jsplayer-controller-volume-seekbar");
$v.controller.volumeSeeker  = $v.player.querySelector(".jsplayer-controller-volume-seeker");
$v.controller.currentTime   = $v.player.querySelector(".jsplayer-controller-current-time");
$v.controller.totalTime     = $v.player.querySelector(".jsplayer-controller-total-time");
$v.controller.playButton    = $v.player.querySelector(".jsplayer-controller-play-button");
$v.controller.volumeButton  = $v.player.querySelector(".jsplayer-controller-volume-button");
$v.controller.commentButton = $v.player.querySelector(".jsplayer-controller-comment-button");
$v.controller.screenButton  = $v.player.querySelector(".jsplayer-controller-screen-button");

$v.controller.parts = {
    play:       "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNTc2IDkyN2wtMTMyOCA3MzhxLTIzIDEzLTM5LjUgM3QtMTYuNS0zNnYtMTQ3MnEwLTI2IDE2LjUtMzZ0MzkuNSAzbDEzMjggNzM4cTIzIDEzIDIzIDMxdC0yMyAzMXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=",
    pause:      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNjY0IDE5MnYxNDA4cTAgMjYtMTkgNDV0LTQ1IDE5aC01MTJxLTI2IDAtNDUtMTl0LTE5LTQ1di0xNDA4cTAtMjYgMTktNDV0NDUtMTloNTEycTI2IDAgNDUgMTl0MTkgNDV6bS04OTYgMHYxNDA4cTAgMjYtMTkgNDV0LTQ1IDE5aC01MTJxLTI2IDAtNDUtMTl0LTE5LTQ1di0xNDA4cTAtMjYgMTktNDV0NDUtMTloNTEycTI2IDAgNDUgMTl0MTkgNDV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
    volume:     "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik04MzIgMzUydjEwODhxMCAyNi0xOSA0NXQtNDUgMTktNDUtMTlsLTMzMy0zMzNoLTI2MnEtMjYgMC00NS0xOXQtMTktNDV2LTM4NHEwLTI2IDE5LTQ1dDQ1LTE5aDI2MmwzMzMtMzMzcTE5LTE5IDQ1LTE5dDQ1IDE5IDE5IDQ1em0zODQgNTQ0cTAgNzYtNDIuNSAxNDEuNXQtMTEyLjUgOTMuNXEtMTAgNS0yNSA1LTI2IDAtNDUtMTguNXQtMTktNDUuNXEwLTIxIDEyLTM1LjV0MjktMjUgMzQtMjMgMjktMzUuNSAxMi01Ny0xMi01Ny0yOS0zNS41LTM0LTIzLTI5LTI1LTEyLTM1LjVxMC0yNyAxOS00NS41dDQ1LTE4LjVxMTUgMCAyNSA1IDcwIDI3IDExMi41IDkzdDQyLjUgMTQyem0yNTYgMHEwIDE1My04NSAyODIuNXQtMjI1IDE4OC41cS0xMyA1LTI1IDUtMjcgMC00Ni0xOXQtMTktNDVxMC0zOSAzOS01OSA1Ni0yOSA3Ni00NCA3NC01NCAxMTUuNS0xMzUuNXQ0MS41LTE3My41LTQxLjUtMTczLjUtMTE1LjUtMTM1LjVxLTIwLTE1LTc2LTQ0LTM5LTIwLTM5LTU5IDAtMjYgMTktNDV0NDUtMTlxMTMgMCAyNiA1IDE0MCA1OSAyMjUgMTg4LjV0ODUgMjgyLjV6bTI1NiAwcTAgMjMwLTEyNyA0MjIuNXQtMzM4IDI4My41cS0xMyA1LTI2IDUtMjYgMC00NS0xOXQtMTktNDVxMC0zNiAzOS01OSA3LTQgMjIuNS0xMC41dDIyLjUtMTAuNXE0Ni0yNSA4Mi01MSAxMjMtOTEgMTkyLTIyN3Q2OS0yODktNjktMjg5LTE5Mi0yMjdxLTM2LTI2LTgyLTUxLTctNC0yMi41LTEwLjV0LTIyLjUtMTAuNXEtMzktMjMtMzktNTkgMC0yNiAxOS00NXQ0NS0xOXExMyAwIDI2IDUgMjExIDkxIDMzOCAyODMuNXQxMjcgNDIyLjV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
    mute:       "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im04MzIsMzQ4bDAsMTA4OHEwLDI2IC0xOSw0NXQtNDUsMTl0LTQ1LC0xOWwtMzMzLC0zMzNsLTI2MiwwcS0yNiwwIC00NSwtMTl0LTE5LC00NWwwLC0zODRxMCwtMjYgMTksLTQ1dDQ1LC0xOWwyNjIsMGwzMzMsLTMzM3ExOSwtMTkgNDUsLTE5dDQ1LDE5dDE5LDQ1eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==",
    commenton:  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im02NDAsNzkycTAsLTUzIC0zNy41LC05MC41dC05MC41LC0zNy41dC05MC41LDM3LjV0LTM3LjUsOTAuNXQzNy41LDkwLjV0OTAuNSwzNy41dDkwLjUsLTM3LjV0MzcuNSwtOTAuNXptMzg0LDBxMCwtNTMgLTM3LjUsLTkwLjV0LTkwLjUsLTM3LjV0LTkwLjUsMzcuNXQtMzcuNSw5MC41dDM3LjUsOTAuNXQ5MC41LDM3LjV0OTAuNSwtMzcuNXQzNy41LC05MC41em0zODQsMHEwLC01MyAtMzcuNSwtOTAuNXQtOTAuNSwtMzcuNXQtOTAuNSwzNy41dC0zNy41LDkwLjV0MzcuNSw5MC41dDkwLjUsMzcuNXQ5MC41LC0zNy41dDM3LjUsLTkwLjV6bTM4NCwwcTAsMTc0IC0xMjAsMzIxLjV0LTMyNiwyMzN0LTQ1MCw4NS41cS0xMTAsMCAtMjExLC0xOHEtMTczLDE3MyAtNDM1LDIyOXEtNTIsMTAgLTg2LDEzcS0xMiwxIC0yMiwtNnQtMTMsLTE4cS00LC0xNSAyMCwtMzdxNSwtNSAyMy41LC0yMS41dDI1LjUsLTIzLjV0MjMuNSwtMjUuNXQyNCwtMzEuNXQyMC41LC0zN3QyMCwtNDh0MTQuNSwtNTcuNXQxMi41LC03Mi41cS0xNDYsLTkwIC0yMjkuNSwtMjE2LjV0LTgzLjUsLTI2OS41cTAsLTE3NCAxMjAsLTMyMS41dDMyNiwtMjMzLjAwMDA3NnQ0NTAsLTg1LjUwMDMydDQ1MCw4NS41MDAzMnQzMjYsMjMzLjAwMDA3NnQxMjAsMzIxLjV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
    commentoff: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0xNzkyLDc5MnEwLDE3NCAtMTIwLDMyMS41dC0zMjYsMjMzdC00NTAsODUuNXEtNzAsMCAtMTQ1LC04cS0xOTgsMTc1IC00NjAsMjQycS00OSwxNCAtMTE0LDIycS0xNywyIC0zMC41LC05dC0xNy41LC0yOWwwLC0xcS0zLC00IC0wLjUsLTEydDIsLTEwdDQuNSwtOS41bDYsLTlsNywtOC41bDgsLTlxNywtOCAzMSwtMzQuNXQzNC41LC0zOHQzMSwtMzkuNXQzMi41LC01MXQyNywtNTl0MjYsLTc2cS0xNTcsLTg5IC0yNDcuNSwtMjIwdC05MC41LC0yODFxMCwtMTMwIDcxLC0yNDguNXQxOTEsLTIwNC41MDA3OTN0Mjg2LC0xMzYuNDk5Nzg2dDM0OCwtNTAuNDk5ODE3cTI0NCwwIDQ1MCw4NS40OTk2OHQzMjYsMjMzLjAwMDM4MXQxMjAsMzIxLjUwMDMzNnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=",
    fullscreen: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik04ODMgMTA1NnEwIDEzLTEwIDIzbC0zMzIgMzMyIDE0NCAxNDRxMTkgMTkgMTkgNDV0LTE5IDQ1LTQ1IDE5aC00NDhxLTI2IDAtNDUtMTl0LTE5LTQ1di00NDhxMC0yNiAxOS00NXQ0NS0xOSA0NSAxOWwxNDQgMTQ0IDMzMi0zMzJxMTAtMTAgMjMtMTB0MjMgMTBsMTE0IDExNHExMCAxMCAxMCAyM3ptNzgxLTg2NHY0NDhxMCAyNi0xOSA0NXQtNDUgMTktNDUtMTlsLTE0NC0xNDQtMzMyIDMzMnEtMTAgMTAtMjMgMTB0LTIzLTEwbC0xMTQtMTE0cS0xMC0xMC0xMC0yM3QxMC0yM2wzMzItMzMyLTE0NC0xNDRxLTE5LTE5LTE5LTQ1dDE5LTQ1IDQ1LTE5aDQ0OHEyNiAwIDQ1IDE5dDE5IDQ1eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==",
    setting:    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMTUyIDg5NnEwLTEwNi03NS0xODF0LTE4MS03NS0xODEgNzUtNzUgMTgxIDc1IDE4MSAxODEgNzUgMTgxLTc1IDc1LTE4MXptNTEyLTEwOXYyMjJxMCAxMi04IDIzdC0yMCAxM2wtMTg1IDI4cS0xOSA1NC0zOSA5MSAzNSA1MCAxMDcgMTM4IDEwIDEyIDEwIDI1dC05IDIzcS0yNyAzNy05OSAxMDh0LTk0IDcxcS0xMiAwLTI2LTlsLTEzOC0xMDhxLTQ0IDIzLTkxIDM4LTE2IDEzNi0yOSAxODYtNyAyOC0zNiAyOGgtMjIycS0xNCAwLTI0LjUtOC41dC0xMS41LTIxLjVsLTI4LTE4NHEtNDktMTYtOTAtMzdsLTE0MSAxMDdxLTEwIDktMjUgOS0xNCAwLTI1LTExLTEyNi0xMTQtMTY1LTE2OC03LTEwLTctMjMgMC0xMiA4LTIzIDE1LTIxIDUxLTY2LjV0NTQtNzAuNXEtMjctNTAtNDEtOTlsLTE4My0yN3EtMTMtMi0yMS0xMi41dC04LTIzLjV2LTIyMnEwLTEyIDgtMjN0MTktMTNsMTg2LTI4cTE0LTQ2IDM5LTkyLTQwLTU3LTEwNy0xMzgtMTAtMTItMTAtMjQgMC0xMCA5LTIzIDI2LTM2IDk4LjUtMTA3LjV0OTQuNS03MS41cTEzIDAgMjYgMTBsMTM4IDEwN3E0NC0yMyA5MS0zOCAxNi0xMzYgMjktMTg2IDctMjggMzYtMjhoMjIycTE0IDAgMjQuNSA4LjV0MTEuNSAyMS41bDI4IDE4NHE0OSAxNiA5MCAzN2wxNDItMTA3cTktOSAyNC05IDEzIDAgMjUgMTAgMTI5IDExOSAxNjUgMTcwIDcgOCA3IDIyIDAgMTItOCAyMy0xNSAyMS01MSA2Ni41dC01NCA3MC41cTI2IDUwIDQxIDk4bDE4MyAyOHExMyAyIDIxIDEyLjV0OCAyMy41eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg=="
};


$v.controller.setBuffer = function(){
    var seekbarWidth = $v.controller.timeSeekbar.getBoundingClientRect().width;
    var buffer = $v.video.buffered;

    if(buffer.length){
        $v.controller.timeSeekbar.style.backgroundPosition = buffer.start(0) / $v.video.duration * seekbarWidth + "px";
        $v.controller.timeSeekbar.style.backgroundSize     = buffer.end(buffer.length-1) / $v.video.duration * seekbarWidth + "px";
    }
};


$v.controller.setTime = function(time, where){
    var min = Math.floor(time / 60);
    var sec = Math.floor(time - min * 60);

    if(min < 10){ min = '0' + min; }
    if(sec < 10){ sec = '0' + sec; }

    where.textContent = min + ":" + sec;
};


$v.controller.setSeeker = function(percent, seeker){
    var seekbar = seeker.parentNode;

    seeker.pos  = seeker.getBoundingClientRect();
    seekbar.pos = seekbar.getBoundingClientRect();
    var seekbarWidth = seekbar.pos.width - seeker.pos.width;

    var pos = (percent <= 1) ? seekbarWidth*percent : percent-seekbar.pos.left; //percentは「割合の時(0-1)」or「クリックされた位置の時」の2パターンある

    if(pos < 0){ pos = 0; }
    if(pos > seekbarWidth){ pos = seekbarWidth; }

    seeker.style.left = pos + "px";
    return pos/seekbarWidth;
};


$v.controller.timeSeeker.mousemoveEvent = function(event, seekend){
    var percent = $v.controller.setSeeker(event.clientX, $v.controller.timeSeeker);
    $v.controller.setTime($v.video.duration*percent, $v.controller.currentTime);
    if(seekend){ $v.video.currentTime = $v.video.duration * percent; }
};


$v.controller.volumeSeeker.mousemoveEvent = function(event){
    $v.video.volume = $v.controller.setSeeker(event.clientX, $v.controller.volumeSeeker);
};


$v.controller.toggle = function(event){
    if($v.controller.timeSeeker.isDragging){ return; }

    if($v.controller.style.visibility == "hidden"){
        event.preventDefault();
        $v.controller.style.visibility = "visible";
    }
    else{
        var controller = $v.controller.getBoundingClientRect();
        if(controller.left <= event.clientX && controller.right >= event.clientX){
            if(controller.top <= event.clientY && controller.bottom >= event.clientY){
                return;
            }
        }
        $v.controller.style.visibility = "hidden";
    }
};


$v.controller.intoScreen = function(){
    $v.screen.appendChild($v.controller);
    var controller = $v.controller.getBoundingClientRect();
    $v.controller.style.top  = screen.height - controller.height + "px";
    $v.controller.style.left = (screen.width/2) - (controller.width/2) + "px";
};


$v.controller.intoPlayer = function(){
    $v.player.appendChild($v.controller);
    $v.controller.style.top  = 0;
    $v.controller.style.left = 0;
    $v.controller.style.visibility = "visible";
};


$v.controller.playButton.addEventListener('click', function(){
    $v.video.paused ? $v.video.play() : $v.video.pause();
});


$v.controller.timeSeek.addEventListener('click', function(event){
    if(!$v.video.duration){ return; }
    var percent = $v.controller.setSeeker(event.clientX, $v.controller.timeSeeker);
    $v.video.currentTime = $v.video.duration * percent;

});


$v.controller.timeSeek.addEventListener('wheel', function(event){
    (event.deltaY < 0) ? $v.video.setTime($v.video.currentTime+10) : $v.video.setTime($v.video.currentTime-10);
});


$v.controller.timeSeeker.addEventListener('mousedown', function(event){
    if(!$v.video.duration){ return; }
    $v.controller.timeSeeker.isDragging = true;
    document.addEventListener('mousemove', $v.controller.timeSeeker.mousemoveEvent);
    document.addEventListener('mouseup', function mouseupEvent(event){
        $v.controller.timeSeeker.mousemoveEvent(event, true);
        document.removeEventListener('mousemove', $v.controller.timeSeeker.mousemoveEvent);
        document.removeEventListener('mouseup',  mouseupEvent);
        $v.controller.timeSeeker.isDragging = false;
    });
});


$v.controller.volumeSeek.addEventListener('click', function(event){
    $v.video.muted = false;
    $v.video.volume = $v.controller.setSeeker(event.clientX, $v.controller.volumeSeeker);
});


$v.controller.volumeSeek.addEventListener('wheel', function(event){
    (event.deltaY < 0) ? $v.video.setVolume($v.video.volume+0.1) : $v.video.setVolume($v.video.volume-0.1);
});


$v.controller.volumeSeeker.addEventListener('mousedown', function(event){
    document.addEventListener('mousemove', $v.controller.volumeSeeker.mousemoveEvent);
    document.addEventListener('mouseup', function mouseupEvent(event){
        document.removeEventListener('mousemove', $v.controller.volumeSeeker.mousemoveEvent);
        document.removeEventListener('mouseup', mouseupEvent);
    });
});


$v.controller.volumeButton.addEventListener('click', function(){
    if($v.video.muted){
        $v.video.muted = false;
        $v.video.volume = 0.5;
    }
    else{
        $v.video.volume = $v.video.volume ? 0 : 0.5;
    }
});


$v.controller.commentButton.addEventListener('click', function(){
    if($v.comment.on){
        $v.comment.on = false;
        $v.comment.clear();
        $v.controller.commentButton.setAttribute("src", $v.controller.parts.commentoff);
    }
    else{
        $v.comment.on = true;
        //var comments = $v.screen.querySelectorAll(".jsplayer-commentnaka");
        $v.controller.commentButton.setAttribute("src", $v.controller.parts.commenton);
    }
});


$v.controller.screenButton.addEventListener('click', function(){
    $v.screen.toggleFullscreen();
});



//■ form
$v.form            = $v.player.querySelector(".jsplayer-form");
$v.form.input      = $v.player.querySelector(".jsplayer-form-input");
$v.form.button     = $v.player.querySelector(".jsplayer-form-button");
$v.form.hiddenId   = $v.player.querySelector(".jsplayer-form-hidden-id");
$v.form.hiddenTime = $v.player.querySelector(".jsplayer-form-hidden-time");


$v.form.addEventListener('submit', function(event){
    event.preventDefault();
    $v.comment.post();
    $v.video.play();
    $v.screen.focus();
});


$v.form.input.addEventListener('focus', function(event){
    $v.video.pause();
});



//■ screen
$v.screen = $v.player.querySelector(".jsplayer-screen");


$v.screen.showOsd = function(str){
    var osd = document.createElement("span");
    osd.textContent = str;
    osd.className   = "jsplayer-screen-osd";
    osd.style.fontSize = $v.comment.fontSize + "px";

    $v.screen.clearOsd();
    $v.screen.appendChild(osd);
    $v.screen.osdTimer = window.setTimeout($v.screen.clearOsd, 1500);
};


$v.screen.clearOsd = function(){
    var osd = $v.screen.querySelectorAll(".jsplayer-screen-osd");
    for(var i = osd.length-1; i >= 0; i--){
        $v.screen.removeChild(osd[i]);
    }
    if($v.screen.osdTimer){ window.clearTimeout($v.screen.osdTimer); }
};


$v.screen.isFullscreen = function(){
    var element = document.fullscreenElement || document.msFullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
    return (element && element.className == $v.screen.className) ? true : false;
};


$v.screen.toggleFullscreen = function(){
    if(!$v.screen.isFullscreen()){
        if     ($v.screen.requestFullscreen)      { $v.screen.requestFullscreen(); }
        else if($v.screen.msRequestFullscreen)    { $v.screen.msRequestFullscreen(); }
        else if($v.screen.webkitRequestFullscreen){ $v.screen.webkitRequestFullscreen(); }
        else if($v.screen.mozRequestFullScreen)   { $v.screen.mozRequestFullScreen(); }
    }
    else{
        if     (document.exitFullscreen)      { document.exitFullscreen(); }
        else if(document.msExitFullscreen)    { document.msExitFullscreen(); }
        else if(document.webkitExitFullscreen){ document.webkitExitFullscreen(); }
        else if(document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
    }
};


$v.screen.fullscreenEvent = function(){
    if($v.screen.isFullscreen()){
        $v.screen.pos = {left:0, top:0, right:screen.width, bottom:screen.height, width:screen.width, height:screen.height}; //IE11で正常に取得できないので手動設定
        $v.screen.addEventListener('click', $v.controller.toggle);
        $v.controller.intoScreen();
    }
    else{
        $v.screen.pos = $v.screen.getBoundingClientRect();
        $v.screen.removeEventListener('click', $v.controller.toggle);
        $v.controller.intoPlayer();
    }
    $v.video.fit();
    $v.comment.setting($v.screen.pos.height);
    $v.comment.clear();
};


document.addEventListener("fullscreenchange",       $v.screen.fullscreenEvent);
document.addEventListener("MSFullscreenChange",     $v.screen.fullscreenEvent);
document.addEventListener("webkitfullscreenchange", $v.screen.fullscreenEvent);
document.addEventListener("mozfullscreenchange",    $v.screen.fullscreenEvent);



//■ function
$v.get = function(url, success, error){
    $v.ajax(url, {method:"GET", success:success, error:error});
};


$v.post = function(url, data, success){
    $v.ajax(url, {method:"POST", data:data, success:success});
};


$v.ajax = function (url, option) { //method, data, timeout, credential, header, success, error, complete
    /*
    option = option || {};
    option.method  = option.method  || "GET";
    option.timeout = option.timeout || 60;

    var body = "";
    var xhr  = new XMLHttpRequest();
    try { xhr.open(option.method, url); } catch (e) { alert('XMLHttpRequest.failed.'); }//Here starts reading the XML File

    if(option.timeout >= 0){ xhr.timeout = option.timeout * 1000; }
    if(option.credential){ xhr.withCredentials = true; }
    if(option.method.match(/^POST$/i)){
        if(option.data instanceof FormData){
            body = option.data;
        }
        else{
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            for(var key in option.data){
                body += encodeURIComponent(key) + "=" + encodeURIComponent(option.data[key]) + "&";
            }
        }
    }
    if(option.header){
        for(var key in option.header){
            xhr.setRequestHeader(key, option.header[key]);
        }
    }
    xhr.addEventListener('loadend', function ()//Here ends reading the XML File
    {
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
            if (option.success) { option.success(xhr); }
        }
        else {
            if(option.error){ option.error(xhr); }
        }
        if (option.complete) { option.complete(xhr); }
    });
    if (option.error) xhr.addEventListener('error', option.error(xhr));

    xhr.send(body);
    */
};


$v.param = function(param){
    var str = "";
    for(var key in param){
        if(!param.hasOwnProperty(key)){ continue; }
        str += encodeURIComponent(key) + "=" + encodeURIComponent(param[key]) + "&";
    }
    return str;
};


$v.deparam = function(str){
    if(str == null){ return {}; }
    str = String(str);
    str = str.replace(/^\?/, "");
    str = str.replace(/#.*/, "");
    var result = {};
    var namevalue = str.split('&');
    for(var i = 0; i < namevalue.length; i++){
        var name  = namevalue[i].split('=')[0] || "";
        var value = namevalue[i].split('=')[1] || "";
        if(name == ""){ continue; }
        result[decodeURIComponent(name)] = decodeURIComponent(value);
    }
    return result;
};


$v.saveObject = function(name, value){
    try{ window.localStorage.setItem(name, JSON.stringify(value)); } catch(e){}
};


$v.loadObject = function(name){
    try{ return JSON.parse(window.localStorage.getItem(name)); } catch(e){}
};


$v.extendObject = function(){
    if(!arguments.length){ return; }
    if(arguments.lenth == 1){ return arguments[0]; }
    var destination = Array.prototype.shift.call(arguments);
    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];
        for(var property in source){
            if(source[property] && source[property].constructor && source[property].constructor === Object){
                destination[property] = destination[property] || {};
                $v.extendObject(destination[property], source[property]);
            }
            else{
                destination[property] = source[property];
            }
        }
    }
    return destination;
};


$v.objectFit = function(screenW, screenH, objectW, objectH){
    var scale = (objectW/objectH > screenW/screenH) ? screenW/objectW : screenH/objectH;
    return {
        w: Math.floor(objectW * scale),
        h: Math.floor(objectH * scale),
        x: Math.floor((screenW / 2) - (objectW * scale / 2)),
        y: Math.floor((screenH / 2) - (objectH * scale / 2)),
    };
};


$v.type = function(target){
    return Object.prototype.toString.call(target).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
};




//■ jsplayer.html特有のコード
$v.comment.HTMLencode ={
    "&quot;":"\u0022",
    "&amp;":"\u0026",
    "&lt;":"\u003c",
    "&gt;":"\u003e",
    "&nbsp;":"\u00a0",
    "&iexcl;":"\u00a1",
    "&cent;":"\u00a2",
    "&pound;":"\u00a3",
    "&curren;":"\u00a4",
    "&yen;":"\u00a5",
    "&brvbar;":"\u00a6",
    "&sect;":"\u00a7",
    "&uml;":"\u00a8",
    "&copy;":"\u00a9",
    "&ordf;":"\u00aa",
    "&laquo;":"\u00ab",
    "&not;":"\u00ac",
    "&shy;":"\u00ad",
    "&reg;":"\u00ae",
    "&macr;":"\u00af",
    "&deg;":"\u00b0",
    "&plusmn;":"\u00b1",
    "&sup2;":"\u00b2",
    "&sup3;":"\u00b3",
    "&acute;":"\u00b4",
    "&micro;":"\u00b5",
    "&para;":"\u00b6",
    "&middot;":"\u00b7",
    "&cedil;":"\u00b8",
    "&sup1;":"\u00b9",
    "&ordm;":"\u00ba",
    "&raquo;":"\u00bb",
    "&frac14;":"\u00bc",
    "&frac12;":"\u00bd",
    "&frac34;":"\u00be",
    "&iquest;":"\u00bf",

    "&apos;":"\'"
}

$v.comment.count = function()
{
    var id1;
    $v.comment.numComment=0;
    for(id1=0;id1!=-1 && (id1=$v.comment.textXML.indexOf("<chat ",id1))!=-1;)
    {
        id1=$v.comment.textXML.indexOf("</chat>",id1);
        $v.comment.numComment++;
    }
    for(id1=0;id1!=-1 && (id1=$v.comment.textXML.indexOf("<d ",id1))!=-1;)
    {
        id1=$v.comment.textXML.indexOf("</d>",id1);
        $v.comment.numComment++;
    }
}

$v.comment.get = function () {
    var i, id1, id2, id3, id4, mail;
    var index, s,sPtr;
    var sec  = Math.floor($v.video.duration);
    $v.comment.list = Array(sec+1); //動画時間+1の箱を作る [[],[],[],[]...]
    for (i = 0; i < $v.comment.list.length; i++) { $v.comment.list[i] = []; }
    var comment_num = Math.floor($v.video.duration / 0.3 * Math.pow(2, document.getElementById("numComment").value));
    var comment_history = $v.comment.numComment>comment_num?Math.floor(($v.comment.numComment - comment_num) * document.getElementById("commentHistory").value):0;
    document.getElementById("displayNumComment").innerHTML=($v.comment.numComment>comment_num?comment_history+"-"+(comment_history+comment_num):$v.comment.numComment)+"/"+$v.comment.numComment;

    var cmStr = $v.comment.textXML;
    var comments = Array(comment_num);
    s=$v.synchr.get();

    i = 0, id1 = 0, id2 = 0, id3 = 0, id4 = 0, mail = "";
    for (;comment_history && (id1 = cmStr.indexOf("<chat ", id1)) != -1; id1++,comment_history--);
    for (; i < comment_num && (id1 = cmStr.indexOf("<chat ", id1)) != -1; i++) {
        comments[i] = {};
        comments[i].font = "MS PGothic";
        comments[i].vpos = 0;
        comments[i].pos = "naka";
        comments[i].color = "white";
        id1 += 5;
        for (; cmStr[id1] != '>' && id1 < cmStr.length; id1++) {
            if (cmStr[id1] != " ") {
                if ((id2 = cmStr.indexOf("=\"", id1)) != -1) {
                    mail = cmStr.substring(id1, id2);
                    id1 = id2 + 2;
                    if((id2=cmStr.indexOf("\"",id1))!=-1)
                    {
                        if(mail=="vpos")
                        {
                            comments[i].vpos=parseInt(cmStr.substring(id1,id2));
                        }
                        if (mail == "mail") {
                            for (id3 = id2; id3 > id1; id3--) {
                                if (cmStr[id3 - 1] != " ") {
                                    for (id4 = id3 - 1; id4 > id1 && cmStr[id4 - 1] != " "; id4--);
                                    mail = cmStr.substring(id4, id3);
                                    if (mail == "ue"
                                        || mail == "shita"
                                        || mail == "naka") {
                                        comments[i].pos = mail;
                                    }
                                    if (mail == "red"
                                        || mail == "blue"
                                        || mail == "yellow"
                                        || mail == "green"
                                        || mail == "orange"
                                        || mail == "cyan"
                                        || mail == "purple"
                                        || mail == "pink"
                                        || mail == "black"
                                        || mail == "white") {
                                        comments[i].color = mail;
                                    }
                                    id3 = id4;
                                }
                            }
                        }
                        id1 = id2;
                    }
                }
            }
        }
        id1 += 1;
        if ((id2 = cmStr.indexOf("</chat>", id1)) != -1) {
            comments[i].content = cmStr.substring(id1, id2);
            comments[i].content = $v.comment.convertHTMLSpecialChar(comments[i].content);
        }
    }

    id1 = 0;
    for (;comment_history && (id1 = cmStr.indexOf("<d ", id1)) != -1; id1++,comment_history--);
    for (; i < comment_num && (id1 = cmStr.indexOf("<d ", id1)) != -1; i++) {
        comments[i] = {};
        comments[i].font = "黑体";
        comments[i].vpos = 0;
        comments[i].pos = "naka";
        comments[i].color = "white";
        id1 += 2;
        for (; cmStr[id1] != '>' && id1 < cmStr.length; id1++) {
            if (cmStr[id1] != " ") {
                if ((id2 = cmStr.indexOf("=\"", id1)) != -1) {
                    mail = cmStr.substring(id1, id2);
                    if (mail === "p")
                    {
                        id1 = id2 + 2;
                        if ((id2 = cmStr.indexOf("\"", id1)) != -1)
                        {
                            mail = cmStr.substring(id1, id2);
                            id3 = 0;
                            if (id3 < mail.length)
                            {
                                id4 = mail.indexOf(",", id3);
                                if (id4 === -1) id4 = mail.length;
                                comments[i].vpos=parseFloat(mail.substring(id3,id4))*100;
                                id3 = id4 + 1;
                                if (id3 < mail.length)
                                {
                                    id4 = mail.indexOf(",", id3);
                                    if (id4 === -1) id4 = mail.length;
                                    if (parseInt(mail.substring(id3, id4)) === 4) comments[i].pos = "shita";
                                    if (parseInt(mail.substring(id3, id4)) === 5) comments[i].pos = "ue";
                                    id3 = id4 + 1;
                                    if (id3 < mail.length)
                                    {
                                        id4 = mail.indexOf(",", id3);
                                        if (id4 === -1) id4 = mail.length;
                                        id3 = id4 + 1;
                                        if (id3 < mail.length)
                                        {
                                            id4 = mail.indexOf(",", id3);
                                            if (id4 === -1) id4 = mail.length;
                                            comments[i].color = "#" + parseInt(mail.substring(id3, id4)).toString(16);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        id1 += 1;
        if ((id2 = cmStr.indexOf("</d>", id1)) != -1) {
            comments[i].content = cmStr.substring(id1, id2);
            comments[i].content = $v.comment.convertHTMLSpecialChar(comments[i].content);
        }
    }
    comments.length = i;

    for (i = comments.length - 1; i >= 0; i--)
    {
        if(comments[i].content==null) { continue; }
        comments[i].vpos/=100;
        for(sPtr=0;sPtr<s.length-1&&comments[i].vpos>s[sPtr+1].time;sPtr++);
        comments[i].vpos=s[sPtr].k*comments[i].vpos+s[sPtr].b;
        index = Math.floor(comments[i].vpos);
        if (index in $v.comment.list) {
            $v.comment.list[index].push({
                "content": comments[i].content.substring(0, 64),
                "font": comments[i].font,
                "vpos": comments[i].vpos,
                "color": comments[i].color,
                "pos": comments[i].pos
            });
        }
    }

    enableInput(true);
    $v.comment.clear();
};

$v.comment.convertHTMLSpecialChar=function(content)
{
    content=content.replace(/&(?:amp;)+/g,"&");
    return content.replace(/&\w+;|&#(\d+);/g,function($0,$1)
    {
        var c=$v.comment.HTMLencode[$0];
        if(c===undefined)
        {
            if(!isNaN($1)) c=String.fromCharCode($1);
            else c=$0;
        }
        return c;
    }
    );
}


$v.comment.post = function () {
    /*
    var sec  = $v.video.currentTime;
    var text = $v.form.input.value.trim();

    if(text == "" || text.length > 64){ return; }

    $v.comment.list[Math.floor(sec+1)].unshift([text, sec+1, Math.floor(Date.now()/1000)]);
    $v.form.input.value = "";

    if (!$document.getElementById("commentFileUrl").value) { return; }

    var postdata = $v.param({
        "mode"    : "comment",
        "id": $document.getElementById("commentFileUrl").value,
        "vpos"    : sec.toFixed(2)*100,
        "comment" : text,
        "adddate" : Math.floor(Date.now()/1000)
    });

    var api = "https://query.yahooapis.com/v1/public/yql?" + $v.param({
        "format"   : "json",
        "env"      : "store://datatables.org/alltableswithkeys",
        "q"        : "SELECT * FROM htmlpost WHERE url = 'http://himado.in/' AND postdata='" + postdata + "' AND xpath='//p'"
    });

    $v.get(api);
    */
};


$v.query = $v.deparam(location.search);
if($v.query.title){ document.title = $v.query.title; }



function onInputFileChangeVideo() {
    //var file = document.getElementById('videoFile').files[0];
    //var url = URL.createObjectURL(file);
    //URL.revokeObjectURL(document.getElementById("videoFileUrl").value);
    //document.getElementById("videoFileUrl").value = url;
    document.getElementById("videoFileUrl").setAttribute("data-mode","file");
}



function onInputFileChangeComment() {
    //var file = document.getElementById('commentFile').files[0];
    //var url = URL.createObjectURL(file);
    //URL.revokeObjectURL(document.getElementById("commentFileUrl").value);
    //document.getElementById("commentFileUrl").value = url;
    document.getElementById("commentFileUrl").setAttribute("data-mode","file");
}

function onClickLoad() {
    enableInput(false);

    if(document.getElementById("videoFileUrl").getAttribute("data-mode")==="file")
    {
        document.getElementById("videoFileUrl").value = URL.createObjectURL(document.getElementById('videoFile').files[0]);
    }
    if(document.getElementById("commentFileUrl").getAttribute("data-mode")==="file")
    {
        document.getElementById("commentFileUrl").value = URL.createObjectURL(document.getElementById('commentFile').files[0]);
    }
    $v.video.src = document.getElementById("videoFileUrl").value;
}

function onChangeNumberComment() {
    if($v.video.duration) $v.comment.get();
}

function onErrorLoadComment()
{
    document.getElementById("displayNumComment").innerHTML="N/A";
    enableInput(true);
}

function enableInput(on_off) {
    if (on_off)
    {
        document.getElementById('loadVideo').removeAttribute("disabled");
        document.getElementById('videoFile').removeAttribute("disabled");
        document.getElementById('commentFile').removeAttribute("disabled");
        document.getElementById('videoFileUrl').removeAttribute("disabled");
        document.getElementById('commentFileUrl').removeAttribute("disabled");
    }
    else
    {
        document.getElementById('loadVideo').disabled = "disabled";
        document.getElementById('videoFile').disabled = "disabled";
        document.getElementById('commentFile').disabled = "disabled";
        document.getElementById('videoFileUrl').disabled = "disabled";
        document.getElementById('commentFileUrl').disabled = "disabled";
    }
}

//Sychronizer
$v.synchr = document.getElementById("synchTable");
$v.synchr.listMax = 8;
$v.synchr.list = Array($v.synchr.listMax);
$v.synchr.listValid = Array($v.synchr.listMax)
$v.synchr.listPtr = $v.synchr.listMax-1;
$v.synchr.reader = new FileReader;

$v.synchr.saver=document.getElementById("synchSaver");

function onAddSynch(data_comment,data_video,ptr)
{
    var newSynch;

    data_video = data_video || undefined;
    data_comment = data_comment || undefined;
    if(ptr === undefined)
    {
        ptr=($v.synchr.listPtr+1)%$v.synchr.listMax;
        for(;ptr!=$v.synchr.listPtr&&$v.synchr.listValid[ptr];ptr=(ptr+1)%$v.synchr.listMax);
    }
    if(!$v.synchr.listValid[ptr])
    {
        $v.synchr.listPtr=ptr;
        $v.synchr.listValid[ptr]=true;
        $v.synchr.list[ptr]={ "video": data_video,"comment": data_comment };
        newSynch=document.createElement("tr");
        newSynch.innerHTML="";
        newSynch.innerHTML+="<td><span>"+data_comment+"</span><button data-id=\""+ptr+"\" onclick=\"onSetSynchComment(this)\">Set</button></td>";
        newSynch.innerHTML+="<td><span>"+data_video+"</span><button data-id=\""+ptr+"\" onclick=\"onSetSynchVideo(this)\">Set</button></td>";
        newSynch.innerHTML+="<td><button data-id=\""+ptr+"\" onclick=\"onRemoveSynch(this)\">Delete</button></th>";
        $v.synchr.appendChild(newSynch);
    }
}

function onRemoveSynch(deleteBotton)
{
    $v.synchr.listValid[deleteBotton.getAttribute("data-id")]=false;
    $v.synchr.removeChild(deleteBotton.parentNode.parentNode);
}

function onSetSynchVideo(applyBotton)
{
    if(!$v.video.duration) return;
    applyBotton.parentNode.firstChild.innerHTML=$v.video.currentTime;
    $v.synchr.list[applyBotton.getAttribute("data-id")].video = $v.video.currentTime;
}

function onSetSynchComment(applyBotton)
{
    if(!$v.video.duration) return;
    applyBotton.parentNode.firstChild.innerHTML=$v.video.currentTime;
    $v.synchr.list[applyBotton.getAttribute("data-id")].comment = $v.video.currentTime;
}

function onShowTextSynch()
{
    var i;
    var sh="";
    sh+="<div id=\"synchSaver\"><textarea rows=\"3\" cols=\"20\">";
    for(i=0;i<$v.synchr.listMax;i++)
    {
        if($v.synchr.listValid[i])
        {
            if(!($v.synchr.list[i].comment === undefined))
            {
                sh+=$v.synchr.list[i].comment;
                if(!($v.synchr.list[i].video === undefined))
                {
                    sh+=","+$v.synchr.list[i].video;
                }
                sh+=";\n";
            }
        }
    }
    sh+="</textarea><button onclick=\"this.parentNode.innerHTML=''\">Close</button>";
    $v.synchr.saver.innerHTML=sh;
}

$v.synchr.reader.onload=function(e)
{
    //this.result
    var i,id1,id2,id3;
    i=0,id1=0;
    $v.synchr.innerHTML="<tr><th>Comment</th><th>Video</th><th><button onclick=\"onAddSynch()\">New</button></th></tr>"
    for(;i<$v.synchr.listMax;)
    {
        id2=this.result.indexOf(",",id1);
        id3=this.result.indexOf(";",id1);
        if(id3===-1) break;
        $v.synchr.listValid[i]=false;
        if(id2===-1 || id3<=id2) onAddSynch(parseFloat(this.result.substring(id1,id3)),undefined,i);
        else onAddSynch(parseFloat(this.result.substring(id1,id2)),parseFloat(this.result.substring(id2+1,id3)),i);
        i++;
        if((id1=this.result.indexOf("\n",id3))===-1) break;
    }
    $v.synchr.listPtr=i;
    for(;i<$v.synchr.listMax;i++) $v.synchr.listValid[i]=false;
}

$v.synchr.get = function()
{
    var i,k,b;
    var s = [];
    var result = [];
    for(i=0;i<$v.synchr.listMax;i++)
    {
        if($v.synchr.listValid[i] && !($v.synchr.list[i].comment===undefined))
        {
            s.push($v.synchr.list[i]);
        }
    }
    if(s.length)
    {
        s.sort(function(x1,x2) { return x1.commment-x2.comment; });
        b=(s.length && !($v.synchr.list[0].video===undefined))?s[0].video-s[0].comment:0.0;
        result.push({"time":0.0,"k":1.0,"b":b});
        for(i=0;i<s.length;i++)
        {
            if(($v.synchr.list[i].video===undefined) && (i+1>=s.length || $v.synchr.list[i+1].video===undefined))
            {
                k=1.0;
                b=0.0;
            }
            else if(!($v.synchr.list[i].video===undefined) && (i+1>=s.length || $v.synchr.list[i+1].video===undefined))
            {
                k=1.0;
                b=s[i].video-s[i].comment;
            }
            else if(($v.synchr.list[i].video===undefined) && !(i+1>=s.length || $v.synchr.list[i+1].video===undefined))
            {
                k=1.0;
                b=s[i+1].video-s[i+1].comment;
            }
            else
            {
                k=s[i+1].comment-s[i].comment>0.01?(s[i+1].video-s[i].video)/(s[i+1].comment-s[i].comment):0;
                b=s[i+1].comment-s[i].comment>0.01?(s[i].video*s[i+1].comment-s[i+1].video*s[i].comment)/(s[i+1].comment-s[i].comment):s[i].video;
            }
            result.push({ "time": s[i].comment,"k": k,"b": b });
        }
    }
    else result.push({"time":0.0,"k":1.0,"b":0.0});

    return result;
}


//■ エントリーポイント
$v.player.entrypoint($v.query.file, 640, 360);
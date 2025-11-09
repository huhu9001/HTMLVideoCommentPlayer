'use strict';
const Player = {
	create(width, height) {
		const w = Widgets.get();
		const p = {
			__proto__:Player.Prototype,
			w:w,
			comments:Comments.create(height),
			syncer:Syncer.create(w.sync.txt.value),
			pref:{volume:Number(window.localStorage.getItem("PREF_VOLUME")) || 1},
			prevSec:undefined,

			blobVideoPlay:null,
			blobVideoSel:null,
			blobCmt:null,
		};
		
		w.video.volume = p.pref.volume;
		Widgets.seek(w.ctrl.volumeSeeker, w.video.volume);
		w.init(width, height, p.comments.fontSize);

		window.addEventListener('unload', function() { p.exit(); });
		
		w.video.addEventListener('loadedmetadata', function () {
			try {
				fetch(w.commentFileUrl.value).then(function(r) {
					if (r.ok) r.text().then(function(xml) {
						p.comments.textXML = xml;
						p.comments.count();
						p.readcmt();
						
						w.eninput();
					});
					else {
						alert(`ERR ${r.status}`);
						w.eninput();
					}
				});
			}
			catch (e) {
				alert(e);
				w.eninput();
			}
		});		
			
		w.video.addEventListener('timeupdate', function() {//When the video arrives where a comment should appear
			const sec = Math.floor(w.video.currentTime);
			if (sec == p.prevSec) return;
			p.prevSec = sec;

			if (!w.timeSeekerDrag) {
				Widgets.seek(w.ctrl.timeSeeker, w.video.currentTime / w.video.duration);
				Widgets.ctrltime(w.ctrl.currentTime, sec);
			}
			if (sec in p.comments.list && !w.video.paused && w.cmtOn) {
				const lane = p.comments.lane;
				lane.naka.fill(true);
				lane.ue.fill(true);
				lane.shita.fill(true);
				
				for(const cmt of w.screen.querySelectorAll(".jsplayer-commentnaka")){
					cmt.pos = cmt.getBoundingClientRect();
					if (cmt.pos.right > w.scrnpos.right - 4)
						lane.naka[cmt.getAttribute("data-lane")] = false;
					if (cmt.pos.right < w.scrnpos.left)
						w.screen.removeChild(cmt);//A comment disappears        
				}
				for (const cmt of w.screen.querySelectorAll(".jsplayer-commentue")) {
					cmt.pos = cmt.getBoundingClientRect();
					lane.ue[cmt.getAttribute("data-lane")] = false;
					if (cmt.getAttribute("timeRemain") === p.comments.timeRemain.toString())
						cmt.style.left = `${cmt.pos.left - cmt.pos.right / 2 - cmt.getAttribute("data-lane") * 20}px`;
					if (cmt.getAttribute("timeRemain") <= 0)
						w.screen.removeChild(cmt);//A comment disappears
					else
						cmt.setAttribute("timeRemain", cmt.getAttribute("timeRemain") - 1);
				}
				for (const cmt of w.screen.querySelectorAll(".jsplayer-commentshita")) {
					cmt.pos = cmt.getBoundingClientRect();
					lane.shita[cmt.getAttribute("data-lane")] = false;
					if (cmt.getAttribute("timeRemain") === p.comments.timeRemain.toString())
						cmt.style.left = `${cmt.pos.left - cmt.pos.right / 2 + cmt.getAttribute("data-lane") * 20}px`;
					if (cmt.getAttribute("timeRemain") <= 0)
						w.screen.removeChild(cmt);//A comment disappears
					else
						cmt.setAttribute("timeRemain", cmt.getAttribute("timeRemain") - 1);
				}
				
				const vdom = document.createDocumentFragment();
				const cmts = p.comments.list[sec];
				for (const cmt of cmts) {
					const lane_proper =
						cmt.pos === "ue" ? lane.ue :
						cmt.pos === "shita" ? lane.shita :
						lane.naka;
					for (const i in lane_proper) {
						if (lane_proper[i]) {
							lane_proper[i] = false;
							const ecmt = p.comments.newcmt(cmt, i, p.w.isfull(), p.w.video.currentTime);
							vdom.appendChild(ecmt);
							break;
						}
					}
				}
				if (cmts.length > 0) w.screen.prepend(vdom);
			}
		});

		w.video.addEventListener('volumechange', function() {
			if (!(w.video.volume == 0 || w.video.muted))
				p.pref.volume = w.video.volume;
		});
		
		//Screen
		function gofs() {
			if (w.isfull()) {
				w.scrnpos = {
					left:0,
					top:0,
					right:screen.width,
					bottom:screen.height,
					width:screen.width,
					height:screen.height,
				}; //IE11で正常に取得できないので手動設定
				w.screen.appendChild(w.controller);
				const cr = w.controller.getBoundingClientRect();
				w.controller.style.top  = `${screen.height - cr.height}px`;
				w.controller.style.left = `${(screen.width/2) - (cr.width/2)}px`;
			}
			else{
				w.scrnpos = w.screen.getBoundingClientRect();
				w.screen.after(w.controller);
				w.controller.style.top  = 0;
				w.controller.style.left = 0;
				w.controller.style.visibility = "visible";
			}
			w.vidfit();
			p.comments.sethgt(w.scrnpos.height);
			w.clrcmt();
		}

		document.addEventListener("fullscreenchange", gofs);
		document.addEventListener("MSFullscreenChange", gofs);
		document.addEventListener("webkitfullscreenchange", gofs);
		document.addEventListener("mozfullscreenchange", gofs);

		//Video
		w.videoFile.addEventListener('change', function() {
			URL.revokeObjectURL(p.blobVideoSel);
			w.videoFileUrl.value =
				p.blobVideoSel = URL.createObjectURL(w.videoFile.files[0]);
		});

		w.commentFile.addEventListener('change', function() {
			URL.revokeObjectURL(p.blobCmt);
			w.commentFileUrl.value =
				p.blobCmt = URL.createObjectURL(w.commentFile.files[0]);
		});

		w.loadVideo.addEventListener('click', function() {
			w.disinput();
			if (p.blobVideoPlay != w.videoFileUrl.value) {
				URL.revokeObjectURL(p.blobVideoPlay);
				if (p.blobVideoSel == w.videoFileUrl.value) {
					p.blobVideoPlay = p.blobVideoSel;
					p.blobVideoSel = null;
				}
				else p.blobVideoPlay = null;
			}
			w.video.src = w.videoFileUrl.value;
		});

		w.numComment.addEventListener('change', function() {
			p.readcmt();
		});
		
		w.commentHistory.addEventListener('change', function() {
			p.readcmt();
		});

		w.sync.apply.addEventListener('click', function() {
			p.syncer = Syncer.create(w.sync.txt.value);
			p.readcmt();
		});
	},
	
	Prototype:{
		exit() {
			window.localStorage.setItem("PREF_VOLUME", this.pref.volume);
		},

		readcmt() {
			if (!this.w.video.duration) return;
			this.w.displayNumComment.innerHTML = this.comments.read(
				Math.floor(this.w.video.duration),
				this.w.numComment.value,
				this.w.commentHistory.value,
				this.syncer);
			this.w.clrcmt();
		},
	},
};

Object.defineProperty(globalThis, "Player", {value:Player});
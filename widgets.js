'use strict';
const Widgets = {
	CLASSNAME_COMMENT:'.jsplayer-commentnaka, .jsplayer-commentue, .jsplayer-commentshita',
	PARTS:{
		play:       "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNTc2IDkyN2wtMTMyOCA3MzhxLTIzIDEzLTM5LjUgM3QtMTYuNS0zNnYtMTQ3MnEwLTI2IDE2LjUtMzZ0MzkuNSAzbDEzMjggNzM4cTIzIDEzIDIzIDMxdC0yMyAzMXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=",
		pause:      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNjY0IDE5MnYxNDA4cTAgMjYtMTkgNDV0LTQ1IDE5aC01MTJxLTI2IDAtNDUtMTl0LTE5LTQ1di0xNDA4cTAtMjYgMTktNDV0NDUtMTloNTEycTI2IDAgNDUgMTl0MTkgNDV6bS04OTYgMHYxNDA4cTAgMjYtMTkgNDV0LTQ1IDE5aC01MTJxLTI2IDAtNDUtMTl0LTE5LTQ1di0xNDA4cTAtMjYgMTktNDV0NDUtMTloNTEycTI2IDAgNDUgMTl0MTkgNDV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
		volume:     "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik04MzIgMzUydjEwODhxMCAyNi0xOSA0NXQtNDUgMTktNDUtMTlsLTMzMy0zMzNoLTI2MnEtMjYgMC00NS0xOXQtMTktNDV2LTM4NHEwLTI2IDE5LTQ1dDQ1LTE5aDI2MmwzMzMtMzMzcTE5LTE5IDQ1LTE5dDQ1IDE5IDE5IDQ1em0zODQgNTQ0cTAgNzYtNDIuNSAxNDEuNXQtMTEyLjUgOTMuNXEtMTAgNS0yNSA1LTI2IDAtNDUtMTguNXQtMTktNDUuNXEwLTIxIDEyLTM1LjV0MjktMjUgMzQtMjMgMjktMzUuNSAxMi01Ny0xMi01Ny0yOS0zNS41LTM0LTIzLTI5LTI1LTEyLTM1LjVxMC0yNyAxOS00NS41dDQ1LTE4LjVxMTUgMCAyNSA1IDcwIDI3IDExMi41IDkzdDQyLjUgMTQyem0yNTYgMHEwIDE1My04NSAyODIuNXQtMjI1IDE4OC41cS0xMyA1LTI1IDUtMjcgMC00Ni0xOXQtMTktNDVxMC0zOSAzOS01OSA1Ni0yOSA3Ni00NCA3NC01NCAxMTUuNS0xMzUuNXQ0MS41LTE3My41LTQxLjUtMTczLjUtMTE1LjUtMTM1LjVxLTIwLTE1LTc2LTQ0LTM5LTIwLTM5LTU5IDAtMjYgMTktNDV0NDUtMTlxMTMgMCAyNiA1IDE0MCA1OSAyMjUgMTg4LjV0ODUgMjgyLjV6bTI1NiAwcTAgMjMwLTEyNyA0MjIuNXQtMzM4IDI4My41cS0xMyA1LTI2IDUtMjYgMC00NS0xOXQtMTktNDVxMC0zNiAzOS01OSA3LTQgMjIuNS0xMC41dDIyLjUtMTAuNXE0Ni0yNSA4Mi01MSAxMjMtOTEgMTkyLTIyN3Q2OS0yODktNjktMjg5LTE5Mi0yMjdxLTM2LTI2LTgyLTUxLTctNC0yMi41LTEwLjV0LTIyLjUtMTAuNXEtMzktMjMtMzktNTkgMC0yNiAxOS00NXQ0NS0xOXExMyAwIDI2IDUgMjExIDkxIDMzOCAyODMuNXQxMjcgNDIyLjV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
		mute:       "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im04MzIsMzQ4bDAsMTA4OHEwLDI2IC0xOSw0NXQtNDUsMTl0LTQ1LC0xOWwtMzMzLC0zMzNsLTI2MiwwcS0yNiwwIC00NSwtMTl0LTE5LC00NWwwLC0zODRxMCwtMjYgMTksLTQ1dDQ1LC0xOWwyNjIsMGwzMzMsLTMzM3ExOSwtMTkgNDUsLTE5dDQ1LDE5dDE5LDQ1eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==",
		commenton:  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im02NDAsNzkycTAsLTUzIC0zNy41LC05MC41dC05MC41LC0zNy41dC05MC41LDM3LjV0LTM3LjUsOTAuNXQzNy41LDkwLjV0OTAuNSwzNy41dDkwLjUsLTM3LjV0MzcuNSwtOTAuNXptMzg0LDBxMCwtNTMgLTM3LjUsLTkwLjV0LTkwLjUsLTM3LjV0LTkwLjUsMzcuNXQtMzcuNSw5MC41dDM3LjUsOTAuNXQ5MC41LDM3LjV0OTAuNSwtMzcuNXQzNy41LC05MC41em0zODQsMHEwLC01MyAtMzcuNSwtOTAuNXQtOTAuNSwtMzcuNXQtOTAuNSwzNy41dC0zNy41LDkwLjV0MzcuNSw5MC41dDkwLjUsMzcuNXQ5MC41LC0zNy41dDM3LjUsLTkwLjV6bTM4NCwwcTAsMTc0IC0xMjAsMzIxLjV0LTMyNiwyMzN0LTQ1MCw4NS41cS0xMTAsMCAtMjExLC0xOHEtMTczLDE3MyAtNDM1LDIyOXEtNTIsMTAgLTg2LDEzcS0xMiwxIC0yMiwtNnQtMTMsLTE4cS00LC0xNSAyMCwtMzdxNSwtNSAyMy41LC0yMS41dDI1LjUsLTIzLjV0MjMuNSwtMjUuNXQyNCwtMzEuNXQyMC41LC0zN3QyMCwtNDh0MTQuNSwtNTcuNXQxMi41LC03Mi41cS0xNDYsLTkwIC0yMjkuNSwtMjE2LjV0LTgzLjUsLTI2OS41cTAsLTE3NCAxMjAsLTMyMS41dDMyNiwtMjMzLjAwMDA3NnQ0NTAsLTg1LjUwMDMydDQ1MCw4NS41MDAzMnQzMjYsMjMzLjAwMDA3NnQxMjAsMzIxLjV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
		commentoff: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0xNzkyLDc5MnEwLDE3NCAtMTIwLDMyMS41dC0zMjYsMjMzdC00NTAsODUuNXEtNzAsMCAtMTQ1LC04cS0xOTgsMTc1IC00NjAsMjQycS00OSwxNCAtMTE0LDIycS0xNywyIC0zMC41LC05dC0xNy41LC0yOWwwLC0xcS0zLC00IC0wLjUsLTEydDIsLTEwdDQuNSwtOS41bDYsLTlsNywtOC41bDgsLTlxNywtOCAzMSwtMzQuNXQzNC41LC0zOHQzMSwtMzkuNXQzMi41LC01MXQyNywtNTl0MjYsLTc2cS0xNTcsLTg5IC0yNDcuNSwtMjIwdC05MC41LC0yODFxMCwtMTMwIDcxLC0yNDguNXQxOTEsLTIwNC41MDA3OTN0Mjg2LC0xMzYuNDk5Nzg2dDM0OCwtNTAuNDk5ODE3cTI0NCwwIDQ1MCw4NS40OTk2OHQzMjYsMjMzLjAwMDM4MXQxMjAsMzIxLjUwMDMzNnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=",
		fullscreen: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik04ODMgMTA1NnEwIDEzLTEwIDIzbC0zMzIgMzMyIDE0NCAxNDRxMTkgMTkgMTkgNDV0LTE5IDQ1LTQ1IDE5aC00NDhxLTI2IDAtNDUtMTl0LTE5LTQ1di00NDhxMC0yNiAxOS00NXQ0NS0xOSA0NSAxOWwxNDQgMTQ0IDMzMi0zMzJxMTAtMTAgMjMtMTB0MjMgMTBsMTE0IDExNHExMCAxMCAxMCAyM3ptNzgxLTg2NHY0NDhxMCAyNi0xOSA0NXQtNDUgMTktNDUtMTlsLTE0NC0xNDQtMzMyIDMzMnEtMTAgMTAtMjMgMTB0LTIzLTEwbC0xMTQtMTE0cS0xMC0xMC0xMC0yM3QxMC0yM2wzMzItMzMyLTE0NC0xNDRxLTE5LTE5LTE5LTQ1dDE5LTQ1IDQ1LTE5aDQ0OHEyNiAwIDQ1IDE5dDE5IDQ1eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==",
		setting:    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc5MiIgaGVpZ2h0PSIxNzkyIiB2aWV3Qm94PSIwIDAgMTc5MiAxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMTUyIDg5NnEwLTEwNi03NS0xODF0LTE4MS03NS0xODEgNzUtNzUgMTgxIDc1IDE4MSAxODEgNzUgMTgxLTc1IDc1LTE4MXptNTEyLTEwOXYyMjJxMCAxMi04IDIzdC0yMCAxM2wtMTg1IDI4cS0xOSA1NC0zOSA5MSAzNSA1MCAxMDcgMTM4IDEwIDEyIDEwIDI1dC05IDIzcS0yNyAzNy05OSAxMDh0LTk0IDcxcS0xMiAwLTI2LTlsLTEzOC0xMDhxLTQ0IDIzLTkxIDM4LTE2IDEzNi0yOSAxODYtNyAyOC0zNiAyOGgtMjIycS0xNCAwLTI0LjUtOC41dC0xMS41LTIxLjVsLTI4LTE4NHEtNDktMTYtOTAtMzdsLTE0MSAxMDdxLTEwIDktMjUgOS0xNCAwLTI1LTExLTEyNi0xMTQtMTY1LTE2OC03LTEwLTctMjMgMC0xMiA4LTIzIDE1LTIxIDUxLTY2LjV0NTQtNzAuNXEtMjctNTAtNDEtOTlsLTE4My0yN3EtMTMtMi0yMS0xMi41dC04LTIzLjV2LTIyMnEwLTEyIDgtMjN0MTktMTNsMTg2LTI4cTE0LTQ2IDM5LTkyLTQwLTU3LTEwNy0xMzgtMTAtMTItMTAtMjQgMC0xMCA5LTIzIDI2LTM2IDk4LjUtMTA3LjV0OTQuNS03MS41cTEzIDAgMjYgMTBsMTM4IDEwN3E0NC0yMyA5MS0zOCAxNi0xMzYgMjktMTg2IDctMjggMzYtMjhoMjIycTE0IDAgMjQuNSA4LjV0MTEuNSAyMS41bDI4IDE4NHE0OSAxNiA5MCAzN2wxNDItMTA3cTktOSAyNC05IDEzIDAgMjUgMTAgMTI5IDExOSAxNjUgMTcwIDcgOCA3IDIyIDAgMTItOCAyMy0xNSAyMS01MSA2Ni41dC01NCA3MC41cTI2IDUwIDQxIDk4bDE4MyAyOHExMyAyIDIxIDEyLjV0OCAyMy41eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg=="
	},

	get() {
		const player = document.getElementById("jsplayer");
		return {
			__proto__:Widgets.Prototype,
			player:player,
			video:player.querySelector(".jsplayer-video"),
			screen:player.querySelector(".jsplayer-screen"),
			controller:player.querySelector(".jsplayer-controller"),
			ctrl:{
				timeSeek:player.querySelector(".jsplayer-controller-time-seek"),
				timeSeekbar:player.querySelector(".jsplayer-controller-time-seekbar"),
				timeSeeker:player.querySelector(".jsplayer-controller-time-seeker"),
				volumeSeek:player.querySelector(".jsplayer-controller-volume-seek"),
				volumeSeekbar:player.querySelector(".jsplayer-controller-volume-seekbar"),
				volumeSeeker:player.querySelector(".jsplayer-controller-volume-seeker"),
				currentTime:player.querySelector(".jsplayer-controller-current-time"),
				totalTime:player.querySelector(".jsplayer-controller-total-time"),
				playButton:player.querySelector(".jsplayer-controller-play-button"),
				volumeButton:player.querySelector(".jsplayer-controller-volume-button"),
				commentButton:player.querySelector(".jsplayer-controller-comment-button"),
				screenButton:player.querySelector(".jsplayer-controller-screen-button"),
			},
			form:player.querySelector(".jsplayer-form"),
			f:{
				input:player.querySelector(".jsplayer-form-input"),
				button:player.querySelector(".jsplayer-form-button"),
				hiddenId:player.querySelector(".jsplayer-form-hidden-id"),
				hiddenTime:player.querySelector(".jsplayer-form-hidden-time"),
			},
			loadVideo:document.getElementById('loadVideo'),
			videoFile:document.getElementById('videoFile'),
			commentFile:document.getElementById('commentFile'),
			videoFileUrl:document.getElementById('videoFileUrl'),
			commentFileUrl:document.getElementById('commentFileUrl'),
			
			numComment:document.getElementById("numComment"),
			commentHistory:document.getElementById("commentHistory"),
			displayNumComment:document.getElementById("displayNumComment"),
			
			sync:{
				apply:document.getElementById("applySync"),
				save:document.getElementById("saveSync"),
				link:document.getElementById("saveSyncLink"),
				file:document.getElementById("syncFile"),
				txt:document.getElementById("syncTxt"),
			},

			fontSize:undefined,
			osdTimer:undefined,
			timeSeekerDrag:false,
			cmtOn:true,
			scrnpos:undefined,
		};
	},
	
	Prototype:{
		init(width, height, fontSize) {
			this.screen.style.width = `${width}px`;
			this.screen.style.height = `${height}px`;
			this.controller.style.width = `${width}px`;
			this.fontSize = fontSize;
			
			document.body.style.setProperty('--screen-width', `-${width * 5}px`);
			document.body.style.setProperty('--fullscreen-width', `-${screen.width * 5}px`);
			
			this.player.style.visibility = "visible";
			this.scrnpos = this.screen.getBoundingClientRect();
			this.eninput();

			const w = this;
			
			w.player.addEventListener('keydown', function(event) {
				w.controller.style.visibility = "visible";
				if (event.target.tagName.match("input|textarea")) return true;
				
				switch (event.which) {
				default: return true;
				case 13: //Enter
					if (event.ctrlKey) w.fullscreen();
					else w.video.paused ? w.video.play() : w.video.pause();
					break;
				case 39: //Right arrow
					w.time(w.video.currentTime + (event.ctrlKey || event.shiftKey ? 30: 10));
					break;
				case 37: //Left arrow
					w.time(w.video.currentTime - (event.ctrlKey || event.shiftKey ? 30: 10));
					break;
				case 36: //Home
					w.time(0);
					break;
				case 35: //End
					w.time(w.video.duration - 10);
					break;
				case 38: //Up arrow
					w.volume(this.video.volume + 0.1);
					break;
				case 40: //Down arrow
					w.volume(this.video.volume - 0.1);
					break;
				case 187: //+
					if (!event.shiftKey) break;
				case 107: //Num+
					w.speed(this.video.playbackRate + 0.1);
					break;
				case 189: //-
					if (!event.shiftKey) break;
				case 109: //Num-
					w.speed(this.video.playbackRate - 0.1);
					break;
				}
				
				event.preventDefault();
			});
			
			w.video.addEventListener('loadedmetadata', function(event) {
				w.setbuf()
				
				Widgets.ctrltime(w.ctrl.totalTime, w.video.duration);
				
				w.f.input.disabled = false;
				w.f.button.disabled = false;
				
				w.vidfit();
				w.video.focus();
			});
			
			w.video.addEventListener('canplaythrough', function() {
				w.video.play();
			});

			w.video.addEventListener('play', function() {
				for (const cmt of w.screen.querySelectorAll(Widgets.CLASSNAME_COMMENT))
					cmt.style.animationPlayState = "running";
				w.ctrl.playButton.setAttribute("src", Widgets.PARTS.pause);
			});

			w.video.addEventListener('pause', function() {
				for (const cmt of w.screen.querySelectorAll(Widgets.CLASSNAME_COMMENT))
					cmt.style.animationPlayState = "paused";
				w.ctrl.playButton.setAttribute("src", Widgets.PARTS.play);
			});

			w.video.addEventListener('progress', function() {
				w.setbuf();
			});

			w.video.addEventListener('seeking', function() {
				w.clrcmt();
			});

			w.video.addEventListener('volumechange', function() {
				if (w.video.volume == 0 || w.video.muted) {
					w.ctrl.volumeButton.setAttribute("src", Widgets.PARTS.mute);
					Widgets.seek(w.ctrl.volumeSeeker, 0);
				}
				else {
					w.ctrl.volumeButton.setAttribute("src", Widgets.PARTS.volume);
					Widgets.seek(w.ctrl.volumeSeeker, w.video.volume);
				}
			});

			w.video.addEventListener('ratechange', function() {
				w.osd(`x${w.video.playbackRate.toFixed(1)}`);
			});

			w.video.addEventListener('click', function(event) {
				if (w.video.currentTime) w.video.play();
				event.preventDefault();
			});


			w.video.addEventListener('dblclick', function(event) {
				event.preventDefault();
			});

			w.video.addEventListener('error', function(event) {
				const error = event.target.error;

				switch (error.code) { // http://www.html5.jp/tag/elements/video.html
					case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
						alert("MEDIA_ERR_SRC_NOT_SUPPORTED");
						break;
					case error.MEDIA_ERR_DECODE:
						alert("MEDIA_ERR_DECODE");
						break;
					case error.MEDIA_ERR_NETWORK:
						alert("MEDIA_ERR_NETWORK");
						break;
					case error.MEDIA_ERR_ABORTED:
						//alert("動画の再生が中止されました");
						break;
					default:
						alert(`ERR ${error.code}`);
						break;
				}
				
				w.displayNumComment.textContent = "N/A";
				w.eninput();
			});

			//Controllers

			w.ctrl.playButton.addEventListener('click', function() {
				w.video.paused ? w.video.play() : w.video.pause();
			});

			w.ctrl.timeSeek.addEventListener('click', function(event) {
				if (!w.video.duration) return;
				const percent = Widgets.seek(w.ctrl.timeSeeker, event.clientX);
				w.video.currentTime = w.video.duration * percent;
			});

			w.ctrl.timeSeek.addEventListener('wheel', function(event){
				w.time(w.video.currentTime + (event.deltaY < 0 ? 10 : -10));
			});

			w.ctrl.timeSeeker.addEventListener('mousedown', function() {
				if (!w.video.duration) return;
				w.timeSeekerDrag = true;

				function tsmove(event, seekend) {
					const percent = Widgets.seek(w.ctrl.timeSeeker, event.clientX);
					Widgets.ctrltime(w.ctrl.currentTime, w.video.duration * percent);
					if (seekend) w.video.currentTime = w.video.duration * percent;
				}

				document.addEventListener('mousemove', tsmove);
				document.addEventListener('mouseup', function tsup(event) {
					tsmove(event, true);
					document.removeEventListener('mousemove', tsmove);
					document.removeEventListener('mouseup', tsup);
					w.timeSeekerDrag = false;
				});
			});

			w.ctrl.volumeSeek.addEventListener('click', function(event) {
				w.video.muted = false;
				w.video.volume = Widgets.seek(w.ctrl.volumeSeeker, event.clientX);
			});

			w.ctrl.volumeSeek.addEventListener('wheel', function(event) {
				w.volume(w.video.volume + (event.deltaY < 0 ? 0.1 : -0.1));
			});

			w.ctrl.volumeSeeker.addEventListener('mousedown', function() {
				function vsmove(event) {
					w.video.volume = Widgets.seek(w.ctrl.volumeSeeker, event.clientX);
				}

				document.addEventListener('mousemove', vsmove);
				document.addEventListener('mouseup', function vsup() {
					document.removeEventListener('mousemove', vsmove);
					document.removeEventListener('mouseup', vsup);
				});
			});

			w.ctrl.volumeButton.addEventListener('click', function() {
				if (w.video.muted) {
					w.video.muted = false;
					w.video.volume = 0.5;
				}
				else w.video.volume = w.video.volume ? 0 : 0.5;
			});

			w.ctrl.commentButton.addEventListener('click', function(){
				if(w.cmtOn) {
					w.cmtOn = false;
					w.clrcmt();
					w.ctrl.commentButton.setAttribute("src", Widgets.PARTS.commentoff);
				}
				else{
					w.cmtOn = true;
					w.ctrl.commentButton.setAttribute("src", Widgets.PARTS.commenton);
				}
			});

			w.ctrl.screenButton.addEventListener('click', function() {
				w.fullscreen();
			});
			
			//Screen		
			w.screen.addEventListener('click', function(event) {
				if (!w.isfull()) return;
				if (w.timeSeekerDrag) return;
				if (w.controller.style.visibility == "hidden") {
					event.preventDefault();
					w.controller.style.visibility = "visible";
				}
				else {
					const cr = w.controller.getBoundingClientRect();
					if (cr.left <= event.clientX
						&& cr.right >= event.clientX
						&& cr.top <= event.clientY
						&& cr.bottom >= event.clientY) return;
					w.controller.style.visibility = "hidden";
				}
			});
			
			//Syncer
			w.sync.save.addEventListener('click', function() {
				URL.revokeObjectURL(w.sync.link.href);
				w.sync.link.href = URL.createObjectURL(new Blob([w.sync.txt.value]));
				w.sync.link.click();
			});
			
			w.sync.file.addEventListener('change', function() {
				const reader = new FileReader;
				reader.onload = function(event) {
					w.sync.txt.value = event.target.result;
				};
				reader.readAsText(w.sync.file.files[0]);
			});
		},
		
		isfull() {
			return (document.fullscreenElement
				?? document.msFullscreenElement
				?? document.webkitFullscreenElement
				?? document.mozFullScreenElement)?.className == this.screen.className;
		},

		fullscreen() {
			if (this.isfull()) (document.exitFullscreen
				?? document.msExitFullscreen
				?? document.webkitExitFullscreen
				?? document.mozCancelFullScreen)?.call(document);
			else (this.screen.requestFullscreen
				?? this.screen.msRequestFullscreen
				?? this.screen.webkitRequestFullscreen
				?? this.screen.mozRequestFullScreen)?.call(this.screen);
		},
		
		eninput() {
			this.loadVideo.removeAttribute("disabled");
			this.videoFile.removeAttribute("disabled");
			this.commentFile.removeAttribute("disabled");
			this.videoFileUrl.removeAttribute("disabled");
			this.commentFileUrl.removeAttribute("disabled");
		},
		
		disinput() {
			this.loadVideo.disabled = "disabled";
			this.videoFile.disabled = "disabled";
			this.commentFile.disabled = "disabled";
			this.videoFileUrl.disabled = "disabled";
			this.commentFileUrl.disabled = "disabled";
			this.displayNumComment.textContent = "N/A";
		},
		
		time(sec) {
			const dur = this.video.duration;
			if (!dur) return;
			this.video.currentTime =
				sec < 1 ? 0 : sec > dur ? dur : sec;
		},
		
		volume(volume) {
			const v = volume.toFixed(1);
			this.video.volume = v >= 1 ? 1 : v <= 0 ? 0 : v;
			this.video.muted = false;
		},
		
		speed(speed) {
			if (!this.video.duration) return;
			const s = speed.toFixed(1);
			this.video.playbackRate = s >= 2 ? 2 : s <= 0.5 ? 0.5 : s;
		},
		
		vidfit() {
			const ws = this.scrnpos.width;
			const wv = this.video.videoWidth;
			if (!ws || !wv) return;
			const hs = this.scrnpos.height;
			const hv = this.video.videoHeight;
			
			const[w, h] =
				wv / hv > ws / hs ? [ws, hv / wv * ws] : [wv / hv * hs, hs];
			
			this.video.style.width = `${Math.floor(w)}px`;
			this.video.style.height = `${Math.floor(h)}px`;
			this.video.style.left = `${Math.floor((ws - w) / 2)}px`;
			this.video.style.top = `${Math.floor((hs - h) / 2)}px`;
		},
		
		clrcmt() {
			for (const cmt of this.screen.querySelectorAll(Widgets.CLASSNAME_COMMENT)) {
				cmt.style.opacity = 0; //firefox：フルスクリーン時に画面最上部のコメントが消えないことがある対策
				this.screen.removeChild(cmt);
			}
		},

		setbuf() {
			const buffer = this.video.buffered;				
			if (buffer.length) {
				const bar = this.ctrl.timeSeekbar;
				const dur = this.video.duration;
				const width = bar.getBoundingClientRect().width;
				bar.style.backgroundPosition = `${buffer.start(0) / dur * width}px`;
				bar.style.backgroundSize = `${buffer.end(buffer.length - 1) / dur * width}px`;
			}
		},
		
		osd(str) {
			const osd = document.createElement("span");
			osd.textContent = str;
			osd.className   = "jsplayer-screen-osd";
			osd.style.fontSize = `${this.fontSize}px`;

			const w = this;
			function clear() {
				window.clearTimeout(w.osdTimer);
				for(const o of w.screen.querySelectorAll(".jsplayer-screen-osd"))
					w.screen.removeChild(o);
			}

			clear();
			this.screen.appendChild(osd);
			this.osdTimer = window.setTimeout(clear, 1500);
		},
	},
	
	seek(seeker, percent) {
		const seekbar = seeker.parentNode;

		const seekerpos  = seeker.getBoundingClientRect();
		const seekbarpos = seekbar.getBoundingClientRect();
		const seekbarWidth = seekbarpos.width - seekerpos.width;

		let pos = (percent <= 1) ? seekbarWidth * percent : percent - seekbarpos.left;
		//percentは「割合の時(0-1)」or「クリックされた位置の時」の2パターンある

		if (pos < 0) pos = 0;
		else if (pos > seekbarWidth) pos = seekbarWidth;

		seeker.style.left = `${pos}px`;
		return pos / seekbarWidth;
	},
	
	
	ctrltime(where, time) {
		const min = Math.floor(time / 60);
		const sec = Math.floor(time - min * 60);
		where.textContent = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
	},
};

Object.defineProperty(globalThis, "Widgets", {value:Widgets});
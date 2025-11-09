'use strict';
const Comments = {
	create(height) {
		const c = {
			__proto__:Comments.Prototype,
			textXML:undefined,
			numComment:0,
			list:[],
			lane:undefined,
			
			timeRemain:3,
			laneCount:undefined,
			laneHeight:undefined,
			fontSize:undefined,
			marginTop:undefined,
		};
		c.sethgt(height);
		return c;
	},
	
	Prototype:{
		sethgt(height) {
			if (height >= 360) {
				this.laneCount  = Math.floor((height - 360) / 180) + 10;
				this.laneHeight = height / this.laneCount * 0.8;
				this.fontSize   = this.laneHeight / 6 * 5; //22.5px以上必要
				this.marginTop  = this.laneHeight / 6;
			}
			else{
				this.laneCount  = Math.floor(height * 0.8 / 30);
				this.laneHeight = 30;
				this.fontSize   = 25;
				this.marginTop  = 5;
			}
			this.lane = {
				naka:Array(this.laneCount),
				ue:Array(this.laneCount),
				shita:Array(this.laneCount),
			};
		},

		count() {
			let n = 0;
			for (let i = 0; (i = this.textXML.indexOf("<chat ", i)) != -1;) {
				i = this.textXML.indexOf("</chat>", i);
				if (i == -1) break;
				n += 1;
			}
			for (let i = 0; (i = this.textXML.indexOf("<d ", i)) != -1;) {
				i = this.textXML.indexOf("</d>", i);
				if (i == -1) break;
				n += 1;
			}
			for (let i = -1; (i = this.textXML.indexOf('"vposMs"', i + 1)) != -1;)
				n += 1;
			this.numComment = n;
		},
		
		read(sec, valnum, valhist, syncer) {
			this.list = Array(sec + 1); //動画時間+1の箱を作る [[],[],[],[]...]
			for (let i = sec; i >= 0; --i) this.list[i] = [];
			
			const num = Math.floor(sec / 0.3 * Math.pow(2, valnum));
			const hist = this.numComment > num ? Math.floor((this.numComment - num) * valhist) : 0;

			const comments = Array(num);
			const txt = this.textXML;
			let len = 0;
			len = Comments.nicoXML(comments, len, txt, num, hist);
			len = Comments.biliXML(comments, len, txt, num, hist);
			len = Comments.nicoJSON(comments, len, txt, num, hist);

			for (let i = len - 1; i >= 0; --i) {
				const cmt = comments[i];
				if (!cmt.content) continue;
				
				cmt.content = cmt.content.substring(0, 64);
				cmt.vpos /= 100;
				
				cmt.vpos = syncer.adjust(cmt.vpos);
				
				const t = Math.floor(cmt.vpos);
				if (t in this.list) this.list[t].push(cmt);
			}
			
			return `${this.numComment > num ? `${hist}-${hist + num}` : `${this.numComment}`}/${this.numComment}`;
		},
		
		newcmt(data, n, isfull, time) {
			const cmt = document.createElement("span");
			cmt.textContent = data.content;
			cmt.className = `jsplayer-comment${data.pos}`;
			cmt.setAttribute("data-lane", n);
			cmt.style.fontFamily = `${data.font}, Meiryo, sans-serif`;
			cmt.style.color = data.color;

			cmt.style.top = `${
				(data.pos === "shita" ? this.laneCount - n : n)
					* this.laneHeight
					+ this.marginTop
			}px`;
			cmt.style.fontSize = `${this.fontSize}px`;
			if (data.pos === "naka")
				cmt.style.animationName =
					`jsplayer${isfull ? "full" : "normal"}lane`;
			else {
				cmt.style.animationName = "none";
				cmt.setAttribute("timeRemain", this.timeRemain);
			}

			const delay = data.vpos - time;
			cmt.style.animationDelay =
				`${delay <= 0 ? 0 : delay.toFixed(3) * 1000}ms`;
				
			cmt.onclick = Comments.clickcmt;

			return cmt;
		},
	},
	
	clickcmt(event) {
		navigator.clipboard.writeText(event.target.textContent);
	},
	
	hamp(content) {
		return content.replace(/&(?:amp;)+/g,"&").replace(/&\w+;|&#(\d+);/g, function(m0, m1) {
			let n;
			return ({
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

				"&apos;":"\'",
			})[m0] ?? ((m1 = parseInt(m1)) && String.fromCharCode(m1)) ?? m0;
		});
	},
	
	nicoXML(cmts, len, txt, num, hist) {
		let i1 = 0;
		for (let j = hist; j > 0 && (i1 = txt.indexOf("<chat ", i1)) != -1; --j, i1 += 1);
		for (; len < num && (i1 = txt.indexOf("<chat ", i1)) != -1; ++len) {
			const cmt = {
				font:"MS PGothic",
				vpos:0,
				pos:"naka",
				color:"white",
				content:undefined,
			};
			for (i1 += 5; txt[i1] != '>' && i1 < txt.length; ++i1) {
				if (txt[i1] != " ") {
					let i2 = txt.indexOf("=\"", i1);
					if (i2 != -1) {
						const mail = txt.substring(i1, i2);
						i1 = i2 + 2;
						i2 = txt.indexOf("\"", i1);
						if (i2 != -1) {
							if (mail == "vpos") {
								cmt.vpos = parseInt(txt.substring(i1, i2));
							}
							else if (mail == "mail") {
								for (let i3 = i2; i3 > i1; --i3) {
									if (txt[i3 - 1] != " ") {
										let i4;
										for (i4 = i3 - 1; i4 > i1 && txt[i4 - 1] != " "; --i4);
										const mail = txt.substring(i4, i3);
										switch (mail) {
										case "ue":
										case "shita":
										case "naka":
											cmt.pos = mail;
											break;
										case "red":
										case "blue":
										case "yellow":
										case "green":
										case "orange":
										case "cyan":
										case "purple":
										case "pink":
										case "black":
										case "white":
											cmt.color = mail;
											break;
										default: break;
										}
										i3 = i4;
									}
								}
							}
							i1 = i2;
						}
					}
				}
			}
			i1 += 1;
			const i2 = txt.indexOf("</chat>", i1);
			if (i2 != -1) cmt.content = Comments.hamp(txt.substring(i1, i2));
			cmts[len] = cmt;
		}
		
		return len;
	},
	
	biliXML(cmts, len, txt, num, hist) {
		let i1 = 0;
		for (let j = hist; j > 0 && (i1 = txt.indexOf("<d ", i1)) != -1; --j, i1 += 1);
		for (; len < num && (i1 = txt.indexOf("<d ", i1)) != -1; ++len) {
			const cmt = {
				font:"黑体",
				vpos:0,
				pos:"naka",
				color:"white",
				content:undefined,
			};
			for (i1 += 2; txt[i1] != '>' && i1 < txt.length; ++i1) {
				if (txt[i1] != " ") {
					let i2 = txt.indexOf("=\"", i1);
					if (i2 != -1) {
						const mail = txt.substring(i1, i2);
						if (mail === "p") {
							i1 = i2 + 2;
							i2 = txt.indexOf("\"", i1);
							if (i2 != -1) {
								const mail = txt.substring(i1, i2);
								if (mail.length > 0) {
									let i4 = mail.indexOf(",", 0);
									if (i4 == -1) i4 = mail.length;
									cmt.vpos = parseFloat(mail.substring(0, i4)) * 100;
									let i3 = i4 + 1;
									if (i3 < mail.length) {
										let i4 = mail.indexOf(",", i3);
										if (i4 == -1) i4 = mail.length;
										switch (parseInt(mail.substring(i3, i4))) {
										default: break;
										case 4: cmt.pos = "shita"; break;
										case 5: cmt.pos = "ue"; break;
										}
										i3 = i4 + 1;
										if (i3 < mail.length) {
											let i4 = mail.indexOf(",", i3);
											if (i4 == -1) i4 = mail.length;
											i3 = i4 + 1;
											if (i3 < mail.length) {
												let i4 = mail.indexOf(",", i3);
												if (i4 == -1) i4 = mail.length;
												let c = parseInt(mail.substring(i3, i4)).toString(16);
												if (c.length < 6) c = `${'0'.repeat(6 - c.length)}${c}`;
												cmt.color = `#${c}`;
											}
										}
									}
								}
							}
						}
					}
				}
			}
			i1 += 1;
			const i2 = txt.indexOf("</d>", i1);
			if (i2 != -1) cmt.content = Comments.hamp(txt.substring(i1, i2));
			cmts[len] = cmt;
		}
		
		return len;
	},
	
	nicoJSON(cmts, len, txt, num, hist) {
		for (const[_, vpos, c, cmd] of txt.matchAll('"vposMs":(\\d+),"body":"(.+?)","commands":\\[(.+?)\\]')) {
			if (len >= num) break;
			if (hist > 0) {
				hist -= 1;
				continue;
			}
			const cmt = {
				font:"MS PGothic",
				vpos:parseInt(vpos) / 10,
				pos:cmd.match('"(ue|shita|naka)"')?.at(1) ?? 'naka',
				color:cmd.match('"(red|blue|yellow|green|orange|cyan|purple|pink|black|white)"')?.at(1) ?? 'white',
				content:c,
			};
			cmts[len] = cmt;
			len += 1;
		}
		return len;
	},
};

Object.defineProperty(globalThis, "Comments", {value:Comments});
'use strict';
const Syncer = {
	create(txt) {
		const dataraw = [];
		for (const item of txt.split(';')) {
			const[tv, tc] = item.match('^(.*),(.*)$')?.slice(1)?.map(parseFloat) ??
				[parseFloat(item), NaN];
			if (tv) dataraw.push({tv:tv, tc:tc});
		}
		dataraw.sort(function(a, b) { return a.tv - b.tv; });
				
		const data = [];
		let last = {tv:0, tc:NaN};
		let lastdata = {k:0, b:0, until:0};
		for (const next of dataraw) {
			if (last.tc) {
				if (next.tc) {
					if (next.tc == last.tc) continue;
					const k = (next.tv - last.tv) / (next.tc - last.tc);
					const b = next.tv - k * next.tc;
					lastdata.until = last.tv;
					data.push(lastdata = {k:k, b:b, until:Infinity});
				}
				else {
					lastdata.until = next.tv;
				}
			}
			else {
				if (next.tc) {
					data.push(lastdata = {k:1, b:next.tv - next.tc, until:Infinity});
				}
				else {
					data.push(lastdata = {k:1, b:0, until:next.tv});
				}
			}
			last = next;
		}
        return {
            __proto__:Syncer.Prototype,
			data:data,
        };
    },

    Prototype:{
        adjust(vpos) {
			for (const item of this.data) {
				if (vpos < item.until) {
					return vpos * item.k + item.b;
				}
			}
            return vpos;
        },
    },
};

Object.defineProperty(globalThis, "Syncer", {value:Syncer});
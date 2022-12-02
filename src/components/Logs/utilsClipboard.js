// GET CLIPBOARD LOGS
export const clStatus = (txt = '') => {
    let str = txt.toLowerCase();
    if (str.length <= 8) {
        if (str.includes('DR_IND_PC') || str.includes('DR_IND_PC')) return 'DR_IND_PC';
        if (str.includes('DR_IND_YM') || str.includes('DR_IND_YM')) return 'DR_IND_YM';
        if (str.includes('DS_OFF')) return 'DS_OFF';
        if (str.includes('DS_SB') || str.includes('sb')) return 'DS_SB';
        if (str.includes('DS_D') || str.includes('dr')) return 'DS_D';
        if (str.includes('DS_ON') && !str.includes('power')) return 'DS_ON';
    }
    return null
}

export const clStart = (txt) => {
    let val = txt.toUpperCase();
    let h, m, s, t;
    if (val.includes('AM')) {
        t = 'AM'
    }
    if (val.includes('PM')) {
        t = 'PM'
    }
    [h, m, s] = val.split(':').map(el => {
        let time = el.trim().match(/\d/g);
        if (time) {
            time = time.join("")
        }
        return time;
    });
    h = +h;
    m = +m;
    s = +s;
    if ((h > 0 || h <= 12) && (m >= 0 && m <= 59) && (s >= 0 && s <= 59)) {
        if (t === 'PM' && h !== 12) {
            h += 12
        }
        if (t === 'AM' && h === 12) {
            h = 0
        }

        return h * 3600 + m * 60 + s;
    }
    return null
};

export const clEnd = (start, txt) => {
    let val = txt.toLowerCase();
    let h, m, s, rest;

    if (val.includes('h')) {
        [h, rest] = val.split('h');
        h = h.match(/\d/g);
        if (h) {
            h = h.join("")
        };
        val = rest;
    }
    if (val.includes('m')) {
        [m, rest] = val.split('m');
        m = m.match(/\d/g);
        if (m) {
            m = m.join("")
        };
        val = rest;
    }
    if (val.includes('s')) {
        [s, rest] = val.split('s');
        s = s.match(/\d/g);
        if (s) {
            s = s.join("")
        };
    }

    h = h ? +h : 0;
    m = m ? +m : 0;
    s = s ? +s : 0

    return start + (h * 3600 + m * 60 + s);
}
'use strict';

const IGArchive = (function () {
    const MAGIC = [73, 71, 65, 48, -1, -1, -1, -1, 2, 0, 0, 0, 2, 0, 0, 0];
    function igEncode(buffer, value) {
        if (value < 0) throw new Error('negative value');
        const result = [];
        do result.push((value & 0x7f) << 1), value >>= 7; while (value > 0);
        result[0] |= 1;
        result.reverse();
        buffer.push(...result);
        return buffer;
    }
    function igEncodeMany(buffer, values) {
        values.forEach(v => igEncode(buffer, v));
    }
    function igTransformData(data, xor) {
        return data.map((b, i) => (b ^ (i + 2) ^ xor) & 0xff);
    }
    function igaCreate(files, nameEncoder) {
        const descs = [];
        const names = [];
        const datas = [];
        let fnBeg = 0, dataOffset = 0;
        for (let [name, data] of files) {
            data = igTransformData(data, name.endsWith('.s') ? 0xFF : 0x00);
            name = nameEncoder.encode(name);
            igEncode(descs, fnBeg);
            igEncode(descs, dataOffset);
            igEncode(descs, data.length);
            igEncodeMany(names, name);
            datas.push(data);
            fnBeg += name.length;
            dataOffset += data.length;
        }
        const segs = [
            MAGIC,
            igEncode([], descs.length), descs,
            igEncode([], names.length), names, ...datas
        ];
        let sumLength = 0;
        for (const s of segs) sumLength += s.length;
        const sumData = new Uint8Array(sumLength);
        let setOffset = 0;
        for (const s of segs) sumData.set(s, setOffset), setOffset += s.length;
        return sumData;
    }
    class ArrayReader {
        constructor (array) {
            this.array = array;
            this.index = 0;
        }
        take(n) {
            const res = this.array.subarray(this.index, this.index + n);
            this.index += n;
            return res;
        }
        byte() {
            const b = this.array[this.index];
            this.index++;
            return b;
        }
        vlq() {
            let v = 0;
            while ((v & 1) == 0) v = (v << 7) | this.byte();
            return v >> 1;
        }
        left() {
            return this.index < this.array.length;
        }
    };
    function igaLoad(inData, nameDecoder) {
        const reader = new ArrayReader(inData);
        for (const b of MAGIC) if (b != reader.byte() && b >= 0) throw new Error('invalid magic');
        const desc_reader = new ArrayReader(reader.take(reader.vlq()));
        const name_reader = new ArrayReader(reader.take(reader.vlq()));
        const file_datass = reader.array.subarray(reader.index);
        const descs = [];
        const nchrs = [];
        while (name_reader.left()) nchrs.push(name_reader.vlq());
        while (desc_reader.left()) descs.push({
            fnbeg: desc_reader.vlq(),
            dataoff: desc_reader.vlq(),
            datalen: desc_reader.vlq(),
        });
        descs.push({ fnbeg: nchrs.length });
        const ret = {};
        for (let i = 1; i < descs.length; i++) {
            const desc = descs[i - 1];
            const name = nameDecoder.decode(new Uint8Array(nchrs.slice(desc.fnbeg, descs[i].fnbeg)));
            const data = file_datass.subarray(desc.dataoff, desc.dataoff + desc.datalen);
            const vxor = name.endsWith('.s') ? 0xFF : 0x00;
            ret[name] = data.map((b, i) => b ^ (i + 2) ^ vxor);
        }
        return ret;
    }
    return { igaCreate, igaLoad };
})();

if (typeof module !== 'undefined') module.exports = IGArchive;
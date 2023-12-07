'use strict';

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
        [73, 71, 65, 48, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
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

if (module) module.exports = { igaCreate };
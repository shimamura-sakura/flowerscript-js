'use strict';

const fs = require('fs');
const cp932 = require('iconv-cp932');
const igarchive = require('./igarchive.js');
const flowerscript = require('./flowerscript.js');

const filelist = [
    '04a_00001a.s',
    '04a_00001b.s',
    '04a_00002.s',
    '04a_01000a.s',
    '04a_01000b.s',
    '04a_01010.s',
    '04a_01100.s',
    '04a_01200.s',
    '04a_01300.s',
    '04a_01400.s',
    '04a_01500.s',
    '04a_01600.s',
    '04a_01700.s',
    '04a_02000a.s',
    '04a_02000b.s',
    '04a_02010.s',
    '04a_02100.s',
    '04a_02200.s',
    '04a_02300.s',
    '04a_02400.s',
    '04a_02500.s',
    '04a_02600.s',
    '04a_02700.s',
    '04a_02700s.s',
    '04a_02700z.s',
    '04a_02701.s',
    '04a_02800.s',
    '04a_02900a.s',
    '04a_02900b.s',
    '04a_03000a.s',
    '04a_03000b.s',
    '04a_03010.s',
    '04a_03100.s',
    '04a_03200.s',
    '04a_03300.s',
    '04a_03400.s',
    '04a_03500.s',
    '04a_03600.s',
    '04a_03700a.s',
    '04a_03700b.s',
    '04a_04000a.s',
    '04a_04000b.s',
    '04a_04010.s',
    '04a_04100.s',
    '04a_04200.s',
    '04a_04300.s',
    '04a_04400.s',
    '04a_04500.s',
    '04a_04600.s',
    '04a_04700.s',
    '04a_04710.s',
    '04a_04720.s',
    '04a_04721.s',
    '04a_04800.s',
    '04a_04900.s',
    '04a_04910a.s',
    '04a_04910b.s',
    '04a_05000a.s',
    '04a_05000b.s',
    '04a_05010.s',
    '04a_05100.s',
    '04a_05200.s',
    '04a_05300.s',
    '04a_05400.s',
    '04a_05500.s',
    '04a_05600.s',
    '04a_05700.s',
    '04a_05800.s',
    '04a_05900.s',
    '04a_06000a.s',
    '04a_06000b.s',
    '04a_06010.s',
    '04a_06100.s',
    '04a_06200.s',
    '04a_06300.s',
    '04a_06301.s',
    '04a_06400.s',
    '04a_06400a.s',
    '04a_06400b.s',
    '04a_06400c.s',
    '04a_06400d.s',
    '04a_06400e.s',
    'start.s',
];

if (1) {
    filelist.forEach(name => {
        const bytes = fs.readFileSync(`sources/4_hiver/${name}`);
        const disasm = flowerscript.disassemble(bytes, cp932, true);
        const reasm = flowerscript.assemble(JSON.parse(disasm), cp932);
        console.assert(bytes.compare(reasm) == 0);
        fs.writeFileSync(`disasm/4_hiver/${name}.json`, disasm);
    });
} else {
    const igaData = igarchive.igaCreate(
        filelist.map(name => {
            const text = fs.readFileSync(`disasm/4_hiver/${name}.json`, { encoding: 'utf-8' });
            return [name, flowerscript.assemble(JSON.parse(text), cp932)];
        }), cp932);
    fs.writeFileSync('/tmp/script.iga', igaData);
}
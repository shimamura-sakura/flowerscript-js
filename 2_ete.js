'use strict';

const fs = require('fs');
const cp932 = require('iconv-cp932');
const igarchive = require('./igarchive.js');
const flowerscript = require('./flowerscript.js');

const filelist = [
    '02a_00001.s',
    '02a_01000.s',
    '02a_01100.s',
    '02a_01200.s',
    '02a_01300.s',
    '02a_01400.s',
    '02a_01500.s',
    '02a_01600.s',
    '02a_01610.s',
    '02a_01700.s',
    '02a_01710.s',
    '02a_01800.s',
    '02a_01801.s',
    '02a_01900.s',
    '02a_01901.s',
    '02a_02000.s',
    '02a_02100.s',
    '02a_02200.s',
    '02a_02300.s',
    '02a_02400.s',
    '02a_02500.s',
    '02a_02600.s',
    '02a_02700.s',
    '02a_02800.s',
    '02a_03000.s',
    '02a_03100.s',
    '02a_03200.s',
    '02a_03300.s',
    '02a_03400.s',
    '02a_03500.s',
    '02a_03600.s',
    '02a_03700.s',
    '02a_03700c.s',
    '02a_03800.s',
    '02a_03801.s',
    '02a_03900.s',
    '02a_03950.s',
    '02a_03999.s',
    '02a_04000.s',
    '02a_04100.s',
    '02a_04200.s',
    '02a_04300.s',
    '02a_04400.s',
    '02a_04400c.s',
    '02a_04500.s',
    '02a_04600.s',
    '02a_04700.s',
    '02a_05000.s',
    '02a_05100.s',
    '02a_05200.s',
    '02a_05200c.s',
    '02a_05200z.s',
    '02a_05300.s',
    '02a_05400.s',
    '02a_05500.s',
    '02a_05600.s',
    '02a_05700.s',
    '02a_05701.s',
    '02a_05702.s',
    '02a_05800.s',
    '02a_05900.s',
    '02a_06000.s',
    '02a_06100.s',
    '02a_06200c.s',
    '02a_06300.s',
    '02a_06400.s',
    '02a_06500.s',
    '02a_06510c.s',
    '02a_06550.s',
    '02a_06599.s',
    '02a_06600.s',
    '02a_06700.s',
    '02a_06800.s',
    '02a_07000.s',
    '02a_07100.s',
    '02a_08000.s',
    'start.s',
];

if (1) {
    filelist.forEach(name => {
        const bytes = fs.readFileSync(`sources/2_ete/${name}`);
        const disasm = flowerscript.disassemble(bytes, cp932, false);
        const reasm = flowerscript.assemble(JSON.parse(disasm), cp932);
        console.assert(bytes.compare(reasm) == 0);
        fs.writeFileSync(`disasm/2_ete/${name}.json`, disasm);
    });
} else {
    const igaData = igarchive.igaCreate(
        filelist.map(name => {
            const text = fs.readFileSync(`disasm/2_ete/${name}.json`, { encoding: 'utf-8' });
            return [name, flowerscript.assemble(JSON.parse(text), cp932)];
        }), cp932);
    fs.writeFileSync('/tmp/script.iga', igaData);
}
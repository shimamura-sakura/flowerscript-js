# FlowerScript-js

disassemble and assemble scripts from FLOWERS series.

## Example

four scripts for four games.

`if (1)` disassemble from `sources/` into `disasm/{game}`  
`if (0)` assemble from `disasm/{game}` into `/tmp/script.iga`

all text in `disasm` of this repository has been replaced with `AAAAA`s, while keeping all filenames

note that instruction names in `disasm` are not up to date with `flowerscript.js`

## About Chinese version of FLOWERS

For "Academia Sancti Angraeci" (圣彗星兰学院)'s Chinese version:

Unofficial version of their patch is packed with EnigmaVirtualBox, just use EnigmaVBUnpacker.

Official version is not packed, but still encrypted (filename and content).

For more information read `academia_angraeci.py` (Yes I like Latin).
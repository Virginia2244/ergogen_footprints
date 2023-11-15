module.exports = {
    params: {
      designator: 'DISP',
      side: 'F',
      SCK: {type: 'net', value: 'SCK'},
      VCC: {type: 'net', value: 'VCC'},
      GND: {type: 'net', value: 'GND'},
      CS: {type: 'net', value: 'CS'},
      reversable: {type: 'boolean', value: true},
      label: {type: 'boolean', value: true},
    },
    body: p => {
      const standard = `
        ${'' /* Add the kicad_mod content here*/}
        (footprint "xiao-ble-tht" (version 20211014) (generator pcbnew)
        (layer "F.Cu")
        (tedit 62108D0B)
        (attr smd exclude_from_pos_files)

        

        ${'' /*Box outlining the usb-c port*/}
        (fp_rect (start 4.5 -4.5) (end -4.5 -11.92403) (layer "F.SilkS") (width 0.127) (fill none))

        ${'' /*Box outlining the body*/}
        (fp_line (start 8.9 8.5) (end 8.9 -8.5) (layer "F.SilkS") (width 0.127))
        (fp_line (start -8.9 -8.5) (end -8.9 8.5) (layer "F.SilkS") (width 0.127))
        (fp_line (start 6.9 -10.5) (end -6.9 -10.5) (layer "F.SilkS") (width 0.127))
        (fp_line (start -6.9 10.5) (end 6.9 10.5) (layer "F.SilkS") (width 0.127))
        (fp_arc (start 8.9 8.5) (mid 8.314214 9.914214) (end 6.9 10.5) (layer "F.SilkS") (width 0.127))
        (fp_arc (start 6.9 -10.5) (mid 8.301491 -9.901491) (end 8.9 -8.5) (layer "F.SilkS") (width 0.127))
        (fp_arc (start -6.9 10.5) (mid -8.301423 9.901423) (end -8.9 8.5) (layer "F.SilkS") (width 0.127))
        (fp_arc (start -8.9 -8.5) (mid -8.301491 -9.901491) (end -6.9 -10.5) (layer "F.SilkS") (width 0.127))

        ${'' /*Pads connecting to the xiao*/}
        (pad "1" thru_hole oval (at -7.62 -7.62) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "2" thru_hole oval (at -7.62 -5.08) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "3" thru_hole oval (at -7.62 -2.54) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "4" thru_hole oval (at -7.62 0) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "5" thru_hole oval (at -7.62 2.54) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "6" thru_hole oval (at -7.62 5.08) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "7" thru_hole oval (at -7.62 7.62) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "8" thru_hole oval (at 7.62 7.62 180) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "9" thru_hole oval (at 7.62 5.08 180) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "10" thru_hole oval (at 7.62 2.54 180) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "11" thru_hole oval (at 7.62 0 180) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "12" thru_hole oval (at 7.62 -2.54 180) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "13" thru_hole oval (at 7.62 -5.08 180) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))
        (pad "14" thru_hole oval (at 7.62 -7.62 180) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask))

  `
      
      const reversable_txt = `
        ${'' /*Box outlining the usb-c port*/}
        (fp_rect (start 4.5 -4.5) (end -4.5 -11.92403) (layer "B.SilkS") (width 0.127) (fill none))

        ${'' /*Box outlining the body*/}
        (fp_line (start 8.9 8.5) (end 8.9 -8.5) (layer "B.SilkS") (width 0.127))
        (fp_line (start -8.9 -8.5) (end -8.9 8.5) (layer "B.SilkS") (width 0.127))
        (fp_line (start 6.9 -10.5) (end -6.9 -10.5) (layer "B.SilkS") (width 0.127))
        (fp_line (start -6.9 10.5) (end 6.9 10.5) (layer "B.SilkS") (width 0.127))
        (fp_arc (start 8.9 8.5) (mid 8.314214 9.914214) (end 6.9 10.5) (layer "B.SilkS") (width 0.127))
        (fp_arc (start 6.9 -10.5) (mid 8.301491 -9.901491) (end 8.9 -8.5) (layer "B.SilkS") (width 0.127))
        (fp_arc (start -6.9 10.5) (mid -8.301423 9.901423) (end -8.9 8.5) (layer "B.SilkS") (width 0.127))
        (fp_arc (start -8.9 -8.5) (mid -8.301491 -9.901491) (end -6.9 -10.5) (layer "B.SilkS") (width 0.127))

        `

      const lable_txt = `
      ${'' /*Lettering on the silkscreen*/}
      (fp_text user "XIAO" (at 0 0.5 unlocked) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)))
      )

      (fp_text user "Seeed Studio" (at 0 -1.5 unlocked) (layer "F.SilkS")
          (effects (font (size 1 1) (thickness 0.15)))
      )
      `
      const reversable_lable_txt = `
      ${'' /*Lettering on the silkscreen*/}
      (fp_text user "XIAO" (at 0 0.5 unlocked) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
      ) 

      (fp_text user "Seeed Studio" (at 0 -1.5 unlocked) (layer "B.SilkS")
          (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
      )
      `

      return `
        ${standard}
        ${p.reversable ? reversable_txt : ''}
        ${p.label ? lable_txt: ''}
        ${p.label ? (p.reversable ? reversable_lable_txt : '') : ''}
				)
      `
    }
  }

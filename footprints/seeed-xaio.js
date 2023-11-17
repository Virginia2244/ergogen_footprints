module.exports = {
    params: {
      reversable: {type: 'boolean', value: true},
      label: {type: 'boolean', value: true},
      traces: {type: 'boolean', value: true},
      P0: {type: 'net', value: 'P0'},
      P1: {type: 'net', value: 'P1'},
      P2: {type: 'net', value: 'P2'},
      P3: {type: 'net', value: 'P3'},
      P4: {type: 'net', value: 'P4'},
      P5: {type: 'net', value: 'P5'},
      P6: {type: 'net', value: 'P6'},
      P7: {type: 'net', value: 'P7'},
      P8: {type: 'net', value: 'P8'},
      P9: {type: 'net', value: 'P9'},
      P10: {type: 'net', value: 'P10'},
      VCC: {type: 'net', value: 'VCC'},
      GND: {type: 'net', value: 'GND'},
      V3: {type: 'net', value: 'V3'},
    },
    body: p => {
      const pin_nets = [
        [`${p.P0.str}`, `${p.VCC.str}`],
        [`${p.P1.str}`, `${p.GND.str}`],
        [`${p.P2.str}`, `${p.V3.str}`],
        [`${p.P3.str}`, `${p.P10.str}`],
        [`${p.P4.str}`, `${p.P9.str}`],
        [`${p.P5.str}`, `${p.P8.str}`],
        [`${p.P6.str}`, `${p.P7.str}`],]

      const get_thru_hole = () => {
        let thru_hole = ''
        for (let i = 0; i < 7; i++) {
          thru_hole += `(pad "${i}" thru_hole oval (at -7.62 ${-7.62 + (i)*2.54} ${p.rot}) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask) ${p.reversable ? p.local_net(i).str : pin_nets[i][0]})\n`
          thru_hole += `(pad "${i + 6}" thru_hole oval (at 7.62 ${7.62 - (i)*2.54} ${180 + p.rot}) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask) ${p.reversable ? p.local_net(i + 7).str : pin_nets[i][1]})\n`
        }
        return thru_hole
      };

      const male_pad = `
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly 
          (pts
            (xy -0.5 -0.625) 
            (xy -0.25 -0.625) 
            (xy 0.25 0) 
            (xy -0.25 0.625) 
            (xy -0.5 0.625)
          ) 
          (width 0) (fill yes))
      ))\n`
      const female_pad = `
      (zone_connect 2)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly 
          (pts
            (xy -0.65 -0.625) 
            (xy 0.5 -0.625) 
            (xy 0.5 0.625) 
            (xy -0.65 0.625) 
            (xy -0.15 0)
          ) 
          (width 0) (fill yes))
      ))\n`

      const get_solder_pads = () => {
        let solder_pads = ''
        for (let i = 0; i < 7; i++) {
          //Left Front male
          solder_pads += `\t\t(pad 1 smd custom (at -5.62 ${-7.62 + (i)*2.54} ${p.rot}) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net(i).str}`
          solder_pads += male_pad

          //Right Front male
          solder_pads += `\t\t(pad 1 smd custom (at 5.62 ${7.62 - (i)*2.54} ${180 + p.rot}) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net(i + 7).str}`
          solder_pads += male_pad


          //Left Front female
          solder_pads += `\t\t(pad 1 smd custom (at -4.775 ${-7.62 + (i)*2.54} ${p.rot}) (size 0.2 0.2) (layers F.Cu F.Mask) ${pin_nets[i][1]}`
          solder_pads += female_pad
          //Right Front female
          solder_pads += `\t\t(pad 1 smd custom (at 4.775 ${7.62 - (i)*2.54} ${180 + p.rot}) (size 0.2 0.2) (layers F.Cu F.Mask) ${pin_nets[6 - i][0]}`
          solder_pads += female_pad
          //Left VIAS
          solder_pads += `\t\t(pad 1 thru_hole circle (at -3.262 ${-7.62 + (i)*2.54}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${pin_nets[i][0]})\n`

          //Left Back male
          solder_pads += `\t\t(pad 1 smd custom (at -5.62 ${-7.62 + (i)*2.54} ${p.rot}) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net(i).str}`
          solder_pads += male_pad

          //Right Back male
          solder_pads += `\t\t(pad 1 smd custom (at 5.62 ${7.62 - (i)*2.54} ${180 + p.rot}) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net(i + 7).str}`
          solder_pads += male_pad
          
          //Left Front female
          solder_pads += `\t\t(pad 1 smd custom (at 4.775 ${-7.62 + (i)*2.54} ${180 + p.rot}) (size 0.2 0.2) (layers B.Cu B.Mask) ${pin_nets[i][1]}`
          solder_pads += female_pad
          
          //Right Front female
          solder_pads += `\t\t(pad 1 smd custom (at -4.775 ${7.62 - (i)*2.54} ${p.rot}) (size 0.2 0.2) (layers B.Cu B.Mask) ${pin_nets[6 - i][0]}`
          solder_pads += female_pad
          
          //Right VIAS
          solder_pads += `\t\t(pad 1 thru_hole circle (at 3.262 ${7.62 - (i)*2.54}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${pin_nets[6 - i][1]})\n`
        }
        return solder_pads
      }

      const get_traces = () => {
        let temp = ''
        // /* Left pin to male pad */
        // temp += `(segment (start -5.62 -7.62) (end -7.62 -7.62) (width 0.25) (layer "F.Cu") (net 15))`
        // temp += `(segment (start -5.62 -7.62) (end -7.62 -7.62) (width 0.25) (layer "B.Cu") (net 15))`
        // /* Right pin to male pad */
        // temp += `(segment (start 5.62 -7.62) (end 7.62 -7.62) (width 0.25) (layer "F.Cu") (net 28))`
        // temp += `(segment (start 5.62 -7.62) (end 7.62 -7.62) (width 0.25) (layer "B.Cu") (net 28))`

        return temp
      }

      const standard = `
${'' /* Add the kicad_mod content here*/}
(footprint "xiao-ble-tht" (version 20211014) (generator pcbnew)
  ${p.at /* parametric position */}
  (layer "F.Cu")
  (tedit 62108D0B)
  (attr smd exclude_from_pos_files)

  ${'' /*Box outlining the front usb-c port*/}
  (fp_rect (start 4.5 -4.5) (end -4.5 -11.92403) (layer "F.SilkS") (width 0.127) (fill none))

  ${'' /*Box outlining the front body*/}
  (fp_line (start 8.9 8.5) (end 8.9 -8.5) (layer "F.SilkS") (width 0.127))
  (fp_line (start -8.9 -8.5) (end -8.9 8.5) (layer "F.SilkS") (width 0.127))
  (fp_line (start 6.9 -10.5) (end -6.9 -10.5) (layer "F.SilkS") (width 0.127))
  (fp_line (start -6.9 10.5) (end 6.9 10.5) (layer "F.SilkS") (width 0.127))
  (fp_arc (start 8.9 8.5) (mid 8.314214 9.914214) (end 6.9 10.5) (layer "F.SilkS") (width 0.127))
  (fp_arc (start 6.9 -10.5) (mid 8.301491 -9.901491) (end 8.9 -8.5) (layer "F.SilkS") (width 0.127))
  (fp_arc (start -6.9 10.5) (mid -8.301423 9.901423) (end -8.9 8.5) (layer "F.SilkS") (width 0.127))
  (fp_arc (start -8.9 -8.5) (mid -8.301491 -9.901491) (end -6.9 -10.5) (layer "F.SilkS") (width 0.127))

${'' /*Getting the through holes*/}
${get_thru_hole()}

`
      
      const reversable_txt = `
(
  footprint "xiao-ble-tht" (version 20211014) (generator pcbnew)
    ${p.at /* parametric position */}
    (layer "F.Cu")
    (tedit 62108D0B)
    (attr smd exclude_from_pos_files)

    ${'' /*Box outlining the front usb-c port*/}
    (fp_rect (start 4.5 -4.5) (end -4.5 -11.92403) (layer "F.SilkS") (width 0.127) (fill none))

    ${'' /*Box outlining the front body*/}
    (fp_line (start 8.9 8.5) (end 8.9 -8.5) (layer "F.SilkS") (width 0.127))
    (fp_line (start -8.9 -8.5) (end -8.9 8.5) (layer "F.SilkS") (width 0.127))
    (fp_line (start 6.9 -10.5) (end -6.9 -10.5) (layer "F.SilkS") (width 0.127))
    (fp_line (start -6.9 10.5) (end 6.9 10.5) (layer "F.SilkS") (width 0.127))
    (fp_arc (start 8.9 8.5) (mid 8.314214 9.914214) (end 6.9 10.5) (layer "F.SilkS") (width 0.127))
    (fp_arc (start 6.9 -10.5) (mid 8.301491 -9.901491) (end 8.9 -8.5) (layer "F.SilkS") (width 0.127))
    (fp_arc (start -6.9 10.5) (mid -8.301423 9.901423) (end -8.9 8.5) (layer "F.SilkS") (width 0.127))
    (fp_arc (start -8.9 -8.5) (mid -8.301491 -9.901491) (end -6.9 -10.5) (layer "F.SilkS") (width 0.127))

    ${'' /*Box outlining the back usb-c port*/}
    (fp_rect (start 4.5 -4.5) (end -4.5 -11.92403) (layer "B.SilkS") (width 0.127) (fill none))

    ${'' /*Box outlining the back body*/}
    (fp_line (start 8.9 8.5) (end 8.9 -8.5) (layer "B.SilkS") (width 0.127))
    (fp_line (start -8.9 -8.5) (end -8.9 8.5) (layer "B.SilkS") (width 0.127))
    (fp_line (start 6.9 -10.5) (end -6.9 -10.5) (layer "B.SilkS") (width 0.127))
    (fp_line (start -6.9 10.5) (end 6.9 10.5) (layer "B.SilkS") (width 0.127))
    (fp_arc (start 8.9 8.5) (mid 8.314214 9.914214) (end 6.9 10.5) (layer "B.SilkS") (width 0.127))
    (fp_arc (start 6.9 -10.5) (mid 8.301491 -9.901491) (end 8.9 -8.5) (layer "B.SilkS") (width 0.127))
    (fp_arc (start -6.9 10.5) (mid -8.301423 9.901423) (end -8.9 8.5) (layer "B.SilkS") (width 0.127))
    (fp_arc (start -8.9 -8.5) (mid -8.301491 -9.901491) (end -6.9 -10.5) (layer "B.SilkS") (width 0.127))

    ${'' /*Getting the through holes*/}
    ${get_thru_hole()}

    ${'' /*Getting the solder pads*/}
     ${get_solder_pads()}      
     `

      const lable_txt = `
      ${'' /*Lettering on the silkscreen*/}
      (fp_text user "XIAO" (at 0 0.5 ${p.rot}) (layer "F.SilkS")
      (effects (font (size 1 1) (thickness 0.15)))
      )

      (fp_text user "Seeed Studio" (at 0 -1.5 ${p.rot}) (layer "F.SilkS")
          (effects (font (size 1 1) (thickness 0.15)))
      )
      `
      const reversable_lable_txt = `
      ${'' /*Lettering on the silkscreen*/}
      (fp_text user "XIAO" (at 0 0.5 ${p.rot}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
      ) 

      (fp_text user "Seeed Studio" (at 0 -1.5 ${p.rot}) (layer "B.SilkS")
          (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
      )
      `
     
      return `
        ${p.reversable ? reversable_txt : standard}
        ${p.label ? lable_txt: ''}
        ${p.label ? (p.reversable ? reversable_lable_txt : '') : ''}
				)
        ${p.traces ? (p.reversable ? get_traces() : '') : ''}
      `
    
    }
  }

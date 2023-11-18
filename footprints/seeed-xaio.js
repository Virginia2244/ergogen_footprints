module.exports = {
    params: {
      reversable: {type: 'boolean', value: true},
      label: {type: 'boolean', value: true},
      instructions: {type: 'boolean', value: true},
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
        [`${p.P6.str}`, `${p.P7.str}`],
      ]

      const spacing = {
        top_left_pin:  {x: -7.62, y: -7.62},
        top_right_pin: {x: 7.62, y: -7.62}, 
        pin_dist: 2.54,
        total_pin_num: 14,
        half_pin_num: 7,
        pin_to_male_pad: 2,
        pin_to_female_pad: 2.845,
        pin_to_via: 4.358,
      }

      const get_thru_hole = () => {
        let thru_hole = ''
        for (let i = 0; i < spacing.half_pin_num; i++) {
          thru_hole += `(pad ${i}                             thru_hole oval (at ${spacing.top_left_pin.x}  ${spacing.top_left_pin.y + (i)*spacing.pin_dist}  ${p.rot})       (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask) ${p.reversable ? p.local_net(i).str : pin_nets[i][0]})\n`
          thru_hole += `(pad ${spacing.total_pin_num - 1 - i} thru_hole oval (at ${spacing.top_right_pin.x} ${spacing.top_right_pin.y + (i)*spacing.pin_dist} ${180 + p.rot}) (size 2.75 1.8) (drill 1 (offset -0.475 0)) (layers *.Cu *.Mask) ${p.reversable ? p.local_net(spacing.total_pin_num - 1 - i).str : pin_nets[i][1]})\n`
        }
        return thru_hole
      }

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
        )
      )\n`
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
        )
      )\n`

      const get_solder_pads = () => {
        let solder_pads = ''
        for (let i = 0; i < (spacing.half_pin_num); i++) {
          //Left VIAS
          solder_pads += `\t\t(pad ${i} thru_hole circle (at ${spacing.top_left_pin.x + spacing.pin_to_via} ${spacing.top_left_pin.y + (i)*spacing.pin_dist}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${pin_nets[i][0]})\n`
          
          //Left Front male
          solder_pads += `\t\t(pad ${i} smd custom (at ${spacing.top_left_pin.x + spacing.pin_to_male_pad} ${spacing.top_left_pin.y + (i)*spacing.pin_dist} ${p.rot}) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net(i).str}`
          solder_pads += male_pad
          
          //Left Front female
          solder_pads += `\t\t(pad ${spacing.total_pin_num - 1 - i} smd custom (at ${spacing.top_left_pin.x + spacing.pin_to_female_pad} ${spacing.top_left_pin.y + (i)*spacing.pin_dist} ${p.rot}) (size 0.2 0.2) (layers F.Cu F.Mask) ${pin_nets[i][1]}`
          solder_pads += female_pad
          
          //Left Back male
          solder_pads += `\t\t(pad ${i} smd custom (at ${spacing.top_left_pin.x + spacing.pin_to_male_pad} ${spacing.top_left_pin.y + (i)*spacing.pin_dist} ${p.rot}) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net(i).str}`
          solder_pads += male_pad

          //Left Back female
          solder_pads += `\t\t(pad ${i} smd custom (at ${spacing.top_left_pin.x + spacing.pin_to_female_pad} ${spacing.top_left_pin.y + (i)*spacing.pin_dist} ${p.rot}) (size 0.2 0.2) (layers B.Cu B.Mask) ${pin_nets[i][0]}`
          solder_pads += female_pad
        

          //Right VIAS
          solder_pads += `\t\t(pad ${spacing.total_pin_num - 1 - i} thru_hole circle (at ${spacing.top_right_pin.x - spacing.pin_to_via} ${spacing.top_right_pin.y + (i)*spacing.pin_dist}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${pin_nets[i][1]})\n`
          
          //Right Back male
          solder_pads += `\t\t(pad ${spacing.total_pin_num - 1 - i} smd custom (at ${spacing.top_right_pin.x - spacing.pin_to_male_pad} ${spacing.top_right_pin.y + (i)*spacing.pin_dist} ${180 + p.rot}) (size 0.2 0.2) (layers B.Cu B.Mask) ${p.local_net(spacing.total_pin_num - 1 - i).str}`
          solder_pads += male_pad
          
          //Right Back female
          solder_pads += `\t\t(pad ${spacing.total_pin_num - 1 - i} smd custom (at ${spacing.top_right_pin.x - spacing.pin_to_female_pad} ${spacing.top_right_pin.y + (i)*spacing.pin_dist} ${180 + p.rot}) (size 0.2 0.2) (layers B.Cu B.Mask) ${pin_nets[i][1]}`
          solder_pads += female_pad

          //Right Front female
          solder_pads += `\t\t(pad ${i} smd custom (at ${spacing.top_right_pin.x - spacing.pin_to_female_pad} ${spacing.top_right_pin.y + (i)*spacing.pin_dist} ${180 + p.rot}) (size 0.2 0.2) (layers F.Cu F.Mask) ${pin_nets[i][0]}`
          solder_pads += female_pad

          //Right Front male
          solder_pads += `\t\t(pad ${spacing.total_pin_num - 1 - i} smd custom (at ${spacing.top_right_pin.x - spacing.pin_to_male_pad} ${spacing.top_right_pin.y + (i)*spacing.pin_dist} ${180 + p.rot}) (size 0.2 0.2) (layers F.Cu F.Mask) ${p.local_net(spacing.total_pin_num - 1 - i).str}`
          solder_pads += male_pad
        }
        return solder_pads
      }

      /* I stole this code from infused-kim's guide at https://nilnil.notion.site/Convert-Kicad-Footprints-to-Ergogen-8340ce87ad554c69af4e3f92bc9a0898
      I have no idea how it works. I am pretty sure that it interfaces with the other ergogen code in a way that I don't understand.*/
      const get_at_coordinates = () => {
        const pattern = /\(at (-?[\d\.]*) (-?[\d\.]*) (-?[\d\.]*)\)/;
        const matches = p.at.match(pattern);
        if (matches && matches.length == 4) {
            return [parseFloat(matches[1]), parseFloat(matches[2]), parseFloat(matches[3])];
        } else {
            return null;
        }
      }

      const adjust_point = (x, y) => {
        const at_l = get_at_coordinates();
        if(at_l == null) {
            throw new Error(
            `Could not get x and y coordinates from p.at: ${p.at}`
            );
        }
        const at_x = at_l[0];
        const at_y = at_l[1];
        const at_angle = at_l[2];
        const adj_x = at_x + x;
        const adj_y = at_y + y;

        const radians = (Math.PI / 180) * at_angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (adj_x - at_x)) + (sin * (adj_y - at_y)) + at_x,
            ny = (cos * (adj_y - at_y)) - (sin * (adj_x - at_x)) + at_y;

        const point_str = `${nx.toFixed(2)} ${ny.toFixed(2)}`;
        return point_str;
      }
    /*End of swiped code*/

      const get_traces = () => {
        let traces = ``
        for (let i = 0; i < (spacing.half_pin_num); i++) {
          /* Left pin to Right male pad F and B*/
          traces += `\t(segment (start ${adjust_point(spacing.top_left_pin.x + spacing.pin_to_male_pad, spacing.top_left_pin.y + i*spacing.pin_dist)}) (end ${adjust_point(spacing.top_left_pin.x, spacing.top_left_pin.y + i*spacing.pin_dist)}) (width 0.25) (layer "F.Cu") (net 1))`
          traces += `\t(segment (start ${adjust_point(spacing.top_left_pin.x + spacing.pin_to_male_pad, spacing.top_left_pin.y + i*spacing.pin_dist)}) (end ${adjust_point(spacing.top_left_pin.x, spacing.top_left_pin.y + i*spacing.pin_dist)}) (width 0.25) (layer "B.Cu") (net 1))`
          /* Right pin to Right male pad F and B*/
          traces += `\t(segment (start ${adjust_point(spacing.top_right_pin.x - spacing.pin_to_male_pad, spacing.top_right_pin.y + i*spacing.pin_dist)}) (end ${adjust_point(spacing.top_right_pin.x, spacing.top_right_pin.y + i*spacing.pin_dist)}) (width 0.25) (layer "F.Cu") (net 1))`
          traces += `\t(segment (start ${adjust_point(spacing.top_right_pin.x - spacing.pin_to_male_pad, spacing.top_right_pin.y + i*spacing.pin_dist)}) (end ${adjust_point(spacing.top_right_pin.x, spacing.top_right_pin.y + i*spacing.pin_dist)}) (width 0.25) (layer "B.Cu") (net 1))`

          /*Left female pad to right via F*/
          traces += `\t(segment (start ${adjust_point(spacing.top_left_pin.x + spacing.pin_to_female_pad, spacing.top_left_pin.y + i*spacing.pin_dist)}) (end ${adjust_point(spacing.top_left_pin.x + 3.57, spacing.top_left_pin.y - .725 + i*spacing.pin_dist)}) (width 0.25) (layer "F.Cu") (net 1))`
          traces += `\t(segment (start ${adjust_point(spacing.top_left_pin.x + 3.57, spacing.top_left_pin.y - .725 + i*spacing.pin_dist)}) (end ${adjust_point(spacing.top_right_pin.x - 5.088, spacing.top_right_pin.y - .725 + i*spacing.pin_dist)}) (width 0.25) (layer "F.Cu") (net 1))`
          traces += `\t(segment (start ${adjust_point(spacing.top_right_pin.x - 5.088, spacing.top_right_pin.y - .725 + i*spacing.pin_dist)}) (end ${adjust_point(spacing.top_right_pin.x - spacing.pin_to_via, spacing.top_right_pin.y + i*spacing.pin_dist)})  (width 0.25) (layer "F.Cu") (net 1))`
          
          /*Right female pad to left via F*/
          traces += `\t(segment (start ${adjust_point(spacing.top_right_pin.x - spacing.pin_to_female_pad, spacing.top_right_pin.y + i*spacing.pin_dist)})   (end ${adjust_point(spacing.top_right_pin.x - 3.57, spacing.top_right_pin.y + .725 + i*spacing.pin_dist)})   (width 0.25) (layer "F.Cu") (net 1))`
          traces += `\t(segment (start ${adjust_point(spacing.top_right_pin.x - 3.57, spacing.top_right_pin.y + .725 + i*spacing.pin_dist)})   (end ${adjust_point(spacing.top_left_pin.x + 5.088, spacing.top_left_pin.y + .725 + i*spacing.pin_dist)}) (width 0.25) (layer "F.Cu") (net 1))`
          traces += `\t(segment (start ${adjust_point(spacing.top_left_pin.x + 5.088, spacing.top_left_pin.y + .725 + i*spacing.pin_dist)}) (end ${adjust_point(spacing.top_left_pin.x + spacing.pin_to_via, spacing.top_left_pin.y + i*spacing.pin_dist)})  (width 0.25) (layer "F.Cu") (net 1))`

          /*Left female pad to left via B*/
          traces += `\t(segment (start ${adjust_point(spacing.top_left_pin.x + spacing.pin_to_female_pad, spacing.top_left_pin.y + i*spacing.pin_dist)}) (end ${adjust_point(spacing.top_left_pin.x + spacing.pin_to_via, spacing.top_left_pin.y + i*spacing.pin_dist)}) (width 0.25) (layer "B.Cu") (net 1))`

          /*Right female pad to right via B*/
          traces += `\t(segment (start ${adjust_point(spacing.top_right_pin.x - spacing.pin_to_female_pad, spacing.top_right_pin.y + i*spacing.pin_dist)}) (end ${adjust_point(spacing.top_right_pin.x - spacing.pin_to_via, spacing.top_right_pin.y + i*spacing.pin_dist)}) (width 0.25) (layer "B.Cu") (net 1))`
        }
        return traces
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

      (fp_text user "Seeed" (at 0 -1.5 ${p.rot}) (layer "F.SilkS")
          (effects (font (size 1 1) (thickness 0.15)))
      )
      `

      const reversable_lable_txt = `
      ${'' /*Lettering on the silkscreen*/}
      (fp_text user "XIAO" (at 0 0.5 ${p.rot}) (layer "B.SilkS")
      (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
      ) 

      (fp_text user "Seeed" (at 0 -1.5 ${p.rot}) (layer "B.SilkS")
          (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
      )
      `
      const instructions = `
          (fp_text user "R. Side - Jumper Here" (at 0 11.5) (layer F.SilkS)
            (effects (font (size 1 1) (thickness 0.15)))
          )
          (fp_text user "L. Side - Jumper Here" (at 0 11.5) (layer B.SilkS)
            (effects (font (size 1 1) (thickness 0.15)) (justify mirror))
          )
      `
      return `
        ${p.reversable ? reversable_txt : standard}
        ${p.label ? lable_txt : ''}
        ${p.instructions ? instructions : ''}
        ${p.label ? (p.reversable ? reversable_lable_txt : '') : ''}
				)
        ${p.traces ? (p.reversable ? get_traces() : '') : ''}
      `
    }
  }

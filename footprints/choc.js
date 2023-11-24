// Kailh Choc PG1350
// Nets
//    from: corresponds to pin 1
//    to: corresponds to pin 2
// Params
//    hotswap: default is false
//      if true, will include holes and pads for Kailh choc hotswap sockets
//    reverse: default is false
//      if true, will flip the footprint such that the pcb can be reversible
//    keycaps: default is false
//      if true, will add choc sized keycap box around the footprint
// 
// note: hotswap and reverse can be used simultaneously

module.exports = {
  params: {
    designator: 'S',
    hotswap: false,
    reverse: false,
    keycaps: false,
    traces: false,
    from: undefined,
    to: undefined
  },
  body: p => {
    const standard = `
      (module PG1350 (layer F.Cu) (tedit 5DD50112)
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

      ${''/* corner marks */}
      (fp_line (start -7 -6) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -6 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -6 -7) (end -7 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start -7 7) (end -7 6) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 6) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 6 -7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 6 7) (end 7 7) (layer Dwgs.User) (width 0.15))
      (fp_line (start 7 -7) (end 7 -6) (layer Dwgs.User) (width 0.15))      
      
      ${''/* middle shaft */}
      (pad "" np_thru_hole circle (at 0 0) (size 3.429 3.429) (drill 3.429) (layers *.Cu *.Mask))
        
      ${''/* stabilizers */}
      (pad "" np_thru_hole circle (at 5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at -5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
    `
    const keycap = `
      ${'' /* keycap marks */}
      (fp_line (start -9 -8.5) (end 9 -8.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start 9 -8.5) (end 9 8.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start 9 8.5) (end -9 8.5) (layer Dwgs.User) (width 0.15))
      (fp_line (start -9 8.5) (end -9 -8.5) (layer Dwgs.User) (width 0.15))
    `
    function pins(def_neg, def_pos, def_side) {
      if(p.hotswap) {
        if(p.reverse){
            return `
            ${'' /* holes */}
            (pad "" np_thru_hole circle (at ${def_pos}5 -3.75) (size 3 3) (drill 3) (layers *.Cu *.Mask))
            ${def_side == 'F' ? '' : '(pad "" np_thru_hole circle (at 0 -5.95) (size 3 3) (drill 3) (layers *.Cu *.Mask))'}
        
            ${'' /* net pads */}
            (pad 2 smd rect (at ${def_pos}8.275 -3.75 ${p.rot}) (size 2.6 2.6) (layers ${def_side}.Cu ${def_side}.Paste ${def_side}.Mask)  ${p.to.str})
            (pad 1 smd custom (at ${def_neg}3.275 -5.95 ${p.rot}) (size 0.2 0.2) (layers ${def_side}.Cu ${def_side}.Mask) ${p.from.str}
            (zone_connect 2)
            (options (clearance outline) (anchor rect))
            (primitives
              (gr_poly 
                (pts
                  (xy 1.3 ${def_side == 'F' ? '0' : '1.3'}) 
                  (xy 1.3 -1.3)
                  (xy -1.3 -1.3) 
                  (xy -1.3 ${def_side == 'F' ? '1.3' : '0'}) 
                  (xy 0 1.3) 
                )
                (width 0) (fill yes))
              )
            )\n
            `
        } else{
        return `
          ${'' /* holes */}
          (pad "" np_thru_hole circle (at ${def_pos}5 -3.75) (size 3 3) (drill 3) (layers *.Cu *.Mask))
          (pad "" np_thru_hole circle (at 0 -5.95) (size 3 3) (drill 3) (layers *.Cu *.Mask))
      
          ${'' /* net pads */}
          (pad 1 smd rect (at ${def_neg}3.275 -5.95 ${p.rot}) (size 2.6 2.6) (layers ${def_side}.Cu ${def_side}.Paste ${def_side}.Mask)  ${p.from.str})
          (pad 2 smd rect (at ${def_pos}8.275 -3.75 ${p.rot}) (size 2.6 2.6) (layers ${def_side}.Cu ${def_side}.Paste ${def_side}.Mask)  ${p.to.str})
        `
        } 
      }else {
          return `
            ${''/* pins */}
            (pad 1 thru_hole circle (at ${def_pos}5 -3.8) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.from.str})
            (pad 2 thru_hole circle (at ${def_pos}0 -5.9) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.to.str})
          `
      }
    }
    /*I stole get_at_coordinates() and adjust_point() from infused-kim's guide at https://nilnil.notion.site/Convert-Kicad-Footprints-to-Ergogen-8340ce87ad554c69af4e3f92bc9a0898
    I have no idea how it works. I am pretty sure that it interfaces with the other ergogen code in fancy ways.
    I do know that get_at_coordinates() is a helper funciton for adjust_point*/
    const get_at_coordinates = () => {
    const pattern = /\(at (-?[\d\.]*) (-?[\d\.]*) (-?[\d\.]*)\)/;
    const matches = p.at.match(pattern);
    if (matches && matches.length == 4) {
        return [parseFloat(matches[1]), parseFloat(matches[2]), parseFloat(matches[3])];
    } else {
        return null;
    }
    }
  
    /*Call adjust_point if you want to make something move that is outisde of the main body of the footprint. Aka after the ')' in the return statement*/
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

    const thru_holes = `
    (pad 2 thru_hole circle (at -1.5 -3) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.from.str})
    (pad 2 thru_hole circle (at 7 2.5) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.to.str})
    `

    const traces = `
    (segment (start ${adjust_point(3.275, -5.95)}) (end ${adjust_point(1.5, -3)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(-3.275, -5.95)}) (end ${adjust_point(-1.5, -3)}) (width 0.25) (layer "B.Cu"))
    (segment (start ${adjust_point(1.5, -3)}) (end ${adjust_point(-1.5, -3)}) (width 0.25) (layer "F.Cu"))

    (segment (start ${adjust_point(8.275, -3.75)}) (end ${adjust_point(7, 2.5)}) (width 0.25) (layer "B.Cu"))
    (segment (start ${adjust_point(-8.275, -3.75)}) (end ${adjust_point(-7, 2.5)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(7, 2.5)}) (end ${adjust_point(-7, 2.5)}) (width 0.25) (layer "F.Cu"))
    `

    if(p.reverse) {
      return `
        ${standard}
        ${p.keycaps ? keycap : ''}
        ${pins('-', '', 'B')}
        ${pins('', '-', 'F')}
        ${p.traces ? thru_holes: ''})
        ${p.traces ? traces: ''}
        `
    } else {
      return `
        ${standard}
        ${p.keycaps ? keycap : ''}
        ${pins('-', '', 'B')})
        `
    }
  }
}
module.exports = {
  params : {
    designator : 'LED',
    side : 'F',
    reverse : false,
    din : undefined,
    dout : undefined,
    VCC : {type : 'net', value : 'VCC'},
    GND : {type : 'net', value : 'GND'}
  },
  body : p => {

    const footprint_spacing = {
      x: 2.9,
      y: 1.6,
    }
    const via_spacing = {
      x: 1.5,
      y: 2.7,
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

    const traces = `
    ${'' /* Back Layer traces */}
    (segment (start ${adjust_point(footprint_spacing.x, footprint_spacing.y)}) (end ${adjust_point(via_spacing.x, via_spacing.y)}) (width 0.25) (layer "B.Cu"))
    (segment (start ${adjust_point(footprint_spacing.x, -footprint_spacing.y)}) (end ${adjust_point(via_spacing.x, -via_spacing.y)}) (width 0.25) (layer "B.Cu"))
    (segment (start ${adjust_point(-footprint_spacing.x, footprint_spacing.y)}) (end ${adjust_point(-via_spacing.x, via_spacing.y)}) (width 0.25) (layer "B.Cu"))
    (segment (start ${adjust_point(-footprint_spacing.x, -footprint_spacing.y)}) (end ${adjust_point(-via_spacing.x, -via_spacing.y)}) (width 0.25) (layer "B.Cu"))
    
    ${'' /* Front layer outer*/}
    (segment (start ${adjust_point(-via_spacing.x, -via_spacing.y)}) (end ${adjust_point(-.775, -3.425)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(-.775, -3.425)}) (end ${adjust_point(1.8, -3.435)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(1.8, -3.435)}) (end ${adjust_point(2.9, -2.325)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(2.9, -2.325)}) (end ${adjust_point(footprint_spacing.x, -footprint_spacing.y)}) (width 0.25) (layer "F.Cu"))

    (segment (start ${adjust_point(-via_spacing.x, via_spacing.y)}) (end ${adjust_point(-.775, 3.425)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(-.775, 3.425)}) (end ${adjust_point(1.8, 3.435)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(1.8, 3.435)}) (end ${adjust_point(2.9, 2.325)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(2.9, 2.325)}) (end ${adjust_point(footprint_spacing.x, footprint_spacing.y)}) (width 0.25) (layer "F.Cu"))


    ${'' /* Front layer inner */}
    (segment (start ${adjust_point(-footprint_spacing.x, -footprint_spacing.y)}) (end ${adjust_point(-2.55, -1.95)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(-2.55, -1.95)}) (end ${adjust_point(0.75, -1.95)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(0.75, -1.95)}) (end ${adjust_point(via_spacing.x, -via_spacing.y)}) (width 0.25) (layer "F.Cu"))

    (segment (start ${adjust_point(-footprint_spacing.x, footprint_spacing.y)}) (end ${adjust_point(-2.55, 1.95)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(-2.55, 1.95)}) (end ${adjust_point(0.75, 1.95)}) (width 0.25) (layer "F.Cu"))
    (segment (start ${adjust_point(0.75, 1.95)}) (end ${adjust_point(via_spacing.x, via_spacing.y)}) (width 0.25) (layer "F.Cu"))

    `

    const standard = `
    
    (module WS2812B (layer F.Cu) (tedit 53BEE615)

        ${p.at /* parametric position */}

        ${'' /* footprint reference */}
        (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${
        p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
        (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

        (fp_line (start -1.75 -1.75) (end -1.75 1.75) (layer ${
        p.side}.SilkS) (width 0.15))
        (fp_line (start -1.75 1.75) (end 1.75 1.75) (layer ${
        p.side}.SilkS) (width 0.15))
        (fp_line (start 1.75 1.75) (end 1.75 -1.75) (layer ${
        p.side}.SilkS) (width 0.15))
        (fp_line (start 1.75 -1.75) (end -1.75 -1.75) (layer ${
        p.side}.SilkS) (width 0.15))

        (fp_line (start -2.5 -2.5) (end -2.5 2.5) (layer ${
        p.side}.SilkS) (width 0.15))
        (fp_line (start -2.5 2.5) (end 2.5 2.5) (layer ${
        p.side}.SilkS) (width 0.15))
        (fp_line (start 2.5 2.5) (end 2.5 -2.5) (layer ${
        p.side}.SilkS) (width 0.15))
        (fp_line (start 2.5 -2.5) (end -2.5 -2.5) (layer ${
        p.side}.SilkS) (width 0.15))

        (fp_poly (pts (xy 4 2.2) (xy 4 0.375) (xy 5 1.2875)) (layer ${
        p.side}.SilkS) (width 0.1))

        (pad 1 smd rect (at -2.2 -0.875 ${p.rot}) (size 2.6 1) (layers ${
        p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.VCC.str})
        (pad 2 smd rect (at -2.2 0.875 ${p.rot}) (size 2.6 1) (layers ${
        p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.dout.str})
        (pad 3 smd rect (at 2.2 0.875 ${p.rot}) (size 2.6 1) (layers ${
        p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.GND.str})
        (pad 4 smd rect (at 2.2 -0.875 ${p.rot}) (size 2.6 1) (layers ${
        p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.din.str})

        (pad 11 smd rect (at -2.5 -1.6 ${p.rot}) (size 2 1.2) (layers ${
        p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.VCC.str})
        (pad 22 smd rect (at -2.5 1.6 ${p.rot}) (size 2 1.2) (layers ${
        p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.dout.str})
        (pad 33 smd rect (at 2.5 1.6 ${p.rot}) (size 2 1.2) (layers ${
        p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.GND.str})
        (pad 44 smd rect (at 2.5 -1.6 ${p.rot}) (size 2 1.2) (layers ${
        p.side}.Cu ${p.side}.Paste ${p.side}.Mask) ${p.din.str})
        
    )

`
    const double_sided = `
    
(module WS2812B (layer F.Cu) (tedit 53BEE615)

    ${p.at /* parametric position */}

    ${'' /* footprint reference */}
    (fp_text reference '${p.ref}' (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))
    (fp_text value '' (at 0 0) (layer F.SilkS) hide (effects (font (size 1.27 1.27) (thickness 0.15))))

    (fp_line (start -2.5 -2.5) (end -2.5 2.5) (layer F.SilkS) (width 0.15))
    (fp_line (start -2.5 2.5) (end 2.5 2.5) (layer F.SilkS) (width 0.15))
    (fp_line (start 2.5 2.5) (end 2.5 -2.5) (layer F.SilkS) (width 0.15))
    (fp_line (start 2.5 -2.5) (end -2.5 -2.5) (layer F.SilkS) (width 0.15))

    (fp_poly (pts (xy 4 2.2) (xy 4 0.375) (xy 5 1.2875)) (layer F.SilkS) (width 0.1))

    (pad 11 smd rect (at -${footprint_spacing.x} -${footprint_spacing.y} ${p.rot}) (size 2 1.2) (layers F.Cu F.Paste F.Mask) ${p.VCC.str})
    (pad 22 smd rect (at -${footprint_spacing.x} ${footprint_spacing.y} ${p.rot}) (size 2 1.2) (layers F.Cu F.Paste F.Mask) ${p.dout.str})
    (pad 33 smd rect (at ${footprint_spacing.x} ${footprint_spacing.y} ${p.rot}) (size 2 1.2) (layers F.Cu F.Paste F.Mask) ${p.GND.str})
    (pad 44 smd rect (at ${footprint_spacing.x} -${footprint_spacing.y} ${p.rot}) (size 2 1.2) (layers F.Cu F.Paste F.Mask) ${p.din.str})
    



    (fp_line (start -1.75 -1.75) (end -1.75 1.75) (layer Edge.Cuts) (width 0.15))
    (fp_line (start -1.75 1.75) (end 1.75 1.75) (layer Edge.Cuts) (width 0.15))
    (fp_line (start 1.75 1.75) (end 1.75 -1.75) (layer Edge.Cuts) (width 0.15))
    (fp_line (start 1.75 -1.75) (end -1.75 -1.75) (layer Edge.Cuts) (width 0.15))

    (fp_line (start -2.5 -2.5) (end -2.5 2.5) (layer B.SilkS) (width 0.15))
    (fp_line (start -2.5 2.5) (end 2.5 2.5) (layer B.SilkS) (width 0.15))
    (fp_line (start 2.5 2.5) (end 2.5 -2.5) (layer B.SilkS) (width 0.15))
    (fp_line (start 2.5 -2.5) (end -2.5 -2.5) (layer B.SilkS) (width 0.15))

    (fp_poly (pts (xy -4 2.2) (xy -4 0.375) (xy -5 1.2875)) (layer B.SilkS) (width 0.1))

    (pad 12 smd rect (at -${footprint_spacing.x} -${footprint_spacing.y} ${p.rot}) (size 2 1.2) (layers B.Cu B.Paste B.Mask) ${p.din.str})
    (pad 23 smd rect (at -${footprint_spacing.x} ${footprint_spacing.y} ${p.rot}) (size 2 1.2) (layers B.Cu B.Paste B.Mask) ${p.GND.str})
    (pad 34 smd rect (at ${footprint_spacing.x} ${footprint_spacing.y} ${p.rot}) (size 2 1.2) (layers B.Cu B.Paste B.Mask) ${p.dout.str})
    (pad 45 smd rect (at ${footprint_spacing.x} -${footprint_spacing.y} ${p.rot}) (size 2 1.2) (layers B.Cu B.Paste B.Mask) ${p.VCC.str})

    (pad 50 thru_hole circle (at -${via_spacing.x} -${via_spacing.y}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.din.str})
    (pad 51 thru_hole circle (at -${via_spacing.x} ${via_spacing.y}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.GND.str})
    (pad 52 thru_hole circle (at ${via_spacing.x} ${via_spacing.y}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.dout.str})
    (pad 53 thru_hole circle (at ${via_spacing.x} -${via_spacing.y}) (size 0.8 0.8) (drill 0.4) (layers *.Cu *.Mask) ${p.VCC.str})
      
)
`
    if (p.reverse) {
      return `
            ${double_sided} ${traces}
          `
    } else {
        return `
            ${standard}
      `
    }
  }
}
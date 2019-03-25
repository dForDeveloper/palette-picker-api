const projects = [
  {
    name: 'project a',
    palettes: [
      {
        name: 'palette i',
        color1: '#ffffff',
        color2: '#ff0000',
        color3: '#fff000',
        color4: '#000fff',
        color5: '#0000ff'
      },
      {
        name: 'palette j',
        color1: '#aaaaaa',
        color2: '#aa0000',
        color3: '#aaa000',
        color4: '#000aaa',
        color5: '#0000aa'
      }
    ]
  },
  {
    name: 'project b',
    palettes: [
      {
        name: 'palette x',
        color1: '#666666',
        color2: '#660000',
        color3: '#666000',
        color4: '#000666',
        color5: '#000066'
      },
      {
        name: 'palette y',
        color1: '#222222',
        color2: '#220000',
        color3: '#222000',
        color4: '#000222',
        color5: '#000022'
      },
      {
        name: 'palette z',
        color1: '#888888',
        color2: '#880000',
        color3: '#888000',
        color4: '#000888',
        color5: '#000088'
      }
    ]
  }
];

exports.seed = async (knex, Promise) => {
  await knex('palettes').del();
  await knex('projects').del();
  const projectPromises = [];
  await projects.forEach(project => {
    projectPromises.push(createProject(knex, project));
  });
  return Promise.all(projectPromises);
};

const createProject = async (knex, project) => {
  const id = await knex('projects').insert({ name: project.name }, 'id');
  const palettePromises = [];
  await project.palettes.forEach(palette => {
    palettePromises.push(
      createPalette(knex, { ...palette, project_id: parseInt(id) })
    );
  });
  return Promise.all(palettePromises);
};

const createPalette = async (knex, palette) => {
  return knex('palettes').insert(palette);
}

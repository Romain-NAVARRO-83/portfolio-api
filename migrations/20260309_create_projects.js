export const up = (pgm) => {
  pgm.createTable('projects', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') }
  });
  pgm.createIndex('projects', 'created_at');
};

export const down = (pgm) => {
  pgm.dropTable('projects');
};

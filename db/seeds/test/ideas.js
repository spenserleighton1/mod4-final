exports.seed = function(knex, Promise) {
  return knex('ideas').del()
    .then(function () {
      return Promise.all([
        knex('ideas').insert({
          title: 'idea one',
          body: 'Hey, you know what? I really hope this works...'
        }),
      ]);
    });
};
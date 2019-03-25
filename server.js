const app = require('./app');

app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/v1', require('./routes/api/v1'));

app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const polyclinicRoutes = require('./routes/polyclinicRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const queueRoutes = require('./routes/queueRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/polyclinics', polyclinicRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
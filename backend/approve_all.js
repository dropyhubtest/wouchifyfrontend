const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://rahuldropyhub_db_user:Wouchify%402026@cluster0.shilkmv.mongodb.net/wouchify';
mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  const result = await mongoose.connection.collection('stores').updateMany(
    {}, 
    { $set: { opsManagerApproval: 'Approved', managerApproval: 'Approved' } }
  );
  console.log('Updated stores:', result.modifiedCount);
  const resultCoupons = await mongoose.connection.collection('coupons').updateMany(
    {}, 
    { $set: { opsManagerApproval: 'Approved', managerApproval: 'Approved' } }
  );
  console.log('Updated coupons:', resultCoupons.modifiedCount);
  process.exit(0);
}).catch(console.error);

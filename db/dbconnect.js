const mongoose = require("mongoose");

const initializeDBConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Database Connection Failed...", error);
  } finally {
  }
};

module.exports = initializeDBConnection;

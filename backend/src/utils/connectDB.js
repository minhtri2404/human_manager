const mongoose = require("mongoose");

const connectDB = async () => {
    console.log("🔍 MONGO_URL:", process.env.MONGODB_URL); 
    
    if (!process.env.MONGODB_URL) {
        console.error("❌ Lỗi: MONGO_URL không được tìm thấy trong .env");
        process.exit(1);
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ DB Connected");
    }catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error.message);
    }
};
module.exports = connectDB

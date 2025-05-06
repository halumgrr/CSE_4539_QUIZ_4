const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    uid: {
        type: Number,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }
});

// Auto-generate UID before saving
usersSchema.pre('save', async function(next) {
    if (!this.uid) {
        const lastUser = await this.constructor.findOne({}, {}, { sort: { uid: -1 } });
        this.uid = lastUser ? lastUser.uid + 1 : 1;
    }
    next();
});

module.exports = mongoose.model("Users", usersSchema);
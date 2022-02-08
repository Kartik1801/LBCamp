((mongoose, Schema, passportLocalMongoose) => {
    const userSchema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true
        }
    });
    userSchema.plugin(passportLocalMongoose);
    const User = mongoose.model('User', userSchema);
    module.exports = User;
})(
    require('mongoose'),
    require('mongoose').Schema,
    require('passport-local-mongoose')
)
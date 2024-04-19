const {Schema,model}=require('mongoose')

const UserSchema = new Schema(
  {
    Username: {
      type: String,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
    },Role:{
      type:String,
      default:'user'
    },
    Provider:{
      type:String,
      default:'credentials'
    },
    Avatar:{
      type:String,
      default:'dummyUser.jpg'
    }
  },
  { timestamps: true },
);

const UserModel=model("User", UserSchema);

module.exports = {UserModel}
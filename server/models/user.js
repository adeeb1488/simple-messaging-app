import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
const modelUser =  mongoose.Schema(
    {
       user_name: {
        type: String,
        required: true,

       },
       email: {
        type: String,
        required: true,
        unique: true,
        // validator: validator.isEmail()
        
        
       },
       pass: {
        type: String,
        required: true,
        
       },
       profile_pic:{
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
       }


    },{timestamps:true}
);

modelUser.methods.checkPass = async function(enteredPass) {
return await bcrypt.compare(enteredPass,this.pass)
}

modelUser.pre('save', async function (next) {
    if(!this.isModified)
    {
        next()
    }
    const s = await bcrypt.genSalt(10);
    this.pass = await bcrypt.hash(this.pass, s)
})
const finalUserModel = mongoose.model("chat_user", modelUser);
export default finalUserModel
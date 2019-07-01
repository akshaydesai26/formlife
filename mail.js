const nodemailer = require('nodemailer');
const mailGun=require('nodemailer-mailgun-transport');

const auth={
    auth:{
        api_key:'30824bef43ed727b1bb21868c6e5b53e-52b0ea77-c3b796f4',
        domain:'sandbox0ee67d7af7f14dc089b2f0a33daa4102.mailgun.org'
    }
};

const transporter=nodemailer.createTransport(mailGun(auth));

const sendMail = (email,text,cb)=>{

    const mailOptions={
        from: 'akshaydesai26@gmail.com',
        to:email,
        subject:'Query answered',
        text:text
    };
    transporter.sendMail(mailOptions,function(err,data){
        if(err){
            //console.log('Error Occurs');
            cb(err,null);
        } else{
            cb(null,data);
        }
    });

}

module.exports=sendMail;


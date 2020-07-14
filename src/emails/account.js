
// // const sgmail=require('@sendgrid/mail')
// // const sendgridapikey=''//would get this value from the app this would usually would not be included in the project


// // sgmail.setApiKey(sendgridapikey)//this would allow us to get recognized by send grid
//sgmail.setApiKey(process.env.sendgridapikey) we will do this finally before pushing it to git
// // sgmail.send({
// //     to:'dalakotikritik@gmail.com',
// //     from:'bkdksd@sd',
// //     subject:'this isme!',
// //     text:'dkhdkwhdkwdkwd'//can also add an html property to have a nice looking mail
// // })

// const sendwelcomemail=(email,name)=>{
//     sgmail.send({
//         to:email,
//         from:'ndkdkd',
//         subject:'wedhwk',
//         text:`welcome name $(name)`,//here used a special character as inverted comas which help in accesing name
//         html:''//can use this property and we can write all the html tags to make our email more fascinating
//     })
// }
// const sendcancelemail=(email,name)=>{
//     sgmail.send({
//         to:email,
//         from:'sdkd',
//         subject:'kdbkd',
//         text:'dlndl'
//     })
// }

// module.exports={
//     sendwelcomeemail,
//     sendcancelemail
// }
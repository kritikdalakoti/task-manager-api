const {calculatetip,fahrenheitToCelsius,celsiusToFahrenheit,add}=require('../src/math')
test('calculatetotal',()=>{
const total=calculatetip(10,0.3)

expect(total).toBe(13)

})
test('without tip',()=>{
    const total=calculatetip(10)
    expect(total).toBe(12.5)
})
test('celsius to fahrenheit',()=>{
    const fahr=celsiusToFahrenheit(0)
    expect(fahr).toBe(32)
})
test('fahr to celsius',()=>{
    const cel=fahrenheitToCelsius(32)
    expect(cel).toBe(0)
})
// test('async testdemo',(done)=>{

//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000);

  
// })
test('add nos',(done)=>{
   add(2,3).then(sum=>{
        expect(sum).toBe(5)
        done()
   }) 
}) 
test('should add 2 nos',async()=>{
    const sum=await add(2,3)
    expect(sum).toBe(5)
})
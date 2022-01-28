((mongoose, Campground, citiesArray,{places, descriptors}) =>{

    mongoose.connect('mongodb://localhost:27017/lb-camp');
    mongoose.connection.on(`error`, console.error.bind(console, "connection error!"));
    mongoose.connection.once(`open`, () => console.log("Database Connected !"));

    const sample = array => array[Math.floor( Math.random() * array.length)]
    const seedDB = async () => {
        await Campground.deleteMany({});
        for ( let i = 0; i < 50; i++){
            const random = Math.floor( Math.random() * 1000);
            const camp = new Campground({
                title: `${sample(descriptors)} ${sample(places)} `,
                location: ` ${citiesArray[random].city}, ${ citiesArray[random].state}`
            });
           await camp.save(); 
        }
    }
    seedDB()
    .then(()=>{
        mongoose.connection.close();
    })
})(
    require('mongoose'),
    require('../models/campground'),
    require('./cities'),
    require('./seedHelpers')
)
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
                location: ` ${citiesArray[random].city}, ${ citiesArray[random].state}`,
                image: `https://source.unsplash.com/collection/483251`,
                description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor impedit facere dolores, corporis accusamus sed sunt est exercitationem! Sit voluptate sapiente delectus tempora recusandae soluta at hic libero odio aut.`
            }
            );
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


/** with express : framework,easily add more routes while keeping our application maintainable */
const express = require('express');
const app = express();
const Joi = require('joi');
//methods
// app.get();
// app.post();
// app.put();
// app.delete();

/** GET */
app.get('/', (req, res) => {
    res.send("Hello World!");
});
app.get('/api/courses', (req, res) => {
    res.send(courses);
});
//http://localhost:5000/api/posts/2021/02?sortby=name&filterby=year - route parameters & query string parameters
app.get('/api/posts/:year/:month', (req, res) => {
    //res.send(req.params); //to get all route params from url 
    //res.send(req.params.year);
    res.send(req.query); //to get all query params from url 
})
const courses=[
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
];
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => {
        return c.id === parseInt(req.params.id)
    });
    console.log(course)
    if(!course){
        res.status(404).send(`The course with id=${req.params.id} is not found`);
        return;
    }
    res.send(course);
    //res.send(req.params.id);
});

/** POST */
app.use(express.json()); //adding a piece of middleware (express.json()) to use in req processing pipeline app.use() ,enable parsing of json object in body of req
app.post('/api/courses', (req, res) => {
    //manual validation
    // if(!req.body.name || req.body.name.length<3){
    //     res.status(400).send('Name is required and should be minimum 3 characters');
    //     return;
    // }
    const each = {
        id:courses.length + 1,
        name:req.body.name
    };
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const result = schema.validate(req.body);
    console.log(result);
    if(result.error!=undefined){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    courses.push(each);
    res.send(each);
});

/** PUT */
app.put('/api/courses/:id', (req, res) => {
    //lookup the course 
    //if not existing, return 404
    const course = courses.find(c => {
        return c.id === parseInt(req.params.id)
    });
    if(!course){
        res.status(404).send(`The course with id=${req.params.id} is not found`); 
        return;
    }

    //validate 
    //if invalid return 400 - Bad request
    const { error } = validateCourse(req.body); //result.error - object restructuring
    if(error!=undefined){
        res.status(400).send(error.details[0].message);
        return;
    }

    //update course
    //return the updated course
    course.name = req.body.name;
    res.send(course)

});

function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}

/** DELETE */
app.delete('/api/courses/:id', (req, res) => {
    //look up the course
    //not existing, return 404
    const course = courses.find(c => {
        return c.id === parseInt(req.params.id)
    });
    if(!course) {
        res.status(404).send(`The course with id=${req.params.id} is not found`); 
        return;
    }

    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return the same course
    res.send(course);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port} `));



/** without express : not very maintainable */
//const http = require('http');
// const server = http.createServer((req, res)=>{
//     if(req.url === '/'){
//         res.write("Hello World!");
//         res.end();
//     }

//     if(req.url === '/api/courses'){
//         res.write(JSON.stringify([1, 2, 3]));
//         res.end();
//     }
// });
// server.listen(3000);
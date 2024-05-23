const http = require('node:http')
const fs = require('fs').promises
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    // Loads the HTML file using the fs module
    fs.readFile(__dirname + '/index.html')
        .then(data =>{
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(data)
        })    
        .catch(err => {
            res.writeHead(500)
            res.end(err)
        })

    // Handles POST request by submit button
    if (req.url === '/submit-form' && req.method === 'POST'){
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString()
        })    
        req.on('end', () =>{
            const formData = querystring.parse(body)

            fs.readFile(__dirname + '/db/database.json', (err, data) =>{
                let db = []
                if (data){
                    db = JSON.parse(data)
                }
                db.push(formData)

                fs.writeFile(__dirname + '/db/database.json', JSON.stringify(db), (err) =>{
                    if (err) throw err;
                    console.log("Form data submitted successfully!")
                })
            })
            // fs.appendFile(__dirname + '/db/database.json', JSON.stringify(formData) + '\n', (err) =>{
            //     if (err) throw err;
            //     console.log('Form data submitted successfully!')
            // })
        })   
    }
})

server.listen(3000, () => console.log("Server running quite fine"))
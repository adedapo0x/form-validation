const http = require('node:http')
const fs = require('fs')
const querystring = require('querystring')

const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    // Loads the HTML file using the fs module
    if (req.url === '/' && req.method === 'GET'){
        res.writeHead(200, {'Content-Type': 'text/html'})
        const readStream = fs.createReadStream(__dirname + '/index.html', 'utf8')
        readStream.pipe(res)
    }
    

//    Handles POST request by submit button
    else if (req.url === '/submit-form' && req.method === 'POST'){
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString()
        })    
        req.on('end', () =>{
            const formData = querystring.parse(body)
            
            // Get file content if any, adds new form data into it then write back to JSON file
            fs.readFile(__dirname + '/db/database.json', 'utf8', (err, data) =>{
                let db = []
                if (data){
                    db = JSON.parse(data)
                }
                db.push(formData) 

                fs.writeFile(__dirname + '/db/database.json', JSON.stringify(db, null, 1), err => {
                    if (err) throw err
                })
            })
        })   

    }

   
})

server.listen(PORT, () => console.log("Server running quite fine"))


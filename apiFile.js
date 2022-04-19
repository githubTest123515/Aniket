const https = require('https');
const fs = require('fs');

//
function printData(url) {
    https.get(url, (response) => {
        let data = '';
        response.on('data', (d) => {
            data += (d.toString());
        })
        response.on('end', () => {
            data = JSON.parse(data.toString())[0].lines;

            function itrFn(data) {
                let i = 0;
                return function print() {
                    console.log(data[i]);
                    i++;
                    i %= data.length;
                }
            }

            let inter = setInterval(itrFn(data), 3000);
            
            setTimeout(() => {
                clearInterval(inter);
            }, 15 * 60000);
        })
    })
}

//Gets the data from the api and stores it in the file
function getData(url) {
    return new Promise((resolve) => {
        https.get(url, (response => {
            let data = '';
            response.on('data', (d) => {
                data += (d.toString());
            })

            response.on('end', () => {
                //console.log(JSON.parse(data.toString()));
                let stringData = data.toString();


                fs.writeFile(`./dataFile.txt`, stringData, function (err) {
                    if (err) throw err;
                    resolve();
                });

            })
        }))
    })

}

//searches the first occurence of the spells by it's name and logs it onto the console.
async function search(searchName) {
    return new Promise(resolve => {
        fs.readFile('dataFile.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }

            data = JSON.parse(data);
            let flag = true;
            let res;
            for (x of data) {
                if (x.name === searchName) {
                    //console.log(x);
                    res = x;
                    flag = false;
                    break;
                }
            }
            if (flag) console.log(`Couldn't find the searched spell, try with some other spell!`);
            
            fs.appendFile(`./history.txt`, 'Search: ' + searchName + '\n', function (err) {
                if (err) throw err;
                resolve(res);
            });
        })
    })

}

function filterDataFile(filePath, filteredData) {
    return new Promise(resolve => {
        fs.writeFile(filePath, JSON.stringify(filteredData), function (err) {
            if (err) throw err;
            resolve();
        });
    })
}

//filter data on the basis of key and value provided by the user
const filter = async function (key, val, countr = 0, arr = []) {
    return new Promise(resolve => {

        fs.readFile('dataFile.txt', 'utf8', async (err, data) => {
            if (err) {
                console.error(err)
                return
            }


            data = JSON.parse(data);
            let filteredData = data.filter(item => {
                for (x in item) {
                    if (x === key && item[x] === val) {
                        return true;
                    }
                }
                return false;
            });
            resolve(filteredData);
            let flag = false;
            if (filteredData.length > 0) {
                //console.table(filteredData);
                flag = true;
            }
            else console.log('No spells found with the key and value provided, try with some other key/value.');
            //resolve();
            if (flag) {
                
                //unique id to store the filtered data in an unique file everytime the filter operation is performed
                id = Number(countr);
                let filePath = `./filteredData/file${countr}_${key}_${val}.txt`;

                //await updateFilterFiles(id, filePath, filteredData);
                arr.push(filePath);

                //new file is created to store the filtered data
                await filterDataFile(filePath, filteredData);

                //to maintain the history
                await updateHistory('filter: ' + `${filePath}\n`);

                //resolve();

            }
            else {
                await updateHistory('filter: ' + 'No Data filtered.');
                //resolve();
            }
            
        });
    })


};


function showHistory() {
    return new Promise(resolve => {
        fs.readFile('history.txt', 'utf8', (err, history) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(history);
            resolve();
        })
    })

}

//To update history every time any operation is performed.
function updateHistory(status) {
    return new Promise(resolve => {
        fs.appendFile(`./history.txt`, status, function (err) {
            if (err) throw err;
            //console.log('Data Updated!');
            resolve();
        });
    })
}

function deleteSpell(spellName) {
    return new Promise(resolve => {
        fs.readFile('./dataFile.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            //console.log(JSON.parse(data));
            data = JSON.parse(data);
            let deletedData = data.filter((item) => item.name === spellName);
            data = data.filter((item) => item.name !== spellName);
            
            fs.writeFile('./dataFile.txt', JSON.stringify(data), (err) => {
                if (err) throw err;
                resolve(deletedData);
            })
        })
    });
}

module.exports.getData = getData;
module.exports.printData = printData;
module.exports.filter = filter;
module.exports.search = search;
module.exports.showHistory = showHistory;
module.exports.deleteSpell = deleteSpell;
// module.exports = {
//     add : function(inp1, inp2){
//         return inp1 + inp2;
//     }
// }
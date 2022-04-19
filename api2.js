let apiFn = require('./apiFile');
let readline = require('readline');
let https = require('https');
let fs = require('fs');
const url = "https://wizard-world-api.herokuapp.com/Spells";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



async function main(){
    await apiFn.getData(url);
    rl.question(`What is your choice?\n1.Search\n2.Filter\n3.History\n4.Delete\n`, async (choice) => {
        console.log(`Your entered choice is ${choice}`);
          await options(Number(choice));
    });
}
let countr = 0;
const arr = [];
main();


async function options(choice){
        switch(choice){
            case 1:
                //console.log("case1");
                rl.question('Enter a name to search: ', async (searchName) => {
                    //console.log(`your entered search is ${searchName}`);
                    console.log(await apiFn.search(searchName));
                    toCont();
                });
                
                break;
            case 2:
                rl.question('Enter filter Details \nEnter key: ', async (key) => {
                    rl.question("Enter value: ", async (value) => {
                        console.table(await apiFn.filter(key, value, countr++, arr));
                        //await apiFn.filter(key, value, countr++, arr)
                        toCont();
                        
                    })
                })
                break;
            case 3:
                await apiFn.showHistory();
                toCont();
                //rl.close();
                break;
            case 4:
                rl.question('Enter name of the spell to Delete: ', async choice =>{
                    await apiFn.deleteSpell(choice);
                    toCont();
                })
                
                
                //rl.close();
                break;
    
            default:console.log("Invalid Input");
                    toCont();
            
        }
       
}

async function toCont(){
    return new Promise(async resolve => {
        rl.question('Do you want to continue(y/n)? ', async (choice) =>{
            if(choice === 'y'){
                    rl.question(`What is your choice?\n1.Search\n2.Filter\n3.History\n4.Delete\n`, async (choice) => {
                    console.log(`Your entered choice is ${choice}`);
                    await options(Number(choice));
                
                });
            }
            else if(choice === 'n'){
                rl.close();
                fs.writeFile('./history.txt', '', (err) =>{
                    if(err) throw err;
                })
                for(x of arr){
                    fs.unlink(x, (err) =>{
                        if(err) throw err;
                    })
                }
            }
            else{
                console.log(`Invalid Input\nYou can only enter(y/n): `);
                await toCont();

            }
            resolve();
        })
    })
}


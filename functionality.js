
let tourist_place = JSON.parse(localStorage.getItem('tourist_place')) || [{
    "name": "Sadapathor",
    "address": "Bholagonj, Sylhet",
    "rating": "4.5",
    "picture": "/image/Bholagonj.jpg",
},
{
    "name": "Swamp Forest",
    "address": "Ratargul, Sylhet",
    "rating": "4.9",
    "picture": "/image/Ratargul.jpg",
},
];
function updateLocalStorage() {
    localStorage.setItem('tourist_place', JSON.stringify(tourist_place));
}
function deleteLocalStorage()
{
    localStorage.removeItem('tourist_place');
}
// deleteLocalStorage();
if(window.location.pathname==='/newFile.html')
{
    // Add Elements To Table 
    function initTable()
    {
        const Table = document.querySelector('table');
        for(i=0;i<tourist_place.length;i++)
        {
            const Tr = document.createElement('tr');
            Tr.setAttribute('name',tourist_place[i]['name']);
            for(attribs in tourist_place[i])
            {
                const Td = document.createElement('td');
                if(attribs==="picture")
                {
                    const img = document.createElement('img');
                    img.setAttribute('src',`${tourist_place[i][attribs]}`);
                    img.setAttribute('alt',`${tourist_place[i][attribs]}`);
                    Td.appendChild(img);
                }
                else
                {
                    Td.setAttribute('class',`${attribs}`);
                    Td.innerHTML = `${tourist_place[i][attribs]}`;
                }
                Tr.appendChild(Td);
            }
            const btn = document.createElement('button');
            const btn1 = document.createElement('button');
            const Td = document.createElement('td');
            Td.setAttribute('class','button-column');
            btn.setAttribute('class','update-button');
            btn.innerHTML="Update";
            btn.addEventListener('click',(e)=>{
                let fieldName = window.prompt('Enter Column Name.');
                let value = window.prompt('Enter a value');
                let ok = false;
                for(i=0;i<Tr.children.length;i++)
                {
                    let tempTd = Tr.children[i];
                    if(tempTd.getAttribute('class')===fieldName)
                    {
                        tempTd.innerHTML=value;
                        ok = true;
                        updateLocalStorage();
                        break;
                    }
                }
                if(!ok)
                {
                    alert('Coulmn Name is Invalid!');
                }
            });
            Td.appendChild(btn);
            btn1.setAttribute('class','delete-button');
            btn1.innerHTML="Delete";
            // btn1.addEventListener('click',()=>{
            //     let name;
            //     for(i=0;i<Tr.children.length;i++)
            //     {
            //         if(Tr.children[i].getAttribute('class')==='name')
            //         {
            //             name = toString(Tr.children[i].innerHTML);
            //         }
            //     }
            //     for(i=0;i<tourist_place.length;i++)
            //     {
            //         if(tourist_place[i]['name']===name)
            //         {
            //             tourist_place[i].remove();
            //             updateLocalStorage();
            //         }
            //     }
            // });
            Td.appendChild(btn1);
            Tr.appendChild(Td);
            Table.appendChild(Tr);
        }
    }
    initTable();
    // Query Result
    const  query = document.getElementById('search_field');
    let search_fieldCharacters=0;
    query.addEventListener('input',(e)=>{
        let prefix = e.target.value;
        if(search_fieldCharacters>prefix.length)
        {
            let rows = document.querySelectorAll('tr');
            rows.forEach((row)=>{
                row.remove();
            });
            initTable();
        }
        search_fieldCharacters=prefix.length;
        if(prefix.length>0)
        {
            let rows = document.querySelectorAll('tr');
            rows.forEach((row)=>{
                const str = row.getAttribute('name');
                if(str && str.toLowerCase().indexOf(prefix)<0)
                {
                    row.remove();
                }
            })
        }
    });
    
    // Update TouristPlace()
    // function onUpdate(tableRow)
    // {
    //     console.log(tableRow.children[0]);
    //     if(tableRow)
    //     {
    //         console.log(tableRow);
    //         let fieldName = window.prompt('enter a column name');
    //     //     let ok = false;
    //     //     for(i=0;i<tableRow.children.length;i++)
    //     //     {
    //     //         let row = tableRow.children[i];
                
    //     //         if(row.getAttribute('class')===fieldName)
    //     //         {
    //     //             let value = window.prompt('enter a new value');
    //     //             row.innerHTML=value;
    //     //             ok = true;
    //     //             break;
    //     //         }
    //     //     }
    //     //     if(!ok)
    //     //     {
    //     //         alert("your column name is invalid!");
    //     //     }
    //     }
    // }
}
// First Page functionality

if(window.location.pathname==='/Assignment1.html')
{
    // Add New Tourist Spot
    const form = document.getElementById('newTouristSpot');
    form.addEventListener('submit',(e)=>{
        // e.preventDefault();
        const name = document.getElementById('Location_Name').value;
        const address = document.getElementById('Location_Address').value;
        const rating = document.getElementById('Location_Rating').value;
        const image = document.getElementById('Location_Image').files[0];
        const imgPath = '/image/'+image.name;
        let newPlace = {};
        newPlace['name']=name;
        newPlace['address']=address;
        newPlace['rating']=rating;
        newPlace['picture']=imgPath;
        tourist_place.push(newPlace);
        updateLocalStorage();
        console.log(tourist_place);
    })
}
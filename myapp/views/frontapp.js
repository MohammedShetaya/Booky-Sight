
const docID = document.querySelector('title').id ; 

if (docID === 'searchresults') {

    window.addEventListener('load' , async function(event) {

        const response = await fetch( '/searchresults' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            } 
        }) ;

        const data = await response.json() ;
        const searchResults = data.searchResults ;   
        let div = document.getElementById('search-results') ;

        if (searchResults.length == 0 ) {
        const newDiv = document.createElement('div') ; 
        newDiv.style.color = 'white' ;
        newDiv.style.fontSize = '1.5em';
        newDiv.innerHTML = 'NO RESULTS FOUND' ;
        newDiv.style.marginLeft = '30px' ;
        div.appendChild(newDiv) ;    
        }
        else{
        for(let i = 0 ; i< searchResults.length ; i ++   ){
            const newButt = document.createElement('button') ;
            const newP = document.createElement('p') ;
            const newLink = document.createElement('a') ;
            const newDiv = document.createElement('div') ;
            newButt.innerHTML = searchResults[i].name ;
            newButt.setAttribute('class' ,'btn btn-secondary ml-3' ) ; 
            newP.innerHTML = searchResults[i].disc ;
            newP.style.marginLeft = '40px'; 
            newP.style.paddingRight = '60px' ; 
            newP.style.color = 'white' ;   
            newLink.appendChild(newButt) ; 
            newLink.appendChild(newP) ;
            newLink.setAttribute('href' , '/'+searchResults[i].id) ;
            newDiv.appendChild(newLink) ;
            newDiv.style.marginBottom = '30px' ; 
            div.appendChild(newDiv) ; 
        }

    }


    }); 

}

if (docID === 'readlist'){

window.addEventListener('load' , async function (event) {
    const pageTitle = docID.toLowerCase() ;
    const url = '/' + pageTitle ;
    event.preventDefault() ; 
    const response = await fetch( url , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        } 
    }) ; 

    const data = await response.json() ;
    const readlist = data.readlist ;

    const div = document.getElementById('list') ;
    let newUL = document.createElement('ul') ; 

    for(let i = 0 ; i < readlist.length ; i ++ ) {

        let newLI = document.createElement('li') ;
        let newLink = document.createElement('a') ; 
        newLink.href = '/' + readlist[i].bookID ;
        let newButt = document.createElement('button') ; 
        newButt.innerHTML = readlist[i].bookName ;
        newLI.style.marginBottom = '20px';  
        newButt.setAttribute('class' , 'btn btn-secondary ml-3') ; 
        newLink.appendChild(newButt) ;
        newLI.appendChild(newLink) ; 
        newUL.appendChild(newLI) ;   
    }
    div.appendChild(newUL) ;
});

}

const addButtton = document.getElementById('add-book') ;

if (addButtton != null)  
addButtton.addEventListener('click' , function(event) {
    addButtton.innerHTML = 'Added' ;
    const pageTitle = docID.toLowerCase() ;
    const url = '/' + pageTitle ;
    const data = {bookID :pageTitle , bookName : document.getElementById(docID).innerHTML} ;     
    fetch( url , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) 
      }) ;  
});

const logOutButton = document.getElementById('logout') ;

if(logOutButton != null) {
    logOutButton.addEventListener('click' , async function (event) {
         const res = await fetch( '/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            } 
          }) ;
    });
}

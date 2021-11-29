import React, {useState, useEffect, useRef} from 'react'
import Stock from './Chart/Stock'


const Searchbar = () => {
  const [stockSymbol, setStockSymbol] = useState('')
  const [apiSymbol, setApiSymbol ] = useState([])
  const [searchSymbol, setSearchSymbol] = useState('')
  
  const searchInput = useRef();
  const inputRef = useRef();
  const suggList = useRef();

  const API_KEY = "KT7CW1QXDZBDGCIH.";
  
  
  useEffect(() => {
  onChange();
  }, [stockSymbol])
  
   // Search Endpoint - Fetch Data from API
   function onChange (){ 
     if(stockSymbol !== ''){
      let APISymbol  = []
      let API_Call = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockSymbol}&apikey=${API_KEY}`
   
       fetch(API_Call)
       .then (function (response) {
           return response.json()
       }).then(function (data) {
       
           // get an Array of suggestions
          for(var key=0; key < data['bestMatches'].length; key++){
            // push everything in Var APISymbol
              APISymbol.push(data['bestMatches'][key]['1. symbol'])
         }
         //show only max. 5 suggestions
         if(APISymbol.length > 5){
          setApiSymbol(prevData => APISymbol.slice(0, 5));
         }
         else{
          setApiSymbol(prevData => APISymbol);
         }     
       })
     }}

      //set Value of Input equal to selected Stock 
  function select(element){
    let selectData = element.target.textContent;
    inputRef.current.value = selectData
    setSearchSymbol(selectData)
    //if element is selected, don´t show suggestions 
    // setStockSymbol('')
    }
    
     // display suggestions
      const renderApiSymbol = () => {
          return apiSymbol.map((data)=> {
                return <li className="symbols"  id = {data} ref={suggList} key={data} onClick={select}  onKeyDown={highlight}>{data}</li> 
                ;
              })}
    
    //highlight selected Symbol 
    let currentLi = 0; 
    const highlight = (e) => {
      if(e.keyCode === 40 && currentLi === 0){
        document.getElementById(apiSymbol[currentLi]).classList.add('highlight')
        
        currentLi++
        
      }
      else if (e.keyCode === 40 && currentLi < apiSymbol.length){
        document.getElementById(apiSymbol[currentLi-1]).classList.remove('highlight');
        document.getElementById(apiSymbol[currentLi]).classList.add('highlight');
        console.log(inputRef)
        inputRef.current.value = document.getElementById(apiSymbol[currentLi]).id
        currentLi++

      }
      else if(e.keyCode === 38 && currentLi > 1){
        document.getElementById(apiSymbol[currentLi-2]).classList.add('highlight');
        document.getElementById(apiSymbol[currentLi-1]).classList.remove('highlight');
        currentLi--
      }
  }
  


  return (
    <div>
      <div ref={searchInput} id='search-input' className='search-input'> 
        <input ref={inputRef} className = 'searchbar' type='text' placeholder='Searchbar...'  onKeyUp={(e) => {{setStockSymbol(e.target.value.toUpperCase())}}} onKeyDown={highlight}/>
       {stockSymbol !== '' && renderApiSymbol() }
      </div>  
     { searchSymbol !== '' && <Stock stockSymbol = {searchSymbol}></Stock>}
    </div>
)    
  }
  
  export default Searchbar

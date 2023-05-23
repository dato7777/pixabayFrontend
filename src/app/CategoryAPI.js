// A mock function to mimic making an async request for data
// async (Stage#2)
import axios from "axios";

// adding category="cars",page = 1, sorting='popular as default, to avoid conflictable results at start
//fetching data from API backend, collecting it and passing to CategoriesSlice.js component
export function getCategories(category = "cars", page = 1, sorting='popular' ) {
  // Defining the requested url, adding parameter "category" at the end which is selected in 
  // CategoriesSelection component 
  const timestamp = Date.now(); // to avoid cached results
  //  "localhost:3001/api/pixabay" is my assigned route in my working backend node.js
  const URL_GET_CATS = `http://localhost:3001/api/pixabay?category=${encodeURIComponent(category)}&page=${page}&timestamp=${timestamp}&order=${sorting}`
  return new Promise((resolve) =>
    axios(URL_GET_CATS).then((res) => {
      resolve({ data: res.data });
    })
  );
}
//updating and fetching data from API backend, collecting it and passing to CategoriesSlice.js component
export function updateSelectedCategory(category, page = 1, sorting='popular' ) {
  const timestamp = Date.now();
  const URL_GET_CATS = `http://localhost:3001/api/pixabay?category=${encodeURIComponent(category)}&page=${page}&timestamp=${timestamp}&order=${sorting}`
  
  return new Promise((resolve) =>
    axios(URL_GET_CATS).then((res) => {
      resolve({ data: res.data });
    })
  );
}




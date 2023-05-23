import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesAsync, selectCateg, updateSelectedCategoryAsync, selectPageNumber, setPageNumber, setSorting, selectSorting } from './CategoriesSlice';

// Defining categories for selection after modal opens
// Here comes the selection handling componentfunction, together with triggering "getCategoriesAsync" 
// with updated category, together with useEffect hook it should be inside the main component,
// but it comes in conflict with react rules, so this is the best division version I found.
const categories = ["backgrounds", "Nature", "fashion", "food", "Space", "science", "business", "Animals"]

const CategoriesSelection = ({ onSelect, modal }) => {
    const sorting = useSelector(selectSorting)
    const currentPageNumber = useSelector(selectPageNumber)
    const dispatch = useDispatch();
    const myNewCateg = useSelector(selectCateg)
    const [selectedCategory, setSelectedCategory] = useState(null);
  
    //...UseEffect hook to update and then fetch data asynchronously if the category is selected, 
    //  based on values of category, sorting and page number  
    useEffect(() => {
        if (selectedCategory !== null) {
            onSelect(selectedCategory);
            modal.toggle();
            dispatch(updateSelectedCategoryAsync({ category: selectedCategory, sorting: sorting }));
            dispatch(getCategoriesAsync({ selectedCategory, currentPageNumber:1, sorting }));
        }
    }, [selectedCategory, dispatch, onSelect, modal, myNewCateg]);

    //...Handling the selection of category ....//
    const handleSelect = (category) => {
        setSelectedCategory(category); //updating value of selection option category
        dispatch(setPageNumber(1)); // updating value of page number to 1, so that after every selection
        // page should be set to 1
        console.log("state of pageNumber CategoriesSelection", currentPageNumber)
        setSorting(sorting) //sorting value ("id" or "latest" is updated)
        dispatch(getCategoriesAsync({ selectedCategory, currentPageNumber, sorting })); //async call
        
    };
    return (
        <div>
            {/* startin to loop through the selection categories defined at the top of the page */}
            {categories.map((category) => (
                <button
                    key={category}
                    // activating handleselect function while category is being selected
                    onClick={() => handleSelect(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    )
}
export default CategoriesSelection


import React from 'react'
import '../css/buttons.css'
import '../css/myGrid.css'
import '../css/modalBox.css'
import '../css/pageNumber.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getCategoriesAsync, selectmainInfo, setSorting, selectSorting, setPageNumber, updateSelectedCategoryAsync, selectPageNumber, imageSortAsync } from './CategoriesSlice';
import CategoriesSelection from './CategoriesSelection'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ImageSort from './ImageSort'

// Here goes the Main Visual component with function usages, the name "Categories" may not be  
// very successful, but I started with it, so was lazy enough not to change the name
const Categories = () => {
    const sorting = useSelector(selectSorting) //defining variable for the state of sorting from reducer
    const currentPageNumber = useSelector(selectPageNumber) //defining variable for the state of pageNumber from reducer
    const updatedMainInfo = useSelector(selectmainInfo) // defining variable of the mainInfo state variable from reducer
    const [open, setOpen] = useState(() => Array(updatedMainInfo.length).fill(false)); //controlling open/close state
    const [modalOpen, setModalOpen] = useState(false); //modal state control (open/close) variable
    const [totalPages, setTotalPages] = useState(0); // defining variable for total pages of the result(payload)
    const [selectedCategory, setSelectedCategory] = useState(null); //defining variable for the selected category
    const dispatch = useDispatch();

    //...Handling the sorting option when selected from Imagesort.js component....//
    const handleSortChange = (option) => {
        dispatch(setSorting(option)); // Dispatch the sorting option
        dispatch(imageSortAsync(option)); // Dispatch the async thunk to perform the sorting
    };
    //...Handling the modal toggling....//
    const handleModalToggle = () => {  //modal closing/opening handling, used inside buttons
        setModalOpen(!modalOpen);
    };
    //...Handling the "open" state of the element....//
    const handleOpen = (index) => {   //ensures that only the selected element's state 
        //is updated(open) while keeping the other elements' states unchanged.
        setOpen(prevState => {
            const newState = [...prevState];
            newState[index] = true;
            return newState;
        });
    };
    //...Handling the "close" state of the element....//
    const handleClose = (index) => {  //ensures that only the selected element's state 
        //is updated(closed) while keeping the other elements' states unchanged.
        setOpen(prevState => {
            const newState = [...prevState];
            newState[index] = false;
            return newState;
        });
    };
    //...UseEffect hook to fetch data asynchronously based on category, page number and sorting
    //values, while also retrieving values for total pages number and the page number....//
    useEffect(() => {
        dispatch(getCategoriesAsync({ category: selectedCategory, currentPageNumber, sorting })).then((data) => {
            setTotalPages(data.payload.totalPages);
            setPageNumber(currentPageNumber);
        });
    }, [dispatch, selectedCategory, currentPageNumber, sorting]); //dependencies 

    //...Handling the selection of category ....//
    const handleCategorySelect = async (category) => {
        setSelectedCategory(category); // Update the selected category state
        await dispatch(updateSelectedCategoryAsync({ category, sorting })); // Dispatch the async action and wait for it to complete
        await dispatch(getCategoriesAsync({ category, currentPageNumber, sorting })); // Dispatch the async action and wait for it to complete

    };
    //...Handling the "next" page button behaviour and dispatching relevant functions....//
    const handleNextPage = async () => { //async action
        const nextPage = currentPageNumber + 1; //assigning variable for increased value of pageNumber
        dispatch(setPageNumber(nextPage)); //activating function to update page number based on new variable

        if (selectedCategory) { //following actions will take place if category is selected:
            const category = selectedCategory.category || selectedCategory; //extracting the category value from selectedCategory object, and if it is a string, assigns directly to category
            await dispatch(updateSelectedCategoryAsync({ category, sorting })); // async action for updating redux store category and sorting
            await dispatch(getCategoriesAsync({ category, nextPage, sorting })); //fetching main info based on categoru, page and sorting values
            setPageNumber(nextPage); //updating pageNumber state with new assigned value
        }
    };
    //...Handling the "previous" page button behaviour and dispatching relevant functions....//
    const handlePrevPage = async () => {
        const prevPage = currentPageNumber - 1; //assigning variable for decreased value of pageNumber
        dispatch(setPageNumber(prevPage)); //activating function to update page number based on new variable

        if (selectedCategory) {
            const category = selectedCategory.category || selectedCategory; //extracting the category value from selectedCategory object, and if it is a string, assigns directly to category
            await dispatch(updateSelectedCategoryAsync({ category, sorting })); // async action for updating redux store category and sorting
            await dispatch(getCategoriesAsync({ category, prevPage, sorting })); //fetching main info based on categoru, page and sorting values
            setPageNumber(prevPage); //updating pageNumber state with new assigned value
        }
    };

    return (
        <div>
            {/* ....................................... */}
            {/* If page number is more than 1, "previous" button appears on the left side of the screen , this button triggers 
            handlePrevPage function*/}
            <div className='previous'>
                {currentPageNumber > 1 && (
                    <button className='previousButton' onClick={handlePrevPage}>
                        &laquo; Previous
                    </button>
                )}
            </div>
            {/* ....................................... */}
            <div >
                {/* Here is the main Button of selection of categories, which appears in the top center of the screen */}
                <button className='button' onClick={handleModalToggle}>CHOOSE CATEGORY</button>
                <Modal  //after clicking it, modal opens with several categories to choose from
                    open={modalOpen} //handling of opening of the modal
                    onClose={handleModalToggle}  // ..closing
                    aria-labelledby="modal-modal-title" //css
                    aria-describedby="modal-modal-description" //css
                >
                    <Box className="boxStyle">
                        {/* Modal box appearance and closing handling */}
                        <Typography className='buttonContainer' >
                            {/* Here I import CategoriesSelection.js component, which is responsible for displaying and selection of categories */}
                            <CategoriesSelection onSelect={handleCategorySelect} modal={{ toggle: handleModalToggle }} ></CategoriesSelection>
                        </Typography>
                    </Box>
                </Modal>
            </div>
            {/* ........................................ */}
            {/* If page number (last one) is less or equal to total number of pages, "next" button appears on the right side of the 
            screen, this button triggers handleNextPage function*/}
            <div className='next'>
                {currentPageNumber <= totalPages && (
                    <button className='nextbutton' onClick={handleNextPage}>
                        &raquo; Next
                    </button>
                )}
            </div>
            {/* ......................................... */}
            {/* Importing the ImageSort.js component with its sorting options selection element  */}
            <div>
                <ImageSort handleSortChange={handleSortChange}></ImageSort>
            </div>
            {/* ......................................... */}
            {/* Displaying the number of a page  */}
            <span className="page-number active-page">PAGE {currentPageNumber}</span>
            {/* ......................................... */}
            {/* Here comes the Main visual element, grid of 3x3 images, 9 results per page, updatedMainInfo is the state of 
                mainInfo(results returned based on request from main component to reducer to API) */}
            <div className="show-grid">
                {/* Avoiding of the empty array error, logical short "if" comes to help , */}
                {Array.isArray(updatedMainInfo) && updatedMainInfo.map((pic, index) => {
                    //Looping through the new results
                    return (
                        //grid of 3x3 display of images
                        <div id="showgrid" key={pic.id}>
                            <div className="row">
                                {/* images resemble buttons (links) to more detailed info per image */}
                                <div className="column"> <Button onClick={() => handleOpen(index)}>
                                    {/* Actual display of images */}
                                    <img src={pic.webformatURL} alt='no name' ></img></Button>
                                    {/* Modal opening after clicking the image */}
                                    <Modal
                                        open={open[index]} //modal opening
                                        onClose={() => handleClose(index)} //closing
                                        aria-labelledby="modal-modal-title" //styling
                                        aria-describedby="modal-modal-description" //styling
                                    >
                                        <Box className="boxStyle">
                                            {/* Styling of inside of the modal box */}
                                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                                {/* Looping through various fields required, anything can be retrieved
                                                by adding more and more key names inside payload of mainInfo */}
                                                Image Views: <p style={{ color: 'blue' }}>{pic.views}</p> <br></br>
                                                Uploaded by user: <p style={{ color: 'blue' }}>{pic.user}</p> <br></br>
                                                Downloads <p style={{ color: 'blue' }}>{pic.downloads}</p> <br></br>
                                                Likes: <p style={{ color: 'blue' }}>{pic.likes}</p> <br></br>
                                                Collections: <p style={{ color: 'blue' }}>{pic.collections}</p> <br></br>
                                            </Typography>
                                        </Box>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* ..................................... */}
        </div >
    )
}
export default Categories
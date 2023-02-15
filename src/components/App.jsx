import React, { useState, useEffect } from "react"
import moment from 'moment'
import ReactPaginate from "react-paginate";

const PER_PAGE = 2;

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([])
  const [filter, setFilter] = useState([])

  useEffect(() => {
    fetch("/api/posts")
      .then((response) => response.json())
      .then((json) => setData(json))
  }, [])


  // get category list
  const categories = []

  data && data.posts && data.posts.map((item) => {
      item.categories.map((cat) => {
        categories.push(cat.name)
      })
  })

  const categoryList = [...new Set(categories)];

  // for category checkbox
  const handleChange = (item) => {  
    let result = filter.find(element => element === item);
    if (result) {
      const temp = [...filter]
      let index = temp.findIndex(e => e === result )
      temp.splice(index, 1)
      setFilter(temp)
    } else {
      setFilter(oldArray => [...oldArray, item]);
    }   
  }; 

  let checkbox = categoryList.map((item) => {
    return (
        <div>
        <input style={{marginRight: "10px" }} type="checkbox" name={item} value={item} onChange={() => handleChange(item)} />
        <label>{item}</label>
        </div>
    )
  })

  // filter the data by categories
  let filteredData = [];
  filteredData = data && data.posts && data.posts.filter(el => {
      let arr = el.categories.map( a => a.name)
      // find the intersection of arr and filter         
      let common = arr.filter(value => filter.includes(value));

      return common.length > 0
  });

  // for paged data
  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  }

  const offset = currentPage * PER_PAGE;

  const pageCount = Math.ceil(filteredData && filteredData.length / PER_PAGE);

  // for list view
  let listview = filteredData && filteredData.slice(offset, offset + PER_PAGE)
                .map((item) => {
      return (
          <div key={item.id}>
            <div className="row">
              <div className="col-sm-2"><b>Title</b></div>
              <div className="col-sm-10">{item.title}</div>
            </div>
            <div className="row">
              <div className="col-sm-2"><b>Publish Date</b></div>
              <div className="col-sm-10">{moment(item.publishDate).format('DD MMM YYYY')}</div>
            </div>
            <div className="row" style={{marginBottom: "5px"}}>
              <div className="col-sm-2"><b>Author</b></div>
              <div className="col-sm-5">{item.author.name}</div>
              <div className="col-sm-5"><img src={item.author.avatar}></img></div>
            </div>
            <div className="btn-group flex-wrap">
              {item.categories.map((cat) => (
                <li className="btn btn-outline-primary" key={cat.id}>{cat.name}</li>
              ))}
            </div>
            <hr />
          </div>
      );
  });


  return (
  
    <div className="container">
      {checkbox}
      <hr />
      <ReactPaginate
        previousLabel={"«"}
        nextLabel={"»"}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        pageClassName="page-item"
        previousClassName="page-item"
        nextClassName="page-item"
        pageLinkClassName="page-link"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        activeClassName="active"
      />
      <hr />
      {listview}
    </div>

  )
}

export default App;

const advancedResults = (model,populate) => async (req,res,next) => {
    let query;
    //copy reqQuery
    const reqQuery = {...req.query}
    console.log("reqQuery1",reqQuery);

    //remove fields
    const removeFields = ["select","sort","page","limit"]
    
    //loop over removefields and delete them from reqQuery
    removeFields.forEach(param =>delete reqQuery[param])
    console.log("reqQuery2",reqQuery);

    //create query string
    let queryString = JSON.stringify(reqQuery);

    //create opraters like gt gte..
    queryString = queryString.replace(/\b(gt|gte|lt|lte\in)\b/g,match =>`$${match}`);

    //finding resource
    query = model.find(JSON.parse(queryString))

    //if it is select param then we need to follow mangoose syntax of select as query.select(fields)
    if(req.query.select){
        const fields = req.query.select.split(',').join(" ");
        query = query.select(fields)
    }

    //sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else{
        query = query.sort("-createdAt");
    }

    //Pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10)|| 10;
    const startIndex = (page-1)*limit; // this is for skipping the records of previous pages
    const endIndex = page*limit;
    const total = await model.countDocuments(); 

    query = query.skip(startIndex).limit(limit).populate(populate)
     //here will get current page with limit 

    //executing query
        const results = await query

       //pagination results
       const pagination ={};

       //checking results in next page
       if(endIndex<total){
        pagination.next={
            page:page+1,
            limit
        }
      }
      //checking results in prev page
        if(startIndex>0){
            pagination.prev={
                page:page-1,
                limit
            }       
        }
        res.advancedResults ={
            success:true,
            count:results.length,
            pagination,
            data:results
        }
    next()
}
module.exports = advancedResults
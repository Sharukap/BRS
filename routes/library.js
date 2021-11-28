const router = require("express").Router();
let Library = require("../model/library.model");
const { route } = require("./publisher");

//test route
router.route("/hello").get((req, res) => {
  return res.send({
    success: true,
    message: "Hello! (config library.js)",
  });
});

//Read Operation : Get list of libraries available (GET localhost:5000/library/list)
router.route("/list").get((req, res) => {
  Library.find({}, (err, libraryList) => {
    if (err) {
      return res.send({
        success: false,
        message: "Error: Server error",
      });
    } else {
      let data = [];
      for (i in libraryList) {
        let libNo = libraryList[i].libNo;
        let libName = libraryList[i].libName;
        let address = libraryList[i].address;
        let associatedInstitute = libraryList[i].associatedInstitute;
        let librarianName = libraryList[i].librarianName;
        let numberofStaff = libraryList[i].numberofStaff;
        data.push({
          libNo: libNo,
          name: libName,
          address: address,
          associatedInstitute: associatedInstitute,
          librarianName: librarianName,
          numberofStaff: numberofStaff,
        });
      }
      return res.send({
        success: true,
        message: "Library details received",
        data: data,
      });
    }
  });
});

//Create Operation: Create a new Library (POST localhost:5000/library/add)
router.route("/add").post((req, res) => {
  const { body } = req;
  const {
    libNo,
    libName,
    address,
    associatedInstitute,
    librarianName,
    numberofStaff,
  } = body;

  //constraints
  if (!libNo || libNo.length < 4) {
    return res.send({
      success: false,
      message:
        "Error: Invalid Registration Number or has left blank. Please Check Again",
    });
  }
  if (!libName) {
    return res.send({
      success: false,
      message: "Error: Library name cannot left blank",
    });
  }
  if (!address) {
    return res.send({
      success: false,
      message: "Error: please add the address",
    });
  }
  if (!associatedInstitute) {
    return res.send({
      success: false,
      message: "Error: Library should contain an asscociated institute",
    });
  }
  if (!librarianName) {
    return res.send({
      success: false,
      message: "Error: this field cannot left blank",
    });
  }

  //save to database
  const newLibrary = new Library(req.body);
  newLibrary
    .save()
    .then(() =>
      res.send({
        success: true,
        message: "New library record added",
      })
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

//Delete Operation: Delete a library (DELETE localhost:5000/library/delete )
router.route('/delete').delete((req,res)=>{
    const {body} = req;
    const {libNo} = body;
    //constraints
    if(!libNo || libNo.length < 4){
        return res.send({
            success: false,
            message: 'Error: Invaild'
        })
    }

    Library.findOneAndDelete({libNo: libNo},
        function (err, docs){
            if(err){
                res.send({
                    success: false,
                    message: 'Error: erroe when deleting'
                })
            }
            else{
                res.send({
                    success: true,
                    message: 'deletion successful',
                    deleted_docs: docs
                })
            }
        });
});

//Update Operation 

router.route("/update").post((req, res) => {
  const { body } = req;
  const { libNo, libName, address, associatedInstitute, librarianName, numberofStaff } = body;

  if (!libNo || libNo.length<4) {
    return res.send({
      success: false,
      message: "Error : Invalid Library Registration number",
    });
  }

  //Update
  Library.findOneAndUpdate(
    {
      libNo : libNo,
    },
    { $set: { libName: newlibName, address : newaddress, associatedInstitute: newassociatedInstitute, librarianName : newlibrarianName, numberofStaff: newnumberofStaff } },

    (err) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error:" + err,
        });
      } else {
        return res.send({
          success: true,
          message: "Library details successfully updated.",
        });
      }
    }
  );
});
module.exports = router;

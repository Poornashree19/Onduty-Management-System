var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  expressvalidator = require("express-validator"),
  session = require("express-session"),
  methodOverride = require("method-override"),
  bodyparser = require("body-parser"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  passportLocalMongoose = require("passport-local-mongoose"),
  flash = require("connect-flash"),
  Student = require("./models/student"),
  Hod = require("./models/hod"),
  Ac = require("./models/ac"),
  Od= require("./models/od");

var moment = require("moment");

var url =process.env.DATABASEURL|| "mongodb://localhost/Od_form";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("connected to DB");
  })
  .catch(err => {
    console.log("Error:", err.message);
  });

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(expressvalidator());


app.use(
  require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {

  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.user = req.user || null;
  next();
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("/student/login");
  }
}
app.get("/", (req, res) => {
  res.render("home");
});


app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/student/register", (req, res) => {
  var type = req.body.type;
  if (type == "student") {
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    
    var department = req.body.department;
    var image = req.body.image;
    
    req.checkBody("name", "name is required").notEmpty();
    req.checkBody("username", "Username is must be 11").notEmpty().isLength({min:11,max:11});
    
    req.checkBody("department", "department is required").notEmpty();
    req.checkBody("password", "Password is must be 6").notEmpty().isLength({min:11,max:11});
    req.checkBody("password2", "Password dont match").equals(req.body.password).isLength({min:11,max:11});

    var errors = req.validationErrors();
    if (errors) {
      
      console.log("errors: " + errors);
      res.render("register", {
        errors: errors
      });
    } else {
      var newStudent = new Student({
        name: name,
        username: username,
        password: password,
        type:type,
        department: department,
        image: image
      });
      Student.createStudent(newStudent, (err, student) => {
        if (err) throw err;
        console.log(student);
      });
      req.flash("success", "you are registered successfully,now you can login");

      res.redirect("/student/login");
    }
  } else if (type == "ac") {
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var department = req.body.department;
    var image = req.body.image;

    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("username", "Username is required").notEmpty().isLength({min:11,max:11});
    req.checkBody("password", "password is required").notEmpty().isLength({min:6,max:6});
    req.checkBody("department", "department is required").notEmpty();
    req.checkBody("password2", "Password dont match").equals(req.body.password).isLength({min:6,max:6});

    var errors = req.validationErrors();
    if (errors) {
      res.render("register", {
        errors: errors
      });
    } else {
      var newAc = new Ac({
        name: name,
        username: username,
        password: password,
        department: department,
        type: type
      });
      Ac.createAc(newAc, (err, ac) => {
        if (err) throw err;
        console.log(ac);
      });
      req.flash("success", "you are registered successfully,now you can login");

      res.redirect("/ac/login");
    }
  } else if (type == "hod") {
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    
    

    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("username", "Username is required").notEmpty().isLength({min:11,max:11});
    req.checkBody("password", "password is required").notEmpty().isLength({min:6,max:6});
    req.checkBody("password2", "Password dont match").equals(req.body.password).isLength({min:6,max:6});

    var errors = req.validationErrors();
    if (errors) {
      res.render("register", {
        errors: errors
      });
    } else {
      var newHod = new Hod({
        name: name,
        username: username,
        password: password,
        type: type,
        image: image
      });
      Hod.createHod(newHod, (err, hod) => {
        if (err) throw err;
        console.log(hod);
      });
      req.flash("success", "you are registered successfully,now you can login");

      res.redirect("/hod/login");
    }
  }
});


passport.use(
  "student",
  new LocalStrategy((username, password, done) => {
    Student.getUserByUsername(username, (err, student) => {
      if (err) throw err;
      if (!student) {
        return done(null, false, { message: "Unknown User" });
      }
      Student.comparePassword(
        password,
        student.password,
        (err, passwordFound) => {
          if (err) throw err;
          if (passwordFound) {
            return done(null, student);
          } else {
            return done(null, false, { message: "Invalid Password" });
          }
        }
      );
    });
  })
);

passport.use(
  "ac",
  new LocalStrategy((username, password, done) => {
    Ac.getUserByUsername(username, (err, ac) => {
      if (err) throw err;
      if (!ac) {
        return done(null, false, { message: "Unknown User" });
      }
      Ac.comparePassword(password, ac.password, (err, passwordFound) => {
        if (err) throw err;
        if (passwordFound) {
          return done(null, ac);
        } else {
          return done(null, false, { message: "Invalid Password" });
        }
      });
    });
  })
);

passport.use(
  "hod",
  new LocalStrategy((username, password, done) => {
    Hod.getUserByUsername(username, (err, hod) => {
      if (err) throw err;
      if (!hod) {
        return done(null, false, { message: "Unknown User" });
      }
      Hod.comparePassword(
        password,
        hod.password,
        (err, passwordFound) => {
          if (err) throw err;
          if (passwordFound) {
            return done(null, hod);
          } else {
            return done(null, false, { message: "Invalid Password" });
          }
        }
      );
    });
  })
);



passport.serializeUser(function(user, done) {
  
  done(null, { id: user.id, type: user.type });
});



passport.deserializeUser(function(obj, done) {
  switch (obj.type) {
    case "student":
      Student.getUserById(obj.id, function(err, student) {
        done(err, student);
      });
      break;
    case "ac":
      Ac.getUserById(obj.id, function(err, ac) {
        done(err, ac);
      });
      break;
    case "hod":
      Hod.getUserById(obj.id, function(err, hod) {
        done(err, hod);
      });
      break;
    default:
      done(new Error("no entity type:", obj.type), null);
      break;
  }
});

app.get("/student/login", (req, res) => {
  res.render("login");
});

app.post(
  "/student/login",
  passport.authenticate("student", {
    successRedirect: "/student/home",
    failureRedirect: "/student/login",
    failureFlash: true
  }),
  (req, res) => {

    res.redirect("/student/home");
  }
);

app.get("/student/home", ensureAuthenticated, (req, res) => {
  var student = req.user.username;
  console.log(student);
  Student.findOne({ username: req.user.username })
    .populate("ods")
    .exec((err, student) => {
      if (err || !student) {
        req.flash("error", "student not found");
        res.redirect("back");
        console.log("err");
      } else {
        res.render("homestud", {
          student: student,
          moment: moment
        });
      }
    });
});
app.get("/student/:id", ensureAuthenticated, (req, res) => {
  console.log(req.params.id);
  Student.findById(req.params.id)
    .populate("ods")
    .exec((err, foundStudent) => {
      if (err || !foundStudent) {
        req.flash("error", "Student not found");
        res.redirect("back");
      } else {
        res.render("profilestud", { student: foundStudent });
      }
    });
});
app.get("/student/:id/edit", ensureAuthenticated, (req, res) => {
  Student.findById(req.params.id, (err, foundStudent) => {
    res.render("editS", { student: foundStudent });
  });
});
app.put("/student/:id", ensureAuthenticated, (req, res) => {
  console.log(req.body.student);
  Student.findByIdAndUpdate(
    req.params.id,
    req.body.student,
    (err, updatedStudent) => {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        req.flash("success", "Succesfully updated");
        res.redirect("/student/" + req.params.id);
      }
    }
  );
});

app.get("/student/:id/apply", ensureAuthenticated, (req, res) => {
  Student.findById(req.params.id, (err, foundStud) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("odApply", { student: foundStud });
    }
  });
});

app.post("/student/:id/apply", (req, res) => {
  Student.findById(req.params.id)
    .populate("ods")
    .exec((err, student) => {
      if (err) {
        res.redirect("/student/home");
      } else {
        date = new Date(req.body.od.from);
        todate = new Date(req.body.od.to);
        year = date.getFullYear();
        month = date.getMonth() + 1;
        dt = date.getDate();
        todt = todate.getDate();

        if (dt < 10) {
          dt = "0" + dt;
        }
        if (month < 10) {
          month = "0" + month;
        }
        
        const odDays = 1 + (todt - dt); // Calculate OD duration
        req.body.od.days = odDays;
        
        // Check if OD duration is greater than 5 days
        if (odDays > 5) {
          req.flash("error", "OD duration cannot exceed 5 days");
          return res.redirect("back");
        }
        
        Od.create(req.body.od, (err, newOd) => {
          if (err) {
            req.flash("error", "Something went wrong");
            return res.redirect("back");
          } else {
            newOd.stud.id = req.user._id;
            newOd.stud.username = req.user.username;
            console.log("OD is applied by--" + req.user.username);

            newOd.save();

            student.ods.push(newOd);

            student.save();
            req.flash("success", "Successfully applied for OD");
            res.render("homestud", { student: student, moment: moment });
          }
        });
      }
    });
});

app.get("/student/:id/track", (req, res) => {
  Student.findById(req.params.id)
    .populate("ods")
    .exec((err, foundStud) => {
      if (err) {
        req.flash("error", "No student with requested id");
        res.redirect("back");
      } else {
        
        res.render("trackOd", { student: foundStud, moment: moment });
      }
    });
});
app.get("/ac/login", (req, res) => {
  res.render("aclogin");
});

app.post(
  "/ac/login",
  passport.authenticate("ac", {
    successRedirect: "/ac/home",
    failureRedirect: "/ac/login",
    failureFlash: true
  }),
  (req, res) => {
    res.redirect("/ac/home");
  }
);
app.get("/ac/home", ensureAuthenticated, (req, res) => {
  Ac.find({}, (err, ac) => {
    if (err) {
      console.log("err");
    } else {
      res.render("homeac", {
        ac: req.user
      });
    }
  });
});
app.get("/ac/:id", ensureAuthenticated, (req, res) => {
  console.log(req.params.id);
  Ac.findById(req.params.id).exec((err, foundAc) => {
    if (err || !foundAc) {
      req.flash("error", "Ac not found");
      res.redirect("back");
    } else {
      res.render("profileac", { ac: foundAc });
    }
  });
});
app.get("/ac/:id/edit", ensureAuthenticated, (req, res) => {
  Ac.findById(req.params.id, (err, foundAc) => {
    res.render("editA", { ac: foundAc });
  });
});
app.put("/ac/:id", ensureAuthenticated, (req, res) => {
  console.log(req.body.ac);
  Ac.findByIdAndUpdate(req.params.id, req.body.ac, (err, updatedAc) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Succesfully updated");
      res.redirect("/ac/" + req.params.id);
    }
  });
});
app.get("/ac/:id/od", (req, res) => {
  Ac.findById(req.params.id).exec((err, acFound) => {
    if (err) {
      req.flash("error", "ac not found with requested id");
      res.redirect("back");
    } else {
      
      Student.find({ department: acFound.department })
        .populate("ods")
        .exec((err, students) => {
          if (err) {
            req.flash("error", "student not found with your department");
            res.redirect("back");
          } else {
            
            res.render("acOdSign", {
              ac: acFound,
              students: students,
              
              moment: moment
            });
            
          }
        });
    }
   
  });
});

app.get("/ac/:id/od/:stud_id/info", (req, res) => {
  Ac.findById(req.params.id).exec((err, acFound) => {
    if (err) {
      req.flash("error", "ac not found with requested id");
      res.redirect("back");
    } else {
      Student.findById(req.params.stud_id)
        .populate("ods")
        .exec((err, foundStudent) => {
          if (err) {
            req.flash("error", "student not found with this id");
            res.redirect("back");
          } else {
            res.render("moreinfostud", {
              student: foundStudent,
              ac: acFound,
              moment: moment
            });
          }
        });
    }
  });
});

app.post("/ac/:id/od/:stud_id/info", (req, res) => {
  Ac.findById(req.params.id).exec((err, acFound) => {
    if (err) {
      req.flash("error", "ac not found with requested id");
      res.redirect("back");
    } else {
      Student.findById(req.params.stud_id)
        .populate("ods")
        .exec((err, foundStudent) => {
          if (err) {
            req.flash("error", "student not found with this id");
            res.redirect("back");
          } else {
            if (req.body.action === "Approve") {
              foundStudent.ods.forEach(function(od) {
                if (od.status === "pending") {
                  od.status = "approved";
                  od.approved = true;
                  od.save();
                }
              });
            } else {
              console.log("u denied");
              foundStudent.ods.forEach(function(od) {
                if (od.status === "pending") {
                  od.status = "denied";
                  od.denied = true;
                  od.save();
                }
              });
            }
            res.render("moreinfostud", {
              student: foundStudent,
              ac: acFound,
              moment: moment
            });
          }
        });
    }
  });
});

app.get("/hod/login", (req, res) => {
  res.render("hodlogin");
});

app.post(
  "/hod/login",
  passport.authenticate("hod", {
    successRedirect: "/hod/home",
    failureRedirect: "/hod/login",
    failureFlash: true
  }),
  (req, res) => {
    res.redirect("/hod/home");
  }
);
app.get("/hod/home", ensureAuthenticated, (req, res) => {
  Hod.find({}, (err, ac) => {
    if (err) {
      console.log("err");
    } else {
      res.render("homehod", {
        hod: req.user
      });
    }
  });
});

app.get("/hod/:id", ensureAuthenticated, (req, res) => {
  console.log(req.params.id);
  Hod.findById(req.params.id).exec((err, foundHod) => {
    if (err || !foundHod) {
      req.flash("error", "Hod not found");
      res.redirect("back");
    } else {
      res.render("profilehod", { hod: foundHod });
    }
  });
});
app.get("/hod/:id/edit", ensureAuthenticated, (req, res) => {
  Hod.findById(req.params.id, (err, foundHod) => {
    res.render("editH", { hod: foundHod });
  });
});

app.put("/hod/:id", ensureAuthenticated, (req, res) => {
  console.log(req.body.hod);
  Hod.findByIdAndUpdate(
    req.params.id,
    req.body.hod,
    (err, updatedHod) => {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        req.flash("success", "Succesfully updated");
        res.redirect("/hod/" + req.params.id);
      }
    }
  );
});

app.get("/hod/:id/od", (req, res) => {
  Hod.findById(req.params.id).exec((err, hodFound) => {
    if (err) {
      req.flash("error", "ac not found with requested id");
      res.redirect("back");
    } else {
      
      Student.find({ hostel: hodFound.hostel })
        .populate("ods")
        .exec((err, students) => {
          if (err) {
            req.flash("error", "student not found with your department");
            res.redirect("back");
          } else {
            res.render("hodOdSign", {
              hod: hodFound,
              students: students,

              moment: moment
            });
          }
        });
    }
  });
});
app.get("/hod/:id/od/:stud_id/info", (req, res) => {
  Hod.findById(req.params.id).exec((err, hodFound) => {
    if (err) {
      req.flash("error", "hod not found with requested id");
      res.redirect("back");
    } else {
      Student.findById(req.params.stud_id)
        .populate("ods")
        .exec((err, foundStudent) => {
          if (err) {
            req.flash("error", "student not found with this id");
            res.redirect("back");
          } else {
            res.render("Hodmoreinfostud", {
              student: foundStudent,
              hod: hodFound,
              moment: moment
            });
          }
        });
    }
  });
});

app.post("/hod/:id/od/:stud_id/info", (req, res) => {
  Hod.findById(req.params.id).exec((err, hodFound) => {
    if (err) {
      req.flash("error", "hod not found with requested id");
      res.redirect("back");
    } else {
      Student.findById(req.params.stud_id)
        .populate("ods")
        .exec((err, foundStudent) => {
          if (err) {
            req.flash("error", "student not found with this id");
            res.redirect("back");
          } else {
            if (req.body.action === "Approve") {
              foundStudent.ods.forEach(function(od) {
                if (od.hodstatus === "pending") {
                  od.hodstatus = "approved";

                  od.save();
                }
              });
            } else {
              console.log("u denied");
              foundStudent.ods.forEach(function(od) {
                if (od.hodstatus === "pending") {
                  od.hodstatus = "denied";

                  od.save();
                }
              });
            }
            res.render("Hodmoreinfostud", {
              student: foundStudent,
              hod: hodFound,
              moment: moment
            });
          }
        });
    }
  });
});


app.get("/logout", (req, res) => {
  req.logout();
  
  res.redirect("/");
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

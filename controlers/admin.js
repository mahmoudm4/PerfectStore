
exports.controler = {
    addproduct: function (req,res) {
        res.render("../views/adminProductControl.ejs",{
            err:-1,
            login: req.session.name?'ok':'no'
        })

    },
    adminView: function (req,res) {
        if(req.session.is_Admin === 'true'){
            res.render("../views/adminProductControl.ejs",{
                err:-1,
                login: req.session.name?'ok':'no'
            })
        }else{
            res.send('<script> location.href = "/home.html" </script>');
        }
       

    },
    adminProductControl: function (req,res) {
        res.render("../views/adminProductControl.ejs",{
            err:-1
        })

    }
}
const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var s;

MongoClient.connect('mongodb://localhost:27017/App_user',(err,database)=>{
    if(err) return console.log(err);
    db=database.db('App_user')
    app.listen(5000,()=>{
        console.log("Listening at port number 5000")
    })
})

app.set('view engine','ejs')
//app.use(express.urlencoded({extended: true}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('mobiles').find().toArray( (err,result)=>{
        if(err) return console.log(err)
    res.render('h2.ejs',{data:result})
    })
})

app.get('/create',(req,res)=>{
    res.render('a2.ejs')
})

app.get('/updatestock',(req,res)=>{
    res.render('u2.ejs')
})

app.get('/deletemobile',(req,res)=>{
    res.render('d2.ejs')
})

app.post('/AddData',(req,res)=>{
    db.collection('mobiles').save(req.body,(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})

app.post('/update',(req,res)=>{
    db.collection('mobiles').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i < result.length;i++){
            if(result[i].M_ID==req.body.M_ID){
                s=result[i].M_STOCK
                break;
            }
        }
        db.collection('mobiles').findOneAndUpdate({M_ID: req.body.M_ID},{$set:{M_STOCK:parseInt(s)+parseInt(req.body.M_STOCK)}},
        {sort:{_id:-1}},(err,result)=>{
            if(err) return console.log(err)
            console.log('Stock updated.!')
            res.redirect('/')
        })
    })
})

app.post('/delete',(req,res)=>{
    db.collection('mobiles').deleteOne({M_ID:req.body.M_ID},(err,result)=>{
        if(err) return err
        console.log('Mobile deleted')
        res.redirect('/')
    })
})

app.get('/sales',(req,res)=>{
    db.collection('sales').find().toArray( (err,result)=>{
        if(err) return console.log(err)
    res.render('sales_details.ejs',{data:result})
    })
})

app.get('/update_sales',(req,res)=>{
    res.render('add_sales.ejs')
})

app.post('/AddSales',(req,res)=>{
    db.collection('sales').save(req.body,(err,result)=>{
        if(err) return console.log(err)
        //res.redirect('/sales')
    })
    db.collection('mobiles').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i < result.length;i++){
            if(result[i].M_ID==req.body.M_ID){
                s=result[i].M_STOCK
                break;
            }
        }
        db.collection('mobiles').findOneAndUpdate({M_ID: req.body.M_ID},{$set:{M_STOCK:parseInt(s)-parseInt(req.body.M_QUANTITY)}},
        {sort:{_id:-1}},(err,result)=>{
            if(err) return console.log(err)
            console.log('Stock updated.!')
            res.redirect('/sales')
        })
    })
})
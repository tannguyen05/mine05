const express = require('express');
const fse = require('fs-extra');
const mkdirp = require('mkdirp');
const resizeImg = require('resize-img');
const changeSlug = require('../js/changeSlug');

//express router
const router = express.Router();


//models

const pages = require('../models/page');
const categories = require('../models/category');
const products = require('../models/product');

//admin page
router.get('/', (req, res)=>{
    res.render('admin',{ Title: 'Admin Page'})
})

// ** PAGE

//all page
router.get('/pages', (req, res)=>{
    let mess = req.flash('success');
    pages.find({}, (err, result)=>{
        if(err) return res.status(500).send(err);
        res.render('admin/pages',{
            Title: 'All Pages',
            pages: result,
            message: mess
        });
    })
})
// add page
router.get('/add-page', (req, res)=>{
    let mess = req.flash('add-failed');
    let errs = req.flash('inp-errors');
    //console.log(req.flash('inp-errors'));
    res.render('admin/add_page',{
        Title: 'Add-page',
        message: mess,
        errors: errs
    })
})
router.post('/add-page', (req, res)=>{
    req.checkBody('title', 'Invalid title').notEmpty();
    req.checkBody('content', 'Invalid content').notEmpty();

    let title = req.body.title;
    let slug = req.body.slug == '' ? changeSlug(title) : changeSlug(req.body.slug);
    let content = req.body.content;

    let errors = req.validationErrors();
    if(errors){
        req.flash('inp-errors' , errors)
        res.redirect('/admin/add-page');
    }
    else{
        pages.findOne({slug: slug}, (err, p)=>{
            if(err) return res.status(500).send(err);;
            if(p){
                req.flash('add-failed', 'Page slug exists');
                res.redirect('/admin/add-page');
            }else{
                pages.create({
                    title: title,
                    slug: slug,
                    content: content
                }, (err, data)=>{
                    if(err) return res.status(500).send(err);
                    pages.find({}, (err, pages)=>{
                        if(err) throw err;
                        req.app.locals.pages = pages;
                    })
                    req.flash('success', 'Add new page successful!')
                    res.redirect('/admin/pages');
                })
            }
        })
    }
})
//edit-page
router.get('/update-page/:id', (req, res)=>{
    let mess = req.flash('edit-failed');
    let errs = req.flash('inp-errors');
    pages.findOne({_id: req.params.id}, (err, page)=>{
        if (err) return res.status(500).send(err);
        res.render('admin/edit_page',{
            Title: 'Edit-page',
            message: mess,
            errors: errs,
            page: page
        })
    })
})
//update page by id
router.post('/update-page/:id', (req, res)=>{
    req.checkBody('title', 'Invalid title').notEmpty();
    req.checkBody('content', 'Invalid content').notEmpty();
    let slug = req.body.slug == '' ? changeSlug(req.body.title) : changeSlug(req.body.slug);
    let item = {
        title: req.body.title,
        slug: slug,
        content: req.body.content
    }
    let errors = req.validationErrors();
    if(errors){
        req.flash('inp-errors' , errors);
        res.redirect('/admin/update-page/'+req.params.id);
    }
    else{
        pages.findOneAndUpdate({_id: req.params.id}, {$set: item},{new: true}, (err)=>{
            if (err) return res.status(500).send(err);
            pages.find({}, (err, pages)=>{
                if(err) throw err;
                req.app.locals.pages = pages;
            })
            req.flash('success', 'Update page successful!');
            res.redirect('/admin/pages');
        })
    }
})
//delete page by id
router.post("/delete-page/:id", function(req, res){
    pages.findOneAndDelete({_id: req.params.id}, function(err){
        if (err) return res.status(500).send(err);
        pages.find({}, (err, pages)=>{
            if(err) throw err;
            req.app.locals.pages = pages;
        })
        req.flash('success', 'Delete page successful!');
        res.redirect('/admin/pages');
    })
})



// **CATEGORY

router.get("/categories", (req, res)=>{
    let mess = req.flash('success');
    categories.find({}, (err, result)=>{
        if(err) return res.status(500).send(err);
        //console.log(result);
        res.render('admin/categories',{
            Title: 'All Categories',
            cats: result,
            message: mess
        });
    })
})
// add category
router.get('/add-category', (req, res)=>{
    let mess = req.flash('add-failed');
    let errs = req.flash('inp-errors');
    //console.log(req.flash('inp-errors'));
    res.render('admin/add_category',{
        Title: 'Add category',
        message: mess,
        errors: errs
    })
})
router.post('/add-category', (req, res)=>{
    req.checkBody('title', 'Invalid title').notEmpty();
    let title = req.body.title;
    let slug = changeSlug(title);
    let errors = req.validationErrors();
    if(errors){
        req.flash('inp-errors' , errors)
        res.redirect('/admin/add-category');
    }
    else{
        categories.findOne({slug: slug}, (err, category)=>{
            if(err) return res.status(500).send(err);;
            if(category){
                req.flash('add-failed', 'Category exists, type another');
                res.redirect('/admin/add-category');
            }else{
                categories.create({
                    title: title,
                    slug: slug,
                }, (err, data)=>{
                    if(err) return res.status(500).send(err);
                    categories.find({}, (err, categories)=>{
                        if(err) throw err;
                        req.app.locals.categories = categories;
                    })
                    req.flash('success', 'Add new category successful!')
                    res.redirect('/admin/categories');
                })
            }
        })
    }
})
//edit category
router.get('/update-category/:id', (req, res)=>{
    let mess = req.flash('edit-failed');
    let errs = req.flash('inp-errors');
    categories.findOne({_id: req.params.id}, (err, category)=>{
       if (err) return res.status(500).send(err);
       res.render('admin/edit_category',{
           Title: 'Edit-category',
           message: mess,
           errors: errs,
           category: category
       })
   })
})
//update by id
router.post('/update-category/:id', (req, res)=>{
    req.checkBody('title', 'Invalid title').notEmpty();
    let slug = changeSlug(req.body.title);
    let item = {
        title: req.body.title,
        slug: slug
    }
    let errors = req.validationErrors();
    if(errors){
        req.flash('inp-errors' , errors);
        res.redirect('/admin/update-category/'+req.params.id);
    }
    else{
        categories.findOneAndUpdate({_id: req.params.id}, {$set: item},{new: true}, (err)=>{
            if (err) return res.status(500).send(err);
            categories.find({}, (err, categories)=>{
                if(err) throw err;
                req.app.locals.categories = categories;
            })
            req.flash('success', 'Update category successful!');
            res.redirect('/admin/categories');
        })
    }
})
//delete category by id
router.post("/delete-category/:id", function(req, res){
    categories.findOneAndDelete({_id: req.params.id}, function(err){
       if (err) return res.status(500).send(err);
       categories.find({}, (err, categories)=>{
            if(err) throw err;
            req.app.locals.categories = categories;
        })
       req.flash('success', 'Delete a category successful!');
       res.redirect('/admin/categories');
   })
})


// **PRODUCT

//all product
router.get('/products', (req, res)=>{
    let mess = req.flash('success');
    products.find({}, (err, result)=>{
        if(err) return res.status(500).send(err);
        res.render('admin/products',{
            Title: 'All Product',
            products: result,
            message: mess
        });
    })
})
// add product
router.get('/add-product', (req, res)=>{
    let mess = req.flash('add-failed');
    let errs = req.flash('inp-errors');
    categories.find({}, (err, result)=>{
        if(err) return res.status(500).send(err);
        res.render('admin/add_product',{
            Title: 'Add product',
            message: mess,
            errors: errs,
            categories: result
        })
    })
})

router.post('/add-product', (req, res)=>{

    let imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';

    req.checkBody('title', 'Invalid title').notEmpty();
    req.checkBody('desc', 'Invalid description').notEmpty();
    req.checkBody('price', 'Price must have a value and a numeric, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.').isDecimal();
    req.checkBody('image', 'Please upload an image Jpeg, Png or Gif').isImage(imageFile);

    let title = req.body.title;
    let slug = changeSlug(title);
    let desc = req.body.desc;
    let price = req.body.price;
    let category = req.body.category;

    let errors = req.validationErrors();
    if(errors){
        req.flash('inp-errors' , errors)
        res.redirect('/admin/add-product');
    }
    else{
        products.findOne({slug: slug}, (err, product)=>{
            if(err) return res.status(500).send(err);;
            if(product){
                req.flash('add-failed', 'Product title exists, type another');
                res.redirect('/admin/add-product');
            }else{
                let price_format = parseFloat(price).toFixed(2);
                products.create({
                    title: title,
                    slug: slug,
                    desc: desc,
                    category: category,
                    price: price_format,
                    image: imageFile
                }, (err, data)=>{
                    if(err) return res.status(500).send(err);

                    //create folder image
                    mkdirp('public/product_images/' + data._id, (err)=>{ if(err) throw err;})
                    mkdirp('public/product_images/' + data._id + '/gallery', (err)=>{ if(err) throw err;})
                    mkdirp('public/product_images/' + data._id + '/gallery/thumbs', (err)=>{ if(err) throw err;})

                    // move image
                    if(imageFile != ''){
                        let productImg = req.files.image;
                        let path = 'public/product_images/' + data._id + '/' + imageFile;
                        productImg.mv(path, (err)=>{if(err) throw err;})
                    }
                    req.flash('success', 'Add new product successful!')
                    res.redirect('/admin/products');
                })
            }
        })
    }
})
//edit product
router.get('/update-product/:id', (req, res)=>{
    let mess = req.flash('edit-failed');
    let errs = req.flash('inp-errors');
    let success = req.flash('success');
    categories.find({}, (err, category)=>{
        if (err) return res.status(500).send(err);
        products.findOne({_id: req.params.id}, (err, product)=>{
            if (err) return res.status(500).send(err);

            // read gallery folder
            let galleryDir = 'public/product_images/' + product._id + '/gallery';
            let galleryImages = null;
            fse.readdir(galleryDir, (err, files)=>{
                if(err) throw err;
                galleryImages = files;
                res.render('admin/edit_product',{
                    Title: 'Edit-product',
                    message: mess,
                    success: success,
                    errors: errs,
                    categories: category,
                    product: product,
                    galleryImages: galleryImages
                })
            })
        })

   })
})
//update by id
router.post('/update-product/:id', (req, res)=>{
    let imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : "";
    let slug = changeSlug(req.body.title);
    let price = parseFloat(req.body.price).toFixed(2);
    let current_images = req.body.productImg;
    let image_update = imageFile;
    if(imageFile == ""){
        image_update = current_images;
    }
    req.checkBody('title', 'Invalid title').notEmpty();
    req.checkBody('desc', 'Invalid description').notEmpty();
    req.checkBody('price', 'Price must have a value and a numeric, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.').isDecimal();
    req.checkBody('image', 'Please upload an image Jpeg, Png or Gif').isImage(imageFile);

    let item = {
       title: req.body.title,
       slug: slug,
       desc: req.body.desc,
       price: price,
       category : req.body.category,
       image: image_update
    }

    let errors = req.validationErrors();
    if(errors){
        req.flash('inp-errors' , errors)
        res.redirect('/admin/update-product/' + req.params.id);
    }else{
        products.findByIdAndUpdate({_id: req.params.id}, {$set: item}, {new: true}, (err)=>{
            if(err) res.status(500).send(err);
            if(imageFile != ""){
                if(current_images != ""){
                    fse.remove("public/product_images/" + req.params.id + "/" + current_images, (err)=>{
                        if(err) throw err;
                    })
                }
                let productImg = req.files.image;
                let path = 'public/product_images/' + req.params.id + '/' + imageFile;
                productImg.mv(path, (err)=>{if(err) throw err;})
            }

            req.flash('success', 'Update product successful!');
            res.redirect('/admin/products');
        })
    }
 })

//product gallery
router.post('/product-gallery/:id', (req, res)=>{
    let gallery = req.files.file;
    let path = "public/product_images/" + req.params.id + "/gallery/" + req.files.file.name;
    let thumbpath = "public/product_images/" + req.params.id + "/gallery/thumbs/" + req.files.file.name;
    gallery.mv(path, (err)=>{
        if(err) throw err;
        resizeImg(fse.readFileSync(path), {width: 100, height: 100}).then((buf)=>{
            fse.writeFileSync(thumbpath, buf);
        })
    })
    res.sendStatus(200);
})
//Delete image from gallery
router.get('/delete-image/:image', (req, res)=>{
    let ImageDelete = "public/product_images/" + req.query.id + "/gallery/" + req.params.image;
    let ThumbDelete = "public/product_images/" + req.query.id + "/gallery/thumbs/" + req.params.image;
    fse.remove(ImageDelete, (err)=>{
        if(err) throw err;
        fse.remove(ThumbDelete, (err)=>{
            if(err) throw err;
            req.flash("success", "Delete an image successful");
            res.redirect("/admin/update-product/"+req.query.id);
        })
    })
})
//Delete product
router.post("/delete-product/:id", function(req, res){
    let path = "public/product_images/" + req.params.id;
    fse.remove(path, (err)=>{
        if(err) throw err;
        products.findOneAndDelete({_id: req.params.id}, (err)=>{
            if(err) return res.status(500).send(err);
            req.flash('success', 'Delete a product successful!');
            res.redirect('/admin/products');
         })
    })
})


//exports
module.exports = router;

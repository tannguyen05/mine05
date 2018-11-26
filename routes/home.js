const express = require('express');
const router = express.Router();
const fse = require('fs-extra');
const pages = require('../models/page.js');
const products = require('../models/product.js');
const categories = require('../models/category.js');


router.get('/', (req, res)=>{
	pages.findOne({slug: "home"}, (err, page)=>{
		if(err) throw err;
		res.render('index', {
			Title: page.title,
			content: page.content,
			slider: true
		})
	})
})
//get page
router.get('/page/:slug', (req, res)=>{
	pages.findOne({slug: req.params.slug}, (err, page)=>{
		if(err) throw err;
		if(!page) res.redirect("/");
		else{
			res.render('index', {
				Title: page.title,
				content: page.content,
				slider: false
			})
		}
	})  
})
//get all products
router.get('/cmscart/products', (req, res)=>{
	products.find({}, (err, products)=>{
		if(err) throw err;
		res.render('cart/products', {
			Title: "All products",
			products: products,
			slider: false
		})
	})
})
//get products by category
router.get('/cmscart/products/:cat_slug', (req, res)=>{
	categories.findOne({slug: req.params.cat_slug}, (err, category)=>{
		if(err) throw err;
		products.find({category: req.params.cat_slug}, (err, products)=>{
			if(err) throw err;
			res.render('cart/cat_products', {
				Title: category.title,
				products: products,
				slider: false
			})
		})
	})
})

//get products details
router.get('/cmscart/products/:p_category/:p_slug', (req, res)=>{
	let gallery = null;
	products.findOne({slug: req.params.p_slug}, (err, product)=>{
		if(err) throw err;
		let galleryDir = "public/product_images/" + product._id + "/gallery";
		fse.readdir(galleryDir, (err, file)=>{
			if(err) throw err;
			gallery = file;
			res.render("cart/product_detail", {
				Title: product.title + "-" + product.category,
				product: product,
				gallery: gallery,
				slider: false
			})
		})
	})
})
// get add cart
router.get('/cmscart/add/:p_slug', (req, res)=>{
	products.findOne({slug: req.params.p_slug}, (err, product)=>{
		if(err) throw err;
		//cart = 0
		if( typeof req.session.cart == "undefined"){
			req.session.cart = [];
			req.session.cart.push({
				name: product.slug,
				quantity: 1,
				price: parseFloat(product.price).toFixed(2),
				image: "/product_images/" + product._id + "/" + product.image
			})
		}else{
			let cart = req.session.cart;
			let newItem = true;
			for (let i = 0; i < cart.length; i++) {
				if(cart[i].name == req.params.p_slug){ //product add to cart exist
					cart[i].quantity++;
					newItem = false;
					break;
				}
			}

			//add new Item to cart
			if(newItem === true){
				cart.push({
					name: product.slug,
					quantity: 1,
					price: parseFloat(product.price).toFixed(2),
					image: "/product_images/" + product._id + "/" + product.image
				})
			}
		}
		//console.log(req.session.cart);
		res.redirect('back');
	})
})
//get checkout page
router.get('/cmscart/cart/checkout', (req, res)=>{
	if(req.session.cart && req.session.cart.length == 0)
	{
		delete req.session.cart;
		res.redirect('/cmscart/cart/checkout');
	}else{
		res.render('cart/checkout',{
			Title: "Checkout",
			cart: req.session.cart,
			slider: false
		});
	}
})
//update cart product
router.get('/cmscart/cart/update/:product', (req, res)=>{
	let product = req.params.product;
	let action = req.query.action;
	let cart = req.session.cart;
	if(req.session.cart !== undefined)
	{
		for (let i = 0; i < cart.length; i++) {
			if (cart[i].name == product){
				switch(action){
					case "clear":
						cart.splice(i, 1);
						if(cart.length == 0)
							delete req.session.cart;
						break;
					case "add":
						cart[i].quantity++;
						break;
					case "minus":
						cart[i].quantity--;
						if(cart[i].quantity < 1)
							cart.splice(i, 1);
						break;
					default:
						console.log("Problem!");
				}
				break;
			}
		}
	}
	res.redirect("/cmscart/cart/checkout");
})
//clear cart
router.get('/cmscart/cart/clear', (req, res)=>{
	delete req.session.cart;
	res.redirect("/cmscart/cart/checkout");
})
//buynow
router.get('/cmscart/cart/buynow', (req, res)=>{
	delete req.session.cart;
	res.sendStatus(200);
})
//exports
module.exports = router;
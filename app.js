const express = require('express');
const session = require('express-session');
const app = express();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api/products';

// Set up Pug as the template engine
app.set('view engine', 'pug');
app.set('views', './views');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Express session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your_secret_key_here',
        resave: false,
        saveUninitialized: false,
    })
);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to fetch products
async function fetchProducts() {
    try {
        const response = await fetch(BACKEND_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Helper function to fetch a single product
async function fetchProductById(id) {
    try {
        const response = await fetch(`${BACKEND_URL}/${id}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}

// Route for displaying the list of clothing items
app.get('/', async (req, res) => {
    const clothingItems = await fetchProducts();
    res.render('index', { title: 'Clothing Store', clothingItems, cart: req.session.cart || [] });
});

// Route for displaying the details of a specific clothing item
app.get('/clothing/:id', async (req, res) => {
    const clothingItem = await fetchProductById(req.params.id);
    if (!clothingItem) {
        res.status(404).send('Clothing item not found.');
    } else {
        res.render('clothing_detail', { title: clothingItem.name, clothingItem });
    }
});

// Route for adding items to the shopping cart
app.post('/cart/add', async (req, res) => {
    const id = req.body.id;
    const quantity = isNaN(parseInt(req.body.quantity)) ? 1 : parseInt(req.body.quantity);

    const clothingItem = await fetchProductById(id);
    if (!clothingItem) {
        res.status(404).send('Clothing item not found.');
    } else {
        req.session.cart = req.session.cart || [];

        // Check if the item is already in the cart
        const existingItem = req.session.cart.find((item) => item._id === id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Clone the item and add quantity to avoid mutating the original product object if it were cached
            const cartItem = {
                _id: clothingItem._id,
                name: clothingItem.name,
                price: clothingItem.price,
                description: clothingItem.description,
                category: clothingItem.category,
                image: clothingItem.image,
                quantity: quantity
            };
            req.session.cart.push(cartItem);
        }

        res.redirect('/');
    }
});

// Route for updating the quantity of items in the cart
app.post('/cart/update/:id', (req, res) => {
    const id = req.params.id;
    const quantity = parseInt(req.body.quantity);
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    if (quantity <= 0) {
        // If the quantity is set to zero or a negative value, remove the item from the cart
        req.session.cart = req.session.cart.filter((item) => item._id !== id);
    } else {
        // Otherwise, update the quantity for the item in the cart
        const item = req.session.cart.find((item) => item._id === id);
        if (item) {
            item.quantity = quantity;
        }
    }
    res.redirect('/cart');
});

// Route for removing items from the shopping cart
app.post('/cart/remove/:id', (req, res) => {
    const id = req.params.id;
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter((item) => item._id !== id);
    }
    res.redirect('/cart');
});

// Route for displaying the shopping cart
app.get('/cart', (req, res) => {
    res.render('cart', { title: 'Shopping Cart', cart: req.session.cart || [] });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Frontend server is running on http://localhost:${port}`);
});

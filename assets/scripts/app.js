class Product {
  
  title = 'DEFAULT';
  imageUrl;
  description;
  price;

  constructor(title, image, desc, price) {
    this.title = title;
    this.imageUrl = image;
    this.description = desc;
    this.price = price;
  }

}



class ElementAttribute {

  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }

}



class Component {

  constructor(renderHookId) {
    this.hookId = renderHookId;
  }

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if(cssClasses) {
      rootElement.className = cssClasses;
    }
    if(attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value)
      }
    }
    document.getElementById(this.hookId).append(rootElement)
    return rootElement
  }

}



class ShoppingCart extends Component{

  items = []

  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`;
  }

  get totalAmount() {
    const sum = this.items.reduce((prevVal, curItem) => prevVal + curItem.price, 0)
    return sum
  }

  constructor(renderHookId) {
    super(renderHookId); // gets 'app' from Shops instantiation of ShoppingCart, where it passes 'app' as the renderHookId arg, which goes to the Component class where this instance becomes this.hookId
  }

  addProduct(product) { // comes from App.addProductToCart which came from ProductItem.addToCart as a method through the event listener click on the Add to Cart button.
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  render() {
    const cartEl = this.createRootElement('section','cart')
    cartEl.innerHTML = `
      <h2>Total: \$${0}</h2>
      <button>Order Now!</button>
    `;
    this.totalOutput = cartEl.querySelector('h2') // this is adding a NEW property to >this<
  }

}



class ProductItem extends Component{

  constructor(product, renderHookId) { // when ProductList creates a new instance of ProductItem, each one becomes an object inside an object, ProductItem.product DOWN 2
    super(renderHookId)
    this.product = product
  }

  addToCart() {
    App.addProductToCart(this.product) // this is a method for the Cart Button.  clicking the button initiates this method. this goes to App.addProductToCart which then directs >this<.product as the arg1 to ShoppingCart.addProduct
  }

  render() { // once render is called from the ProductList.render method, it comes here 
    const prodEl = this.createRootElement('li','product-item') // it is then assigned a tag(arg1) and a cssClass(arg2)
    prodEl.innerHTML = `
      <div>
        <img src="${this.product.imageUrl}" alt="${this.product.title}" >
        <div class="product-item__content">
          <h2>${this.product.title}</h2>
          <h2>\$${this.product.price}</h2>
          <p>${this.product.description}</p>
          <button>Add to Cart</button>
        </div>
      </div>
    `; // creates this HTML, reaching out to the newly created ProductItem through ProductItem.product that was passed through the ProductList.render() method, grabbing information and passing it into the HTML
    const addCartButton = prodEl.querySelector('button') // get access to the button
    addCartButton.addEventListener('click',this.addToCart.bind(this)) // adds an event listener to this specific button, through the use of a method defined above and binding this specific ProductItem.product to that specific HTML button
  }

}



class ProductList extends Component{

  products = [
    new Product(
      'A Pillow',
      'https://i5.walmartimages.com/asr/1aa47027-c394-4515-8c0b-fb34e397bb49_1.2449a29d0e09f9cc4516d3ba1d6407ef.jpeg?odnWidth=undefined&odnHeight=undefined&odnBg=ffffff',
      'A Soft Pillow!',
      19.99),
    new Product(
      'A Carpet',
      'https://99centfloorstore.com/wp-content/uploads/2018/04/CASHMERE-EXEPTIONAL-II-CARPET.jpg',
      'A Pillow Carpet?',
      89.99
    )
  ];

  constructor (renderHookId) {
    super(renderHookId)// gets 'app' from Shops instantiation of ProductList, where it passes 'app' as the renderHookId arg, which goes to the Component class where this instance becomes this.hookId
  }

  render() {
    const prodList = this.createRootElement('ul','product-list', [
      new ElementAttribute('id', 'prod-list')
    ]);
    for (const prod of this.products) { // going through everything in ProductList.products, iterating each as prod
      const productItem = new ProductItem(prod, 'prod-list') // passes each individual item in the ProductList.products array to ProductItem class ^^^1 // prod = product arg, 'prod-list' = super(renderhookId) arg
      productItem.render(); // now that there is an instance of ProductItem.product, we are calling render on that productItem ^^^ 3
    }
    return prodList
  }

}



class Shop {

  render(){
    this.cart = new ShoppingCart('app'); // get access to ShoppingCart class // stores it as a field in shop (Shop.cart) and passes through 'app' as arg1 in the Component constructor
    this.cart.render() // calls the field Shop.cart.render(), which points to ShoppingCart.render()
    const productList = new ProductList('app'); // get access to ProductList class and passes through 'app' as arg1 in the Component constructor
    productList.render(); // calls ProductList('app').render()
  }

}



class App {

  // static cart // only works with chrome

  static init() {
    const shop = new Shop();
    shop.render(); // starts the chain that renders the information into HTML
    this.cart = shop.cart // adds cart as a field to App, App.cart = shop.cart(field on Shop added after shop.render() is called) = new ShoppingCart() so access to ShoppingCart
  }

  static addProductToCart(product) {
    this.cart.addProduct(product) // now that we have access to ShoppingCart because of our static init()(as this.cart), we can use it here in this static method.  This is basically calling Shoppingcart.addProduct(arg1).  We are calling this method by using the Add to Cart button created in ProductItem class. ^^^
  }

}

App.init();
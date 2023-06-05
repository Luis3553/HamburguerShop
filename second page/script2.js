// La primera variable selecciona el espacio donde se guardaran las ordenes y la segunda
// variable selecciona el boton que se utilizara para agregar cada orden en ese espacio.
const listOfOrders = document.querySelector('.orders');
const addToListButton = document.querySelector('.add-btn');

// Crea una lista de objetos(ingredientes) que junto a la funcion de debajo hace que las
// imagenes de preview aparezcan y desaparezcan.
const ingredients = [
    { input: '#input-ketchup', imagen: '.ketchup' },
    { input: '#input-lettuce', imagen: '.lettuce' },
    { input: '#input-bacon', imagen: '.bacon' },
    { input: '#input-tomatos', imagen: '.tomato' },
    { input: '#input-cheese', imagen: '.cheese' },
    { input: '#input-meat', imagen: '.meat' },
    { input: '#input-pickles', imagen: '.pickles' },
    { input: '#input-onions', imagen: '.onions' },
    { input: '#input-mustard', imagen: '.mustard' }
];

function toggleVisibility(image) {
    image.style.display = image.style.display === 'none' ? 'block' : 'none';
}

ingredients.forEach(ingredient => {
    const inputElement = document.querySelector(ingredient.input);
    const imageElement = document.querySelector(ingredient.imagen);

    inputElement.addEventListener('change', () => {
        toggleVisibility(imageElement);
    });
});
//--------------------------------------------------------------------------------------
//Carga las ordenes que se guardaron anteriormente en localStorage
function saveOrdersToLocalStorage() {
    const orders = Array.from(listOfOrders.children);
    const savedOrders = orders.map((order) => {
        const name = order.querySelector('.order-text1').textContent;
        const ingredients = order.ingredients;
        const drinks = order.drinks;
        return { name, ingredients, drinks };
    });
    localStorage.setItem('orders', JSON.stringify(savedOrders));
}

function loadOrdersFromLocalStorage() {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    savedOrders.forEach((savedOrder) => {
        const order = createOrder(savedOrder.name);
        order.ingredients = savedOrder.ingredients;
        order.drinks = savedOrder.drinks;
        listOfOrders.appendChild(order);
    });
}

loadOrdersFromLocalStorage();
//--------------------------------------------------------------------------------------
//Añade un evento que dispara una alerta donde se introducira el propietario de la orden, 
//luego se llamaran a dos funciones para su creacion y su introduccion a la lista.
addToListButton.addEventListener('click', () => {
    Swal.fire({
        title: 'Enter the order name',
        input: 'text',
        inputAttributes: {
            maxlength: 18
        },
        showCancelButton: true,
        confirmButtonText: 'Add',
        confirmButtonColor: 'brown',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value) {
                return 'You must enter a name for the order';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const order = createOrder(result.value);
            addOrderToList(order);
        }
    });
});
//--------------------------------------------------------------------------------------
//Crea una orden y recibe como parametro un nombre el cual se le atribuira la order,
//tambien a esta orden se le añaden elementos con sus funciones como eliminar, editar, ver detalles,
//todo esto con clases en css para su organizacion. 
function createOrder(name) {

    const orderId = Date.now().toString();

    const order = document.createElement('div');
    order.classList.add('order');

    const imgOfOrder = document.createElement('img');
    imgOfOrder.setAttribute('src', '../img/pedido.png');
    imgOfOrder.classList.add('order-img');

    const nameOfOrder = document.createElement('p');
    nameOfOrder.classList.add('order-text1');
    nameOfOrder.textContent = name;

    const a = document.createElement('a');
    a.textContent = 'Click here for details';
    a.classList.add('order-text2');
    a.addEventListener('click', () => {
        showOrderDetails(order);
    });

    const delet = document.createElement('img');
    delet.setAttribute('src', '../img/borrar.png');
    delet.classList.add('delete');
    delet.addEventListener('click', () => {
        order.remove();
        saveOrdersToLocalStorage();
    });

    const edit = document.createElement('img');
    edit.setAttribute('src', '../img/lapiz.png');
    edit.classList.add('edit');
    edit.addEventListener('click', () => {
        showEditOrderDetails(order);
    });

    order.appendChild(imgOfOrder);
    order.appendChild(nameOfOrder);
    order.appendChild(a);
    order.appendChild(delet);
    order.appendChild(edit);
    order.setAttribute('data-order-id', orderId);

    return order;
}
//-------------------------------------------------------------------------------------
//Añade la orden ya creada a la lista con los valores de las clases de los elementos input(ingredientes y bebidas)
//que han sido seleccionados luego llama a la funcion "SaveOrdersToLocalStorage" 
//para almacenarlas en el almacenamiento local.
function addOrderToList(order) {
    listOfOrders.insertAdjacentElement('afterbegin', order);

    const selectedIngredients = getSelectedValues('.ingredient-check:checked');
    order.ingredients = selectedIngredients;

    const selectedDrinks = getSelectedValues('.drink-check:checked');
    order.drinks = selectedDrinks;

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    saveOrdersToLocalStorage();
}

function getSelectedValues(selector) {
    const selectedElements = document.querySelectorAll(selector);
    return Array.from(selectedElements).map(element => element.value);
}
//--------------------------------------------------------------------------------------
//Esta funcion recibe como parametro la orden creada y muestra los detalles de sus valores en una alerta.
function showOrderDetails(order) {
    var messageIng = 'Ingredients:\n';
    order.ingredients.forEach((ingredient, index) => {
        if (index === order.ingredients.length - 1) {
            messageIng += `${ingredient}.`;
        } else {
            messageIng += `${ingredient}, `;
        }
    });

    var messageDrink = 'Drinks:\n';
    order.drinks.forEach((drink, index) => {
        if (index === order.drinks.length - 1) {
            messageDrink += `${drink}.`;
        } else {
            messageDrink += `${drink}, `;
        }
    });

    Swal.fire({
        title: `${order.querySelector('.order-text1').textContent} Order`,
        html: `<div class="details-box">
        <p class="detail">${messageIng}</p>
        <p class="detail2">${messageDrink}</p>
      </div>`,
        padding: '1em',
        position: "center",
        confirmButtonColor: "brown",
    });
}
//--------------------------------------------------------------------------------------------
//Esta funcion crea toda una interfaz dentro de una alerta interactiva para cambiar el nombre del propietario de la orden 
//del propietario de la orden y cambiar sus ingredientes y bebidas. 
function showEditOrderDetails(order) {

    Swal.fire({
        title: "What would you like to change?",
        html: `
        <div class="edit-name">
          <label>Change Order Name:
          <input type="text" id="name" maxlength="18" value="${order.querySelector('.order-text1').textContent}"></label>
        </div>

        <div class="edit-box">
        <h2>Ingredients:</h2>
        <div id="edit-ingredients">
          <label><input class="ingredient-x" type="checkbox" ${order.ingredients.includes('Ketchup') ? 'checked' : ''}>Ketchup</label>
          <label><input class="ingredient-x" type="checkbox" ${order.ingredients.includes('Pickles') ? 'checked' : ''}>Pickles</label>
          <label><input class="ingredient-x" type="checkbox" ${order.ingredients.includes('Meat') ? 'checked' : ''}>Meat</label>
          <label><input class="ingredient-x" type="checkbox" ${order.ingredients.includes('Onions') ? 'checked' : ''}>Onions</label>
          <label><input class="ingredient-x" type="checkbox" ${order.ingredients.includes('Bacon') ? 'checked' : ''}>Bacon</label>
          <label><input class="ingredient-x" type="checkbox" ${order.ingredients.includes('Lettuce') ? 'checked' : ''}>Lettuce</label>
          <label><input class="ingredient-x" type="checkbox" ${order.ingredients.includes('Tomatos') ? 'checked' : ''}>Tomatos</label>
          <label><input class="ingredient-x" type="checkbox" ${order.ingredients.includes('Cheese') ? 'checked' : ''}>Cheese</label>
          <label><input class="ingredient-x" type="checkbox" ${order.ingredients.includes('Mustard') ? 'checked' : ''}>Mustard</label>
        </div>

        <h2>Drinks:</h2>

        <div id="edit-drinks">
          <label><input class="drink-x" type="checkbox" ${order.drinks.includes('Orange Juice') ? 'checked' : ''}>Orange Juice</label>
          <label><input class="drink-x" type="checkbox" ${order.drinks.includes('Pineapple Juice') ? 'checked' : ''}>Pineapple Juice</label>
          <label><input class="drink-x" type="checkbox" ${order.drinks.includes('Cranberry Juice') ? 'checked' : ''}>Cranberry Juice</label>
          <label><input class="drink-x" type="checkbox" ${order.drinks.includes('Strawberry Banana Smoothie') ? 'checked' : ''}>Strawberry Banana Smoothie</label>
          <label><input class="drink-x" type="checkbox" ${order.drinks.includes('Apple Juice') ? 'checked' : ''}>Apple Juice</label>
          <label><input class="drink-x" type="checkbox" ${order.drinks.includes('Grapefruit Juice') ? 'checked' : ''}>Grapefruit Juice</label>
          <label><input class="drink-x" type="checkbox" ${order.drinks.includes('Mango Smoothie') ? 'checked' : ''}>Mango Smoothie</label>
          <label><input class="drink-x" type="checkbox" ${order.drinks.includes('Watermelon Juice') ? 'checked' : ''}>Watermelon Juice</label>
        </div>
      </div>`,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Save',
        confirmButtonColor: 'brown',
        width: "525px",
        preConfirm: () => {
            const newName = document.querySelector('#name').value;
            const newIngredients = Array.from(document.querySelectorAll('.ingredient-x'))
                .filter(input => input.checked)
                .map(input => input.nextSibling.textContent);
            const newDrinks = Array.from(document.querySelectorAll('.drink-x'))
                .filter(input => input.checked)
                .map(input => input.nextSibling.textContent);

            return {
                newName: newName.trim(),
                newIngredients,
                newDrinks
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newName = result.value.newName;
            const newIngredients = result.value.newIngredients;
            const newDrinks = result.value.newDrinks;

            order.querySelector('.order-text1').textContent = newName;
            order.ingredients = newIngredients;
            order.drinks = newDrinks;
            Swal.fire(
                'Saved!',
                'Your order has been saved.',
                'success'
            )
            saveOrdersToLocalStorage();
        }
    });
}
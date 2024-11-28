import { dictionary } from "./dictionary.js";

// Función para crear una tarjeta de palabra
const makeWordCard = (word, category) => {
    const container = document.createElement('div');
    container.className = 'word-card';

    // Crea el elemento para mostrar el ID en la tarjeta
    const idElement = document.createElement('span');
    idElement.className = 'word-id';
    idElement.textContent = `ID: ${word.id}`;

    const englishTitle = document.createElement('h2');
    englishTitle.textContent = word.english;

    const spanishTitle = document.createElement('h3');
    spanishTitle.textContent = word.spanish;

    const categoryTag = document.createElement('span');
    categoryTag.className = 'category-tag';
    categoryTag.textContent = category;

   
    container.appendChild(idElement);
    container.appendChild(englishTitle);
    container.appendChild(spanishTitle);
    container.appendChild(categoryTag);

    container.addEventListener('mouseenter', function () {
        const englishWord = englishTitle.textContent;
        const foundWord = dictionary.categories[category].find(word => word.english === englishWord);

        if (foundWord) {
            const translationResult = document.getElementById('translation-result');
            translationResult.children[1].textContent = `${foundWord.english} - ${foundWord.spanish}`;
            translationResult.children[2].textContent = foundWord.example;
        }
    });

    return container;
};

// Función para renderizar las palabras
// esta mostrando que muestra todas las palbras del diccionario
const renderWords = (categoryFilter = 'all') => {
    const container = document.getElementById('dictionary-container'); // obtine el elemento del DOM
    container.innerHTML = ''; // limpia el contenid

    for (const category in dictionary.categories) {
        // en cada iteracion entra a cada categoria
        const words = dictionary.categories[category];
        // aqui se guarda la categoria

        // verifica si la categoria es all o coincide con la categoria actual
        if (categoryFilter === 'all' || categoryFilter === category) {
            // si es asi crea la tarjeta para la palabra
            words.forEach(word => {
                const wordCard = makeWordCard(word, category);
                container.appendChild(wordCard);
            });
        }
    }
};

// Función para traducir
const translateWord = () => {
    // obtiene el texto ingresado para traducir
    const searchWord = document.getElementById('search-word').value.trim();
    // obtiene si es de ingles a español o al revezx
    const direction = document.getElementById('translation-direction').value;
    const translationResult = document.getElementById('translation-result'); // aqui se muestran los resultados
    let foundWord = null; // se almacena la palabra

    for (const category in dictionary.categories) {
        const words = dictionary.categories[category];
        foundWord = words.find(word => 
            word[direction === 'en-es' ? 'english' : 'spanish'].toLowerCase() === searchWord.toLowerCase()

            // si la direccion de la palabra es en  en-es busca en ingles : si no en español
        );
        if (foundWord) break;
    }

    if (foundWord) {
        translationResult.children[1].textContent = direction === 'en-es' ? foundWord.spanish : foundWord.english;
        translationResult.children[2].textContent = foundWord.example;
    } else {
        translationResult.children[1].textContent = 'Palabra no encontrada';
        translationResult.children[2].textContent = '-';
    }
};

// Función para ordenar palabras alfabéticamente
const sortWords = (language = 'english') => {
    const container = document.getElementById('dictionary-container');
    const wordCards = Array.from(container.getElementsByClassName('word-card'));

    wordCards.sort((a, b) => {
        const wordA = a.querySelector('h2').textContent.toLowerCase();
        const wordB = b.querySelector('h2').textContent.toLowerCase();
        return wordA.localeCompare(wordB);
    });

    container.innerHTML = '';
    wordCards.forEach(card => container.appendChild(card));
};

// Función para abrir el modal
const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
};

// Función para cerrar el modal
const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
};

// Función para añadir una nueva palabra
const addWord = () => {
    // Captura los valores del formulario
    const englishWord = document.getElementById('new-english-word').value.trim();
    const spanishWord = document.getElementById('new-spanish-word').value.trim();
    const exampleWord = document.getElementById('new-example-word').value.trim();
    const category = document.getElementById('new-word-category').value;


    // Verifica que los campos estén completos
    if (englishWord && spanishWord && category && exampleWord) {
        // Si la categoría no existe, se crea
        if (!dictionary.categories[category]) {
            dictionary.categories[category] = [];
        }

        // Encuentra el último ID en la categoría
        const lastWordInCategory = dictionary.categories[category][dictionary.categories[category].length - 1];
        const newId = lastWordInCategory ? lastWordInCategory.id + 1 : 1;

        // Crea el objeto de la nueva palabra
        const newWord = {
            id: newId,
            english: englishWord,
            spanish: spanishWord,
            example: exampleWord,
        };

        // Añade la nueva palabra a la categoría correspondiente
        dictionary.categories[category].push(newWord);

        // Renderiza nuevamente las palabras
        renderWords();

        // Mensaje de confirmación y limpieza del formulario
        alert('Palabra añadida correctamente.');
        closeModal('add-word-modal'); // Cierra el modal
        document.getElementById('add-word-form').reset(); // Limpia el formulario
    } else {
        alert('Por favor, completa todos los campos.');
    }
};

// Inicializar los eventos
const init = () => {
    document.getElementById('translate-btn').addEventListener('click', translateWord);
    document.getElementById('sort-words-btn').addEventListener('click', () => {
        const direction = document.getElementById('translation-direction').value;
        sortWords(direction === 'en-es' ? 'english' : 'spanish');
    });
    document.getElementById('open-add-word-modal').addEventListener('click', () => openModal('add-word-modal'));
    document.getElementById('close-add-word-modal').addEventListener('click', () => closeModal('add-word-modal'));
    document.getElementById('add-word-btn').addEventListener('click', addWord);
    document.getElementById('category-filter').addEventListener('change', (e) => {
        renderWords(e.target.value);
    });
    renderWords();
};

window.addEventListener('DOMContentLoaded', init);
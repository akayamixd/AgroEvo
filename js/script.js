var words = ["свежего", "современного", "яркого", "передового", "экологичного", "надёжного", "эффективного", "нового"];
var index = 0;
setInterval(function () {
    document.getElementById("changing-word").innerText = words[index];
    index = (index + 1) % words.length;
}, 6000);

window.onload = function Callback() {
    const form = document.querySelector('.form');
    const phoneInput = document.getElementById('phone');

    phoneInput.addEventListener('input', function() {
        this.setCustomValidity('');
        let inputValue = this.value.replace(/\D/g, '');
        let formattedValue = '+7';

        if (inputValue.length > 11) {
            inputValue = inputValue.slice(0, 11);
        }

        for (let i = 0; i < inputValue.length; i++) {
            if (i === 0) {
                formattedValue += '';
            } else if (i === 1) {
                formattedValue += ' (';
            } else if (i === 4) {
                formattedValue += ') ';
            } else if (i === 7) {
                formattedValue += '-';
            } else if (i === 9) {
                formattedValue += '-';
            }
            if (i !== 0) {
                formattedValue += inputValue[i];
            }
        }

        this.value = formattedValue;
    });

    // Создание модального окна
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Создание элемента для сообщения
    const message = document.createElement('p');
    modal.appendChild(message);

    // Создание кнопки закрытия
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрыть';
    closeButton.classList.add('closeButton');
    modal.appendChild(closeButton);

    // Создание затемнения под модальным окном
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    document.body.appendChild(modal);
    document.body.appendChild(overlay);

    form.addEventListener('submit', function(event) {
        event.preventDefault();
      
        const phoneNumber = phoneInput.value.replace(/\D/g, '');
      
        if (phoneNumber.length === 11) {
          message.textContent = 'Спасибо! В ближайшее время мы перезвоним.';
          modal.classList.add('show');
          overlay.classList.add('show');
          phoneInput.value = '';
      
          closeButton.addEventListener('click', function() {
            modal.classList.add('hide');
            overlay.classList.add('hide');
            setTimeout(function() {
              modal.classList.remove('show', 'hide');
              overlay.classList.remove('show', 'hide');
            }, 300);
          });
        } else {
          phoneInput.setCustomValidity('Неверный формат номера телефона');
          phoneInput.reportValidity();
        }
      });
      
      overlay.addEventListener('click', function() {
        modal.classList.add('hide');
        overlay.classList.add('hide');
        setTimeout(function() {
          modal.classList.remove('show', 'hide');
          overlay.classList.remove('show', 'hide');
        }, 300);
      });
};


// Функция для перенаправления с добавлением параметра в URL
function scrollToElement(elementId) {
  if (window.location.href.includes("mainAgroEvo.html")) {
    // Если мы уже на странице mainAgroEvo.html, добавляем хэш с ID элемента и прокручиваем
    if (!window.location.hash.includes(`#${elementId}`)) {
      history.replaceState(null, null, `#${elementId}`); // Обновляем хэш без перезагрузки
    }
    scrollToElementOnLoad(elementId);
  } else {
    // Иначе перенаправляем на главную страницу с временным хэшем
    window.location.href = `mainAgroEvo.html#temp-${elementId}`;
  }
}

// Функция для прокрутки к элементу на целевой странице и размещения его в середине экрана
function scrollToElementOnLoad(elementId) {
  if (!elementId && window.location.hash) {
    elementId = window.location.hash.substring(1); // Получаем ID элемента из хэша, если он не передан
  }
  
  if (elementId && elementId.startsWith('temp-')) {
    elementId = elementId.substring(5); // Убираем префикс 'temp-' из ID
  }
  
  if (elementId) {
    var targetElement = document.getElementById(elementId);
    if (targetElement) {
      // Получаем размеры элемента и окна
      var elementRect = targetElement.getBoundingClientRect();
      var absoluteElementTop = elementRect.top + window.pageYOffset;
      var middleOfScreen = window.innerHeight / 2;
      var elementOffset = middleOfScreen - (elementRect.height / 2);

      // Прокручиваем к элементу, чтобы он оказался в середине экрана
      window.scrollTo({
        top: absoluteElementTop - elementOffset,
        behavior: 'smooth'
      });

      // Обновляем хэш в URL без префикса 'temp-'
      history.replaceState(null, null, `#${elementId}`);
    }
  }
}

// Добавляем слушатель на событие загрузки DOM
document.addEventListener("DOMContentLoaded", function() {
  var elementId = window.location.hash.substring(1); // Получаем ID элемента из хэша
  if (elementId) {
    setTimeout(() => {
      scrollToElementOnLoad(elementId);
    }, 100); // Небольшая задержка для предотвращения мгновенной прокрутки
  }
});


function navigateTo(page) {
  window.location.href = page;
}

document.addEventListener('DOMContentLoaded', () => {
  const buttonWithIcon = document.getElementById('order-button');
  const icon = document.getElementById('order');

  if (buttonWithIcon && icon) {
    buttonWithIcon.addEventListener('mouseenter', () => {
      icon.dispatchEvent(new Event('mouseenter'));
    });

    buttonWithIcon.addEventListener('mouseleave', () => {
      icon.dispatchEvent(new Event('mouseleave'));
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const filterSelect = document.getElementById('filter');
  const switchInput = document.getElementById('switch');
  const cards = document.querySelectorAll('.tech-main-card');
  const logoButtons = document.querySelectorAll('.icon-button');
  let selectedLogo = null;

  function filterCards() {
    const selectedCategory = filterSelect.value;
    const isPurchase = switchInput.checked;

    cards.forEach(card => {
      const category = card.dataset.category.split(' ');
      const matchesCategory = selectedCategory === 'all' || category.includes(selectedCategory);
      const matchesPurchase = isPurchase ? category.includes('purchase') : category.includes('leasing');
      const matchesLogo = !selectedLogo || category.includes(selectedLogo);

      const shouldShow = matchesCategory && matchesPurchase && matchesLogo;
      card.classList.toggle('hidden', !shouldShow);
    });
  }

  filterSelect.addEventListener('change', filterCards);
  switchInput.addEventListener('change', filterCards);

  logoButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (selectedLogo === button.dataset.logo) {
        selectedLogo = null;
        button.classList.remove('selected');
      } else {
        logoButtons.forEach(btn => btn.classList.remove('selected'));
        selectedLogo = button.dataset.logo;
        button.classList.add('selected');
      }
      filterCards();
    });
  });

  // Показываем все карточки по умолчанию при загрузке страницы
  filterCards();
});


document.addEventListener('DOMContentLoaded', () => {
  const imageContainer = document.getElementById('photo-container');
  const mainPhoto = document.getElementById('current-photo');
  const totalImages = 60; // Общее количество изображений
  let currentImage = 11;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  // Функция для смены изображения
  const changeImage = (index) => {
    mainPhoto.src = `fendtvario/fendt_vario-${index}.jpg`;
  };

  // Обработка начала перетаскивания
  imageContainer.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // Проверка на ЛКМ
        isDragging = true;
        startX = event.clientX;
      }
  });

  // Обработка завершения перетаскивания
  document.addEventListener('mouseup', () => {
      isDragging = false;
  });

  // Обработка движения мыши
  imageContainer.addEventListener('mousemove', (event) => {
      if (isDragging) {
          currentX = event.clientX;
          const deltaX = currentX - startX;

          if (Math.abs(deltaX) > 5) { // Порог изменения изображения
              if (deltaX > 0) {
                  currentImage = (currentImage % totalImages) + 1;
              } else {
                  currentImage = (currentImage - 2 + totalImages) % totalImages + 1;
              }
              changeImage(currentImage);
              startX = currentX;
          }
      }
  });

  // Предотвращение перетаскивания изображения браузером
  mainPhoto.addEventListener('dragstart', (event) => {
      event.preventDefault();
  });
});
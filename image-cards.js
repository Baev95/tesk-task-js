const sectionCards = document.querySelector('.section-cards');
const popup = document.querySelector('.popup');

function useRequest(url, callback) {
	const xmlXHR = new XMLHttpRequest();
	xmlXHR.open('GET', url, true);
	xmlXHR.onload = function () {
		if (xmlXHR.status != 200) {
			console.log(`Статус ответа: ${xmlXHR.status}`);
		} else {
			const resPars = JSON.parse(xmlXHR.response)
			if (callback) {
				callback(resPars);
				clickImage();
			}
		}
	};

	xmlXHR.onerror = function () {
		console.log('Ошибка! Статус ответа: ' + xmlXHR.status);
	};

	xmlXHR.send();

};

function displayResult(API) {

	API.forEach(item => {
		const newDiv = `
   <div id='${item.id})' class='card' style='background-image: url(${item.url})'></div>`
		sectionCards.innerHTML += newDiv;
	});

};

document.addEventListener('DOMContentLoaded', () => {
	useRequest(`https://boiling-refuge-66454.herokuapp.com/images`, displayResult);
});

function clickImage() {
	const cardsDiv = sectionCards.querySelectorAll('.card')
	cardsDiv.forEach(item => {

		item.addEventListener('click', function (e) {
			popup.classList.add('popup-active');
			let currentId = item.id;
			let idImage = currentId.split('').splice(0, 3).join('');
			openImage(idImage);
		})
	})
};

function openImage(ID) {
	const xmlXHR = new XMLHttpRequest();
	xmlXHR.open('GET', `https://boiling-refuge-66454.herokuapp.com/images/${ID}`, true);
	xmlXHR.onload = function () {
		const resPars = JSON.parse(xmlXHR.response)
		viewImage(resPars)
	}
	xmlXHR.send();
};

const formatDate = (date) => {
	dateCorrect = new Date(date)
	let dd = dateCorrect.getDate();
	if (dd < 10) {
		dd = `0` + dd;
	}
	let mm = dateCorrect.getMonth() + 1;
	if (mm < 10) {
		mm = `0` + mm;
	}
	const yy = dateCorrect.getFullYear();
	const hh = dateCorrect.getHours();
	if (hh < 10) {
		hh = `0` + hh;
	}
	const min = dateCorrect.getMinutes();
	if (min < 10) {
		min = `0` + min;
	}
	return dd + `.` + mm + `.` + yy + '  ' + hh + ':' + min;
};

function viewImage(item) {
	let comments;
	let timeDate = '';
	if (item.comments.length > 0) {
		comments = item.comments[0].text;
		timeDate = formatDate(item.comments[0].date);
	} else {
		comments = 'Комментарий пока нет';
		timeDate = ''
	}


	popup.innerHTML = `
	<div class="popup__body">
		<div class="popup__content">
			<a href="#" class="popup__close">X</a>
				<div class="popup__img"><img src=${item.url}></div>	
				
				<div> 
					<div class="popup__title">Ваши комментарии</div> 
					<div class="popup__comments-view">${timeDate}  <br> ${comments}</div>
				</div>
		
		<div class="popup__add-comments"> 
			<div id='post-form' class='popup__form'>
				<input class="popup__input-comment" type="text" name="comment" placeholder="Ваш комментарий" required="">
				<button type="submit" class='btn btn-submit'>Оставить комментарий</button>
			</div>
		</div>
		</div>
	</div>
	`;

	const popupClose = popup.querySelector('.popup__close');
	const buttonSubmit = popup.querySelector('.btn-submit');
	closeImage(popupClose);

	buttonSubmit.addEventListener('click', function (e) {
		e.preventDefault();
		const inputValue = popup.querySelector('.popup__input-comment').value;
		 let obj = { 
			'comment': `${inputValue}`, 
			'name': 'your comment'
		 };
		createPost(obj, response => {
			console.log(response)
		})
	})


	function createPost(body, callback){
		const inputValue = popup.querySelector('.popup__input-comment').value = '';
		const url = `https://boiling-refuge-66454.herokuapp.com/images/${item.id}/comments`;

		const xmlXHR = new XMLHttpRequest();
		xmlXHR.open('POST', url, true);

		xmlXHR.setRequestHeader('Content-type', 'application/json;charset=UTF-8');

		xmlXHR.addEventListener('load', () => {
			const resPars = JSON.stringify(body);
			callback(resPars);

		})
		
	xmlXHR.onerror = function() {
		console.log('Ошибка! Статус ответа: ' + xmlXHR.status);
	}

	xmlXHR.send(JSON.stringify(body));

	}
}


		function closeImage(item) {
			item.addEventListener('click', () => {
				popup.classList.remove('popup-active');
			})
		}
		



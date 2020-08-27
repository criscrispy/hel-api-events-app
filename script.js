const body = document.querySelector('body');
const eventsContainer = document.querySelector('.events-container');

let eventsNext;

// Helper function to set attributes
function setAttributes(element, attributes) {
	for (const key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
}

// Retrieving data for weekly events ...
async function linkedEvents() {
	const eventsDatabase = await axios.get('https://api.hel.fi/linkedevents/v1/event/?start=now&end=2020-09-22');

	const eventsMain = eventsDatabase.data.data; // an array of 2O events
	eventsNext = eventsDatabase.data.meta.next; // url of the array of next page of events

	eventsMain.forEach((info, index) => {
		const imgArray = info.images;
		const name = info.name.fi;
		const shortDescriptionFI = info.short_description.fi;
		const shortDescriptionEN = info.short_description.en;
		const eventDate = info.start_time;
		const infoURL = info.info_url;

		// ************************************************
		// Handling images error
		// ************************************************
		let imgURL;
		if (imgArray.length) {
			imgURL = imgArray[0].url;
		} else {
			imgURL = 'https://placekitten.com/400/400';
		}

		// Handling info_url error
		let urlFI;
		if (infoURL) {
			urlFI = infoURL.fi;
		} else {
			urlFI = 'https://www.hel.fi/helsinki/fi';
		}

		// ************************************************
		//create div with class card
		//************************************************

		const card = document.createElement('div');
		card.classList.add('card', 'col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'm-2', 'align-self-center');

		// ************************************************
		// Create new image with class card-image-top
		// ************************************************
		const cardImg = document.createElement('img');
		setAttributes(cardImg, {
			src : imgURL,
			alt : `event_${index}`
		});
		cardImg.classList.add('card-img-top');

		//create div with class card-body
		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');

		//create card title with h5 and class card-title
		const cardtitle = document.createElement('h5');
		cardtitle.innerHTML = name;
		cardtitle.classList.add('card-title');

		// ************************************************
		// Create paragraph for short description - FI
		// ************************************************
		const cardtextFI = document.createElement('p');
		cardtextFI.innerHTML = shortDescriptionFI;

		cardtextFI.classList.add('card-text');
		// Handling the length of the short description
		if (cardtextFI.innerHTML.length > 150) {
			// cardtextFI.classList.add("text-truncate");
			cardtextFI.classList.add('shorten-text');
		}

		// ************************************************
		// Create paragraph for short description - FI
		// ************************************************
		const cardtextEN = document.createElement('p');
		// Handling the case of the absence of english translation
		if (shortDescriptionEN) {
			cardtextEN.innerHTML = shortDescriptionEN;
		} else {
			cardtextEN.innerHTML = '';
		}
		cardtextEN.classList.add('card-text');
		// Handling the length of the short description
		if (cardtextEN.innerHTML.length > 150) {
			// cardtextEN.classList.add("text-truncate");
			cardtextEN.classList.add('shorten-text');
		}

		//***************************************
		//  Create span for eventDate
		//***************************************
		const startDate = document.createElement('p');
		startDate.classList.add('text-muted');
		// startDate.classList.add("start-date");
		startDate.innerHTML = eventDate;

		// create a tags with button for more info
		const moreInfoBtn = document.createElement('a');
		moreInfoBtn.classList.add('btn', 'btn-primary');
		moreInfoBtn.innerText = 'More info';
		setAttributes(moreInfoBtn, {
			href   : urlFI,
			target : '_blank'
		});

		//****************
		// Appending
		//****************
		card.append(cardImg);

		cardBody.append(cardtitle);
		cardBody.append(cardtextFI);
		cardBody.append(cardtextEN);
		cardBody.append(startDate);
		cardBody.append(moreInfoBtn);
		card.append(cardBody);

		eventsContainer.append(card);
	});
}

//****************************************************/
// Things to do
//  -- working on the next list of events
//  -- loading animation
//  -- refactoring code
/************************************************/
// div for load more button
const loadMoreDiv = document.createElement('div');
loadMoreDiv.classList.add('text-center');
loadMoreDiv.classList.add('mb-2');

const loadMoreBtn = document.createElement('a');
loadMoreBtn.classList.add('btn');
loadMoreBtn.classList.add('btn-info');
loadMoreBtn.classList.add('text-center');
loadMoreBtn.innerText = 'Load more';
loadMoreDiv.append(loadMoreBtn);
body.append(loadMoreDiv);

loadMoreBtn.addEventListener('click', function() {
	console.log(eventsNext); // url for next set of events for current week
});

// on load
linkedEvents().catch((error) => {
	console.log('Houston, we have a problem', error);
});

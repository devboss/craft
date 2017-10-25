import $ from 'jquery';

const gaActions = {
	init() {
		const doc = $(document);
		doc.ready(function () {
			doc.on('click', '.homepage__button--elves, .homepage__button--untold-story, .homepage__button--visitors-guide', function (event) {
				gaActions.trackBookOpen($(event.target));
			});
			doc.on('click', '.page__button--close', function (event) {
				gaActions.trackBookClose($(event.target));
			});
			doc.on('click', '.page__side--front .page__button--next', function (event) {
				gaActions.trackNextPageTurn($(event.target));
			});
			doc.on('click', '.page__side--back .page__button--previous', function (event) {
				gaActions.trackPrevPageTurn($(event.target));
			});
			doc.on('click', '.page__side--front .page__button--previous', function (event) {
				gaActions.trackPrevPageTurn($(event.target), true);
			});
		});
	},
	trackBookOpen(element) {
		let label = "";
		if(element.hasClass('homepage__button--elves')) {
			label = 'The ELF World Opened';
		}
		if(element.hasClass('homepage__button--untold-story')) {
			label = 'My Untold Story Opened';
		}
		if(element.hasClass('homepage__button--visitors-guide')) {
			label = 'Lapland Visitors Guide Opened';
		}

		ga('send', 'event', {
			eventCategory: 'Books',
			eventAction: 'open',
			eventLabel: label
		});
	},
	trackBookClose(element) {
		const book = element.parents('.book').first();
		const name = book.data('name');
		let label = '';
		if(name === 'elf-world') {
			label = 'The ELF World Closed';
		}
		if(name === 'untold-story') {
			label = 'My Untold Story Closed';
		}
		if(name === 'visitors-guide') {
			label = 'Lapland Visitors Guide Closed';
		}

		ga('send', 'event', {
			eventCategory: 'Books',
			eventAction: 'close',
			eventLabel: label
		});
	},
	trackNextPageTurn(element) {
		const book = element.parents('.book').first();
		const bookName = book.data('name');
		if(bookName === 'elf-world') {

			const back = element.parents('.page__side--front').prev();
			const name = back.data('name');

			if(name) {
				let label = '';
				if(name === 'intro') {
					label = 'The Elf World From Intro To Eeko';
				}
				if(name === 'eeko') {
					label = 'The Elf World From Eeko To Sage';
				}
				if(name === 'sage') {
					label = 'The Elf World From Sage To Conker';
				}
				if(name === 'conker') {
					label = 'The Elf World From Conker To Compass And Wish';
				}
				if(name === 'compass-and-wish') {
					label = 'The Elf World From Compass And Wish To Whittle';
				}
				if(name === 'whittle') {
					label = 'The Elf World From Whittle To Pixie Mixie';
				}
				if(name === 'pixie-mixie') {
					label = 'The Elf World From Pixie Mixie To Zauber';
				}

				ga('send', 'event', {
					eventCategory: 'Books',
					eventAction: 'next',
					eventLabel: label
				});
			}

		}

		if(bookName === 'untold-story') {

			const back = element.parents('.page__side--front').prev();
			const name = back.data('name');

			if(name) {
				let label = '';
				if(name === 'page-1') {
					label = 'The Untold Story From Page 1 To Page 2';
				}
				if(name === 'page-2') {
					label = 'The Untold Story From Page 2 To Page 3';
				}
				if(name === 'page-3') {
					label = 'The Untold Story From Page 3 To Page 4';
				}
				if(name === 'page-4') {
					label = 'The Untold Story From Page 4 To Page 5';
				}
				if(name === 'page-5') {
					label = 'The Untold Story From Page 5 To Page 6';
				}
				if(name === 'page-6') {
					label = 'The Untold Story From Page 6 To Page 7';
				}
				if(name === 'page-7') {
					label = 'The Untold Story From Page 7 To Page 8';
				}
				if(name === 'page-8') {
					label = 'The Untold Story From Page 8 To Page 9';
				}
				if(name === 'page-9') {
					label = 'The Untold Story From Page 9 To Page 10';
				}
				if(name === 'page-10') {
					label = 'The Untold Story From Page 10 To Page 11';
				}
				if(name === 'page-11') {
					label = 'The Untold Story From Page 11 To Page 12';
				}
				if(name === 'page-12') {
					label = 'The Untold Story From Page 12 To Page 13';
				}
				if(name === 'page-13') {
					label = 'The Untold Story From Page 13 To Page 14';
				}
				if(name === 'page-14') {
					label = 'The Untold Story From Page 14 To Page 15';
				}
				if(name === 'page-15') {
					label = 'The Untold Story From Page 15 To Page 16';
				}
				if(name === 'page-16') {
					label = 'The Untold Story From Page 16 To Page 17';
				}



				ga('send', 'event', {
					eventCategory: 'Books',
					eventAction: 'next',
					eventLabel: label
				});
			}

		}

	},
	trackPrevPageTurn(element, mobile = false) {
		const book = element.parents('.book').first();
		const bookName = book.data('name');

		if(bookName === 'elf-world') {
			let back = element.parents('.page__side--back');
			if(mobile) {
				back = element.parents('.page__side--front').prev();
			}
			const name = back.data('name');

			//page we are on

			if(name) {
				let label = '';
				if(name === 'eeko') {
					label = 'The Elf World From Eeko To Intro';
				}
				if(name === 'sage') {
					label = 'The Elf World From Sage To Eeko';
				}
				if(name === 'conker') {
					label = 'The Elf World From Conker To Sage';
				}
				if(name === 'compass-and-wish') {
					label = 'The Elf World From Compass And Wish To Conker';
				}
				if(name === 'whittle') {
					label = 'The Elf World From Whittle To Compass And Wish';
				}
				if(name === 'pixie-mixie') {
					label = 'The Elf World From Pixie Mixie To Whittle';
				}
				if(name === 'zauber') {
					label = 'The Elf World From Zauber To Pixie Mixie';
				}

				ga('send', 'event', {
					eventCategory: 'Books',
					eventAction: 'previous',
					eventLabel: label
				});
			}

		}

		if(bookName === 'untold-story') {
			let back = element.parents('.page__side--back');
			if(mobile) {
				back = element.parents('.page__side--front').prev();
			}
			const name = back.data('name');

			if(name) {
				let label = '';
				if(name === 'page-2') {
					label = 'The Untold Story From Page 2 To Page 1';
				}
				if(name === 'page-3') {
					label = 'The Untold Story From Page 3 To Page 2';
				}
				if(name === 'page-4') {
					label = 'The Untold Story From Page 4 To Page 3';
				}
				if(name === 'page-5') {
					label = 'The Untold Story From Page 5 To Page 4';
				}
				if(name === 'page-6') {
					label = 'The Untold Story From Page 6 To Page 5';
				}
				if(name === 'page-7') {
					label = 'The Untold Story From Page 7 To Page 6';
				}
				if(name === 'page-8') {
					label = 'The Untold Story From Page 8 To Page 7';
				}
				if(name === 'page-9') {
					label = 'The Untold Story From Page 9 To Page 8';
				}
				if(name === 'page-10') {
					label = 'The Untold Story From Page 10 To Page 9';
				}
				if(name === 'page-11') {
					label = 'The Untold Story From Page 11 To Page 10';
				}
				if(name === 'page-12') {
					label = 'The Untold Story From Page 12 To Page 11';
				}
				if(name === 'page-13') {
					label = 'The Untold Story From Page 13 To Page 12';
				}
				if(name === 'page-14') {
					label = 'The Untold Story From Page 14 To Page 13';
				}
				if(name === 'page-15') {
					label = 'The Untold Story From Page 15 To Page 14';
				}
				if(name === 'page-16') {
					label = 'The Untold Story From Page 16 To Page 15';
				}
				if(name === 'page-17') {
					label = 'The Untold Story From Page 17 To Page 16';
				}



				ga('send', 'event', {
					eventCategory: 'Books',
					eventAction: 'previous',
					eventLabel: label
				});
			}
		}
	}
};

gaActions.init();

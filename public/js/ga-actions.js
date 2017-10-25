webpackJsonp([5],{

/***/ 353:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);


var gaActions = {
	init: function init() {
		var doc = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(document);
		doc.ready(function () {
			doc.on('click', '.homepage__button--elves, .homepage__button--untold-story, .homepage__button--visitors-guide', function (event) {
				gaActions.trackBookOpen(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(event.target));
			});
			doc.on('click', '.page__button--close', function (event) {
				gaActions.trackBookClose(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(event.target));
			});
			doc.on('click', '.page__side--front .page__button--next', function (event) {
				gaActions.trackNextPageTurn(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(event.target));
			});
			doc.on('click', '.page__side--back .page__button--previous', function (event) {
				gaActions.trackPrevPageTurn(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(event.target));
			});
			doc.on('click', '.page__side--front .page__button--previous', function (event) {
				gaActions.trackPrevPageTurn(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(event.target), true);
			});
		});
	},
	trackBookOpen: function trackBookOpen(element) {
		var label = "";
		if (element.hasClass('homepage__button--elves')) {
			label = 'The ELF World Opened';
		}
		if (element.hasClass('homepage__button--untold-story')) {
			label = 'My Untold Story Opened';
		}
		if (element.hasClass('homepage__button--visitors-guide')) {
			label = 'Lapland Visitors Guide Opened';
		}

		ga('send', 'event', {
			eventCategory: 'Books',
			eventAction: 'open',
			eventLabel: label
		});
	},
	trackBookClose: function trackBookClose(element) {
		var book = element.parents('.book').first();
		var name = book.data('name');
		var label = '';
		if (name === 'elf-world') {
			label = 'The ELF World Closed';
		}
		if (name === 'untold-story') {
			label = 'My Untold Story Closed';
		}
		if (name === 'visitors-guide') {
			label = 'Lapland Visitors Guide Closed';
		}

		ga('send', 'event', {
			eventCategory: 'Books',
			eventAction: 'close',
			eventLabel: label
		});
	},
	trackNextPageTurn: function trackNextPageTurn(element) {
		var book = element.parents('.book').first();
		var bookName = book.data('name');
		if (bookName === 'elf-world') {

			var back = element.parents('.page__side--front').prev();
			var name = back.data('name');

			if (name) {
				var label = '';
				if (name === 'intro') {
					label = 'The Elf World From Intro To Eeko';
				}
				if (name === 'eeko') {
					label = 'The Elf World From Eeko To Sage';
				}
				if (name === 'sage') {
					label = 'The Elf World From Sage To Conker';
				}
				if (name === 'conker') {
					label = 'The Elf World From Conker To Compass And Wish';
				}
				if (name === 'compass-and-wish') {
					label = 'The Elf World From Compass And Wish To Whittle';
				}
				if (name === 'whittle') {
					label = 'The Elf World From Whittle To Pixie Mixie';
				}
				if (name === 'pixie-mixie') {
					label = 'The Elf World From Pixie Mixie To Zauber';
				}

				ga('send', 'event', {
					eventCategory: 'Books',
					eventAction: 'next',
					eventLabel: label
				});
			}
		}

		if (bookName === 'untold-story') {

			var _back = element.parents('.page__side--front').prev();
			var _name = _back.data('name');

			if (_name) {
				var _label = '';
				if (_name === 'page-1') {
					_label = 'The Untold Story From Page 1 To Page 2';
				}
				if (_name === 'page-2') {
					_label = 'The Untold Story From Page 2 To Page 3';
				}
				if (_name === 'page-3') {
					_label = 'The Untold Story From Page 3 To Page 4';
				}
				if (_name === 'page-4') {
					_label = 'The Untold Story From Page 4 To Page 5';
				}
				if (_name === 'page-5') {
					_label = 'The Untold Story From Page 5 To Page 6';
				}
				if (_name === 'page-6') {
					_label = 'The Untold Story From Page 6 To Page 7';
				}
				if (_name === 'page-7') {
					_label = 'The Untold Story From Page 7 To Page 8';
				}
				if (_name === 'page-8') {
					_label = 'The Untold Story From Page 8 To Page 9';
				}
				if (_name === 'page-9') {
					_label = 'The Untold Story From Page 9 To Page 10';
				}
				if (_name === 'page-10') {
					_label = 'The Untold Story From Page 10 To Page 11';
				}
				if (_name === 'page-11') {
					_label = 'The Untold Story From Page 11 To Page 12';
				}
				if (_name === 'page-12') {
					_label = 'The Untold Story From Page 12 To Page 13';
				}
				if (_name === 'page-13') {
					_label = 'The Untold Story From Page 13 To Page 14';
				}
				if (_name === 'page-14') {
					_label = 'The Untold Story From Page 14 To Page 15';
				}
				if (_name === 'page-15') {
					_label = 'The Untold Story From Page 15 To Page 16';
				}
				if (_name === 'page-16') {
					_label = 'The Untold Story From Page 16 To Page 17';
				}

				ga('send', 'event', {
					eventCategory: 'Books',
					eventAction: 'next',
					eventLabel: _label
				});
			}
		}
	},
	trackPrevPageTurn: function trackPrevPageTurn(element) {
		var mobile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var book = element.parents('.book').first();
		var bookName = book.data('name');

		if (bookName === 'elf-world') {
			var back = element.parents('.page__side--back');
			if (mobile) {
				back = element.parents('.page__side--front').prev();
			}
			var name = back.data('name');

			//page we are on

			if (name) {
				var label = '';
				if (name === 'eeko') {
					label = 'The Elf World From Eeko To Intro';
				}
				if (name === 'sage') {
					label = 'The Elf World From Sage To Eeko';
				}
				if (name === 'conker') {
					label = 'The Elf World From Conker To Sage';
				}
				if (name === 'compass-and-wish') {
					label = 'The Elf World From Compass And Wish To Conker';
				}
				if (name === 'whittle') {
					label = 'The Elf World From Whittle To Compass And Wish';
				}
				if (name === 'pixie-mixie') {
					label = 'The Elf World From Pixie Mixie To Whittle';
				}
				if (name === 'zauber') {
					label = 'The Elf World From Zauber To Pixie Mixie';
				}

				ga('send', 'event', {
					eventCategory: 'Books',
					eventAction: 'previous',
					eventLabel: label
				});
			}
		}

		if (bookName === 'untold-story') {
			var _back2 = element.parents('.page__side--back');
			if (mobile) {
				_back2 = element.parents('.page__side--front').prev();
			}
			var _name2 = _back2.data('name');

			if (_name2) {
				var _label2 = '';
				if (_name2 === 'page-2') {
					_label2 = 'The Untold Story From Page 2 To Page 1';
				}
				if (_name2 === 'page-3') {
					_label2 = 'The Untold Story From Page 3 To Page 2';
				}
				if (_name2 === 'page-4') {
					_label2 = 'The Untold Story From Page 4 To Page 3';
				}
				if (_name2 === 'page-5') {
					_label2 = 'The Untold Story From Page 5 To Page 4';
				}
				if (_name2 === 'page-6') {
					_label2 = 'The Untold Story From Page 6 To Page 5';
				}
				if (_name2 === 'page-7') {
					_label2 = 'The Untold Story From Page 7 To Page 6';
				}
				if (_name2 === 'page-8') {
					_label2 = 'The Untold Story From Page 8 To Page 7';
				}
				if (_name2 === 'page-9') {
					_label2 = 'The Untold Story From Page 9 To Page 8';
				}
				if (_name2 === 'page-10') {
					_label2 = 'The Untold Story From Page 10 To Page 9';
				}
				if (_name2 === 'page-11') {
					_label2 = 'The Untold Story From Page 11 To Page 10';
				}
				if (_name2 === 'page-12') {
					_label2 = 'The Untold Story From Page 12 To Page 11';
				}
				if (_name2 === 'page-13') {
					_label2 = 'The Untold Story From Page 13 To Page 12';
				}
				if (_name2 === 'page-14') {
					_label2 = 'The Untold Story From Page 14 To Page 13';
				}
				if (_name2 === 'page-15') {
					_label2 = 'The Untold Story From Page 15 To Page 14';
				}
				if (_name2 === 'page-16') {
					_label2 = 'The Untold Story From Page 16 To Page 15';
				}
				if (_name2 === 'page-17') {
					_label2 = 'The Untold Story From Page 17 To Page 16';
				}

				ga('send', 'event', {
					eventCategory: 'Books',
					eventAction: 'previous',
					eventLabel: _label2
				});
			}
		}
	}
};

gaActions.init();

/***/ }),

/***/ 690:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(353);


/***/ })

},[690]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvanMvZ2EtYWN0aW9ucy5qcyJdLCJuYW1lcyI6WyJnYUFjdGlvbnMiLCJpbml0IiwiZG9jIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJvbiIsImV2ZW50IiwidHJhY2tCb29rT3BlbiIsInRhcmdldCIsInRyYWNrQm9va0Nsb3NlIiwidHJhY2tOZXh0UGFnZVR1cm4iLCJ0cmFja1ByZXZQYWdlVHVybiIsImVsZW1lbnQiLCJsYWJlbCIsImhhc0NsYXNzIiwiZ2EiLCJldmVudENhdGVnb3J5IiwiZXZlbnRBY3Rpb24iLCJldmVudExhYmVsIiwiYm9vayIsInBhcmVudHMiLCJmaXJzdCIsIm5hbWUiLCJkYXRhIiwiYm9va05hbWUiLCJiYWNrIiwicHJldiIsIm1vYmlsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUEsSUFBTUEsWUFBWTtBQUNqQkMsS0FEaUIsa0JBQ1Y7QUFDTixNQUFNQyxNQUFNLDhDQUFBQyxDQUFFQyxRQUFGLENBQVo7QUFDQUYsTUFBSUcsS0FBSixDQUFVLFlBQVk7QUFDckJILE9BQUlJLEVBQUosQ0FBTyxPQUFQLEVBQWdCLDhGQUFoQixFQUFnSCxVQUFVQyxLQUFWLEVBQWlCO0FBQ2hJUCxjQUFVUSxhQUFWLENBQXdCLDhDQUFBTCxDQUFFSSxNQUFNRSxNQUFSLENBQXhCO0FBQ0EsSUFGRDtBQUdBUCxPQUFJSSxFQUFKLENBQU8sT0FBUCxFQUFnQixzQkFBaEIsRUFBd0MsVUFBVUMsS0FBVixFQUFpQjtBQUN4RFAsY0FBVVUsY0FBVixDQUF5Qiw4Q0FBQVAsQ0FBRUksTUFBTUUsTUFBUixDQUF6QjtBQUNBLElBRkQ7QUFHQVAsT0FBSUksRUFBSixDQUFPLE9BQVAsRUFBZ0Isd0NBQWhCLEVBQTBELFVBQVVDLEtBQVYsRUFBaUI7QUFDMUVQLGNBQVVXLGlCQUFWLENBQTRCLDhDQUFBUixDQUFFSSxNQUFNRSxNQUFSLENBQTVCO0FBQ0EsSUFGRDtBQUdBUCxPQUFJSSxFQUFKLENB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QVosRUFBdUI7QUFDdEJULGVBQVEsMENBQVI7QUFDQTtBQUNELFFBQUdTLFdBQVMsU0FBWixFQUF1QjtBQUN0QlQsZUFBUSwwQ0FBUjtBQUNBO0FBQ0QsUUFBR1MsV0FBUyxTQUFaLEVBQXVCO0FBQ3RCVCxlQUFRLDBDQUFSO0FBQ0E7QUFDRCxRQUFHUyxXQUFTLFNBQVosRUFBdUI7QUFDdEJULGVBQVEsMENBQVI7QUFDQTtBQUNELFFBQUdTLFdBQVMsU0FBWixFQUF1QjtBQUN0QlQsZUFBUSwwQ0FBUjtBQUNBO0FBQ0QsUUFBR1MsV0FBUyxTQUFaLEVBQXVCO0FBQ3RCVCxlQUFRLDBDQUFSO0FBQ0E7QUFDRCxRQUFHUyxXQUFTLFNBQVosRUFBdUI7QUFDdEJULGVBQVEsMENBQVI7QUFDQTs7QUFJREUsT0FBRyxNQUFILEVBQVcsT0FBWCxFQUFvQjtBQUNuQkMsb0JBQWUsT0FESTtBQUVuQkMsa0JBQWEsVUFGTTtBQUduQkMsaUJBQVlMO0FBSE8sS0FBcEI7QUFLQTtBQUNEO0FBQ0Q7QUF6UmdCLENBQWxCOztBQTRSQWQsVUFBVUMsSUFBVixHIiwiZmlsZSI6Ii9qcy9nYS1hY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcblxuY29uc3QgZ2FBY3Rpb25zID0ge1xuXHRpbml0KCkge1xuXHRcdGNvbnN0IGRvYyA9ICQoZG9jdW1lbnQpO1xuXHRcdGRvYy5yZWFkeShmdW5jdGlvbiAoKSB7XG5cdFx0XHRkb2Mub24oJ2NsaWNrJywgJy5ob21lcGFnZV9fYnV0dG9uLS1lbHZlcywgLmhvbWVwYWdlX19idXR0b24tLXVudG9sZC1zdG9yeSwgLmhvbWVwYWdlX19idXR0b24tLXZpc2l0b3JzLWd1aWRlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdGdhQWN0aW9ucy50cmFja0Jvb2tPcGVuKCQoZXZlbnQudGFyZ2V0KSk7XG5cdFx0XHR9KTtcblx0XHRcdGRvYy5vbignY2xpY2snLCAnLnBhZ2VfX2J1dHRvbi0tY2xvc2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0Z2FBY3Rpb25zLnRyYWNrQm9va0Nsb3NlKCQoZXZlbnQudGFyZ2V0KSk7XG5cdFx0XHR9KTtcblx0XHRcdGRvYy5vbignY2xpY2snLCAnLnBhZ2VfX3NpZGUtLWZyb250IC5wYWdlX19idXR0b24tLW5leHQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0Z2FBY3Rpb25zLnRyYWNrTmV4dFBhZ2VUdXJuKCQoZXZlbnQudGFyZ2V0KSk7XG5cdFx0XHR9KTtcblx0XHRcdGRvYy5vbignY2xpY2snLCAnLnBhZ2VfX3NpZGUtLWJhY2sgLnBhZ2VfX2J1dHRvbi0tcHJldmlvdXMnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0Z2FBY3Rpb25zLnRyYWNrUHJldlBhZ2VUdXJuKCQoZXZlbnQudGFyZ2V0KSk7XG5cdFx0XHR9KTtcblx0XHRcdGRvYy5vbignY2xpY2snLCAnLnBhZ2VfX3NpZGUtLWZyb250IC5wYWdlX19idXR0b24tLXByZXZpb3VzJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdGdhQWN0aW9ucy50cmFja1ByZXZQYWdlVHVybigkKGV2ZW50LnRhcmdldCksIHRydWUpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdHRyYWNrQm9va09wZW4oZWxlbWVudCkge1xuXHRcdGxldCBsYWJlbCA9IFwiXCI7XG5cdFx0aWYoZWxlbWVudC5oYXNDbGFzcygnaG9tZXBhZ2VfX2J1dHRvbi0tZWx2ZXMnKSkge1xuXHRcdFx0bGFiZWwgPSAnVGhlIEVMRiBXb3JsZCBPcGVuZWQnO1xuXHRcdH1cblx0XHRpZihlbGVtZW50Lmhhc0NsYXNzKCdob21lcGFnZV9fYnV0dG9uLS11bnRvbGQtc3RvcnknKSkge1xuXHRcdFx0bGFiZWwgPSAnTXkgVW50b2xkIFN0b3J5IE9wZW5lZCc7XG5cdFx0fVxuXHRcdGlmKGVsZW1lbnQuaGFzQ2xhc3MoJ2hvbWVwYWdlX19idXR0b24tLXZpc2l0b3JzLWd1aWRlJykpIHtcblx0XHRcdGxhYmVsID0gJ0xhcGxhbmQgVmlzaXRvcnMgR3VpZGUgT3BlbmVkJztcblx0XHR9XG5cblx0XHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRcdGV2ZW50Q2F0ZWdvcnk6ICdCb29rcycsXG5cdFx0XHRldmVudEFjdGlvbjogJ29wZW4nLFxuXHRcdFx0ZXZlbnRMYWJlbDogbGFiZWxcblx0XHR9KTtcblx0fSxcblx0dHJhY2tCb29rQ2xvc2UoZWxlbWVudCkge1xuXHRcdGNvbnN0IGJvb2sgPSBlbGVtZW50LnBhcmVudHMoJy5ib29rJykuZmlyc3QoKTtcblx0XHRjb25zdCBuYW1lID0gYm9vay5kYXRhKCduYW1lJyk7XG5cdFx0bGV0IGxhYmVsID0gJyc7XG5cdFx0aWYobmFtZSA9PT0gJ2VsZi13b3JsZCcpIHtcblx0XHRcdGxhYmVsID0gJ1RoZSBFTEYgV29ybGQgQ2xvc2VkJztcblx0XHR9XG5cdFx0aWYobmFtZSA9PT0gJ3VudG9sZC1zdG9yeScpIHtcblx0XHRcdGxhYmVsID0gJ015IFVudG9sZCBTdG9yeSBDbG9zZWQnO1xuXHRcdH1cblx0XHRpZihuYW1lID09PSAndmlzaXRvcnMtZ3VpZGUnKSB7XG5cdFx0XHRsYWJlbCA9ICdMYXBsYW5kIFZpc2l0b3JzIEd1aWRlIENsb3NlZCc7XG5cdFx0fVxuXG5cdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0XHRldmVudENhdGVnb3J5OiAnQm9va3MnLFxuXHRcdFx0ZXZlbnRBY3Rpb246ICdjbG9zZScsXG5cdFx0XHRldmVudExhYmVsOiBsYWJlbFxuXHRcdH0pO1xuXHR9LFxuXHR0cmFja05leHRQYWdlVHVybihlbGVtZW50KSB7XG5cdFx0Y29uc3QgYm9vayA9IGVsZW1lbnQucGFyZW50cygnLmJvb2snKS5maXJzdCgpO1xuXHRcdGNvbnN0IGJvb2tOYW1lID0gYm9vay5kYXRhKCduYW1lJyk7XG5cdFx0aWYoYm9va05hbWUgPT09ICdlbGYtd29ybGQnKSB7XG5cblx0XHRcdGNvbnN0IGJhY2sgPSBlbGVtZW50LnBhcmVudHMoJy5wYWdlX19zaWRlLS1mcm9udCcpLnByZXYoKTtcblx0XHRcdGNvbnN0IG5hbWUgPSBiYWNrLmRhdGEoJ25hbWUnKTtcblxuXHRcdFx0aWYobmFtZSkge1xuXHRcdFx0XHRsZXQgbGFiZWwgPSAnJztcblx0XHRcdFx0aWYobmFtZSA9PT0gJ2ludHJvJykge1xuXHRcdFx0XHRcdGxhYmVsID0gJ1RoZSBFbGYgV29ybGQgRnJvbSBJbnRybyBUbyBFZWtvJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAnZWVrbycpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgRWxmIFdvcmxkIEZyb20gRWVrbyBUbyBTYWdlJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAnc2FnZScpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgRWxmIFdvcmxkIEZyb20gU2FnZSBUbyBDb25rZXInO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICdjb25rZXInKSB7XG5cdFx0XHRcdFx0bGFiZWwgPSAnVGhlIEVsZiBXb3JsZCBGcm9tIENvbmtlciBUbyBDb21wYXNzIEFuZCBXaXNoJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAnY29tcGFzcy1hbmQtd2lzaCcpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgRWxmIFdvcmxkIEZyb20gQ29tcGFzcyBBbmQgV2lzaCBUbyBXaGl0dGxlJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAnd2hpdHRsZScpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgRWxmIFdvcmxkIEZyb20gV2hpdHRsZSBUbyBQaXhpZSBNaXhpZSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BpeGllLW1peGllJykge1xuXHRcdFx0XHRcdGxhYmVsID0gJ1RoZSBFbGYgV29ybGQgRnJvbSBQaXhpZSBNaXhpZSBUbyBaYXViZXInO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Z2EoJ3NlbmQnLCAnZXZlbnQnLCB7XG5cdFx0XHRcdFx0ZXZlbnRDYXRlZ29yeTogJ0Jvb2tzJyxcblx0XHRcdFx0XHRldmVudEFjdGlvbjogJ25leHQnLFxuXHRcdFx0XHRcdGV2ZW50TGFiZWw6IGxhYmVsXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0aWYoYm9va05hbWUgPT09ICd1bnRvbGQtc3RvcnknKSB7XG5cblx0XHRcdGNvbnN0IGJhY2sgPSBlbGVtZW50LnBhcmVudHMoJy5wYWdlX19zaWRlLS1mcm9udCcpLnByZXYoKTtcblx0XHRcdGNvbnN0IG5hbWUgPSBiYWNrLmRhdGEoJ25hbWUnKTtcblxuXHRcdFx0aWYobmFtZSkge1xuXHRcdFx0XHRsZXQgbGFiZWwgPSAnJztcblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtMScpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAxIFRvIFBhZ2UgMic7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtMicpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAyIFRvIFBhZ2UgMyc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtMycpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAzIFRvIFBhZ2UgNCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtNCcpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA0IFRvIFBhZ2UgNSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtNScpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA1IFRvIFBhZ2UgNic7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtNicpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA2IFRvIFBhZ2UgNyc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtNycpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA3IFRvIFBhZ2UgOCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtOCcpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA4IFRvIFBhZ2UgOSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtOScpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA5IFRvIFBhZ2UgMTAnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICdwYWdlLTEwJykge1xuXHRcdFx0XHRcdGxhYmVsID0gJ1RoZSBVbnRvbGQgU3RvcnkgRnJvbSBQYWdlIDEwIFRvIFBhZ2UgMTEnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICdwYWdlLTExJykge1xuXHRcdFx0XHRcdGxhYmVsID0gJ1RoZSBVbnRvbGQgU3RvcnkgRnJvbSBQYWdlIDExIFRvIFBhZ2UgMTInO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICdwYWdlLTEyJykge1xuXHRcdFx0XHRcdGxhYmVsID0gJ1RoZSBVbnRvbGQgU3RvcnkgRnJvbSBQYWdlIDEyIFRvIFBhZ2UgMTMnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICdwYWdlLTEzJykge1xuXHRcdFx0XHRcdGxhYmVsID0gJ1RoZSBVbnRvbGQgU3RvcnkgRnJvbSBQYWdlIDEzIFRvIFBhZ2UgMTQnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICdwYWdlLTE0Jykge1xuXHRcdFx0XHRcdGxhYmVsID0gJ1RoZSBVbnRvbGQgU3RvcnkgRnJvbSBQYWdlIDE0IFRvIFBhZ2UgMTUnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICdwYWdlLTE1Jykge1xuXHRcdFx0XHRcdGxhYmVsID0gJ1RoZSBVbnRvbGQgU3RvcnkgRnJvbSBQYWdlIDE1IFRvIFBhZ2UgMTYnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICdwYWdlLTE2Jykge1xuXHRcdFx0XHRcdGxhYmVsID0gJ1RoZSBVbnRvbGQgU3RvcnkgRnJvbSBQYWdlIDE2IFRvIFBhZ2UgMTcnO1xuXHRcdFx0XHR9XG5cblxuXG5cdFx0XHRcdGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdFx0XHRcdGV2ZW50Q2F0ZWdvcnk6ICdCb29rcycsXG5cdFx0XHRcdFx0ZXZlbnRBY3Rpb246ICduZXh0Jyxcblx0XHRcdFx0XHRldmVudExhYmVsOiBsYWJlbFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHR9LFxuXHR0cmFja1ByZXZQYWdlVHVybihlbGVtZW50LCBtb2JpbGUgPSBmYWxzZSkge1xuXHRcdGNvbnN0IGJvb2sgPSBlbGVtZW50LnBhcmVudHMoJy5ib29rJykuZmlyc3QoKTtcblx0XHRjb25zdCBib29rTmFtZSA9IGJvb2suZGF0YSgnbmFtZScpO1xuXG5cdFx0aWYoYm9va05hbWUgPT09ICdlbGYtd29ybGQnKSB7XG5cdFx0XHRsZXQgYmFjayA9IGVsZW1lbnQucGFyZW50cygnLnBhZ2VfX3NpZGUtLWJhY2snKTtcblx0XHRcdGlmKG1vYmlsZSkge1xuXHRcdFx0XHRiYWNrID0gZWxlbWVudC5wYXJlbnRzKCcucGFnZV9fc2lkZS0tZnJvbnQnKS5wcmV2KCk7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBuYW1lID0gYmFjay5kYXRhKCduYW1lJyk7XG5cblx0XHRcdC8vcGFnZSB3ZSBhcmUgb25cblxuXHRcdFx0aWYobmFtZSkge1xuXHRcdFx0XHRsZXQgbGFiZWwgPSAnJztcblx0XHRcdFx0aWYobmFtZSA9PT0gJ2Vla28nKSB7XG5cdFx0XHRcdFx0bGFiZWwgPSAnVGhlIEVsZiBXb3JsZCBGcm9tIEVla28gVG8gSW50cm8nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICdzYWdlJykge1xuXHRcdFx0XHRcdGxhYmVsID0gJ1RoZSBFbGYgV29ybGQgRnJvbSBTYWdlIFRvIEVla28nO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICdjb25rZXInKSB7XG5cdFx0XHRcdFx0bGFiZWwgPSAnVGhlIEVsZiBXb3JsZCBGcm9tIENvbmtlciBUbyBTYWdlJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAnY29tcGFzcy1hbmQtd2lzaCcpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgRWxmIFdvcmxkIEZyb20gQ29tcGFzcyBBbmQgV2lzaCBUbyBDb25rZXInO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICd3aGl0dGxlJykge1xuXHRcdFx0XHRcdGxhYmVsID0gJ1RoZSBFbGYgV29ybGQgRnJvbSBXaGl0dGxlIFRvIENvbXBhc3MgQW5kIFdpc2gnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKG5hbWUgPT09ICdwaXhpZS1taXhpZScpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgRWxmIFdvcmxkIEZyb20gUGl4aWUgTWl4aWUgVG8gV2hpdHRsZSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3phdWJlcicpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgRWxmIFdvcmxkIEZyb20gWmF1YmVyIFRvIFBpeGllIE1peGllJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdFx0XHRcdGV2ZW50Q2F0ZWdvcnk6ICdCb29rcycsXG5cdFx0XHRcdFx0ZXZlbnRBY3Rpb246ICdwcmV2aW91cycsXG5cdFx0XHRcdFx0ZXZlbnRMYWJlbDogbGFiZWxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZihib29rTmFtZSA9PT0gJ3VudG9sZC1zdG9yeScpIHtcblx0XHRcdGxldCBiYWNrID0gZWxlbWVudC5wYXJlbnRzKCcucGFnZV9fc2lkZS0tYmFjaycpO1xuXHRcdFx0aWYobW9iaWxlKSB7XG5cdFx0XHRcdGJhY2sgPSBlbGVtZW50LnBhcmVudHMoJy5wYWdlX19zaWRlLS1mcm9udCcpLnByZXYoKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IG5hbWUgPSBiYWNrLmRhdGEoJ25hbWUnKTtcblxuXHRcdFx0aWYobmFtZSkge1xuXHRcdFx0XHRsZXQgbGFiZWwgPSAnJztcblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtMicpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAyIFRvIFBhZ2UgMSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtMycpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAzIFRvIFBhZ2UgMic7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtNCcpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA0IFRvIFBhZ2UgMyc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtNScpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA1IFRvIFBhZ2UgNCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtNicpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA2IFRvIFBhZ2UgNSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtNycpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA3IFRvIFBhZ2UgNic7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtOCcpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA4IFRvIFBhZ2UgNyc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtOScpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSA5IFRvIFBhZ2UgOCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYobmFtZSA9PT0gJ3BhZ2UtMTAnKSB7XG5cdFx0XHRcdFx0bGFiZWwgPSAnVGhlIFVudG9sZCBTdG9yeSBGcm9tIFBhZ2UgMTAgVG8gUGFnZSA5Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAncGFnZS0xMScpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAxMSBUbyBQYWdlIDEwJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAncGFnZS0xMicpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAxMiBUbyBQYWdlIDExJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAncGFnZS0xMycpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAxMyBUbyBQYWdlIDEyJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAncGFnZS0xNCcpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAxNCBUbyBQYWdlIDEzJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAncGFnZS0xNScpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAxNSBUbyBQYWdlIDE0Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAncGFnZS0xNicpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAxNiBUbyBQYWdlIDE1Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihuYW1lID09PSAncGFnZS0xNycpIHtcblx0XHRcdFx0XHRsYWJlbCA9ICdUaGUgVW50b2xkIFN0b3J5IEZyb20gUGFnZSAxNyBUbyBQYWdlIDE2Jztcblx0XHRcdFx0fVxuXG5cblxuXHRcdFx0XHRnYSgnc2VuZCcsICdldmVudCcsIHtcblx0XHRcdFx0XHRldmVudENhdGVnb3J5OiAnQm9va3MnLFxuXHRcdFx0XHRcdGV2ZW50QWN0aW9uOiAncHJldmlvdXMnLFxuXHRcdFx0XHRcdGV2ZW50TGFiZWw6IGxhYmVsXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuZ2FBY3Rpb25zLmluaXQoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3Jlc291cmNlcy9qcy9nYS1hY3Rpb25zLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==
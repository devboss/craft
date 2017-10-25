import cookie from './cookie';

let storage;

const isLocalStorageAvailable = () => {
	try {
		const randomKey = 'testvuels';
		window.sessionStorage.setItem(randomKey, '1');
		window.sessionStorage.removeItem(randomKey);

		return true;
	} catch (error) {
		return false;
	}
};

if (isLocalStorageAvailable()) {
	storage = window.sessionStorage;
} else {
	storage = cookie;
}

export default storage;
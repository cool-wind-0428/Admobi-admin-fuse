import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import config from './firebaseServiceConfig';

class FirebaseService {
	init(success) {
		if (Object.entries(config).length === 0 && config.constructor === Object) {
			if (process.env.NODE_ENV === 'development') {
				console.warn(
					'Missing Firebase Configuration at src/app/services/firebaseService/firebaseServiceConfig.js'
				);
			}
			success(false);
			return;
		}
		if (firebase.apps.length) {
			return;
		}
		firebase.initializeApp(config);
		this.db = firebase.database();
		this.auth = firebase.auth();
		this.storage = firebase.storage();
		success(true);
	}

	getUserData = userId => {
		if (!firebase.apps.length) {
			return false;
		}
		return new Promise((resolve, reject) => {
			this.db
				.ref(`users/${userId}`)
				.once('value')
				.then(snapshot => {
					const user = snapshot.val();
					resolve(user);
				});
		});
	};

	updateUserData = user => {
		if (!firebase.apps.length) {
			return false;
		}
		return this.db.ref(`users/${user.uid}`).set(user);
	};

	onAuthStateChanged = callback => {
		if (!this.auth) {
			return;
		}
		this.auth.onAuthStateChanged(callback);
	};

	signOut = () => {
		if (!this.auth) {
			return;
		}
		this.auth.signOut();
	};
}
function createRef() {
	// [START storage_create_ref]
	// Get a reference to the storage service, which is used to create references in your storage bucket
	var storage = firebase.storage();

	// Create a storage reference from our storage service
	var storageRef = storage.ref();
	// [END storage_create_ref]
}

function createRefChild() {
	const storageRef = firebase.storage().ref();
  
	// [START storage_create_ref_child]
	// Create a child reference
	var imagesRef = storageRef.child('images');
	// imagesRef now points to 'images'
  
	// Child references can also take paths delimited by '/'
	var spaceRef = storageRef.child('images/space.jpg');
	// spaceRef now points to "images/space.jpg"
	// imagesRef still points to "images"
	// [END storage_create_ref_child]
  }
  function downloadCreateRef() {
	// [START storage_download_create_ref]
	// Create a reference with an initial file path and name
	var storage = firebase.storage();
	var pathReference = storage.ref('images/stars.jpg');
  
	// Create a reference from a Google Cloud Storage URI
	var gsReference = storage.refFromURL('gs://bucket/images/stars.jpg');
  
	// Create a reference from an HTTPS URL
	// Note that in the URL, characters are URL escaped!
	var httpsReference = storage.refFromURL('https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg');  
	// [END storage_download_create_ref]
  }

const instance = new FirebaseService();

export default instance;

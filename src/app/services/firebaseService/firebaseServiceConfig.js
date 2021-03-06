const prodConfig = {
	apiKey           : "AIzaSyDGA9FjQeljMxg2eVmXiirmUaQsgM9-kIU",
	authDomain       : "admobi-ae191.firebaseapp.com",
	databaseURL      : "https://admobi-ae191-default-rtdb.firebaseio.com",
	projectId        : "admobi-ae191",
	storageBucket    : "admobi-ae191.appspot.com",
	messagingSenderId: "YOUR_MESSAGING_SENDER_ID"
};

const devConfig = {
	apiKey           : "AIzaSyDGA9FjQeljMxg2eVmXiirmUaQsgM9-kIU",
	authDomain       : "admobi-ae191.firebaseapp.com",
	databaseURL      : "https://admobi-ae191-default-rtdb.firebaseio.com",
	projectId        : "admobi-ae191",
	storageBucket    : "admobi-ae191.appspot.com",
	messagingSenderId: "YOUR_MESSAGING_SENDER_ID"
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;